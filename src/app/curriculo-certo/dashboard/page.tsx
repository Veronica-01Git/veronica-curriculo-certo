import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreBadge } from "@/components/dashboard/ScoreBadge";
import { APP_BASE } from "@/lib/routes";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const resumes = await prisma.resume.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Meus currículos</h1>
          <p className="mt-1 text-sm text-ink-500">Gerencie, otimize e exporte suas versões de currículo.</p>
        </div>
        <Button href={`${APP_BASE}/dashboard/upload`}>Novo currículo</Button>
      </div>

      {resumes.length === 0 ? (
        <Card className="mt-10 flex flex-col items-center gap-3 p-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" strokeLinejoin="round" />
              <path d="M14 3v5h5" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-ink-950">Nenhum currículo ainda</h2>
          <p className="max-w-sm text-sm text-ink-500">
            Envie seu currículo atual para receber um score ATS e um PDF otimizado em minutos.
          </p>
          <Button href={`${APP_BASE}/dashboard/upload`} className="mt-2">
            Enviar meu primeiro currículo
          </Button>
        </Card>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Link key={resume.id} href={`${APP_BASE}/dashboard/preview/${resume.id}`}>
              <Card className="flex h-full flex-col p-5 transition-shadow hover:shadow-soft">
                <div className="flex items-start justify-between">
                  <h3 className="text-[15px] font-semibold text-ink-950">{resume.title}</h3>
                </div>
                <p className="mt-1 text-xs text-ink-500">
                  Atualizado em {resume.updatedAt.toLocaleDateString("pt-BR")}
                </p>
                <div className="mt-4">
                  <ScoreBadge score={resume.atsScore} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
