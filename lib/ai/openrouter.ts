import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// ---------------------------------------------------------------------------
// OpenRouter provider singleton
// ---------------------------------------------------------------------------
// OpenRouter is an AI gateway that gives access to 200+ models (Claude,
// GPT-4o, Gemini, Llama, Mistral …) through a single API key.
// Set OPENROUTER_API_KEY in .env.local to enable generation.
// ---------------------------------------------------------------------------

let providerInstance: ReturnType<typeof createOpenRouter> | null = null;

export function hasRealEnvValue(value: string | undefined): boolean {
  return Boolean(value && !value.includes("...") && value.length > 0);
}

export function isOpenRouterConfigured(): boolean {
  return hasRealEnvValue(process.env.OPENROUTER_API_KEY);
}

/**
 * Returns the lazily-initialised OpenRouter provider.
 * Throws a descriptive error when the key is not configured so that the
 * API route can return a 503 instead of crashing silently.
 */
export function getOpenRouterProvider(): ReturnType<typeof createOpenRouter> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!hasRealEnvValue(apiKey)) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. " +
        "Get a key at https://openrouter.ai/keys and add it to .env.local.",
    );
  }

  if (!providerInstance) {
    providerInstance = createOpenRouter({
      apiKey: apiKey!,
      // Sent as HTTP-Referer / X-Title headers so OpenRouter can display your
      // app in usage logs.  Both are optional but recommended.
      baseURL: "https://openrouter.ai/api/v1",
    });
  }

  return providerInstance;
}

// ---------------------------------------------------------------------------
// Default model used across the app.
// You can override this per-request or make it configurable via env.
// A good default is claude-sonnet-4-5 (high quality, fast, affordable).
// ---------------------------------------------------------------------------
export const DEFAULT_OPENROUTER_MODEL =
  process.env.OPENROUTER_DEFAULT_MODEL ?? "anthropic/claude-sonnet-4-5";

/**
 * Convenience helper: returns a model instance ready for use with the
 * Vercel AI SDK's `streamText` / `generateText`.
 *
 * @param modelId – optional override, e.g. "openai/gpt-4o"
 */
export function getOpenRouterModel(modelId?: string) {
  const provider = getOpenRouterProvider();
  return provider(modelId ?? DEFAULT_OPENROUTER_MODEL);
}
