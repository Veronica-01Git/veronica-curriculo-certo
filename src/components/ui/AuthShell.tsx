import { type ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Logo />
        <div className="mt-12 w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">{title}</h1>
          <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-ink-500">{footer}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <div
          aria-hidden
          className="absolute inset-0 bg-grid-faint bg-[size:40px_40px] opacity-[0.06] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_30%,black,transparent)]"
        />
        <div className="relative flex h-full flex-col items-start justify-end p-16">
          <p className="text-balance text-2xl font-medium leading-snug text-white">
            “Reformulei meu currículo em 5 minutos e passei no filtro do ATS na primeira tentativa.”
          </p>
          <p className="mt-4 text-sm text-ink-300">Usuária VERONICA · Currículo Certo</p>
        </div>
      </div>
    </div>
  );
}
