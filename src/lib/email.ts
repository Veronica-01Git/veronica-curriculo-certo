const FROM = process.env.EMAIL_FROM ?? "VERONICA <contato@curriculocerto.app>";

/**
 * Envia e-mail via Resend se RESEND_API_KEY estiver configurada. Caso
 * contrário, registra o conteúdo no console do servidor — permite testar o
 * fluxo de recuperação de senha em desenvolvimento sem uma conta de e-mail.
 */
async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    console.log(`[email] RESEND_API_KEY não configurada. E-mail que seria enviado:
  Para: ${to}
  Assunto: ${subject}${links.length ? `\n  Link: ${links[0]}` : ""}
  ---
  ${html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Falha ao enviar e-mail via Resend: ${res.status} ${errorText}`);
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0A0A0B;">
      <p style="font-size: 13px; font-weight: 600; letter-spacing: 0.04em; color: #2361FF; text-transform: uppercase; margin: 0 0 24px;">
        VERONICA · Currículo Certo
      </p>
      <h1 style="font-size: 20px; margin: 0 0 12px;">Redefinir sua senha</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #3A3A3F; margin: 0 0 24px;">
        Recebemos um pedido para redefinir a senha da sua conta. Clique no botão abaixo para escolher uma nova senha.
        Este link expira em 1 hora.
      </p>
      <a href="${resetUrl}"
         style="display: inline-block; background: #0A0A0B; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; padding: 12px 22px; border-radius: 10px;">
        Redefinir senha
      </a>
      <p style="font-size: 12.5px; line-height: 1.6; color: #6B6B72; margin: 28px 0 0;">
        Se você não pediu essa alteração, pode ignorar este e-mail com segurança — sua senha continua a mesma.
      </p>
    </div>
  `;

  await sendEmail(to, "Redefinir sua senha — VERONICA", html);
}
