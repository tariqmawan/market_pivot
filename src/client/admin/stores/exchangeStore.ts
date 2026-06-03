import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";
import exchangesJson from "../../../data/exchanges.json";

export type ExchangeStatus = "open" | "closed" | "pre_market" | "after_hours" | "halted";
export type MarketType = "stock" | "derivative" | "crypto" | "commodity" | "bond" | "forex";

export interface ExchangeHoliday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface AdminExchange extends CrudEntity {
  code: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  timezone: string;
  currency: string;
  marketType: MarketType;
  status: ExchangeStatus;
  mainIndex: string;
  mainIndexName: string;
  tradingOpen: string;
  tradingClose: string;
  website: string;
  logo: string;
  founded: number | null;
  listedCompanies: number;
  avgDailyVolume: number;
  marketCap: number;
  description: string;
  holidays: ExchangeHoliday[];
}

interface ExchangeJson {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  timezone: string;
  currency: string;
  tradingHours?: { open: string; close: string };
  mainIndex: string;
  mainIndexName: string;
  description?: string;
  founded?: number;
  website?: string;
  logo?: string;
  marketCap?: number;
  listedCompanies?: number;
  avgDailyVolume?: number;
}

const seedExchanges: AdminExchange[] = (
  (exchangesJson as { exchanges: ExchangeJson[] }).exchanges
).map((ex, i) => {
  const now = Date.now() - (i + 1) * 60_000;
  return {
    id: `exch-${ex.id.toLowerCase()}`,
    code: ex.id,
    name: ex.name,
    country: ex.country,
    countryCode: ex.countryCode,
    region: ex.region,
    timezone: ex.timezone,
    currency: ex.currency,
    marketType: "stock",
    status: "open",
    mainIndex: ex.mainIndex,
    mainIndexName: ex.mainIndexName,
    tradingOpen: ex.tradingHours?.open ?? "09:00",
    tradingClose: ex.tradingHours?.close ?? "17:00",
    website: ex.website ?? "",
    logo: ex.logo ?? "",
    founded: ex.founded ?? null,
    listedCompanies: ex.listedCompanies ?? 0,
    avgDailyVolume: ex.avgDailyVolume ?? 0,
    marketCap: ex.marketCap ?? 0,
    description: ex.description ?? "",
    holidays: [],
    createdAt: now,
    updatedAt: now,
  };
});

export const useExchangeAdminStore = createCrudStore<AdminExchange>({
  name: "mp-admin-exchanges",
  idPrefix: "exch",
  seed: seedExchanges,
});
