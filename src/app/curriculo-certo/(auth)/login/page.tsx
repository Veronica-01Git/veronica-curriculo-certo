import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/ui/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { APP_BASE } from "@/lib/routes";

export default function LoginPage() {
  return (
    <AuthShell
      title="Bem-vindo de volta"
      subtitle="Entre para continuar otimizando seu currículo."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href={`${APP_BASE}/register`} className="font-medium text-brand-600 hover:text-brand-700">
            Criar conta grátis
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
