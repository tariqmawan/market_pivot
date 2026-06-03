import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";

export type ApiProvider =
  | "Finnhub"
  | "CoinGecko"
  | "AlphaVantage"
  | "FRED"
  | "TwelveData"
  | "Polygon"
  | "Custom";

export type ApiEnvironment = "production" | "staging" | "development";
export type ApiKeyStatus = "active" | "disabled" | "rotating" | "expired";

export interface AdminApiKey extends CrudEntity {
  provider: ApiProvider;
  label: string;
  environment: ApiEnvironment;
  keyMasked: string;
  status: ApiKeyStatus;
  rateLimitPerMin: number;
  monthlyQuota: number;
  monthlyUsage: number;
  expiresAt: string;
  lastRotatedAt: string;
  lastUsedAt: string;
  healthy: boolean;
  notes: string;
}

const masked = (provider: string) =>
  `${provider.slice(0, 3).toUpperCase()}_••••••••••••${provider.length.toString(36).toUpperCase()}${(provider.charCodeAt(0) % 9)}X${(provider.length % 7)}`;

const today = () => new Date().toISOString().split("T")[0];
const inDays = (d: number) => {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0];
};

const seedKeys: AdminApiKey[] = [
  {
    id: "key-finnhub-prod",
    provider: "Finnhub",
    label: "Finnhub Production",
    environment: "production",
    keyMasked: masked("Finnhub"),
    status: "active",
    rateLimitPerMin: 60,
    monthlyQuota: 100000,
    monthlyUsage: 27450,
    expiresAt: inDays(180),
    lastRotatedAt: inDays(-45),
    lastUsedAt: inDays(0),
    healthy: true,
    notes: "Primary equity quotes provider",
    createdAt: Date.now() - 90 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "key-coingecko-prod",
    provider: "CoinGecko",
    label: "CoinGecko Pro",
    environment: "production",
    keyMasked: masked("CoinGecko"),
    status: "active",
    rateLimitPerMin: 500,
    monthlyQuota: 500000,
    monthlyUsage: 184200,
    expiresAt: inDays(220),
    lastRotatedAt: inDays(-30),
    lastUsedAt: inDays(0),
    healthy: true,
    notes: "Crypto market data",
    createdAt: Date.now() - 120 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "key-alpha-prod",
    provider: "AlphaVantage",
    label: "Alpha Vantage Premium",
    environment: "production",
    keyMasked: masked("AlphaVantage"),
    status: "active",
    rateLimitPerMin: 75,
    monthlyQuota: 250000,
    monthlyUsage: 145800,
    expiresAt: inDays(90),
    lastRotatedAt: inDays(-90),
    lastUsedAt: inDays(0),
    healthy: true,
    notes: "Historical data + fundamentals",
    createdAt: Date.now() - 200 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "key-fred-prod",
    provider: "FRED",
    label: "FRED Macro",
    environment: "production",
    keyMasked: masked("FRED"),
    status: "active",
    rateLimitPerMin: 120,
    monthlyQuota: 1000000,
    monthlyUsage: 8420,
    expiresAt: inDays(365),
    lastRotatedAt: inDays(-10),
    lastUsedAt: inDays(-1),
    healthy: true,
    notes: "St. Louis Fed macro data",
    createdAt: Date.now() - 30 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "key-twelve-prod",
    provider: "TwelveData",
    label: "TwelveData Pro",
    environment: "production",
    keyMasked: masked("TwelveData"),
    status: "rotating",
    rateLimitPerMin: 800,
    monthlyQuota: 1500000,
    monthlyUsage: 412900,
    expiresAt: inDays(150),
    lastRotatedAt: today(),
    lastUsedAt: inDays(0),
    healthy: true,
    notes: "Backup / multi-asset realtime",
    createdAt: Date.now() - 60 * 86400000,
    updatedAt: Date.now(),
  },
  {
    id: "key-finnhub-stg",
    provider: "Finnhub",
    label: "Finnhub Staging",
    environment: "staging",
    keyMasked: masked("Finnhub"),
    status: "active",
    rateLimitPerMin: 30,
    monthlyQuota: 30000,
    monthlyUsage: 4900,
    expiresAt: inDays(180),
    lastRotatedAt: inDays(-45),
    lastUsedAt: inDays(-2),
    healthy: true,
    notes: "Staging environment",
    createdAt: Date.now() - 60 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
];

export const useApiKeyAdminStore = createCrudStore<AdminApiKey>({
  name: "mp-admin-api-keys",
  idPrefix: "key",
  seed: seedKeys,
});

export function maskApiKey(raw: string): string {
  if (!raw) return "";
  const last4 = raw.slice(-4);
  const prefix = raw.slice(0, 3).toUpperCase();
  return `${prefix}_${"•".repeat(Math.max(8, raw.length - 7))}${last4}`;
}
