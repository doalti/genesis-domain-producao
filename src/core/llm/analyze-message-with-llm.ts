/**
 * Análise LLM opcional sobre query hints heurísticos (GAS core/llm/).
 */
import type { LlmPort } from "../../contracts/llm-port.js";

export type GenesisDomainProducaoLlmAnalysisInput = {
  message: string;
  knowledgeMarkdown: string;
  heuristicHints: unknown | null;
  formattedHints: string | null;
};

export type GenesisDomainProducaoLlmAnalysisResult = {
  llmMode: "mock" | "gemini";
  llmConfigured: boolean;
  analysis: string | null;
  error?: string;
};

export async function genesisDomainProducaoAnalyzeMessageWithLlm(
  llm: LlmPort,
  input: GenesisDomainProducaoLlmAnalysisInput,
  llmConfigured: boolean,
): Promise<GenesisDomainProducaoLlmAnalysisResult> {
  if (!llmConfigured) {
    return {
      llmMode: "mock",
      llmConfigured: false,
      analysis: null,
      error: "PLAYGROUND_GEMINI_API_KEY ausente — apenas heurística local.",
    };
  }

  const systemPrompt = [
    "És um assistente do BusinessDomain producao.",
    "Analisa o pedido do utilizador com base no knowledge e nos query hints heurísticos.",
    "Responde em português, conciso, citando tabelas Sankhya quando relevante.",
    "",
    "## Knowledge",
    input.knowledgeMarkdown,
    "",
    "## Query hints heurísticos",
    input.formattedHints ?? "(nenhum hint heurístico)",
    "",
    "## Hints JSON",
    JSON.stringify(input.heuristicHints, null, 2),
  ].join("\n");

  const result = await llm.complete({
    systemPrompt,
    userMessage: input.message,
  });

  if (result.error) {
    return {
      llmMode: "gemini",
      llmConfigured: true,
      analysis: null,
      error: result.error.message,
    };
  }

  return {
    llmMode: "gemini",
    llmConfigured: true,
    analysis: result.content,
  };
}
