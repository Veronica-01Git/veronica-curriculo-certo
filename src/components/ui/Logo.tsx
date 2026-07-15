import Link from "next/link";
import { APP_BASE } from "@/lib/routes";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href={APP_BASE} className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 12.5L9.5 18L20 6"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-ink-950">VERONICA</span>
        <span className="text-[10.5px] font-medium tracking-wide text-ink-500">Currículo Certo</span>
      </span>
    </Link>
  );
}
