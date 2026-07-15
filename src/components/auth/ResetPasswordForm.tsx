"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import { APP_BASE } from "@/lib/routes";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;

  if (!token) {
    return (
      <div className="rounded-xl2 border border-red-100 bg-red-50/60 p-4">
        <p className="text-sm text-red-600">
          Este link de redefinição é inválido. Solicite um novo na tela de{" "}
          <a href={`${APP_BASE}/forgot-password`} className="font-medium underline">
            esqueci minha senha
          </a>
          .
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl2 border border-approve-100 bg-approve-50/60 p-4">
          <p className="text-sm text-approve-700">Sua senha foi redefinida com sucesso.</p>
        </div>
        <Button href={`${APP_BASE}/login`} className="w-full">
          Ir para o login
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("A confirmação não corresponde à nova senha.");
      return;
    }
    if (newPassword.length < 8) {
      setError("A nova senha deve ter ao menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Não foi possível redefinir sua senha.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.prefetch(`${APP_BASE}/login`), 0);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          id="newPassword"
          type="password"
          label="Nova senha"
          placeholder="Mínimo 8 caracteres"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <PasswordStrengthMeter password={newPassword} />
      </div>

      <Input
        id="confirmPassword"
        type="password"
        label="Confirmar nova senha"
        placeholder="Repita a nova senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        autoComplete="new-password"
        error={confirmMismatch ? "As senhas não coincidem." : undefined}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Redefinindo..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
