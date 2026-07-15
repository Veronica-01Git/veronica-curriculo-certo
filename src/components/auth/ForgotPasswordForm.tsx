"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Não foi possível processar seu pedido.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl2 border border-approve-100 bg-approve-50/60 p-4">
        <p className="text-sm text-approve-700">
          Se <span className="font-medium">{email}</span> estiver cadastrado, você vai receber um link de
          redefinição em instantes. Confira também a caixa de spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="email"
        type="email"
        label="E-mail"
        placeholder="voce@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar link de redefinição"}
      </Button>
    </form>
  );
}
