import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";
import commoditiesJson from "../../../data/commodities.json";

export type CommodityCategory =
  | "Energy"
  | "Metals"
  | "Agriculture"
  | "Industrial"
  | "Soft"
  | "Livestock";

export interface ContractSpec {
  exchange: string;
  ticker: string;
  contractSize: string;
  tickSize: string;
}

export interface AdminCommodity extends CrudEntity {
  slug: string;
  symbol: string;
  name: string;
  category: CommodityCategory;
  unit: string;
  spotPrice: number;
  changePercent24h: number;
  futuresContract: string;
  contractSpec: ContractSpec;
  productionRegions: string[];
  supplyRegions: string[];
  demandRegions: string[];
  demandTrends: string[];
  currencyCorrelation: string;
  economicImpact: string;
  active: boolean;
}

interface CommodityJson {
  id: string;
  name: string;
  symbol: string;
  category: string;
  unit: string;
  spotPrice: number;
  changePercent24h?: number;
  futuresContract: string;
  supplyRegions?: string[];
  demandTrends?: string[];
  currencyCorrelation?: string;
  economicImpact?: string;
}

const seedCommodities: AdminCommodity[] = (
  (commoditiesJson as { commodities: CommodityJson[] }).commodities
).map((c, i) => {
  const now = Date.now() - (i + 1) * 60_000;
  return {
    id: `com-${c.id}`,
    slug: c.id,
    symbol: c.symbol,
    name: c.name,
    category: (c.category as CommodityCategory) ?? "Energy",
    unit: c.unit,
    spotPrice: c.spotPrice,
    changePercent24h: c.changePercent24h ?? 0,
    futuresContract: c.futuresContract,
    contractSpec: {
      exchange: c.category === "Energy" ? "NYMEX" : c.category === "Metals" ? "COMEX" : "CBOT",
      ticker: c.futuresContract,
      contractSize: c.unit === "barrel" ? "1,000 barrels" : c.unit === "ounce" ? "100 oz" : "Standard",
      tickSize: "0.01",
    },
    productionRegions: c.supplyRegions ?? [],
    supplyRegions: c.supplyRegions ?? [],
    demandRegions: c.demandTrends?.slice(0, 3) ?? [],
    demandTrends: c.demandTrends ?? [],
    currencyCorrelation: c.currencyCorrelation ?? "",
    economicImpact: c.economicImpact ?? "",
    active: true,
    createdAt: now,
    updatedAt: now,
  };
});

export const useCommodityAdminStore = createCrudStore<AdminCommodity>({
  name: "mp-admin-commodities",
  idPrefix: "com",
  seed: seedCommodities,
});
