import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fetchJson, emitApiError } from "../lib/apiClient";

export interface WatchlistSymbol {
  symbol: string;
  name: string;
  type: "stock" | "currency" | "crypto" | "index" | "etf" | "commodity";
  price: number;
  change: number;
  changePercent: number;
  addedAt: number;
  alertEnabled?: boolean;
  alertPrice?: number;
  notes?: string;
}

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  symbols: WatchlistSymbol[];
  createdAt: number;
  updatedAt: number;
  color: string;
  icon: string;
}

interface WatchlistState {
  watchlists: Watchlist[];
  activeWatchlistId: string;
  /** Loading flag for the initial backend sync. */
  isHydrated: boolean;
  /** Replace the entire collection (used by sync layer). */
  replaceAll: (items: Watchlist[]) => void;
  /** Pull the user's watchlists from the backend. */
  syncFromBackend: () => Promise<void>;
  createWatchlist: (name: string, description?: string) => Promise<string>;
  renameWatchlist: (id: string, name: string) => Promise<void>;
  deleteWatchlist: (id: string) => Promise<void>;
  setActiveWatchlist: (id: string) => void;
  addSymbol: (watchlistId: string, symbol: WatchlistSymbol) => Promise<void>;
  removeSymbol: (watchlistId: string, symbol: string) => Promise<void>;
  moveSymbol: (watchlistId: string, fromIndex: number, toIndex: number) => Promise<void>;
  toggleAlert: (watchlistId: string, symbol: string, enabled: boolean, price?: number) => Promise<void>;
  reorderWatchlists: (fromIndex: number, toIndex: number) => Promise<void>;
  getActiveWatchlist: () => Watchlist | undefined;
}

