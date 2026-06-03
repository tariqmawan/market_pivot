import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ActivityType =
  | "login"
  | "logout"
  | "watchlist_add"
  | "watchlist_remove"
  | "watchlist_create"
  | "watchlist_delete"
  | "portfolio_add"
  | "portfolio_edit"
  | "portfolio_delete"
  | "alert_create"
  | "alert_trigger"
  | "screener_run"
  | "screen_save"
  | "profile_update"
  | "settings_change"
  | "view";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: number;
  metadata?: Record<string, string>;
}

interface ActivityState {
  activities: ActivityEntry[];
  log: (type: ActivityType, description: string, metadata?: Record<string, string>) => void;
  clear: () => void;
  maxEntries: number;
}

const newId = () => `a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const SEED_ACTIVITIES: ActivityEntry[] = [
  { id: newId(), type: "login", description: "Signed in to MarketsPivot", timestamp: Date.now() - 1000 * 60 * 5 },
  { id: newId(), type: "watchlist_add", description: "Added AAPL to Mega Cap Tech", timestamp: Date.now() - 1000 * 60 * 30 },
  { id: newId(), type: "screener_run", description: "Ran screener: Tech > $1B market cap, PE < 30", timestamp: Date.now() - 1000 * 60 * 90 },
  { id: newId(), type: "alert_create", description: "Created alert: MSFT > $400", timestamp: Date.now() - 1000 * 60 * 60 * 5 },
  { id: newId(), type: "portfolio_add", description: "Added NVDA position to Core Portfolio", timestamp: Date.now() - 1000 * 60 * 60 * 24 },
  { id: newId(), type: "view", description: "Viewed AAPL stock detail page", timestamp: Date.now() - 1000 * 60 * 60 * 26 },
  { id: newId(), type: "settings_change", description: "Changed default landing to Dashboard", timestamp: Date.now() - 1000 * 60 * 60 * 48 },
  { id: newId(), type: "watchlist_create", description: "Created watchlist: Dividend Aristocrats", timestamp: Date.now() - 1000 * 60 * 60 * 72 },
];

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: SEED_ACTIVITIES,
      maxEntries: 100,
      log: (type, description, metadata) => {
        const entry: ActivityEntry = { id: newId(), type, description, timestamp: Date.now(), metadata };
        set((state) => ({ activities: [entry, ...state.activities].slice(0, state.maxEntries) }));
      },
      clear: () => set({ activities: [] }),
    }),
    {
      name: "markets-pivot-activity",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
