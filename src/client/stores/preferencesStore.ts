import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type RiskProfile = "conservative" | "moderate" | "aggressive" | "speculative";
export type LayoutDensity = "comfortable" | "compact";
export type NotificationChannel = "email" | "push" | "sms" | "inApp";

export interface UserPreferencesState {
  theme: Theme;
  baseCurrency: "USD" | "EUR" | "GBP" | "JPY" | "INR" | "CNY" | "AUD" | "CAD";
  defaultMarket: "Global" | "Americas" | "Europe" | "Asia" | "Africa" | "Middle East";
  riskProfile: RiskProfile;
  layoutDensity: LayoutDensity;
  defaultLanding: "dashboard" | "markets" | "stocks" | "forex" | "crypto" | "user";
  notifications: {
    priceAlerts: boolean;
    earningsAlerts: boolean;
    newsDigest: boolean;
    weeklyReport: boolean;
    breakingNews: boolean;
    portfolioAlerts: boolean;
    channels: NotificationChannel[];
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  privacy: {
    publicProfile: boolean;
    showPortfolio: boolean;
    showWatchlists: boolean;
    allowAnalytics: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
  };
  setTheme: (theme: Theme) => void;
  setBaseCurrency: (currency: UserPreferencesState["baseCurrency"]) => void;
  setDefaultMarket: (market: UserPreferencesState["defaultMarket"]) => void;
  setRiskProfile: (profile: RiskProfile) => void;
  setLayoutDensity: (density: LayoutDensity) => void;
  setDefaultLanding: (path: UserPreferencesState["defaultLanding"]) => void;
  updateNotification: <K extends keyof UserPreferencesState["notifications"]>(
    key: K,
    value: UserPreferencesState["notifications"][K]
  ) => void;
  toggleNotificationChannel: (channel: NotificationChannel) => void;
  updatePrivacy: <K extends keyof UserPreferencesState["privacy"]>(
    key: K,
    value: UserPreferencesState["privacy"][K]
  ) => void;
  updateSecurity: <K extends keyof UserPreferencesState["security"]>(
    key: K,
    value: UserPreferencesState["security"][K]
  ) => void;
  resetAll: () => void;
}

const DEFAULTS: Omit<UserPreferencesState,
  | "setTheme"
  | "setBaseCurrency"
  | "setDefaultMarket"
  | "setRiskProfile"
  | "setLayoutDensity"
  | "setDefaultLanding"
  | "updateNotification"
  | "toggleNotificationChannel"
  | "updatePrivacy"
  | "updateSecurity"
  | "resetAll"
> = {
  theme: "dark",
  baseCurrency: "USD",
  defaultMarket: "Global",
  riskProfile: "moderate",
  layoutDensity: "comfortable",
  defaultLanding: "dashboard",
  notifications: {
    priceAlerts: true,
    earningsAlerts: true,
    newsDigest: false,
    weeklyReport: true,
    breakingNews: true,
    portfolioAlerts: true,
    channels: ["email", "inApp"],
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  },
  privacy: {
    publicProfile: false,
    showPortfolio: false,
    showWatchlists: false,
    allowAnalytics: true,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 60,
    loginAlerts: true,
  },
};

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = prefersDark ? "dark" : "light";
  } else {
    root.dataset.theme = theme;
  }
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      setBaseCurrency: (baseCurrency) => set({ baseCurrency }),
      setDefaultMarket: (defaultMarket) => set({ defaultMarket }),
      setRiskProfile: (riskProfile) => set({ riskProfile }),
      setLayoutDensity: (layoutDensity) => set({ layoutDensity }),
      setDefaultLanding: (defaultLanding) => set({ defaultLanding }),
      updateNotification: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),
      toggleNotificationChannel: (channel) =>
        set((state) => {
          const channels = state.notifications.channels;
          const next = channels.includes(channel)
            ? channels.filter((c) => c !== channel)
            : [...channels, channel];
          return { notifications: { ...state.notifications, channels: next } };
        }),
      updatePrivacy: (key, value) =>
        set((state) => ({ privacy: { ...state.privacy, [key]: value } })),
      updateSecurity: (key, value) =>
        set((state) => ({ security: { ...state.security, [key]: value } })),
      resetAll: () => set({ ...DEFAULTS }),
    }),
    {
      name: "markets-pivot-preferences",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyTheme(state.theme);
      },
    }
  )
);
