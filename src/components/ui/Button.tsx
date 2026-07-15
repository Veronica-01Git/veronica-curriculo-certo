import { type ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink-950 text-white hover:bg-ink-900 shadow-soft active:scale-[0.98]",
  secondary:
    "bg-white text-ink-950 border border-ink-100 hover:border-ink-300 hover:bg-ink-50 active:scale-[0.98]",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100 active:scale-[0.98]",
  danger: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-[15px] rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", href, children, ...props }, ref) => {
    const classes = `inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out disabled:opacity-40 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
