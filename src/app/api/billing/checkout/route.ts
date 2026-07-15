import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, PLANS } from "@/lib/stripe";
import { APP_BASE } from "@/lib/routes";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe ainda não configurado. Defina STRIPE_SECRET_KEY no ambiente." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const planKey = (body?.plan as "mensal" | "anual") ?? "mensal";
  const plan = PLANS[planKey];

  if (!plan.priceId) {
    return NextResponse.json({ error: `Price ID do plano "${planKey}" não configurado.` }, { status: 503 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${appUrl}${APP_BASE}/dashboard/billing?success=1`,
    cancel_url: `${appUrl}${APP_BASE}/dashboard/billing?canceled=1`,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
