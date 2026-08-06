import Anthropic from "@anthropic-ai/sdk";

/** Lançada quando ANTHROPIC_API_KEY não está configurada. */
export class AiUnavailableError extends Error {
  constructor() {
    super("IA não configurada: defina ANTHROPIC_API_KEY no .env.");
    this.name = "AiUnavailableError";
  }
}

let anthropicClient: Anthropic | null = null;

/** Cliente Anthropic compartilhado. Lança AiUnavailableError se a chave não estiver definida. */
export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new AiUnavailableError();
  if (!anthropicClient) anthropicClient = new Anthropic();
  return anthropicClient;
}
