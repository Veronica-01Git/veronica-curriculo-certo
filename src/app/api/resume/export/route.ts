import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateResumePdf } from "@/lib/ats/pdf-generator";
import type { ResumeData, TemplateKey } from "@/types/resume";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const resumeId = body?.resumeId as string | undefined;
  const template = (body?.template as TemplateKey | undefined) ?? "CLASSIC_ATS";

  if (!resumeId) {
    return NextResponse.json({ error: "resumeId é obrigatório." }, { status: 400 });
  }

  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId: session.user.id } });
  if (!resume?.structuredData) {
    return NextResponse.json({ error: "Currículo não encontrado ou ainda não processado." }, { status: 404 });
  }

  const structured: ResumeData = JSON.parse(resume.structuredData);
  const pdfBuffer = await generateResumePdf(structured, template);

  const fileName = `${(structured.contact.fullName || "curriculo").replace(/\s+/g, "-").toLowerCase()}-ats.pdf`;

  await prisma.$transaction([
    prisma.resume.update({ where: { id: resume.id }, data: { template } }),
    prisma.export.create({
      data: { resumeId: resume.id, format: "pdf-ats", template, fileName },
    }),
  ]);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${fileName}"`,
    },
  });
}
