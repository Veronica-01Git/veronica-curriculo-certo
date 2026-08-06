import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeAts } from "@/lib/ats/optimizer";
import type { ResumeData, TemplateKey } from "@/types/resume";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";
import { ExportPanel } from "@/components/dashboard/ExportPanel";
import { ExperienceBullets } from "@/components/dashboard/ExperienceBullets";

const ISSUE_TONE = { critical: "critical", warning: "warning", tip: "brand" } as const;

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { template?: string };
}) {
  const session = await getServerSession(authOptions);
  const resume = await prisma.resume.findFirst({ where: { id: params.id, userId: session!.user.id } });

  if (!resume || !resume.structuredData) notFound();

  const data: ResumeData = JSON.parse(resume.structuredData);
  const analysis = analyzeAts(data, resume.targetJobText ?? undefined);
  const initialTemplate = (searchParams.template as TemplateKey) ?? (resume.template as TemplateKey);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">{resume.title}</h1>
          <p className="mt-1 text-sm text-ink-500">
            Enviado em {resume.createdAt.toLocaleDateString("pt-BR")} · Formato original {resume.sourceFormat.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr_320px]">
        <ScoreGauge score={analysis.score} />

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-ink-950">Diagnóstico</h3>
            <ul className="mt-4 space-y-3">
              {analysis.issues.length === 0 && (
                <li className="text-sm text-approve-600">Nenhum problema crítico encontrado. Excelente trabalho.</li>
              )}
              {analysis.issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Badge tone={ISSUE_TONE[issue.severity]} className="mt-0.5 shrink-0">
                    {issue.severity === "critical" ? "Crítico" : issue.severity === "warning" ? "Atenção" : "Dica"}
                  </Badge>
                  <span className="text-sm text-ink-700">{issue.message}</span>
                </li>
              ))}
            </ul>
          </Card>

          {(analysis.matchedKeywords.length > 0 || analysis.missingKeywords.length > 0) && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-ink-950">Palavras-chave da vaga</h3>
              {analysis.matchedKeywords.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-ink-500">Encontradas no currículo</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {analysis.matchedKeywords.map((k) => (
                      <Badge key={k} tone="approve">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {analysis.missingKeywords.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-ink-500">Ausentes — considere incluir</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map((k) => (
                      <Badge key={k} tone="critical">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-ink-950">Conteúdo extraído</h3>
            <div className="mt-4 space-y-5 text-sm">
              <div>
                <p className="font-medium text-ink-950">{data.contact.fullName}</p>
                <p className="text-ink-500">
                  {[data.contact.email, data.contact.phone, data.contact.location].filter(Boolean).join(" · ")}
                </p>
              </div>
              {data.summary && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Resumo</p>
                  <p className="mt-1 text-ink-700">{data.summary}</p>
                </div>
              )}
              {data.experiences.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Experiência</p>
                  <ExperienceBullets resumeId={resume.id} experiences={data.experiences} />
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <ExportPanel resumeId={resume.id} initialTemplate={initialTemplate} />
        </div>
      </div>
    </div>
  );
}
