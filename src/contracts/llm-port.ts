/**
 * Port canónico LLM — contrato público (GAS contracts/).
 */
export interface LlmCompletionRequest {
  systemPrompt: string;
  userMessage: string;
  model?: string;
  temperature?: number;
}

export interface LlmCompletionResult {
  content: string;
  model?: string;
  latencyMs?: number;
  error?: { code: string; message: string };
}

export interface LlmPort {
  complete(request: LlmCompletionRequest): Promise<LlmCompletionResult>;
}
