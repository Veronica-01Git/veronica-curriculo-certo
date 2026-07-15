import { type HTMLAttributes } from "react";

type Tone = "brand" | "approve" | "neutral" | "warning" | "critical";

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  approve: "bg-approve-50 text-approve-600 border-approve-100",
  neutral: "bg-ink-100 text-ink-700 border-ink-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  critical: "bg-red-50 text-red-600 border-red-100",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
