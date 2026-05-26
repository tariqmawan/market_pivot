import type { CryptoPrice, TradingPair } from "../../types";
import { toNumber } from "./format";

export function normalizeCryptoPrice(raw: Record<string, unknown> | null | undefined): CryptoPrice | null {
  if (!raw) return null;
  return {
    id: String(raw.cryptoId ?? raw.id ?? ""),
    symbol: String(raw.symbol ?? ""),
    name: String(raw.name ?? raw.symbol ?? ""),
    price: toNumber(raw.price),
    marketCap: toNumber(raw.marketCap),
    volume24h: toNumber(raw.volume24h),
    change24h: toNumber(raw.change24h),
    changePercent24h: toNumber(raw.changePercent24h),
    ath: toNumber(raw.ath),
    atl: toNumber(raw.atl),
    circulatingSupply: toNumber(raw.circulatingSupply),
    rank: toNumber(raw.rank),
    timestamp: raw.timestamp ? new Date(String(raw.timestamp)) : new Date(),
  };
}

export function normalizeTradingPair(raw: Record<string, unknown>): TradingPair {
  return {
    pair: String(raw.pair ?? ""),
    baseAsset: String(raw.baseAsset ?? ""),
    quoteAsset: String(raw.quoteAsset ?? ""),
    price: toNumber(raw.price),
    volume24h: toNumber(raw.volume24h),
    exchange: String(raw.exchange ?? ""),
  };
}
