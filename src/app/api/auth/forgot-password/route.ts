import { randomBytes, createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { APP_BASE } from "@/lib/routes";

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido."),
});

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  const parsed = forgotPasswordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  // Resposta genérica sempre — não revela se o e-mail existe na base.
  const genericResponse = NextResponse.json({
    message: "Se este e-mail estiver cadastrado, você receberá um link de redefinição em instantes.",
  });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) {
    return genericResponse;
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expires: new Date(Date.now() + TOKEN_TTL_MS) },
    }),
  ]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl}${APP_BASE}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail(user.email, resetUrl);

  return genericResponse;
}
