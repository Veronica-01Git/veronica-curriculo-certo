import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "./HowItWorks";

const FEATURES = [
  {
    title: "Score ATS em tempo real",
    description: "Pontuação de 0 a 100 com diagnóstico de contato, formatação, palavras-chave e métricas de impacto.",
    icon: GaugeIcon,
  },
  {
    title: "Casamento de palavras-chave",
    description: "Compara seu currículo com a vaga alvo e aponta exatamente o que está faltando.",
    icon: TargetIcon,
  },
  {
    title: "3 modelos aprovados por ATS",
    description: "Clássico, Moderno e Executivo — todos em coluna única, texto real, sem tabelas ou imagens.",
    icon: LayersIcon,
  },
  {
    title: "Reescrita com IA (opcional)",
    description: "Conecte sua própria chave Anthropic ou OpenAI para reescrever conquistas com verbos de ação e métricas.",
    icon: SparkleIcon,
  },
  {
    title: "Exportação em PDF real",
    description: "Nada de imagem disfarçada de texto — geração nativa de PDF, 100% selecionável e indexável.",
    icon: FileIcon,
  },
  {
    title: "Privacidade em primeiro lugar",
    description: "Seus dados e arquivos ficam vinculados apenas à sua conta, com exclusão a qualquer momento.",
    icon: ShieldIcon,
  },
];

export function Features() {
  return (
    <section id="recursos" className="bg-ink-50/40 py-24">
      <Container>
        <SectionHeading
          eyebrow="Recursos"
          title="Tudo que um currículo precisa para ser lido — por máquina e por humano"
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="p-6 transition-shadow hover:shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <feature.icon />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-ink-950">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

function iconProps() {
  return { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;
}

function GaugeIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 12l4-4M4 12a8 8 0 1116 0" strokeLinecap="round" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" strokeLinejoin="round" />
      <path d="M3 13l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" strokeLinejoin="round" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" strokeLinejoin="round" />
      <path d="M14 3v5h5" strokeLinejoin="round" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
    </svg>
  );
}
