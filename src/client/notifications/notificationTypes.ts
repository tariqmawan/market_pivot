/**
 * Notification types and the in-memory + localStorage-backed store.
 *
 * Frontend-only. Persists to localStorage so a page refresh keeps the
 * archive intact. The store is intentionally simple — production would
 * back this with a server-issued event stream (SSE / WebSocket / polling).
 */

export type NotificationCategory = "watchlist" | "portfolio" | "market" | "system";

export type NotificationSeverity = "info" | "success" | "warning" | "critical";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  body: string;
  /** Optional deep link. */
  href?: string;
  /** Optional structured data for icons/badges. */
  symbol?: string;
  /** ISO timestamp. */
  createdAt: string;
  read: boolean;
  archived: boolean;
}

const STORAGE_KEY = "markets-pivot-notifications";

const isBrowser = typeof window !== "undefined";

const load = (): AppNotification[] => {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as AppNotification[];
    return Array.isArray(parsed) ? parsed : seed();
  } catch {
    return seed();
  }
};

const save = (items: AppNotification[]): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* silent */
  }
};

const seed = (): AppNotification[] => {
  const now = new Date();
  const minutes = (m: number) => new Date(now.getTime() - m * 60 * 1000).toISOString();
  const items: AppNotification[] = [
    {
      id: "n_seed_1",
      category: "market",
      severity: "info",
      title: "Markets opened mixed",
      body: "Asia closed in the red; Europe trading sideways as ECB speakers loom.",
      createdAt: minutes(8),
      read: false,
      archived: false,
    },
    {
      id: "n_seed_2",
      category: "watchlist",
      severity: "success",
      title: "BTC crossed $68,000",
      body: "Your watchlist symbol BTC just hit the alert you set yesterday.",
      symbol: "BTC",
      href: "/crypto/bitcoin",
      createdAt: minutes(34),
      read: false,
      archived: false,
    },
    {
      id: "n_seed_3",
      category: "portfolio",
      severity: "warning",
      title: "Concentration alert",
      body: "Equities make up 72% of your portfolio. Consider rebalancing.",
      href: "/portfolio",
      createdAt: minutes(120),
      read: true,
      archived: false,
    },
    {
      id: "n_seed_4",
      category: "system",
      severity: "info",
      title: "Welcome to MarketsPivot Pro",
      body: "Your 14-day Pro trial is active. Compare features on the pricing page.",
      href: "/pricing",
      createdAt: minutes(60 * 24),
      read: true,
      archived: false,
    },
  ];
  save(items);
  return items;
};

let listeners: Array<() => void> = [];
const emit = (): void => listeners.forEach((l) => l());

let cache: AppNotification[] | null = null;
const getAll = (): AppNotification[] => {
  if (!cache) cache = load();
  return cache;
};
const setAll = (items: AppNotification[]): void => {
  cache = items;
  save(items);
  emit();
};

export const notificationStore = {
  list(): AppNotification[] {
    return getAll();
  },

  unreadCount(): number {
    return getAll().filter((n) => !n.read && !n.archived).length;
  },

  unread(): AppNotification[] {
    return getAll().filter((n) => !n.read && !n.archived);
  },

  archive(): AppNotification[] {
    return getAll().filter((n) => !n.archived);
  },

  archiveOne(id: string): void {
    setAll(getAll().map((n) => (n.id === id ? { ...n, archived: !n.archived } : n)));
  },

  archiveAll(): void {
    setAll(getAll().map((n) => ({ ...n, archived: true })));
  },

  markRead(id: string): void {
    setAll(getAll().map((n) => (n.id === id ? { ...n, read: true } : n)));
  },

  markAllRead(): void {
    setAll(getAll().map((n) => ({ ...n, read: true })));
  },

  push(input: Omit<AppNotification, "id" | "createdAt" | "read" | "archived">): AppNotification {
    const note: AppNotification = {
      ...input,
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      read: false,
      archived: false,
    };
    setAll([note, ...getAll()]);
    return note;
  },

  remove(id: string): void {
    setAll(getAll().filter((n) => n.id !== id));
  },

  clear(): void {
    setAll([]);
  },

  subscribe(listener: () => void): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};
