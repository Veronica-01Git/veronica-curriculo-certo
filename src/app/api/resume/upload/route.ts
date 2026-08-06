import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromFile, structureResumeText, structureResumeWithAi } from "@/lib/ats/parser";
import type { ResumeData } from "@/types/resume";
import { analyzeAts } from "@/lib/ats/optimizer";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const targetRole = (formData.get("targetRole") as string) || undefined;
  const targetJobText = (formData.get("targetJobText") as string) || undefined;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Formato não suportado. Use PDF, DOCX ou TXT." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Arquivo muito grande (máx. 8MB)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let rawText: string;
  try {
    rawText = await extractTextFromFile(buffer, file.type);
  } catch {
    return NextResponse.json({ error: "Não foi possível ler o conteúdo do arquivo." }, { status: 422 });
  }

  if (!rawText || rawText.trim().length < 30) {
    return NextResponse.json(
      { error: "Não conseguimos extrair texto suficiente deste arquivo." },
      { status: 422 }
    );
  }

  let structured: ResumeData;
  try {
    structured = await structureResumeWithAi(rawText);
  } catch {
    structured = structureResumeText(rawText);
  }
  const analysis = analyzeAts(structured, targetJobText);

  const sourceFormat = file.type === "application/pdf" ? "pdf" : file.type.includes("word") ? "docx" : "txt";

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      title: structured.contact.fullName !== "Seu Nome" ? structured.contact.fullName : "Meu Currículo",
      status: "OPTIMIZED",
      sourceFormat,
      rawText,
      structuredData: JSON.stringify(structured),
      atsScore: analysis.score,
      targetRole,
      targetJobText,
    },
  });

  return NextResponse.json({ id: resume.id, score: analysis.score }, { status: 201 });
}
