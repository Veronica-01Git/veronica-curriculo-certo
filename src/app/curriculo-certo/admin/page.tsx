import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminPage() {
  const [userCount, resumeCount, activeSubscriptions, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { subscription: true, _count: { select: { resumes: true } } },
    }),
  ]);

  const avgScoreResult = await prisma.resume.aggregate({ _avg: { atsScore: true } });

  const stats = [
    { label: "Usuários totais", value: userCount },
    { label: "Currículos processados", value: resumeCount },
    { label: "Assinaturas ativas", value: activeSubscriptions },
    { label: "Score ATS médio", value: Math.round(avgScoreResult._avg.atsScore ?? 0) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Painel admin</h1>
      <p className="mt-1 text-sm text-ink-500">Visão geral da operação da VERONICA.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-sm text-ink-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-ink-950">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="border-b border-ink-100 p-6">
          <h2 className="text-sm font-semibold text-ink-950">Usuários recentes</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-500">
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
              <th className="px-6 py-3 font-medium">Currículos</th>
              <th className="px-6 py-3 font-medium">Plano</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user) => (
              <tr key={user.id} className="border-b border-ink-100 last:border-0">
                <td className="px-6 py-3.5 font-medium text-ink-950">{user.name ?? "—"}</td>
                <td className="px-6 py-3.5 text-ink-500">{user.email}</td>
                <td className="px-6 py-3.5 text-ink-500">{user._count.resumes}</td>
                <td className="px-6 py-3.5">
                  <Badge tone={user.subscription?.status === "ACTIVE" ? "approve" : "neutral"}>
                    {user.subscription?.planName ?? "Gratuito"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
