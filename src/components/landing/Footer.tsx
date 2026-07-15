import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 py-12">
      <Container className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <Logo />
        <p className="text-xs text-ink-500">
          © {new Date().getFullYear()} VERONICA. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-sm text-ink-500">
          <a href="#" className="hover:text-ink-950 transition-colors">
            Privacidade
          </a>
          <a href="#" className="hover:text-ink-950 transition-colors">
            Termos
          </a>
          <a href="mailto:contato@curriculocerto.app" className="hover:text-ink-950 transition-colors">
            Contato
          </a>
        </div>
      </Container>
    </footer>
  );
}
