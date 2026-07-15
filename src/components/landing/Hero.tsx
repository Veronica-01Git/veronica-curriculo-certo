import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { APP_BASE } from "@/lib/routes";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-20 md:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-100/50 blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="animate-fadeUp">
            <Badge tone="approve">
              <span className="h-1.5 w-1.5 rounded-full bg-approve-500" />
              Aprovado por robôs de recrutamento (ATS)
            </Badge>
          </div>

          <h1 className="mt-6 animate-fadeUp text-balance text-4xl font-semibold tracking-tight text-ink-950 [animation-delay:80ms] md:text-6xl">
            Seu currículo, reescrito para <span className="text-brand-600">passar pelo ATS</span> e chegar ao recrutador.
          </h1>

          <p className="mt-5 max-w-xl animate-fadeUp text-balance text-lg leading-relaxed text-ink-500 [animation-delay:160ms]">
            Envie seu currículo atual, a VERONICA analisa, otimiza palavras-chave e formatação, e devolve um PDF
            pronto — em três modelos aceitos pelos maiores sistemas de recrutamento do mundo.
          </p>

          <div className="mt-9 flex animate-fadeUp flex-col items-center gap-3 [animation-delay:240ms] sm:flex-row">
            <Button href={`${APP_BASE}/register`} size="lg">
              Otimizar meu currículo agora
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
            <Button href="#como-funciona" variant="secondary" size="lg">
              Ver como funciona
            </Button>
          </div>

          <p className="mt-4 animate-fadeUp text-xs text-ink-500 [animation-delay:280ms]">
            Sem cartão de crédito para começar · Primeira otimização grátis
          </p>
        </div>

        <HeroPreview />
      </Container>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-4xl animate-fadeUp [animation-delay:340ms]">
      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lift">
        <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-100" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-100" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-100" />
          <span className="ml-3 text-xs font-medium text-ink-500">painel · curriculocerto.app</span>
        </div>
        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-[1fr_260px]">
          <div className="space-y-3">
            <div className="h-3 w-2/5 rounded-full bg-ink-100" />
            <div className="h-2.5 w-full rounded-full bg-ink-100/70" />
            <div className="h-2.5 w-11/12 rounded-full bg-ink-100/70" />
            <div className="h-2.5 w-4/5 rounded-full bg-ink-100/70" />
            <div className="mt-5 h-2.5 w-1/3 rounded-full bg-ink-100" />
            <div className="h-2.5 w-full rounded-full bg-ink-100/70" />
            <div className="h-2.5 w-10/12 rounded-full bg-ink-100/70" />
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-approve-100 bg-approve-50/60 p-6">
            <span className="text-xs font-medium uppercase tracking-wide text-approve-600">Pontuação ATS</span>
            <span className="text-5xl font-semibold text-approve-600">94</span>
            <span className="text-xs text-ink-500">Pronto para envio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
