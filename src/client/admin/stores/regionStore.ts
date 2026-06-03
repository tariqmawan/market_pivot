import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";
import regionsJson from "../../../data/regions.json";

export interface AdminRegion extends CrudEntity {
  slug: string;
  name: string;
  type: string;
  summary: string;
  countries: string[];
  currencies: string[];
  keyIndices: string[];
  majorExchanges: string[];
  sectorLeaders: string[];
  gdpUSD: number;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  interestRate: number;
  population: string;
  marketCap: number;
  commodityImpact: string;
  tradeBalance: string;
  calendarFocus: string[];
  newsThemes: string[];
  macroOutlook: string;
}

interface RegionJson {
  id: string;
  name: string;
  type: string;
  summary: string;
  countries: string[];
  majorExchanges: string[];
  currencies: string[];
  keyIndices: string[];
  gdpGrowth: number;
  inflation: number;
  commodityImpact: string;
  tradeBalance?: string;
  calendarFocus: string[];
  sectorLeaders: string[];
  newsThemes: string[];
}

const seedRegions: AdminRegion[] = (
  (regionsJson as { regions: RegionJson[] }).regions
).map((r, i) => {
  const now = Date.now() - (i + 1) * 60_000;
  return {
    id: `reg-${r.id}`,
    slug: r.id,
    name: r.name,
    type: r.type,
    summary: r.summary,
    countries: r.countries,
    currencies: r.currencies,
    keyIndices: r.keyIndices,
    majorExchanges: r.majorExchanges,
    sectorLeaders: r.sectorLeaders,
    gdpUSD: 0,
    gdpGrowth: r.gdpGrowth,
    inflation: r.inflation,
    unemployment: 5,
    interestRate: 4,
    population: "",
    marketCap: 0,
    commodityImpact: r.commodityImpact,
    tradeBalance: r.tradeBalance ?? "",
    calendarFocus: r.calendarFocus,
    newsThemes: r.newsThemes,
    macroOutlook: r.summary,
    createdAt: now,
    updatedAt: now,
  };
});

export const useRegionAdminStore = createCrudStore<AdminRegion>({
  name: "mp-admin-regions",
  idPrefix: "reg",
  seed: seedRegions,
});
