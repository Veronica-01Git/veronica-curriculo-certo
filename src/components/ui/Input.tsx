import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-ink-100 bg-white px-3.5 py-2.5 text-[15px] text-ink-950 outline-none transition-colors placeholder:text-ink-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-50 ${
            error ? "border-red-300 focus:border-red-400 focus:ring-red-50" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
