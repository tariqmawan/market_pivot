import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";
import cryptosJson from "../../../data/cryptocurrencies.json";

export type CoinStatus = "active" | "delisted" | "frozen";

export interface AdminCoin extends CrudEntity {
  slug: string;
  symbol: string;
  name: string;
  category: string;
  blockchain: string;
  consensus: string;
  blockTime: number;
  founder: string;
  launched: number | null;
  circulatingSupply: number;
  maxSupply: number | null;
  totalSupply: number;
  ecosystem: string[];
  exchangeListings: string[];
  description: string;
  logo: string;
  status: CoinStatus;
  whitepaperUrl: string;
}

interface CoinJson {
  id: string;
  symbol: string;
  name: string;
  category: string;
  description?: string;
  launched?: number;
  founder?: string;
  maxSupply?: number | null;
  circulatingSupply?: number;
  consensusMechanism?: string;
  blockTime?: number;
  logo?: string;
}

const seedCoins: AdminCoin[] = (
  (cryptosJson as { cryptocurrencies: CoinJson[] }).cryptocurrencies
).map((c, i) => {
  const now = Date.now() - (i + 1) * 60_000;
  return {
    id: `coin-${c.id}`,
    slug: c.id,
    symbol: c.symbol,
    name: c.name,
    category: c.category,
    blockchain: c.category.startsWith("Layer 1") ? c.symbol : "Ethereum",
    consensus: c.consensusMechanism ?? "—",
    blockTime: c.blockTime ?? 0,
    founder: c.founder ?? "",
    launched: c.launched ?? null,
    circulatingSupply: c.circulatingSupply ?? 0,
    maxSupply: c.maxSupply ?? null,
    totalSupply: c.circulatingSupply ?? 0,
    ecosystem: [c.category],
    exchangeListings: ["Binance", "Coinbase", "Kraken"],
    description: c.description ?? "",
    logo: c.logo ?? "",
    status: "active",
    whitepaperUrl: "",
    createdAt: now,
    updatedAt: now,
  };
});

export const useCoinAdminStore = createCrudStore<AdminCoin>({
  name: "mp-admin-coins",
  idPrefix: "coin",
  seed: seedCoins,
});
