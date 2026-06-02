import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";
import stocksJson from "../../../data/stocks.json";

export type StockStatus = "active" | "ipo_pending" | "delisted" | "suspended";

export interface StockEarning {
  date: string;
  epsEstimate: number;
  epsActual?: number;
  revenueEstimate?: number;
  revenueActual?: number;
}

export interface StockDividend {
  exDate: string;
  payDate: string;
  amount: number;
}

export interface AdminStock extends CrudEntity {
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  status: StockStatus;
  ceo: string;
  headquarters: string;
  employees: number;
  founded: number | null;
  website: string;
  logo: string;
  description: string;
  marketCap: number;
  sharesOutstanding: number;
  pe: number;
  eps: number;
  beta: number;
  dividendYield: number;
  ipoDate: string; // YYYY-MM-DD
  nextEarningsDate: string;
  earnings: StockEarning[];
  dividends: StockDividend[];
  tags: string[];
}

interface StockJson {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  logo?: string;
  description?: string;
  website?: string;
  headquarters?: string;
  employees?: number;
  founded?: number;
  ceo?: string;
  marketCap?: number;
  pe?: number;
  eps?: number;
  beta?: number;
  dividendYield?: number;
  sharesOutstanding?: number;
  nextEarningsDate?: string;
  tags?: string[];
}

const seedStocks: AdminStock[] = (
  (stocksJson as { stocks: StockJson[] }).stocks
).map((s, i) => {
  const now = Date.now() - (i + 1) * 60_000;
  return {
    id: `stk-${s.symbol.toLowerCase()}`,
    ticker: s.symbol,
    name: s.name,
    exchange: s.exchange,
    sector: s.sector,
    industry: s.industry,
    status: "active",
    ceo: s.ceo ?? "",
    headquarters: s.headquarters ?? "",
    employees: s.employees ?? 0,
    founded: s.founded ?? null,
    website: s.website ?? "",
    logo: s.logo ?? "",
    description: s.description ?? "",
    marketCap: s.marketCap ?? 0,
    sharesOutstanding: s.sharesOutstanding ?? 0,
    pe: s.pe ?? 0,
    eps: s.eps ?? 0,
    beta: s.beta ?? 1,
    dividendYield: s.dividendYield ?? 0,
    ipoDate: s.founded ? `${s.founded}-01-01` : "",
    nextEarningsDate: s.nextEarningsDate ?? "",
    earnings: [],
    dividends: [],
    tags: s.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };
});

export const useStockAdminStore = createCrudStore<AdminStock>({
  name: "mp-admin-stocks",
  idPrefix: "stk",
  seed: seedStocks,
});
