/**
 * Subscription plan catalog.
 *
 * Single source of truth for plans, feature matrix, and usage limits.
 * Frontend-only — no payment provider is wired in. The mock billing adapter
 * in `mockBillingAdapter.ts` simulates a backend so the UI is testable end-to-end.
 */

export type PlanId = "free" | "pro" | "enterprise";
export type BillingInterval = "monthly" | "yearly";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete";

export interface PlanFeature {
  /** Stable key consumed by <FeatureGate feature="..."> and useFeatureAccess(). */
  key: string;
  /** Human-readable feature label. */
  label: string;
  /** Short value proposition for plan comparison tables. */
  description?: string;
}

export interface PlanUsageLimit {
  /** Resource identifier (e.g. "watchlist_items", "alerts", "api_calls"). */
  key: string;
  /** Limit value. Use Infinity for "unlimited". */
  limit: number;
  /** Unit shown next to the limit (e.g. "items", "alerts", "/mo"). */
  unit?: string;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  /** Price in USD for the given interval. 0 means free. */
  price: {
    monthly: number;
    yearly: number;
  };
  /** Marketing badge (e.g. "Most popular"). */
  badge?: string;
  /** Features included in the plan. */
  features: PlanFeature[];
  /** Usage limits — use Infinity for unlimited. */
  limits: PlanUsageLimit[];
  /** Stripe-style tier rank — used to compare plan levels (higher = more access). */
  tierRank: number;
}

/**
 * Catalog of plans. Add or remove feature keys here and the FeatureGate + plan
 * comparison UI pick them up automatically.
 */
export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Get started with global market coverage.",
    price: { monthly: 0, yearly: 0 },
    tierRank: 0,
    features: [
      { key: "market_overview", label: "Market overview & live tape" },
      { key: "basic_charts", label: "Basic price charts" },
      { key: "watchlist", label: "Watchlist (up to 5 symbols)" },
      { key: "news", label: "Top news headlines" },
    ],
    limits: [
      { key: "watchlist_items", limit: 5, unit: "symbols" },
      { key: "alerts", limit: 3, unit: "alerts" },
      { key: "screener_saved", limit: 1, unit: "presets" },
      { key: "export_pdf", limit: 0, unit: "/mo" },
      { key: "api_calls", limit: 0, unit: "/day" },
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Advanced screens, alerts, and portfolio analytics.",
    price: { monthly: 29, yearly: 290 },
    badge: "Most popular",
    tierRank: 1,
    features: [
      { key: "market_overview", label: "Market overview & live tape" },
      { key: "basic_charts", label: "Basic price charts" },
      { key: "advanced_screener", label: "Advanced multi-factor screener" },
      { key: "portfolio_analytics", label: "Portfolio analytics & attribution" },
      { key: "analyst_ratings", label: "Analyst ratings & price targets" },
      { key: "export_pdf", label: "Export reports (PDF / CSV)" },
      { key: "alerts", label: "Smart price & volume alerts" },
    ],
    limits: [
      { key: "watchlist_items", limit: 100, unit: "symbols" },
      { key: "alerts", limit: 50, unit: "alerts" },
      { key: "screener_saved", limit: 20, unit: "presets" },
      { key: "export_pdf", limit: 50, unit: "/mo" },
      { key: "api_calls", limit: 5000, unit: "/day" },
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Full intelligence stack, team seats, and API access.",
    price: { monthly: 99, yearly: 990 },
    tierRank: 2,
    features: [
      { key: "market_overview", label: "Market overview & live tape" },
      { key: "basic_charts", label: "Basic price charts" },
      { key: "advanced_screener", label: "Advanced multi-factor screener" },
      { key: "portfolio_analytics", label: "Portfolio analytics & attribution" },
      { key: "analyst_ratings", label: "Analyst ratings & price targets" },
      { key: "insider_trading", label: "Insider transactions & cluster buying" },
      { key: "economic_forecasting", label: "Economic forecasting & scenarios" },
      { key: "ai_summaries", label: "AI-powered market summaries" },
      { key: "team_seats", label: "Team seats & shared workspaces" },
      { key: "api_access", label: "REST API access" },
      { key: "priority_support", label: "Priority support & onboarding" },
    ],
    limits: [
      { key: "watchlist_items", limit: Infinity, unit: "symbols" },
      { key: "alerts", limit: Infinity, unit: "alerts" },
      { key: "screener_saved", limit: Infinity, unit: "presets" },
      { key: "export_pdf", limit: Infinity, unit: "/mo" },
      { key: "api_calls", limit: 100000, unit: "/day" },
    ],
  },
};

/** Plan order for comparison and upgrade flows. */
export const PLAN_ORDER: PlanId[] = ["free", "pro", "enterprise"];

export const getPlan = (id: PlanId): PlanDefinition => PLANS[id];

/** Returns true if `planA` is at the same level or higher than `planB`. */
export const isPlanAtLeast = (planA: PlanId, planB: PlanId): boolean =>
  PLANS[planA].tierRank >= PLANS[planB].tierRank;

/** Pretty-print a price (e.g. "$29" or "Free"). */
export const formatPrice = (planId: PlanId, interval: BillingInterval): string => {
  const plan = PLANS[planId];
  if (plan.price[interval] === 0) return "Free";
  return `$${plan.price[interval]}`;
};
