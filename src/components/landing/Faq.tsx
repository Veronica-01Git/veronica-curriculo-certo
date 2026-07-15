import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./HowItWorks";

const FAQS = [
  {
    q: "O que é um ATS e por que meu currículo precisa passar por ele?",
    a: "ATS (Applicant Tracking System) é o software que a maioria das empresas usa para filtrar candidaturas antes de um humano ler o currículo. Se a formatação ou as palavras-chave não forem compatíveis, seu currículo pode ser descartado automaticamente — mesmo que você seja qualificado.",
  },
  {
    q: "A VERONICA garante que serei aprovado na vaga?",
    a: "Garantimos que o formato e o conteúdo do seu currículo terão a maior compatibilidade técnica possível com sistemas ATS. A aprovação final depende também da sua experiência e do processo seletivo de cada empresa.",
  },
  {
    q: "Preciso configurar uma API de IA para usar o produto?",
    a: "Não. A análise de score ATS e a estruturação do currículo funcionam de forma totalmente local. A reescrita assistida por IA é um recurso opcional que você pode ativar conectando sua própria chave da Anthropic ou OpenAI.",
  },
  {
    q: "Em quais formatos posso enviar e exportar meu currículo?",
    a: "Você pode enviar PDF, DOCX ou TXT. A exportação final é sempre em PDF, no modelo Clássico, Moderno ou Executivo — todos otimizados para ATS.",
  },
  {
    q: "Posso cancelar minha assinatura quando quiser?",
    a: "Sim. O cancelamento é feito em um clique dentro do painel de cobrança e você mantém acesso até o fim do período já pago.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-ink-50/40 py-24">
      <Container>
        <SectionHeading eyebrow="Perguntas frequentes" title="Tudo que você precisa saber" />

        <div className="mx-auto mt-14 max-w-2xl divide-y divide-ink-100">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-ink-950">
                {item.q}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 text-ink-500 transition-transform duration-200 group-open:rotate-45"
                >
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
