import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { TEMPLATES } from "@/types/resume";
import { APP_BASE } from "@/lib/routes";

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);
  const resumes = await prisma.resume.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
    take: 1,
  });
  const latestResumeId = resumes[0]?.id;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Modelos</h1>
      <p className="mt-1 text-sm text-ink-500">
        Todos os modelos seguem coluna única, texto real e formatação limpa — a base de qualquer PDF aprovado por ATS.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {TEMPLATES.map((template) => (
          <Card key={template.key} className="flex flex-col p-6">
            <div className="aspect-[3/4] w-full rounded-lg border border-ink-100 bg-ink-50/60 p-4">
              <div className="h-2 w-2/3 rounded-full bg-ink-300" />
              <div className="mt-2 h-1.5 w-1/2 rounded-full bg-ink-100" />
              <div className="mt-4 h-1.5 w-full rounded-full bg-ink-100" />
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-ink-100" />
              <div className="mt-1.5 h-1.5 w-4/5 rounded-full bg-ink-100" />
              <div className="mt-4 h-1.5 w-1/3 rounded-full bg-brand-200" />
              <div className="mt-2 h-1.5 w-full rounded-full bg-ink-100" />
              <div className="mt-1.5 h-1.5 w-4/5 rounded-full bg-ink-100" />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-ink-950">{template.name}</h3>
            <p className="mt-1 flex-1 text-sm text-ink-500">{template.description}</p>
            {latestResumeId && (
              <Link
                href={`${APP_BASE}/dashboard/preview/${latestResumeId}?template=${template.key}`}
                className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Usar neste modelo →
              </Link>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
