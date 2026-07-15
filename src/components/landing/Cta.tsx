import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { APP_BASE } from "@/lib/routes";

export function Cta() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-xl2 bg-ink-950 px-8 py-16 text-center md:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:36px_36px] opacity-[0.06] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
          />
          <h2 className="relative text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Seu próximo processo seletivo começa com um currículo que passa pelo filtro.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-balance text-ink-300">
            Leve menos de 5 minutos para enviar, otimizar e baixar seu currículo aprovado por ATS.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button href={`${APP_BASE}/register`} variant="primary" size="lg" className="bg-white text-ink-950 hover:bg-ink-100">
              Otimizar meu currículo agora
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
