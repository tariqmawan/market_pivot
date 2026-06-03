import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  createWatchlist: (name: string, description?: string) => string;
  renameWatchlist: (id: string, name: string) => void;
  deleteWatchlist: (id: string) => void;
  setActiveWatchlist: (id: string) => void;
  addSymbol: (watchlistId: string, symbol: WatchlistSymbol) => void;
  removeSymbol: (watchlistId: string, symbol: string) => void;
  moveSymbol: (watchlistId: string, fromIndex: number, toIndex: number) => void;
  toggleAlert: (watchlistId: string, symbol: string, enabled: boolean, price?: number) => void;
  reorderWatchlists: (fromIndex: number, toIndex: number) => void;
  getActiveWatchlist: () => Watchlist | undefined;
}

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

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlists: DEFAULT_WATCHLISTS,
      activeWatchlistId: DEFAULT_WATCHLISTS[0].id,

      createWatchlist: (name: string, description = "") => {
        const id = newId("wl");
        const colors = ["#A27841", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#06b6d4"];
        const icons = ["📊", "💼", "📈", "🎯", "💎", "⚡", "🌍"];
        const watchlist: Watchlist = {
          id,
          name,
          description,
          color: colors[get().watchlists.length % colors.length],
          icon: icons[get().watchlists.length % icons.length],
          symbols: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ watchlists: [...state.watchlists, watchlist], activeWatchlistId: id }));
        return id;
      },

      renameWatchlist: (id, name) =>
        set((state) => ({
          watchlists: state.watchlists.map((wl) =>
            wl.id === id ? { ...wl, name, updatedAt: Date.now() } : wl
          ),
        })),

      deleteWatchlist: (id) =>
        set((state) => {
          if (state.watchlists.length <= 1) return state;
          const remaining = state.watchlists.filter((wl) => wl.id !== id);
          return {
            watchlists: remaining,
            activeWatchlistId: state.activeWatchlistId === id ? remaining[0]?.id ?? "" : state.activeWatchlistId,
          };
        }),

      setActiveWatchlist: (id) => set({ activeWatchlistId: id }),

      addSymbol: (watchlistId, symbol) =>
        set((state) => ({
          watchlists: state.watchlists.map((wl) => {
            if (wl.id !== watchlistId) return wl;
            if (wl.symbols.some((s) => s.symbol.toLowerCase() === symbol.symbol.toLowerCase())) return wl;
            return { ...wl, symbols: [...wl.symbols, symbol], updatedAt: Date.now() };
          }),
        })),

      removeSymbol: (watchlistId, symbol) =>
        set((state) => ({
          watchlists: state.watchlists.map((wl) =>
            wl.id === watchlistId
              ? { ...wl, symbols: wl.symbols.filter((s) => s.symbol !== symbol), updatedAt: Date.now() }
              : wl
          ),
        })),

      moveSymbol: (watchlistId, fromIndex, toIndex) =>
        set((state) => ({
          watchlists: state.watchlists.map((wl) => {
            if (wl.id !== watchlistId) return wl;
            const next = [...wl.symbols];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return { ...wl, symbols: next, updatedAt: Date.now() };
          }),
        })),

      toggleAlert: (watchlistId, symbol, enabled, price) =>
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
        })),

      reorderWatchlists: (fromIndex, toIndex) =>
        set((state) => {
          const next = [...state.watchlists];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return { watchlists: next };
        }),

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
