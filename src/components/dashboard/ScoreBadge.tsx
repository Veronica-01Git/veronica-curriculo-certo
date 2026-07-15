import { Badge } from "@/components/ui/Badge";

export function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <Badge tone="neutral">Sem análise</Badge>;
  if (score >= 80) return <Badge tone="approve">{score} · Pronto para envio</Badge>;
  if (score >= 55) return <Badge tone="warning">{score} · Pode melhorar</Badge>;
  return <Badge tone="critical">{score} · Precisa de ajustes</Badge>;
}
