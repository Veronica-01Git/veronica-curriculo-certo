import Link from "next/link";
import { AuthShell } from "@/components/ui/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { APP_BASE } from "@/lib/routes";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Esqueceu sua senha?"
      subtitle="Informe seu e-mail e enviaremos um link para você criar uma nova senha."
      footer={
        <>
          Lembrou a senha?{" "}
          <Link href={`${APP_BASE}/login`} className="font-medium text-brand-600 hover:text-brand-700">
            Voltar para o login
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
