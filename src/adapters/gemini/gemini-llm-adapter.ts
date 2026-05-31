/**
 * Adapter Gemini — implementação concreta de LlmPort (GAS adapters/).
 */
import type { LlmCompletionRequest, LlmCompletionResult, LlmPort } from "../../contracts/llm-port.js";

const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.5-flash";
const ERROR_CODE = "GENESIS_DOMAIN_PRODUCAO_LLM_UNAVAILABLE";

function genesisDomainProducaoResolvePlaygroundApiKey(): string {
  return (
    process.env.PLAYGROUND_GEMINI_API_KEY?.trim()
    || process.env.GOOGLE_API_KEY?.trim()
    || ""
  );
}

export function genesisDomainProducaoResolvePlaygroundLlmModel(): string {
  return process.env.PLAYGROUND_GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export function genesisDomainProducaoIsPlaygroundLlmConfigured(): boolean {
  return Boolean(genesisDomainProducaoResolvePlaygroundApiKey());
}

export function genesisDomainProducaoResolvePlaygroundLlmMode(): "mock" | "gemini" {
  return genesisDomainProducaoIsPlaygroundLlmConfigured() ? "gemini" : "mock";
}

export function genesisDomainProducaoCreateGeminiLlmAdapter(options?: { required?: boolean }): LlmPort {
  const apiKey = genesisDomainProducaoResolvePlaygroundApiKey();
  const defaultModel = genesisDomainProducaoResolvePlaygroundLlmModel();

  if (options?.required && !apiKey) {
    throw new Error("PLAYGROUND_GEMINI_API_KEY (ou GOOGLE_API_KEY) é obrigatório.");
  }

  return {
    async complete(request: LlmCompletionRequest): Promise<LlmCompletionResult> {
      if (!apiKey) {
        return {
          content: "",
          error: { code: ERROR_CODE, message: "PLAYGROUND_GEMINI_API_KEY ausente — modo mock." },
        };
      }

      const started = Date.now();
      const model = request.model || defaultModel;
      const url = `${GEMINI_API}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: `${request.systemPrompt}\n\n---\n\nUtilizador:\n${request.userMessage}` }],
            }],
            generationConfig: {
              temperature: request.temperature ?? 0.2,
              maxOutputTokens: 8192,
            },
          }),
        });

        const json = (await res.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          error?: { message?: string };
        };

        if (!res.ok) {
          return {
            content: "",
            error: { code: ERROR_CODE, message: json.error?.message ?? `Gemini HTTP ${res.status}` },
            latencyMs: Date.now() - started,
          };
        }

        const content = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
        return { content, model, latencyMs: Date.now() - started };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return { content: "", error: { code: ERROR_CODE, message }, latencyMs: Date.now() - started };
      }
    },
  };
}
