import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckoutButton, PortalButton } from "@/components/dashboard/BillingActions";

const STATUS_LABEL: Record<string, string> = {
  TRIALING: "Plano gratuito",
  ACTIVE: "Ativa",
  PAST_DUE: "Pagamento pendente",
  CANCELED: "Cancelada",
  INCOMPLETE: "Incompleta",
};

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  const subscription = await prisma.subscription.findUnique({ where: { userId: session!.user.id } });

  const isActive = subscription?.status === "ACTIVE";

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Assinatura</h1>
      <p className="mt-1 text-sm text-ink-500">Gerencie seu plano e forma de pagamento.</p>

      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-500">Plano atual</p>
            <p className="mt-1 text-lg font-semibold text-ink-950">{subscription?.planName ?? "Gratuito"}</p>
          </div>
          <Badge tone={isActive ? "approve" : "neutral"}>
            {STATUS_LABEL[subscription?.status ?? "TRIALING"]}
          </Badge>
        </div>

        {subscription?.currentPeriodEnd && (
          <p className="mt-3 text-xs text-ink-500">
            Próxima renovação em {subscription.currentPeriodEnd.toLocaleDateString("pt-BR")}
            {subscription.cancelAtPeriodEnd ? " (cancelamento agendado)" : ""}
          </p>
        )}

        <div className="mt-6">{isActive ? <PortalButton /> : null}</div>
      </Card>

      {!isActive && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm font-semibold text-ink-950">Profissional Mensal</p>
            <p className="mt-1 text-2xl font-semibold text-ink-950">R$ 29,90</p>
            <p className="text-xs text-ink-500">por mês</p>
            <div className="mt-4">
              <CheckoutButton plan="mensal" label="Assinar mensal" />
            </div>
          </Card>
          <Card className="p-6 border-ink-950">
            <p className="text-sm font-semibold text-ink-950">Profissional Anual</p>
            <p className="mt-1 text-2xl font-semibold text-ink-950">R$ 239,90</p>
            <p className="text-xs text-ink-500">por ano · 2 meses grátis</p>
            <div className="mt-4">
              <CheckoutButton plan="anual" label="Assinar anual" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
