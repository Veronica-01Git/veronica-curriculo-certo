"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function CheckoutButton({ plan, label }: { plan: "mensal" | "anual"; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Não foi possível iniciar o checkout.");
      setLoading(false);
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={loading} className="w-full">
        {loading ? "Redirecionando..." : label}
      </Button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function PortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Não foi possível abrir o portal de cobrança.");
      setLoading(false);
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={loading} variant="secondary">
        {loading ? "Abrindo..." : "Gerenciar assinatura"}
      </Button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
