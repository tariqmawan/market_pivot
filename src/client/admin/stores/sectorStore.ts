import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";
import sectorsJson from "../../../data/sectors.json";

export type SectorCategory =
  | "Growth"
  | "Cyclical"
  | "Defensive"
  | "Thematic"
  | "Income";

export interface AdminSector extends CrudEntity {
  slug: string;
  name: string;
  icon: string;
  category: SectorCategory;
  summary: string;
  description: string;
  industries: string[];
  etfs: string[];
  topCompanies: string[];
  trendingStocks: string[];
  dividendLeaders: string[];
  relatedRegions: string[];
  marketCapUSD: number;
  weightPct: number;
  peRatio: number;
  performanceYtd: number;
  dividendYield: number;
  volatility: string;
  investorProfile: string;
  newsThemes: string[];
}

interface SectorJson {
  id: string;
  name: string;
  icon: string;
  category: SectorCategory;
  summary: string;
  description: string;
  topCompanies: string[];
  etfs: string[];
  marketCapUSD: number;
  peRatio: number;
  performanceYtd: number;
  dividendYield: number;
  trendingStocks: string[];
  dividendLeaders: string[];
  relatedRegions: string[];
  newsThemes: string[];
  volatility: string;
  investorProfile: string;
}

const seedSectors: AdminSector[] = (
  (sectorsJson as { sectors: SectorJson[] }).sectors
).map((s, i) => {
  const now = Date.now() - (i + 1) * 60_000;
  return {
    id: `sec-${s.id}`,
    slug: s.id,
    name: s.name,
    icon: s.icon,
    category: s.category,
    summary: s.summary,
    description: s.description,
    industries: [],
    etfs: s.etfs,
    topCompanies: s.topCompanies,
    trendingStocks: s.trendingStocks,
    dividendLeaders: s.dividendLeaders,
    relatedRegions: s.relatedRegions,
    marketCapUSD: s.marketCapUSD,
    weightPct: 0,
    peRatio: s.peRatio,
    performanceYtd: s.performanceYtd,
    dividendYield: s.dividendYield,
    volatility: s.volatility,
    investorProfile: s.investorProfile,
    newsThemes: s.newsThemes,
    createdAt: now,
    updatedAt: now,
  };
});

// Recompute weight as share of total market cap
const totalCap = seedSectors.reduce((sum, s) => sum + s.marketCapUSD, 0);
if (totalCap > 0) {
  for (const s of seedSectors) {
    s.weightPct = Number(((s.marketCapUSD / totalCap) * 100).toFixed(2));
  }
}

export const useSectorAdminStore = createCrudStore<AdminSector>({
  name: "mp-admin-sectors",
  idPrefix: "sec",
  seed: seedSectors,
});
