import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";
import currenciesJson from "../../../data/currencies.json";

export type PairTier = "major" | "cross" | "exotic";

export interface AdminCurrency extends CrudEntity {
  code: string;
  name: string;
  symbol: string;
  country: string;
  countryCode: string;
  region: string;
  type: "fiat" | "commodity" | "crypto";
  centralBank: string;
  interestRate: number;
  inflation: number;
  gdpGrowth: number;
  reserveStatus: string;
  capitalFlows: string;
  description: string;
  logo: string;
  active: boolean;
}

export interface AdminCurrencyPair extends CrudEntity {
  base: string;
  quote: string;
  tier: PairTier;
  spread: number;
  notes: string;
  active: boolean;
}

interface CurrencyJson {
  code: string;
  name: string;
  symbol?: string;
  country: string;
  countryCode: string;
  region: string;
  type: "fiat" | "commodity" | "crypto";
  centralBank?: string;
  interestRate?: number;
  inflation?: number;
  gdpGrowth?: number;
  reserveStatus?: string;
  capitalFlows?: string;
  description?: string;
  logo?: string;
}

const seedCurrencies: AdminCurrency[] = (
  (currenciesJson as { currencies: CurrencyJson[] }).currencies
).map((c, i) => {
  const now = Date.now() - (i + 1) * 60_000;
  return {
    id: `cur-${c.code.toLowerCase()}`,
    code: c.code,
    name: c.name,
    symbol: c.symbol ?? c.code,
    country: c.country,
    countryCode: c.countryCode,
    region: c.region,
    type: c.type,
    centralBank: c.centralBank ?? "",
    interestRate: c.interestRate ?? 0,
    inflation: c.inflation ?? 0,
    gdpGrowth: c.gdpGrowth ?? 0,
    reserveStatus: c.reserveStatus ?? "Regional",
    capitalFlows: c.capitalFlows ?? "Open",
    description: c.description ?? "",
    logo: c.logo ?? "",
    active: true,
    createdAt: now,
    updatedAt: now,
  };
});

const SEED_PAIRS: Array<{ base: string; quote: string; tier: PairTier }> = [
  { base: "EUR", quote: "USD", tier: "major" },
  { base: "USD", quote: "JPY", tier: "major" },
  { base: "GBP", quote: "USD", tier: "major" },
  { base: "USD", quote: "CHF", tier: "major" },
  { base: "AUD", quote: "USD", tier: "major" },
  { base: "USD", quote: "CAD", tier: "major" },
  { base: "NZD", quote: "USD", tier: "major" },
  { base: "EUR", quote: "GBP", tier: "cross" },
  { base: "EUR", quote: "JPY", tier: "cross" },
  { base: "GBP", quote: "JPY", tier: "cross" },
  { base: "AUD", quote: "JPY", tier: "cross" },
  { base: "EUR", quote: "CHF", tier: "cross" },
  { base: "USD", quote: "INR", tier: "exotic" },
  { base: "USD", quote: "TRY", tier: "exotic" },
  { base: "USD", quote: "ZAR", tier: "exotic" },
  { base: "USD", quote: "MXN", tier: "exotic" },
  { base: "USD", quote: "BRL", tier: "exotic" },
  { base: "USD", quote: "CNY", tier: "exotic" },
];

const seedPairs: AdminCurrencyPair[] = SEED_PAIRS.map((p, i) => {
  const now = Date.now() - (i + 1) * 30_000;
  return {
    id: `fxp-${p.base}${p.quote}`.toLowerCase(),
    base: p.base,
    quote: p.quote,
    tier: p.tier,
    spread: p.tier === "major" ? 0.8 : p.tier === "cross" ? 1.5 : 4.5,
    notes: "",
    active: true,
    createdAt: now,
    updatedAt: now,
  };
});

export const useCurrencyAdminStore = createCrudStore<AdminCurrency>({
  name: "mp-admin-currencies",
  idPrefix: "cur",
  seed: seedCurrencies,
});

export const useCurrencyPairAdminStore = createCrudStore<AdminCurrencyPair>({
  name: "mp-admin-currency-pairs",
  idPrefix: "fxp",
  seed: seedPairs,
});
