/**
 * Deterministic mock AI provider.
 *
 * Generates stable, content-aware summaries without making any network calls.
 * Each kind (asset, market, news, portfolio, economic) has its own template
 * so the output is realistic enough to use as design content. Real providers
 * (OpenAI, Anthropic, internal) implement the same `AIProvider` interface
 * and replace this one via `setActiveProvider()`.
 */

import type { AIProvider, AISummary, AISummaryRequest, AISummaryTone } from "./aiTypes";
import { formatPrompt } from "./prompts";

const toneForPercent = (pct: number | undefined): AISummaryTone => {
  if (pct === undefined || Number.isNaN(pct)) return "neutral";
  if (pct >= 1.5) return "bullish";
  if (pct <= -1.5) return "bearish";
  if (Math.abs(pct) > 0.4) return "mixed";
  return "neutral";
};

const bulletFor = (label: string, value: string | number): string => `${label}: ${value}`;

const assetSummary = (request: AISummaryRequest): Pick<AISummary, "text" | "tone" | "bullets" | "tags"> => {
  const change = Number(request.context?.change24h ?? request.context?.changePercent ?? 0);
  const price = request.context?.price ?? "n/a";
  const volume = request.context?.volume ?? "n/a";
  const tone = request.tone ?? toneForPercent(change);
  const direction = change >= 0 ? "higher" : "lower";
  const magnitude = Math.abs(change).toFixed(2);
  return {
    tone,
    text: `${request.subject} is trading at ${price}, ${direction} by ${magnitude}% over the last 24h. Volume (${volume}) and broader risk appetite are the swing factors for the next session.`,
    bullets: [
      bulletFor("24h move", `${change >= 0 ? "+" : ""}${magnitude}%`),
      bulletFor("Price", price),
      bulletFor("Volume", volume),
    ],
    tags: ["price-action", "24h", tone],
  };
};

const marketSummary = (request: AISummaryRequest): Pick<AISummary, "text" | "tone" | "bullets" | "tags"> => {
  const advancers = request.context?.advancers ?? "—";
  const decliners = request.context?.decliners ?? "—";
  const breadth = Number(request.context?.breadth ?? 0);
  return {
    tone: toneForPercent(breadth),
    text: `Session breadth tilted with ${advancers} advancers vs ${decliners} decliners. Cross-asset flows suggest risk-on positioning with rates and FX in the background.`,
    bullets: [
      bulletFor("Advancers", advancers),
      bulletFor("Decliners", decliners),
      bulletFor("Breadth", `${breadth}%`),
    ],
    tags: ["session", "breadth"],
  };
};

const newsSummary = (request: AISummaryRequest): Pick<AISummary, "text" | "tone" | "bullets" | "tags"> => {
  const source = request.context?.source ?? "wire service";
  const impact = request.context?.impact ?? "moderate";
  return {
    tone: "neutral",
    text: `${request.subject} — a ${impact}-impact development reported by ${source}. Markets will read through to related sectors and benchmark indices during the next session.`,
    bullets: [
      bulletFor("Source", source),
      bulletFor("Impact", impact),
    ],
    tags: ["news", String(impact)],
  };
};

const portfolioSummary = (request: AISummaryRequest): Pick<AISummary, "text" | "tone" | "bullets" | "tags"> => {
  const pnl = Number(request.context?.pnl ?? 0);
  const top = request.context?.top ?? "—";
  const concentration = Number(request.context?.concentration ?? 0);
  return {
    tone: toneForPercent(pnl),
    text: `Portfolio ${pnl >= 0 ? "gained" : "lost"} ${Math.abs(pnl).toFixed(2)}% over the period, led by ${top}. Concentration in the top position is ${concentration.toFixed(0)}% of NAV.`,
    bullets: [
      bulletFor("Period P/L", `${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}%`),
      bulletFor("Top contributor", top),
      bulletFor("Top weight", `${concentration.toFixed(0)}%`),
    ],
    tags: ["portfolio", "attribution"],
  };
};

const economicSummary = (request: AISummaryRequest): Pick<AISummary, "text" | "tone" | "bullets" | "tags"> => {
  const actual = request.context?.actual ?? "n/a";
  const forecast = request.context?.forecast ?? "n/a";
  const surprise = request.context?.surprise ?? "in line";
  return {
    tone: "neutral",
    text: `${request.subject} came in at ${actual} vs ${forecast} consensus — a ${surprise} print. The data feeds directly into the policy reaction function and rate path expectations.`,
    bullets: [
      bulletFor("Actual", actual),
      bulletFor("Forecast", forecast),
      bulletFor("Surprise", surprise),
    ],
    tags: ["macro", "data"],
  };
};

const TEMPLATES: Record<AISummaryRequest["kind"], (request: AISummaryRequest) => Pick<AISummary, "text" | "tone" | "bullets" | "tags">> = {
  asset: assetSummary,
  market: marketSummary,
  news: newsSummary,
  portfolio: portfolioSummary,
  economic: economicSummary,
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mockAiProvider: AIProvider = {
  id: "mock-v1",
  displayName: "MarketsPivot Mock AI",
  async summarize(request: AISummaryRequest): Promise<AISummary> {
    // Touch the prompt builder so the templates are exercised end-to-end —
    // production providers will use the same artifacts.
    const prompt = formatPrompt(request);
    void prompt;
    await delay(220);
    const tmpl = TEMPLATES[request.kind] ?? assetSummary;
    const result = tmpl(request);
    return {
      id: `ai_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      kind: request.kind,
      subject: request.subject,
      ...result,
      model: "mock-v1",
      generatedAt: new Date().toISOString(),
    };
  },
};
