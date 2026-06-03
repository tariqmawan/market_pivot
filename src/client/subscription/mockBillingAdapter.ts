/**
 * Mock billing adapter.
 *
 * Simulates a backend billing system (Stripe-shaped) entirely in the browser
 * so the SubscriptionContext can be exercised end-to-end without a real
 * payment provider. When a real API is wired in, swap this file for a thin
 * `fetch` wrapper and keep the same return types.
 */

import type { PlanId, BillingInterval, SubscriptionStatus } from "./plans";

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanId;
  interval: BillingInterval;
  status: SubscriptionStatus;
  /** ISO date string. */
  currentPeriodStart: string;
  /** ISO date string. */
  currentPeriodEnd: string;
  /** Whether the subscription will auto-renew. */
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string | null;
  seats: number;
}

export interface Invoice {
  id: string;
  /** ISO date string. */
  date: string;
  amount: number;
  currency: "USD";
  status: "paid" | "open" | "void" | "refunded";
  description: string;
  /** Hosted invoice URL (mocked). */
  url: string;
}

export interface PaymentMethod {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface UsageMetric {
  key: string;
  label: string;
  used: number;
  limit: number;
  unit?: string;
}

const STORAGE_KEY = "markets-pivot-subscription";

const DEFAULT_SUBSCRIPTION: Subscription = {
  id: "sub_mock_default",
  userId: "guest",
  plan: "free",
  interval: "monthly",
  status: "active",
  currentPeriodStart: new Date().toISOString(),
  // 30-day rolling window
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  cancelAtPeriodEnd: false,
  trialEndsAt: null,
  seats: 1,
};

const MOCK_INVOICES: Invoice[] = [
  {
    id: "in_001",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 0,
    currency: "USD",
    status: "paid",
    description: "Free plan — no charge",
    url: "#invoice-001",
  },
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm_mock_visa",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: new Date().getFullYear() + 2,
    isDefault: true,
  },
];

const loadSubscription = (): Subscription => {
  if (typeof window === "undefined") return DEFAULT_SUBSCRIPTION;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SUBSCRIPTION;
    return { ...DEFAULT_SUBSCRIPTION, ...(JSON.parse(raw) as Partial<Subscription>) };
  } catch {
    return DEFAULT_SUBSCRIPTION;
  }
};

const persistSubscription = (sub: Subscription): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
  } catch {
    /* localStorage may be disabled — silent */
  }
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mockBillingAdapter = {
  async getSubscription(): Promise<Subscription> {
    await delay(120);
    return loadSubscription();
  },

  async changePlan(plan: PlanId, interval: BillingInterval = "monthly"): Promise<Subscription> {
    await delay(220);
    const current = loadSubscription();
    const next: Subscription = {
      ...current,
      plan,
      interval,
      status: "active",
      cancelAtPeriodEnd: false,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd:
        plan === "free"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(
              Date.now() + (interval === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
    };
    persistSubscription(next);
    return next;
  },

  async startTrial(plan: PlanId, interval: BillingInterval = "monthly"): Promise<Subscription> {
    await delay(220);
    const current = loadSubscription();
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const next: Subscription = {
      ...current,
      plan,
      interval,
      status: "trialing",
      trialEndsAt,
      cancelAtPeriodEnd: false,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(
        Date.now() + (interval === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
    persistSubscription(next);
    return next;
  },

  async cancelSubscription(): Promise<Subscription> {
    await delay(180);
    const current = loadSubscription();
    const next: Subscription = { ...current, cancelAtPeriodEnd: true, status: "active" };
    persistSubscription(next);
    return next;
  },

  async resumeSubscription(): Promise<Subscription> {
    await delay(180);
    const current = loadSubscription();
    const next: Subscription = { ...current, cancelAtPeriodEnd: false };
    persistSubscription(next);
    return next;
  },

  async listInvoices(): Promise<Invoice[]> {
    await delay(140);
    return MOCK_INVOICES;
  },

  async listPaymentMethods(): Promise<PaymentMethod[]> {
    await delay(120);
    return MOCK_PAYMENT_METHODS;
  },

  /**
   * Returns usage metrics for the current period. Values are mocked but
   * shaped to match the production adapter so the UI is final.
   */
  async getUsage(): Promise<UsageMetric[]> {
    await delay(100);
    return [
      { key: "watchlist_items", label: "Watchlist symbols", used: 4, limit: 5, unit: "symbols" },
      { key: "alerts", label: "Active alerts", used: 1, limit: 3, unit: "alerts" },
      { key: "screener_saved", label: "Saved screener presets", used: 0, limit: 1, unit: "presets" },
      { key: "export_pdf", label: "PDF exports", used: 0, limit: 0, unit: "/mo" },
      { key: "api_calls", label: "API calls", used: 0, limit: 0, unit: "/day" },
    ];
  },

  /**
   * Tracks a usage event client-side. Production adapters would forward
   * this to a metering endpoint. Here we increment the in-memory counters
   * surfaced by getUsage() on the next call.
   */
  async trackUsage(key: string, delta = 1): Promise<void> {
    await delay(20);
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("markets-pivot-usage");
      const map: Record<string, number> = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      map[key] = (map[key] ?? 0) + delta;
      window.localStorage.setItem("markets-pivot-usage", JSON.stringify(map));
    } catch {
      /* silent */
    }
  },
};

export type BillingAdapter = typeof mockBillingAdapter;
