import { getAnthropicClient } from "@/lib/ai/client";
import type { ResumeData, ResumeExperience, ResumeEducation } from "@/types/resume";

/**
 * Extrai texto bruto de um arquivo enviado pelo usuário (PDF, DOCX ou TXT).
 */
export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // txt e fallback
  return buffer.toString("utf-8");
}

/**
 * JSON Schema bruto (não usa a Zod — o helper zodOutputFormat do SDK exige
 * Zod v4, e este projeto usa Zod v3 para validação de formulários).
 */
const RESUME_JSON_SCHEMA = {
  type: "object",
  properties: {
    contact: {
      type: "object",
      properties: {
        fullName: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        linkedin: { type: "string" },
        portfolio: { type: "string" },
      },
      required: ["fullName"],
      additionalProperties: false,
    },
    summary: { type: "string" },
    skills: { type: "array", items: { type: "string" } },
    experiences: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          company: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["role", "company", "bullets"],
        additionalProperties: false,
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          degree: { type: "string" },
          institution: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
        },
        required: ["degree", "institution"],
        additionalProperties: false,
      },
    },
    certifications: { type: "array", items: { type: "string" } },
    languages: { type: "array", items: { type: "string" } },
  },
  required: ["contact", "summary", "skills", "experiences", "education", "certifications", "languages"],
  additionalProperties: false,
} as const;

/**
 * Estruturador via IA: converte texto bruto de currículo em ResumeData
 * preservando a ordem original do documento. Requer ANTHROPIC_API_KEY —
 * lança AiUnavailableError se não estiver configurada (o chamador deve
 * cair de volta para o heurístico structureResumeText nesse caso).
 */
export async function structureResumeWithAi(rawText: string): Promise<ResumeData> {
  const response = await getAnthropicClient().messages.create({
    model: "claude-sonnet-5",
    max_tokens: 4096,
    output_config: { format: { type: "json_schema", schema: RESUME_JSON_SCHEMA } },
    messages: [
      {
        role: "user",
        content: `Extraia os dados estruturados do currículo abaixo. Regras importantes:
- Preserve EXATAMENTE a ordem original das experiências profissionais, das conquistas (bullets) de cada experiência e da formação acadêmica — na mesma ordem em que aparecem no texto original. Não reordene por data nem por relevância.
- Não invente, corrija ou complete informações que não estão no texto.
- Cada bullet de experiência é uma frase/linha separada, sem numeração nem marcador.
- Se um campo (telefone, LinkedIn, datas etc.) não existir no texto, deixe de fora.

Texto do currículo:
"""
${rawText}
"""`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (textBlock?.type !== "text") {
    throw new Error("A IA não retornou um currículo estruturado válido.");
  }

  return JSON.parse(textBlock.text) as ResumeData;
}

const SECTION_HEADERS: Record<keyof Pick<ResumeData, "summary" | "skills" | "experiences" | "education" | "certifications" | "languages">, RegExp> = {
  summary: /^(resumo|objetivo|perfil profissional|sobre mim|summary)/i,
  skills: /^(habilidades|compet[êe]ncias|skills|tecnologias)/i,
  experiences: /^(experi[êe]ncia|hist[óo]rico profissional|experience)/i,
  education: /^(forma[çc][ãa]o|educa[çc][ãa]o|education)/i,
  certifications: /^(certifica[çc][õo]es|certifications|cursos)/i,
  languages: /^(idiomas|languages)/i,
};

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?\d{1,3}[\s.-]?)?\(?\d{2,3}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}/;
const LINKEDIN_RE = /linkedin\.com\/[^\s,;]+/i;

/**
 * Estruturador heurístico: converte texto bruto de currículo em ResumeData.
 * Não depende de nenhuma API externa — funciona 100% offline. Quando uma
 * ANTHROPIC_API_KEY/OPENAI_API_KEY estiver configurada, o otimizador
 * (ver optimizer.ts) pode refinar este resultado com IA.
 */
export function structureResumeText(rawText: string): ResumeData {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const fullText = rawText;
  const email = fullText.match(EMAIL_RE)?.[0];
  const phone = fullText.match(PHONE_RE)?.[0];
  const linkedin = fullText.match(LINKEDIN_RE)?.[0];
  const fullName = lines[0]?.length && lines[0].length < 60 ? lines[0] : "Seu Nome";

  const buckets: Record<string, string[]> = {
    summary: [],
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    languages: [],
    other: [],
  };

  let currentBucket = "other";
  for (const line of lines.slice(1)) {
    const matchedHeader = Object.entries(SECTION_HEADERS).find(([, re]) => re.test(line));
    if (matchedHeader) {
      currentBucket = matchedHeader[0];
      continue;
    }
    buckets[currentBucket].push(line);
  }

  const skills = buckets.skills
    .join(", ")
    .split(/[,•;|]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40);

  const experiences: ResumeExperience[] = groupIntoBlocks(buckets.experiences).map((block) => ({
    role: block[0] ?? "Cargo",
    company: block[1] ?? "Empresa",
    bullets: block.slice(2).filter((l) => l.length > 0),
  }));

  const education: ResumeEducation[] = groupIntoBlocks(buckets.education, 2).map((block) => ({
    degree: block[0] ?? "Formação",
    institution: block[1] ?? "Instituição",
  }));

  return {
    contact: { fullName, email, phone, linkedin },
    summary: buckets.summary.join(" ").slice(0, 600),
    skills: Array.from(new Set(skills)).slice(0, 30),
    experiences,
    education,
    certifications: buckets.certifications.filter(Boolean),
    languages: buckets.languages.filter(Boolean),
  };
}

/** Agrupa linhas soltas em blocos (heurística: nova entrada a cada N linhas não vazias). */
function groupIntoBlocks(lines: string[], minSize = 3): string[][] {
  if (lines.length === 0) return [];
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const looksLikeNewEntry = /^\d{4}|—|-\s*\d{4}|atual/i.test(line) === false && current.length >= minSize;
    if (looksLikeNewEntry && current.length > 0) {
      blocks.push(current);
      current = [];
    }
    current.push(line);
  }
  if (current.length) blocks.push(current);
  return blocks;
}
