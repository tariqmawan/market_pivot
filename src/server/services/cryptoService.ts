import type { Knex } from "knex";
import type { Cryptocurrency } from "../../types";

const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;

export function isValidCryptoSlug(id: string): boolean {
  return SLUG_RE.test(id);
}

export async function resolveCrypto(db: Knex, param: string): Promise<Cryptocurrency | undefined> {
  const key = param.toLowerCase().trim();
  if (!key) return undefined;
  return db("cryptocurrencies")
    .whereRaw('LOWER(id) = ? OR LOWER(symbol) = ?', [key, key])
    .first();
}

function toNum(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Normalize DB row (decimal/bigint often arrive as strings). */
export function normalizeCryptoPriceRow(row: Record<string, unknown>) {
  return {
    ...row,
    price: toNum(row.price),
    marketCap: toNum(row.marketCap),
    volume24h: toNum(row.volume24h),
    change24h: toNum(row.change24h),
    changePercent24h: toNum(row.changePercent24h),
    ath: toNum(row.ath),
    atl: toNum(row.atl),
    circulatingSupply: toNum(row.circulatingSupply),
    rank: toNum(row.rank),
  };
}

export async function getLatestPrice(db: Knex, cryptoId: string) {
  const row = await db("crypto_prices")
    .where({ cryptoId })
    .orderBy("timestamp", "desc")
    .first();
  return row ? normalizeCryptoPriceRow(row) : null;
}

export async function getTradingPairs(db: Knex, symbol: string, limit: number) {
  return db("trading_pairs")
    .where({ baseAsset: symbol.toUpperCase() })
    .orderBy("volume24h", "desc")
    .limit(limit);
}

export async function getExchangeVolumes(db: Knex, symbol: string, limit: number) {
  return db("trading_pairs")
    .where({ baseAsset: symbol.toUpperCase() })
    .select("exchange")
    .sum("volume24h as totalVolume")
    .groupBy("exchange")
    .orderByRaw("SUM(volume24h) DESC")
    .limit(limit);
}

export async function getCryptoNews(
  db: Knex,
  crypto: Cryptocurrency,
  page: number,
  limit: number
) {
  const id = crypto.id.toLowerCase();
  const sym = crypto.symbol.toLowerCase();
  const filter = (qb: Knex.QueryBuilder) => {
    qb.whereRaw('LOWER("relevantAssets") LIKE ?', [`%${id}%`]).orWhereRaw(
      'LOWER("relevantAssets") LIKE ?',
      [`%${sym}%`]
    );
  };

  const [data, countRow] = await Promise.all([
    db("news")
      .modify(filter)
      .orderBy("publishedAt", "desc")
      .offset((page - 1) * limit)
      .limit(limit),
    db("news").modify(filter).count({ count: "id" }).first(),
  ]);

  const total = Number(countRow?.count ?? 0);
  return { data, total, pages: Math.ceil(total / limit) || 0 };
}
