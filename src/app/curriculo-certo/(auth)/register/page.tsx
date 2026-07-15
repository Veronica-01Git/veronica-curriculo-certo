import Link from "next/link";
import { AuthShell } from "@/components/ui/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { APP_BASE } from "@/lib/routes";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="Otimize seu primeiro currículo gratuitamente, sem cartão de crédito."
      footer={
        <>
          Já tem conta?{" "}
          <Link href={`${APP_BASE}/login`} className="font-medium text-brand-600 hover:text-brand-700">
            Entrar
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
