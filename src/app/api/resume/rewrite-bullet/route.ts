import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AiRewriteUnavailableError, rewriteBulletWithAi } from "@/lib/ats/optimizer";
import type { ResumeData } from "@/types/resume";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const resumeId = body?.resumeId as string | undefined;
  const experienceIndex = body?.experienceIndex as number | undefined;
  const bulletIndex = body?.bulletIndex as number | undefined;

  if (!resumeId || experienceIndex === undefined || bulletIndex === undefined) {
    return NextResponse.json(
      { error: "resumeId, experienceIndex e bulletIndex são obrigatórios." },
      { status: 400 }
    );
  }

  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId: session.user.id } });
  if (!resume || !resume.structuredData) {
    return NextResponse.json({ error: "Currículo não encontrado." }, { status: 404 });
  }

  const structured: ResumeData = JSON.parse(resume.structuredData);
  const experience = structured.experiences[experienceIndex];
  const original = experience?.bullets[bulletIndex];
  if (!experience || original === undefined) {
    return NextResponse.json({ error: "Conquista não encontrada." }, { status: 404 });
  }

  let rewritten: string;
  try {
    rewritten = await rewriteBulletWithAi(original, resume.targetRole ?? undefined);
  } catch (err) {
    if (err instanceof AiRewriteUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Falha ao reescrever com IA. Tente novamente." }, { status: 502 });
  }

  experience.bullets[bulletIndex] = rewritten;

  await prisma.resume.update({
    where: { id: resume.id },
    data: { structuredData: JSON.stringify(structured) },
  });

  return NextResponse.json({ bullet: rewritten });
}
