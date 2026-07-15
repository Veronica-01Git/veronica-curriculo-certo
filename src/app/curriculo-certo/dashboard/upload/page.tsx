import { UploadForm } from "@/components/dashboard/UploadForm";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Novo currículo</h1>
      <p className="mt-1 text-sm text-ink-500">
        Envie seu arquivo atual. Extraímos o conteúdo automaticamente e calculamos seu score ATS.
      </p>
      <div className="mt-8">
        <UploadForm />
      </div>
    </div>
  );
}
