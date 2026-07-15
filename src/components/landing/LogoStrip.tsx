import { Container } from "@/components/ui/Container";

const SYSTEMS = ["Workday", "Greenhouse", "Taleo", "iCIMS", "SAP SuccessFactors", "Lever"];

export function LogoStrip() {
  return (
    <div className="border-y border-ink-100 bg-ink-50/40 py-8">
      <Container>
        <p className="mb-5 text-center text-xs font-medium uppercase tracking-widest text-ink-500">
          Otimizado para os principais sistemas de rastreamento de candidatos
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {SYSTEMS.map((s) => (
            <span key={s} className="text-sm font-semibold tracking-tight text-ink-300">
              {s}
            </span>
          ))}
        </div>
      </Container>
    </div>
  );
}
