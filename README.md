# VERONICA — Currículo Certo

Micro SaaS que transforma o currículo do assinante em um PDF otimizado para ser aprovado por sistemas de rastreamento de candidatos (ATS).

Este projeto é o primeiro produto do **VERONICA Hub** (https://veronicahub.com). A raiz do domínio é reservada para uma futura landing com múltiplos produtos; o Currículo Certo vive em **`/curriculo-certo`**.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — UI branca, limpa, responsiva
- **Prisma** + **PostgreSQL** (Neon) — banco na nuvem
- **NextAuth** — login por e-mail/senha (Google OAuth pronto para plugar), recuperação de senha por e-mail
- **Stripe** — assinaturas mensal/anual (checkout, portal, webhook)
- **Resend** — envio de e-mail transacional (recuperação de senha), com fallback de log em dev quando não configurado
- **@react-pdf/renderer** — geração nativa de PDF (texto real, sem imagem)
- **pdf-parse / mammoth** — extração de texto de PDF/DOCX enviados pelo usuário

## Estrutura de rotas

```
/                          → landing do VERONICA Hub (placeholder para futuros produtos)
/curriculo-certo           → landing de marketing do Currículo Certo
/curriculo-certo/login
/curriculo-certo/register
/curriculo-certo/forgot-password
/curriculo-certo/reset-password
/curriculo-certo/dashboard/*
/curriculo-certo/admin/*
/api/*                     → rotas de API (não seguem o prefixo /curriculo-certo)
```

O prefixo vive em `src/lib/routes.ts` (`APP_BASE`). Se o Currículo Certo um dia precisar mudar de caminho, é o único lugar a editar (exceto o `matcher` do `middleware.ts`, que precisa de strings literais por exigência do Next.js).

## Como rodar localmente

```bash
npm install
cp .env.example .env      # preencha DATABASE_URL, DIRECT_URL e NEXTAUTH_SECRET no mínimo
npm run db:push           # sincroniza o schema com seu banco Postgres
npm run dev                # http://localhost:3000/curriculo-certo
```

Gere o `NEXTAUTH_SECRET` com:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Scripts de manutenção de usuários

```bash
npm run make:admin -- seuemail@exemplo.com     # promove um usuário a ADMIN
npm run delete:user -- seuemail@exemplo.com    # remove um usuário e todos os dados vinculados
```

## Plugando APIs reais

Todas as integrações externas são opcionais e o app funciona sem elas — cada uma é ativada apenas preenchendo a variável de ambiente correspondente em `.env`:

| Recurso | Variável | Efeito se ausente |
|---|---|---|
| Pagamentos | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_*` | Botões de checkout retornam erro amigável |
| Login Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Apenas login por e-mail/senha aparece |
| Reescrita com IA | `ANTHROPIC_API_KEY` ou `OPENAI_API_KEY` | Otimizador usa apenas heurística local |
| E-mail transacional | `RESEND_API_KEY`, `EMAIL_FROM` | Link de recuperação de senha é apenas logado no console do servidor |

## Motor ATS (`src/lib/ats`)

- `parser.ts` — extrai texto do arquivo e estrutura em `ResumeData`
- `optimizer.ts` — calcula score 0-100, compara com a vaga alvo, gera diagnóstico
- `templates/` — 3 modelos de PDF (Clássico, Moderno, Executivo), todos em coluna única e texto real
- `pdf-generator.ts` — renderiza o PDF final

## Deploy em produção (Vercel + domínio próprio)

1. Suba este repositório para o GitHub.
2. Importe o repositório em https://vercel.com/new.
3. Configure as variáveis de ambiente no painel do projeto na Vercel (mesmas chaves do `.env.example`, com valores de produção — `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL` devem ser `https://veronicahub.com`, sem o sufixo `/curriculo-certo`).
4. Em *Settings → Domains* na Vercel, adicione `veronicahub.com` e siga os registros DNS indicados.
5. No painel DNS do registrador do domínio, aponte os registros conforme instruído pela Vercel.
6. Configure o webhook do Stripe apontando para `https://veronicahub.com/api/billing/webhook` quando for ativar cobranças reais.
