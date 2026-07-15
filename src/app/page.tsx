import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { APP_BASE } from "@/lib/routes";

export default function HubHomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

      <Container className="relative flex min-h-screen flex-col items-center justify-center py-24 text-center">
        <span className="text-sm font-semibold tracking-[0.2em] text-ink-500">VERONICA</span>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-ink-950 md:text-5xl">
          Um hub de ferramentas para sua carreira
        </h1>
        <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-ink-500">
          Cada produto VERONICA resolve uma etapa da sua jornada profissional. Comece pelo que já está disponível.
        </p>

        <div className="mt-12 grid w-full max-w-md grid-cols-1 gap-4">
          <Link href={`${APP_BASE}`}>
            <Card className="flex items-center gap-4 p-6 text-left transition-shadow hover:shadow-soft">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink-950">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 12.5L9.5 18L20 6"
                    stroke="white"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-ink-950">Currículo Certo</p>
                <p className="mt-0.5 text-sm text-ink-500">
                  Otimize seu currículo e exporte um PDF aprovado por ATS.
                </p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-ink-300">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Card>
          </Link>

          <Card className="flex items-center gap-4 p-6 text-left opacity-60">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink-100" />
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-ink-950">Próximo produto</p>
              <p className="mt-0.5 text-sm text-ink-500">Em breve.</p>
            </div>
            <Badge tone="neutral">Em breve</Badge>
          </Card>
        </div>
      </Container>
    </main>
  );
}
