"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("A confirmação não corresponde à nova senha.");
      return;
    }
    if (newPassword.length < 8) {
      setError("A nova senha deve ter ao menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Não foi possível alterar sua senha.");
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="currentPassword"
        type="password"
        label="Senha atual"
        placeholder="••••••••"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

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
      {success && <p className="text-sm text-approve-600">Senha alterada com sucesso.</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Salvando..." : "Salvar nova senha"}
      </Button>
    </form>
  );
}
