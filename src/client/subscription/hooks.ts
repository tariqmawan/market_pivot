import { useCallback, useMemo } from "react";
import { useSubscriptionContext } from "./SubscriptionContext";
import { isPlanAtLeast, type BillingInterval, type PlanId } from "./plans";
import { getRequiredPlan } from "./featureMatrix";
import type { UsageMetric } from "./mockBillingAdapter";

/**
 * Primary subscription hook. Mirrors the context value but is the recommended
 * public API for components. Re-exports the same shape so call sites can
 * import from a stable path.
 */
export function useSubscription() {
  const ctx = useSubscriptionContext();
  return ctx;
}

export interface FeatureAccess {
  /** True if the current plan covers the feature. */
  allowed: boolean;
  /** Minimum plan required to unlock the feature (null = free for all). */
  requiredPlan: PlanId | null;
  /** Human-readable description for upgrade prompts. */
  description: string | null;
  /** Convenience: upgrade to this plan to unlock. */
  upgrade: (interval?: BillingInterval) => Promise<void>;
}

/**
 * Returns the access state for a given feature, with a one-click `upgrade()`
 * helper. Use this when you need to render a conditional CTA.
 *
 * @example
 *   const access = useFeatureAccess("advanced_screener");
 *   if (!access.allowed) return <UpgradePrompt feature="advanced_screener" />;
 */
export function useFeatureAccess(feature: string): FeatureAccess {
  const { hasFeature, currentPlan, changePlan } = useSubscriptionContext();
  const requiredPlan = getRequiredPlan(feature);
  const allowed = hasFeature(feature);

  const upgrade = useCallback(
    async (interval: BillingInterval = "monthly") => {
      if (requiredPlan) {
        await changePlan(requiredPlan, interval);
      }
    },
    [changePlan, requiredPlan]
  );

  return useMemo(
    () => ({
      allowed,
      requiredPlan,
      description: requiredPlan
        ? `${requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} plan required`
        : null,
      upgrade,
    }),
    [allowed, requiredPlan, currentPlan, upgrade]
  );
}

/**
 * Returns true if the user's plan is at least `plan` (higher tier rank).
 */
export function useHasPlan(plan: PlanId): boolean {
  const { currentPlan } = useSubscriptionContext();
  return isPlanAtLeast(currentPlan, plan);
}

/**
 * Tracks the usage of a metered resource. Returns:
 *   - `metric` — the underlying UsageMetric (or null if not tracked)
 *   - `used`, `limit`, `unit` — convenient primitives
 *   - `withinLimit` — true if more usage is allowed
 *   - `percent` — 0..100, capped (Infinity = 100)
 */
export function useUsage(key: string): {
  metric: UsageMetric | null;
  used: number;
  limit: number;
  unit: string | undefined;
  withinLimit: boolean;
  percent: number;
} {
  const { getUsage } = useSubscriptionContext();
  const metric = getUsage(key) ?? null;
  const used = metric?.used ?? 0;
  const limit = metric?.limit ?? 0;
  const unit = metric?.unit;
  const withinLimit = limit === Infinity || (limit > 0 && used < limit);
  const percent = limit === Infinity || limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  return { metric, used, limit, unit, withinLimit, percent };
}
