/**
 * Public surface of the subscription module.
 * Components and hooks should import from `client/subscription`, not the
 * individual files, so we can refactor internals without breaking call sites.
 */

export type {
  PlanId,
  BillingInterval,
  SubscriptionStatus,
  PlanDefinition,
  PlanFeature,
  PlanUsageLimit,
} from "./plans";
export { PLANS, PLAN_ORDER, getPlan, isPlanAtLeast, formatPrice } from "./plans";

export type { FeatureAccessRule } from "./featureMatrix";
export { FEATURE_MATRIX, getFeatureRule, getRequiredPlan, getFeaturesForPlan } from "./featureMatrix";

export type {
  Subscription,
  Invoice,
  PaymentMethod,
  UsageMetric,
  BillingAdapter,
} from "./mockBillingAdapter";
export { mockBillingAdapter } from "./mockBillingAdapter";

export { SubscriptionProvider, useSubscriptionContext } from "./SubscriptionContext";
export type { SubscriptionContextValue } from "./SubscriptionContext";

export { useSubscription, useFeatureAccess, useHasPlan, useUsage } from "./hooks";
export type { FeatureAccess } from "./hooks";

export { FeatureGate, UpgradePrompt, PlanBadge } from "./FeatureGate";
export type { FeatureGateProps, UpgradePromptProps, PlanBadgeProps } from "./FeatureGate";
