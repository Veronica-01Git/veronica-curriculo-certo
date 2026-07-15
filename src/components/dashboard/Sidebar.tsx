"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import { APP_BASE } from "@/lib/routes";

const NAV_ITEMS = [
  { href: `${APP_BASE}/dashboard`, label: "Meus currículos", icon: DocIcon },
  { href: `${APP_BASE}/dashboard/upload`, label: "Novo currículo", icon: UploadIcon },
  { href: `${APP_BASE}/dashboard/templates`, label: "Modelos", icon: LayersIcon },
  { href: `${APP_BASE}/dashboard/billing`, label: "Assinatura", icon: CardIcon },
  { href: `${APP_BASE}/dashboard/settings`, label: "Segurança", icon: KeyIcon },
];

export function Sidebar({ userName, role }: { userName: string; role: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-ink-100 bg-white">
      <div className="px-6 py-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-ink-950 text-white" : "text-ink-700 hover:bg-ink-100"
              }`}
            >
              <item.icon />
              {item.label}
            </Link>
          );
        })}

        {role === "ADMIN" && (
          <Link
            href={`${APP_BASE}/admin`}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname.startsWith(`${APP_BASE}/admin`) ? "bg-ink-950 text-white" : "text-ink-700 hover:bg-ink-100"
            }`}
          >
            <ShieldIcon />
            Painel admin
          </Link>
        )}
      </nav>

      <div className="border-t border-ink-100 p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-sm font-semibold text-ink-700">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-950">{userName}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs text-ink-500 hover:text-ink-950"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function iconProps() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;
}
function DocIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" strokeLinejoin="round" />
      <path d="M14 3v5h5" strokeLinejoin="round" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 16V4M12 4l-5 5M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
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
function CardIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
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
function KeyIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M17 6l3 3M14 9l2 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
