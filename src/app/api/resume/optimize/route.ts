import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeAts } from "@/lib/ats/optimizer";
import type { ResumeData } from "@/types/resume";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const resumeId = body?.resumeId as string | undefined;
  const targetJobText = body?.targetJobText as string | undefined;
  const structuredDataInput = body?.structuredData as ResumeData | undefined;

  if (!resumeId) {
    return NextResponse.json({ error: "resumeId é obrigatório." }, { status: 400 });
  }

  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId: session.user.id } });
  if (!resume) {
    return NextResponse.json({ error: "Currículo não encontrado." }, { status: 404 });
  }

  const structured: ResumeData = structuredDataInput ?? JSON.parse(resume.structuredData ?? "{}");
  const analysis = analyzeAts(structured, targetJobText ?? resume.targetJobText ?? undefined);

  const updated = await prisma.resume.update({
    where: { id: resume.id },
    data: {
      structuredData: JSON.stringify(structured),
      targetJobText: targetJobText ?? resume.targetJobText,
      atsScore: analysis.score,
      status: "OPTIMIZED",
    },
  });

  return NextResponse.json({ id: updated.id, analysis });
}
