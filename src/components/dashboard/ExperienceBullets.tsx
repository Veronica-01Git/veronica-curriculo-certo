"use client";

import { useState } from "react";
import type { ResumeExperience } from "@/types/resume";

export function ExperienceBullets({
  resumeId,
  experiences: initialExperiences,
}: {
  resumeId: string;
  experiences: ResumeExperience[];
}) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function rewrite(experienceIndex: number, bulletIndex: number) {
    const key = `${experienceIndex}-${bulletIndex}`;
    setLoadingKey(key);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    try {
      const res = await fetch("/api/resume/rewrite-bullet", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resumeId, experienceIndex, bulletIndex }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Falha ao reescrever.");

      setExperiences((prev) => {
        const next = prev.map((exp) => ({ ...exp, bullets: [...exp.bullets] }));
        next[experienceIndex].bullets[bulletIndex] = data.bullet as string;
        return next;
      });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [key]: err instanceof Error ? err.message : "Falha ao reescrever.",
      }));
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div className="mt-2 space-y-3">
      {experiences.map((exp, i) => (
        <div key={i}>
          <p className="font-medium text-ink-950">
            {exp.role} — {exp.company}
          </p>
          <ul className="mt-1 space-y-1.5 pl-4 text-ink-700">
            {exp.bullets.map((bullet, j) => {
              const key = `${i}-${j}`;
              const isLoading = loadingKey === key;
              return (
                <li key={j} className="group list-disc">
                  <div className="flex items-start justify-between gap-3">
                    <span>{bullet}</span>
                    <button
                      type="button"
                      onClick={() => rewrite(i, j)}
                      disabled={isLoading}
                      className="shrink-0 whitespace-nowrap text-xs font-medium text-brand-600 opacity-0 transition-opacity hover:text-brand-700 focus:opacity-100 group-hover:opacity-100 disabled:opacity-100"
                    >
                      {isLoading ? "Melhorando..." : "Melhorar com IA"}
                    </button>
                  </div>
                  {errors[key] && <p className="mt-0.5 text-xs text-red-600">{errors[key]}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
