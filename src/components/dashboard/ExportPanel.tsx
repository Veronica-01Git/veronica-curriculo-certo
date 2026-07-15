"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TEMPLATES, type TemplateKey } from "@/types/resume";

export function ExportPanel({ resumeId, initialTemplate }: { resumeId: string; initialTemplate: TemplateKey }) {
  const [template, setTemplate] = useState<TemplateKey>(initialTemplate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/resume/export", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resumeId, template }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Falha ao gerar PDF.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "curriculo-ats.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold text-ink-950">Escolha o modelo e exporte</h3>
      <div className="mt-4 space-y-2">
        {TEMPLATES.map((t) => (
          <label
            key={t.key}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
              template === t.key ? "border-brand-400 bg-brand-50/40" : "border-ink-100 hover:border-ink-300"
            }`}
          >
            <input
              type="radio"
              name="template"
              className="mt-1"
              checked={template === t.key}
              onChange={() => setTemplate(t.key)}
            />
            <span>
              <span className="block text-sm font-medium text-ink-950">{t.name}</span>
              <span className="block text-xs text-ink-500">{t.description}</span>
            </span>
          </label>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <Button onClick={handleExport} disabled={loading} className="mt-5 w-full">
        {loading ? "Gerando PDF..." : "Baixar PDF otimizado"}
      </Button>
    </Card>
  );
}
