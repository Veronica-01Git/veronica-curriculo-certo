import { AiUnavailableError, getAnthropicClient } from "@/lib/ai/client";
import type { AtsAnalysis, AtsIssue, ResumeData } from "@/types/resume";

export { AiUnavailableError as AiRewriteUnavailableError };

const STOPWORDS = new Set(
  "a o os as de da do das dos em no na nos nas para por com sem um uma uns umas que e ou ao aos à às the of and or to in on for with a an".split(
    " "
  )
);

const ACTION_VERBS = [
  "liderou",
  "desenvolveu",
  "implementou",
  "otimizou",
  "reduziu",
  "aumentou",
  "criou",
  "gerenciou",
  "coordenou",
  "entregou",
  "led",
  "built",
  "developed",
  "implemented",
  "optimized",
  "increased",
  "reduced",
  "managed",
];

const HAS_METRIC_RE = /\d+([.,]\d+)?\s?(%|x|k|mil|milhões|milhoes|horas|dias|meses|anos)?/i;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function extractKeywords(text: string, topN = 25): string[] {
  const tokens = tokenize(text);
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * Analisa um currículo estruturado contra uma vaga alvo (opcional) e produz
 * um score ATS de 0 a 100, palavras-chave e problemas de formatação/conteúdo.
 * Roda 100% localmente — nenhuma dependência de API externa.
 */
export function analyzeAts(resume: ResumeData, targetJobText?: string): AtsAnalysis {
  const issues: AtsIssue[] = [];
  let score = 100;

  // --- Contato ---
  if (!resume.contact.email) {
    issues.push({ severity: "critical", message: "Nenhum e-mail encontrado. Adicione um e-mail profissional." });
    score -= 15;
  }
  if (!resume.contact.phone) {
    issues.push({ severity: "warning", message: "Nenhum telefone encontrado." });
    score -= 5;
  }

  // --- Resumo ---
  if (!resume.summary || resume.summary.length < 60) {
    issues.push({
      severity: "warning",
      message: "Resumo profissional muito curto. Escreva 2-4 linhas destacando seu valor.",
    });
    score -= 8;
  }

  // --- Habilidades ---
  if (resume.skills.length < 5) {
    issues.push({ severity: "warning", message: "Poucas habilidades listadas. Adicione ao menos 8-12 relevantes." });
    score -= 8;
  }

  // --- Experiências ---
  if (resume.experiences.length === 0) {
    issues.push({ severity: "critical", message: "Nenhuma experiência profissional identificada." });
    score -= 20;
  }

  let bulletsWithMetrics = 0;
  let bulletsWithActionVerbs = 0;
  let totalBullets = 0;
  for (const exp of resume.experiences) {
    for (const bullet of exp.bullets) {
      totalBullets++;
      if (HAS_METRIC_RE.test(bullet)) bulletsWithMetrics++;
      const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase();
      if (firstWord && ACTION_VERBS.some((v) => firstWord.startsWith(v.slice(0, 5)))) {
        bulletsWithActionVerbs++;
      }
    }
  }

  if (totalBullets > 0 && bulletsWithMetrics / totalBullets < 0.3) {
    issues.push({
      severity: "tip",
      message: "Poucos resultados quantificados. Adicione números (%, R$, tempo) às suas conquistas.",
    });
    score -= 6;
  }
  if (totalBullets > 0 && bulletsWithActionVerbs / totalBullets < 0.4) {
    issues.push({
      severity: "tip",
      message: "Comece suas conquistas com verbos de ação (Liderou, Implementou, Reduziu...).",
    });
    score -= 4;
  }

  // --- Palavras-chave vs. vaga alvo ---
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];

  if (targetJobText && targetJobText.trim().length > 20) {
    const jobKeywords = extractKeywords(targetJobText, 30);
    const resumeTokens = new Set(
      tokenize(
        [resume.summary, resume.skills.join(" "), resume.experiences.map((e) => e.bullets.join(" ")).join(" ")].join(
          " "
        )
      )
    );

    matchedKeywords = jobKeywords.filter((k) => resumeTokens.has(k));
    missingKeywords = jobKeywords.filter((k) => !resumeTokens.has(k)).slice(0, 15);

    const matchRatio = jobKeywords.length ? matchedKeywords.length / jobKeywords.length : 1;
    score = Math.round(score * 0.6 + matchRatio * 40);

    if (missingKeywords.length > 0) {
      issues.push({
        severity: "warning",
        message: `${missingKeywords.length} palavras-chave da vaga não aparecem no currículo.`,
      });
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, matchedKeywords, missingKeywords, issues };
}

/**
 * Reescrita assistida por IA de uma conquista de currículo (opcional).
 * Usa Anthropic se ANTHROPIC_API_KEY estiver definida, senão OpenAI se
 * OPENAI_API_KEY estiver definida. Sem nenhuma chave configurada, lança
 * AiUnavailableError — o chamador decide como comunicar isso ao usuário.
 */
export async function rewriteBulletWithAi(bullet: string, targetRole?: string): Promise<string> {
  const prompt = `Reescreva a conquista de currículo abaixo para ser mais objetiva, começar com verbo de ação forte e, quando possível, incluir uma métrica de impacto. Responda apenas com a frase reescrita, sem aspas.\n\nCargo alvo: ${
    targetRole ?? "não informado"
  }\nFrase original: "${bullet}"`;

  if (process.env.ANTHROPIC_API_KEY) {
    const response = await getAnthropicClient().messages.create({
      model: "claude-sonnet-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = response.content.find((block) => block.type === "text");
    return (textBlock?.type === "text" ? textBlock.text.trim() : "") || bullet;
  }

  if (process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI respondeu ${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() || bullet;
  }

  throw new AiUnavailableError();
}
