"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { APP_BASE } from "@/lib/routes";

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
};

export function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [targetJobText, setTargetJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024,
  });

  async function handleSubmit() {
    if (!file) {
      setError("Selecione um arquivo para continuar.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetRole", targetRole);
    formData.append("targetJobText", targetJobText);

    const res = await fetch("/api/resume/upload", { method: "POST", body: formData });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível processar o arquivo.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    router.push(`${APP_BASE}/dashboard/preview/${data.id}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card
        {...getRootProps()}
        className={`cursor-pointer border-2 border-dashed p-12 text-center transition-colors ${
          isDragActive ? "border-brand-400 bg-brand-50/40" : "border-ink-100 hover:border-ink-300"
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-500">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 16V4M12 4l-5 5M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {file ? (
          <p className="mt-4 text-sm font-medium text-ink-950">{file.name}</p>
        ) : (
          <>
            <p className="mt-4 text-sm font-medium text-ink-950">
              Arraste seu currículo aqui ou clique para selecionar
            </p>
            <p className="mt-1 text-xs text-ink-500">PDF, DOCX ou TXT · até 8MB</p>
          </>
        )}
      </Card>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700">Cargo alvo (opcional)</label>
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="Ex: Analista de Dados Sênior"
          className="w-full rounded-lg border border-ink-100 bg-white px-3.5 py-2.5 text-[15px] text-ink-950 outline-none transition-colors placeholder:text-ink-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700">
          Descrição da vaga (opcional, melhora o casamento de palavras-chave)
        </label>
        <textarea
          value={targetJobText}
          onChange={(e) => setTargetJobText(e.target.value)}
          rows={6}
          placeholder="Cole aqui o texto da vaga que você quer se candidatar..."
          className="w-full rounded-lg border border-ink-100 bg-white px-3.5 py-2.5 text-[15px] text-ink-950 outline-none transition-colors placeholder:text-ink-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleSubmit} disabled={loading} size="lg" className="w-full">
        {loading ? "Analisando currículo..." : "Analisar e gerar score ATS"}
      </Button>
    </div>
  );
}
