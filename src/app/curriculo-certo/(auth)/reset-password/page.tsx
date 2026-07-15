import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/ui/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { APP_BASE } from "@/lib/routes";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Criar nova senha"
      subtitle="Escolha uma senha forte para proteger sua conta."
      footer={
        <>
          Lembrou a senha?{" "}
          <Link href={`${APP_BASE}/login`} className="font-medium text-brand-600 hover:text-brand-700">
            Voltar para o login
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
