import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

/**
 * Retorna o cliente Stripe, ou null se a chave ainda não foi configurada.
 * Isso permite que o app rode e seja demonstrado antes de plugar o Stripe real.
 */
export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });
  }
  return stripeInstance;
}

export const PLANS = {
  mensal: {
    name: "Profissional Mensal",
    priceId: process.env.STRIPE_PRICE_ID_MENSAL ?? "",
    priceLabel: "R$ 29,90/mês",
  },
  anual: {
    name: "Profissional Anual",
    priceId: process.env.STRIPE_PRICE_ID_ANUAL ?? "",
    priceLabel: "R$ 239,90/ano",
  },
} as const;