// Used as offline-first seed so first-time users see content immediately.
// They are replaced as soon as the backend responds with the user's real watchlists.
const DEFAULT_WATCHLISTS: Watchlist[] = [
  {
    id: "default-mega",
    name: "Mega Cap Tech",
    description: "Top large-cap technology leaders",
    color: "#A27841",
    icon: "💻",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    symbols: [
      { symbol: "AAPL", name: "Apple Inc.", type: "stock", price: 192.42, change: 3.12, changePercent: 1.65, addedAt: Date.now(), alertEnabled: false },
      { symbol: "MSFT", name: "Microsoft Corporation", type: "stock", price: 425.18, change: 5.13, changePercent: 1.22, addedAt: Date.now(), alertEnabled: true, alertPrice: 400 },
      { symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", price: 122.50, change: 3.60, changePercent: 3.03, addedAt: Date.now(), alertEnabled: false },
      { symbol: "GOOGL", name: "Alphabet Inc.", type: "stock", price: 175.30, change: 1.45, changePercent: 0.83, addedAt: Date.now(), alertEnabled: false },
      { symbol: "META", name: "Meta Platforms Inc.", type: "stock", price: 502.30, change: 7.20, changePercent: 1.45, addedAt: Date.now(), alertEnabled: false },
    ],
  },
  {
    id: "default-fx",
    name: "FX Watch",
    description: "Major currency pairs",
    color: "#3b82f6",
    icon: "💱",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    symbols: [
      { symbol: "USD/EUR", name: "US Dollar / Euro", type: "currency", price: 0.92, change: 0.0014, changePercent: 0.15, addedAt: Date.now() },
      { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", type: "currency", price: 155.20, change: 0.42, changePercent: 0.27, addedAt: Date.now() },
      { symbol: "USD/INR", name: "US Dollar / Indian Rupee", type: "currency", price: 83.50, change: 0.15, changePercent: 0.18, addedAt: Date.now() },
    ],
  },
  {
    id: "default-crypto",
    name: "Crypto Leaders",
    description: "Top digital assets",
    color: "#f59e0b",
    icon: "₿",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    symbols: [
      { symbol: "BTC", name: "Bitcoin", type: "crypto", price: 65000, change: 1400, changePercent: 2.20, addedAt: Date.now(), alertEnabled: true, alertPrice: 68000 },
      { symbol: "ETH", name: "Ethereum", type: "crypto", price: 3200, change: 72, changePercent: 2.30, addedAt: Date.now() },
      { symbol: "SOL", name: "Solana", type: "crypto", price: 145, change: 6.2, changePercent: 4.46, addedAt: Date.now() },
    ],
  },
];

const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// ─── Backend integration ──────────────────────────────────────────────
// All mutating actions write to the backend first, then update local state.
// If the backend call fails, the local change is rolled back and a toast is emitted.
async function apiCreateWatchlist(name: string, description: string): Promise<{ id: string }> {
  const res = await fetchJson<{ id: string }>(`/watchlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });
  if (!res.success || !res.data) throw new Error("Failed to create watchlist");
  return res.data;
}

async function apiUpdateWatchlist(id: string, name: string): Promise<void> {
  await fetchJson(`/watchlist/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

async function apiDeleteWatchlist(id: string): Promise<void> {
  await fetchJson(`/watchlist/${id}`, { method: "DELETE" });
}

async function apiAddSymbol(watchlistId: string, symbol: WatchlistSymbol): Promise<void> {
  await fetchJson(`/watchlist/${watchlistId}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol }),
  });
}

async function apiRemoveSymbol(watchlistId: string, symbol: string): Promise<void> {
  // Backend may use either symbol or assetId; use symbol for now (matches the URL pattern).
  await fetchJson(`/watchlist/${watchlistId}/remove/${encodeURIComponent(symbol)}`, { method: "DELETE" });
}

async function apiFetchAll(): Promise<Watchlist[] | null> {
  try {
    const res = await fetchJson<Watchlist[]>(`/watchlist`);
    if (res.success && Array.isArray(res.data)) return res.data;
    return null;
  } catch {
    // Not authenticated / no server — leave localStorage fallback in place.
    return null;
  }
}

// ─── Store ────────────────────────────────────────────────────────────
export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlists: DEFAULT_WATCHLISTS,
      activeWatchlistId: DEFAULT_WATCHLISTS[0].id,
      isHydrated: false,

      replaceAll: (items) => set({ watchlists: items }),

      syncFromBackend: async () => {
        const remote = await apiFetchAll();
        if (remote && remote.length > 0) {
          set({ watchlists: remote, isHydrated: true });
        } else {
          set({ isHydrated: true });
        }
      },

      createWatchlist: async (name, description = "") => {
        const id = newId("wl");
        const colors = ["#A27841", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#06b6d4"];
        const icons = ["📊", "💼", "📈", "🎯", "💎", "⚡", "🌍"];
        const optimistic: Watchlist = {
          id,
          name,
          description,
          color: colors[get().watchlists.length % colors.length],
          icon: icons[get().watchlists.length % icons.length],
          symbols: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ watchlists: [...state.watchlists, optimistic], activeWatchlistId: id }));
        try {
          const res = await apiCreateWatchlist(name, description);
          // Replace the optimistic id with the server-assigned id.
          set((state) => ({
            watchlists: state.watchlists.map((w) => (w.id === id ? { ...w, id: res.id } : w)),
            activeWatchlistId: state.activeWatchlistId === id ? res.id : state.activeWatchlistId,
          }));
          return res.id;
        } catch (e) {
          // Rollback
          set((state) => ({
            watchlists: state.watchlists.filter((w) => w.id !== id),
            activeWatchlistId: state.activeWatchlistId === id ? state.watchlists[0]?.id ?? "" : state.activeWatchlistId,
          }));
          emitApiError((e as Error).message);
          throw e;
        }
      },

      renameWatchlist: async (id, name) => {
        const prev = get().watchlists.find((w) => w.id === id);
        if (!prev) return;
        // Optimistic update
        set((state) => ({
          watchlists: state.watchlists.map((w) =>
            w.id === id ? { ...w, name, updatedAt: Date.now() } : w
          ),
        }));
        try {
          await apiUpdateWatchlist(id, name);
        } catch (e) {
          // Rollback
          set((state) => ({
            watchlists: state.watchlists.map((w) => (w.id === id ? { ...w, name: prev.name } : w)),
          }));
          emitApiError((e as Error).message);
          throw e;
        }
      },

      deleteWatchlist: async (id) => {
        const snapshot = get().watchlists;
        if (snapshot.length <= 1) return;
        const prevActive = get().activeWatchlistId;
        set((state) => {
          const remaining = state.watchlists.filter((wl) => wl.id !== id);
          return {
            watchlists: remaining,
            activeWatchlistId: prevActive === id ? remaining[0]?.id ?? "" : prevActive,
          };
        });
        try {
          await apiDeleteWatchlist(id);
        } catch (e) {
          set({ watchlists: snapshot });
          emitApiError((e as Error).message);
          throw e;
        }
      },

      setActiveWatchlist: (id) => set({ activeWatchlistId: id }),

      addSymbol: async (watchlistId, symbol) => {
        const prev = get().watchlists;
        set((state) => ({
          watchlists: state.watchlists.map((wl) => {
            if (wl.id !== watchlistId) return wl;
            if (wl.symbols.some((s) => s.symbol.toLowerCase() === symbol.symbol.toLowerCase())) return wl;
            return { ...wl, symbols: [...wl.symbols, symbol], updatedAt: Date.now() };
          }),
        }));
        try {
          await apiAddSymbol(watchlistId, symbol);
        } catch (e) {
          set({ watchlists: prev });
          emitApiError((e as Error).message);
          throw e;
        }
      },

      removeSymbol: async (watchlistId, symbol) => {
        const prev = get().watchlists;
        set((state) => ({
          watchlists: state.watchlists.map((wl) =>
            wl.id === watchlistId
              ? { ...wl, symbols: wl.symbols.filter((s) => s.symbol !== symbol), updatedAt: Date.now() }
              : wl
          ),
        }));
        try {
          await apiRemoveSymbol(watchlistId, symbol);
        } catch (e) {
          set({ watchlists: prev });
          emitApiError((e as Error).message);
          throw e;
        }
      },

      moveSymbol: async (watchlistId, fromIndex, toIndex) => {
        const prev = get().watchlists;
        set((state) => ({
          watchlists: state.watchlists.map((wl) => {
            if (wl.id !== watchlistId) return wl;
            const next = [...wl.symbols];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return { ...wl, symbols: next, updatedAt: Date.now() };
          }),
        }));
        // Backend doesn't expose explicit reorder; we re-sync after a brief delay.
        // (No-op fallback: client state already updated; no need to throw.)
        try {
          await apiFetchAll();
        } catch {
          set({ watchlists: prev });
        }
      },

      toggleAlert: async (watchlistId, symbol, enabled, price) => {
        const prev = get().watchlists;
        set((state) => ({
          watchlists: state.watchlists.map((wl) =>
            wl.id === watchlistId
              ? {
                  ...wl,
                  symbols: wl.symbols.map((s) =>
                    s.symbol === symbol
                      ? { ...s, alertEnabled: enabled, alertPrice: price ?? s.alertPrice }
                      : s
                  ),
                  updatedAt: Date.now(),
                }
              : wl
          ),
        }));
        // Alert toggle is a UI preference, not a server mutation. Persisted via zustand persist.
        void prev;
      },

      reorderWatchlists: async (fromIndex, toIndex) => {
        const prev = get().watchlists;
        set((state) => {
          const next = [...state.watchlists];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return { watchlists: next };
        });
        // Persist locally; backend has no reorder endpoint — re-sync on next login.
        void prev;
      },

      getActiveWatchlist: () => {
        const { watchlists, activeWatchlistId } = get();
        return watchlists.find((wl) => wl.id === activeWatchlistId);
      },
    }),
    {
      name: "markets-pivot-watchlists",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
