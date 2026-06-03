import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isPlanAtLeast, type BillingInterval, type PlanId, type SubscriptionStatus } from "./plans";
import {
  mockBillingAdapter,
  type Invoice,
  type PaymentMethod,
  type Subscription,
  type UsageMetric,
} from "./mockBillingAdapter";
import { getRequiredPlan } from "./featureMatrix";

export interface SubscriptionContextValue {
  subscription: Subscription | null;
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  usage: UsageMetric[];
  isLoading: boolean;
  error: string | null;

  currentPlan: PlanId;
  status: SubscriptionStatus;
  isTrialing: boolean;
  isCanceled: boolean;
  /** Days until current period end (rounded down, never negative). */
  daysUntilRenewal: number;

  changePlan: (plan: PlanId, interval?: BillingInterval) => Promise<void>;
  startTrial: (plan: PlanId, interval?: BillingInterval) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
  refresh: () => Promise<void>;

  hasFeature: (feature: string) => boolean;
  isWithinLimit: (key: string) => boolean;
  getUsage: (key: string) => UsageMetric | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
  /** Override the adapter (useful for tests). Defaults to the mock. */
  adapter?: typeof mockBillingAdapter;
}

const computeDaysUntil = (iso: string): number => {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.floor(ms / (24 * 60 * 60 * 1000));
};

export const SubscriptionProvider: React.FC<ProviderProps> = ({ children, adapter = mockBillingAdapter }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [usage, setUsage] = useState<UsageMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sub, inv, pm, u] = await Promise.all([
        adapter.getSubscription(),
        adapter.listInvoices(),
        adapter.listPaymentMethods(),
        adapter.getUsage(),
      ]);
      setSubscription(sub);
      setInvoices(inv);
      setPaymentMethods(pm);
      setUsage(u);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load subscription");
    } finally {
      setIsLoading(false);
    }
  }, [adapter]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const changePlan = useCallback(
    async (plan: PlanId, interval: BillingInterval = "monthly") => {
      const next = await adapter.changePlan(plan, interval);
      setSubscription(next);
      // Refresh usage because limits may have changed
      const u = await adapter.getUsage();
      setUsage(u);
    },
    [adapter]
  );

  const startTrial = useCallback(
    async (plan: PlanId, interval: BillingInterval = "monthly") => {
      const next = await adapter.startTrial(plan, interval);
      setSubscription(next);
      const u = await adapter.getUsage();
      setUsage(u);
    },
    [adapter]
  );

  const cancelSubscription = useCallback(async () => {
    const next = await adapter.cancelSubscription();
    setSubscription(next);
  }, [adapter]);

  const resumeSubscription = useCallback(async () => {
    const next = await adapter.resumeSubscription();
    setSubscription(next);
  }, [adapter]);

  const currentPlan: PlanId = subscription?.plan ?? "free";
  const status: SubscriptionStatus = subscription?.status ?? "active";
  const isTrialing = status === "trialing";
  const isCanceled = !!subscription?.cancelAtPeriodEnd || status === "canceled";
  const daysUntilRenewal = subscription
    ? computeDaysUntil(subscription.currentPeriodEnd)
    : 0;

  const hasFeature = useCallback(
    (feature: string): boolean => {
      const required = getRequiredPlan(feature);
      if (!required) return true; // free-for-all feature
      return isPlanAtLeast(currentPlan, required);
    },
    [currentPlan]
  );

  const isWithinLimit = useCallback(
    (key: string): boolean => {
      const metric = usage.find((u) => u.key === key);
      if (!metric) return true; // no rule — allow
      if (metric.limit === Infinity || metric.limit === 0) {
        return metric.limit > 0;
      }
      return metric.used < metric.limit;
    },
    [usage]
  );

  const getUsage = useCallback(
    (key: string): UsageMetric | undefined => usage.find((u) => u.key === key),
    [usage]
  );

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      subscription,
      invoices,
      paymentMethods,
      usage,
      isLoading,
      error,
      currentPlan,
      status,
      isTrialing,
      isCanceled,
      daysUntilRenewal,
      changePlan,
      startTrial,
      cancelSubscription,
      resumeSubscription,
      refresh,
      hasFeature,
      isWithinLimit,
      getUsage,
    }),
    [
      subscription,
      invoices,
      paymentMethods,
      usage,
      isLoading,
      error,
      currentPlan,
      status,
      isTrialing,
      isCanceled,
      daysUntilRenewal,
      changePlan,
      startTrial,
      cancelSubscription,
      resumeSubscription,
      refresh,
      hasFeature,
      isWithinLimit,
      getUsage,
    ]
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscriptionContext = (): SubscriptionContextValue => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscriptionContext must be used within <SubscriptionProvider>");
  }
  return ctx;
};
