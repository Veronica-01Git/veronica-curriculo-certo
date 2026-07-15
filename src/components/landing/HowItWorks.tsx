import { Container } from "@/components/ui/Container";

const STEPS = [
  {
    number: "01",
    title: "Envie seu currículo",
    description: "Arraste o PDF, DOCX ou TXT atual. A VERONICA extrai e organiza cada seção automaticamente.",
  },
  {
    number: "02",
    title: "Cole a vaga alvo",
    description: "Adicione a descrição da vaga para casar palavras-chave exatas exigidas pelo ATS da empresa.",
  },
  {
    number: "03",
    title: "Receba o score e ajustes",
    description: "Veja sua pontuação ATS de 0 a 100, com problemas críticos e sugestões objetivas de melhoria.",
  },
  {
    number: "04",
    title: "Baixe o PDF certo",
    description: "Escolha entre 3 modelos aprovados por ATS e exporte o arquivo pronto para envio.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Como funciona"
          title="Do currículo atual ao PDF aprovado em 4 passos"
          description="Um fluxo direto, pensado para quem precisa candidatar-se agora — sem enrolação."
        />

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              <span className="text-sm font-semibold text-brand-500">{step.number}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">{eyebrow}</span>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-balance text-base leading-relaxed text-ink-500">{description}</p>}
    </div>
  );
}
