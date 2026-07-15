export function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#059669" : score >= 55 ? "#B45309" : "#DC2626";
  const bg = score >= 80 ? "#ECFDF5" : score >= 55 ? "#FFFBEB" : "#FEF2F2";
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 p-6" style={{ backgroundColor: bg }}>
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#ffffff" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold" style={{ color }}>
            {score}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-ink-500">score ATS</span>
        </div>
      </div>
      <p className="mt-3 text-center text-xs font-medium" style={{ color }}>
        {score >= 80 ? "Pronto para envio" : score >= 55 ? "Pode melhorar" : "Precisa de ajustes"}
      </p>
    </div>
  );
}
