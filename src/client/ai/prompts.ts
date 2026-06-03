/**
 * Prompt templates for the AI module.
 *
 * Centralized so that:
 *   1. A real provider can drop in `formatPrompt(request) → string` and
 *      ship the same content to OpenAI / Anthropic / etc.
 *   2. Mock provider and tests share one source of truth.
 *   3. Versioning / A/B testing of prompts is straightforward.
 *
 * Each template is intentionally simple — the goal is a stable, well-typed
 * contract, not a clever prompt-engineering layer.
 */

import type { AISummaryKind, AISummaryRequest, AISummaryTone } from "./aiTypes";

const TONE_GUIDANCE: Record<AISummaryTone, string> = {
  neutral: "balanced, neither bullish nor bearish",
  bullish: "constructive, leaning positive",
  bearish: "cautious, leaning negative",
  mixed: "mixed signals with both upside and downside",
};

const KIND_GUIDANCE: Record<AISummaryKind, string> = {
  asset: "Focus on price action, key drivers, and notable catalysts.",
  market: "Summarize session tone, breadth, and the most important moves.",
  news: "Highlight the headline, why it matters, and market reaction.",
  portfolio: "Discuss performance, risk, and diversification in plain terms.",
  economic: "Explain the indicator, the consensus, and the implications.",
};

export interface PromptArtifacts {
  systemPrompt: string;
  userPrompt: string;
}

const formatContext = (context: Record<string, string | number> | undefined): string => {
  if (!context || Object.keys(context).length === 0) return "(no extra context)";
  return Object.entries(context)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
};

export const formatPrompt = (request: AISummaryRequest): PromptArtifacts => {
  const tone = request.tone ?? "neutral";
  const maxWords = request.maxWords ?? 80;
  const systemPrompt = [
    "You are MarketsPivot AI, a financial markets analyst that writes concise,",
    "data-driven summaries in plain English. Avoid speculation. Cite numeric",
    "values from the context when available.",
  ].join(" ");

  const userPrompt = [
    `Subject: ${request.subject}`,
    `Summary type: ${request.kind}`,
    `Style: ${TONE_GUIDANCE[tone]}.`,
    `Guidance: ${KIND_GUIDANCE[request.kind]}`,
    `Max words: ${maxWords}.`,
    "",
    "Context:",
    formatContext(request.context),
    "",
    "Return a JSON object with:",
    "{",
    '  "text": "<2-3 sentence summary>",',
    '  "bullets": ["<key point>", "..."],',
    '  "tone": "neutral | bullish | bearish | mixed",',
    '  "tags": ["<short tag>", "..."]',
    "}",
  ].join("\n");

  return { systemPrompt, userPrompt };
};
