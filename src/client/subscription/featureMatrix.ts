/**
 * Feature → minimum required plan mapping.
 *
 * Centralizes the rule "feature X requires plan Y or higher" so feature gates,
 * plan comparison tables, and the upgrade flow all stay in sync.
 *
 * To gate a new feature: add it to `PLANS` (plans.ts) on the plans that
 * include it, then add a row here linking the public feature key to the
 * minimum plan that must own it.
 */

import type { PlanId } from "./plans";
import { PLANS } from "./plans";

export interface FeatureAccessRule {
  /** Public feature key, referenced by <FeatureGate feature="...">. */
  feature: string;
  /** Minimum plan required to access this feature. */
  requires: PlanId;
  /** Short description shown in upgrade prompts. */
  description: string;
  /** Optional category — useful for grouped plan comparison tables. */
  category?: "screening" | "analytics" | "data" | "ai" | "export" | "alerts";
}

export const FEATURE_MATRIX: FeatureAccessRule[] = [
  {
    feature: "advanced_screener",
    requires: "pro",
    description: "Multi-factor screeners with custom formulas and saved presets.",
    category: "screening",
  },
  {
    feature: "portfolio_analytics",
    requires: "pro",
    description: "Attribution, risk decomposition, and benchmark comparison.",
    category: "analytics",
  },
  {
    feature: "analyst_ratings",
    requires: "pro",
    description: "Wall Street ratings, price targets, and earnings revisions.",
    category: "data",
  },
  {
    feature: "export_csv",
    requires: "pro",
    description: "Bulk export of screener results, watchlists, and historical quotes.",
    category: "export",
  },
  {
    feature: "export_pdf",
    requires: "pro",
    description: "Branded PDF reports for portfolios, screens, and watchlists.",
    category: "export",
  },
  {
    feature: "smart_alerts",
    requires: "pro",
    description: "Price, volume, and indicator-based alerts delivered in real time.",
    category: "alerts",
  },
  {
    feature: "insider_trading",
    requires: "enterprise",
    description: "Insider transactions, Form 4 filings, and cluster buying signals.",
    category: "data",
  },
  {
    feature: "economic_forecasting",
    requires: "enterprise",
    description: "Macro forecasting, scenarios, and inflation regime modeling.",
    category: "analytics",
  },
  {
    feature: "ai_summaries",
    requires: "enterprise",
    description: "AI-generated market briefs, news digests, and earnings summaries.",
    category: "ai",
  },
  {
    feature: "api_access",
    requires: "enterprise",
    description: "Programmatic access to market data, news, and analytics via REST.",
    category: "data",
  },
  {
    feature: "team_seats",
    requires: "enterprise",
    description: "Shared workspaces, role-based permissions, and audit log.",
    category: "data",
  },
];

const FEATURE_INDEX: Map<string, FeatureAccessRule> = new Map(
  FEATURE_MATRIX.map((rule) => [rule.feature, rule])
);

/** Returns the access rule for a feature, or null if the feature is free for all plans. */
export const getFeatureRule = (feature: string): FeatureAccessRule | null =>
  FEATURE_INDEX.get(feature) ?? null;

/** Returns the minimum plan required to use the feature (null if free for all). */
export const getRequiredPlan = (feature: string): PlanId | null =>
  getFeatureRule(feature)?.requires ?? null;

/** All features included in a given plan. */
export const getFeaturesForPlan = (planId: PlanId): FeatureAccessRule[] => {
  const plan = PLANS[planId];
  const allowed = new Set(plan.features.map((f) => f.key));
  return FEATURE_MATRIX.filter((rule) => allowed.has(rule.feature));
};
