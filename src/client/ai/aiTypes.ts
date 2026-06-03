/**
 * AI module — public types.
 *
 * The interface surface is designed so a real provider (OpenAI, Anthropic, etc.)
 * can be swapped in by implementing `AIProvider` and registering it with
 * `setActiveProvider()`. The current default is the local deterministic
 * provider in `mockAiProvider.ts`.
 */

export type AISummaryTone = "neutral" | "bullish" | "bearish" | "mixed";
export type AISummaryKind = "asset" | "market" | "news" | "portfolio" | "economic";

export interface AISummaryRequest {
  kind: AISummaryKind;
  /** Human-readable subject — e.g. "BTC", "S&P 500", "Asia session". */
  subject: string;
  /** Optional numeric context the summary can reference. */
  context?: Record<string, string | number>;
  /** Maximum words in the returned summary. */
  maxWords?: number;
  /** Force a tone — useful for tests. */
  tone?: AISummaryTone;
}

export interface AISummary {
  id: string;
  kind: AISummaryKind;
  subject: string;
  /** Two- or three-sentence summary. */
  text: string;
  tone: AISummaryTone;
  /** Key bullet points. */
  bullets: string[];
  /** Free-form tags surfaced for filtering. */
  tags: string[];
  /** Model identifier (e.g. "mock-v1", "gpt-4o", "claude-opus-4-8"). */
  model: string;
  /** ISO timestamp. */
  generatedAt: string;
}

export interface AIProvider {
  readonly id: string;
  readonly displayName: string;
  summarize(request: AISummaryRequest): Promise<AISummary>;
}

const registry: { current: AIProvider } = { current: null as unknown as AIProvider };

/** Register a provider as the active default. Called at app boot. */
export const setActiveProvider = (provider: AIProvider): void => {
  registry.current = provider;
};

/** Returns the active provider, or null if none has been registered. */
export const getActiveProvider = (): AIProvider | null => registry.current;

/** Convenience: delegates to the active provider, throws if none is set. */
export const aiSummarize = async (request: AISummaryRequest): Promise<AISummary> => {
  if (!registry.current) {
    throw new Error("No AI provider registered. Call setActiveProvider() at boot.");
  }
  return registry.current.summarize(request);
};
