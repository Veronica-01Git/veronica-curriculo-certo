const STRENGTH_LABEL = ["Muito fraca", "Fraca", "Razoável", "Boa", "Excelente"];
const STRENGTH_COLOR = ["bg-ink-100", "bg-red-400", "bg-amber-400", "bg-brand-400", "bg-approve-500"];

export function passwordStrength(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const strength = passwordStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < strength ? STRENGTH_COLOR[strength] : "bg-ink-100"
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-500">{STRENGTH_LABEL[strength]}</p>
    </div>
  );
}
