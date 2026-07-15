import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "./HowItWorks";
import { APP_BASE } from "@/lib/routes";

const PLANS = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "sempre",
    description: "Para testar a otimização em um currículo.",
    features: ["1 currículo otimizado", "Score ATS completo", "1 modelo de exportação", "Marca d'água na exportação"],
    cta: "Começar grátis",
    href: `${APP_BASE}/register`,
    highlight: false,
  },
  {
    name: "Profissional Mensal",
    price: "R$ 29,90",
    period: "/mês",
    description: "Para quem está em busca ativa por vaga.",
    features: [
      "Currículos ilimitados",
      "3 modelos aprovados por ATS",
      "Casamento de palavras-chave por vaga",
      "Reescrita assistida por IA",
      "Sem marca d'água",
    ],
    cta: "Assinar agora",
    href: `${APP_BASE}/register?plan=mensal`,
    highlight: true,
  },
  {
    name: "Profissional Anual",
    price: "R$ 239,90",
    period: "/ano",
    description: "2 meses grátis para quem já sabe que vai usar.",
    features: [
      "Tudo do plano mensal",
      "33% de economia no ano",
      "Suporte prioritário por e-mail",
      "Acesso antecipado a novos modelos",
    ],
    cta: "Assinar plano anual",
    href: `${APP_BASE}/register?plan=anual`,
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="precos" className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Preços"
          title="Simples, transparente, sem letras miúdas"
          description="Cancele quando quiser. Sem fidelidade, sem taxa de setup."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col p-8 ${
                plan.highlight ? "border-ink-950 shadow-lift ring-1 ring-ink-950" : ""
              }`}
            >
              {plan.highlight && (
                <Badge tone="brand" className="absolute -top-3 left-8">
                  Mais popular
                </Badge>
              )}
              <h3 className="text-sm font-semibold text-ink-700">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-ink-950">{plan.price}</span>
                <span className="text-sm text-ink-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-ink-500">{plan.description}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-approve-500">
                      <path d="M5 12.5L9.5 18L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Button href={plan.href} variant={plan.highlight ? "primary" : "secondary"} className="mt-8 w-full">
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
