/**
 * Turno playground — heurística + LLM opcional.
 */
import {
  PRODUCAO_DOMAIN_KNOWLEDGE,
  genesisDomainProducaoFormatQueryHintsForPrompt,
  genesisDomainProducaoMapMessageToQueryHints,
} from "../../dist/index.js";
import {
  genesisDomainProducaoAnalyzeMessageWithLlm,
} from "../../dist/core/llm/analyze-message-with-llm.js";
import {
  genesisDomainProducaoCreateGeminiLlmAdapter,
  genesisDomainProducaoIsPlaygroundLlmConfigured,
  genesisDomainProducaoResolvePlaygroundLlmMode,
} from "../../dist/adapters/gemini/gemini-llm-adapter.js";

export type ChatTurnRequest = { message: string };
export type ChatTurnResponse = {
  ok: boolean;
  heuristicHints: unknown | null;
  formattedHints: string | null;
  llmMode: "mock" | "gemini";
  llmConfigured: boolean;
  llmAnalysis: string | null;
  llmError?: string;
};

export async function processChatTurn(input: ChatTurnRequest): Promise<ChatTurnResponse> {
  const message = input.message.trim();
  const heuristicHints = genesisDomainProducaoMapMessageToQueryHints(message);
  const formattedHints = heuristicHints ? genesisDomainProducaoFormatQueryHintsForPrompt(heuristicHints) : null;
  const llm = genesisDomainProducaoCreateGeminiLlmAdapter();
  const llmConfigured = genesisDomainProducaoIsPlaygroundLlmConfigured();
  const llmResult = await genesisDomainProducaoAnalyzeMessageWithLlm(
    llm,
    {
      message,
      knowledgeMarkdown: PRODUCAO_DOMAIN_KNOWLEDGE,
      heuristicHints,
      formattedHints,
    },
    llmConfigured,
  );

  return {
    ok: true,
    heuristicHints,
    formattedHints,
    llmMode: genesisDomainProducaoResolvePlaygroundLlmMode(),
    llmConfigured,
    llmAnalysis: llmResult.analysis,
    llmError: llmResult.error,
  };
}
