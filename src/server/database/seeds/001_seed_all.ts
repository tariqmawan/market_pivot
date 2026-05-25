import type { Knex } from "knex";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON helper
const readJson = (filename: string) =>
  JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../../../data", filename),
      "utf8"
    )
  );

// Chunk insert helper
async function insertChunked(
  knex: Knex,
  table: string,
  rows: object[],
  chunkSize = 100
) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    await knex(table)
      .insert(rows.slice(i, i + chunkSize))
      .onConflict()
      .ignore();
  }
}

export async function seed(knex: Knex): Promise<void> {
  console.log("\nSeeding database...\n");

  // ───────────────── EXCHANGES ─────────────────
  const { exchanges } = readJson("exchanges.json");

  await knex("exchanges").del();

  await insertChunked(
    knex,
    "exchanges",
    exchanges.map((e: any) => ({
      id: e.id,
      name: e.name,
      country: e.country,
      countryCode: e.countryCode,
      region: e.region,
      timezone: e.timezone,
      currency: e.currency,
      tradingHours_open: e.tradingHours?.open ?? "09:00",
      tradingHours_close: e.tradingHours?.close ?? "17:00",
      mainIndex: e.mainIndex,
      mainIndexName: e.mainIndexName,
      description: e.description ?? null,
      founded: e.founded ?? null,
      website: e.website ?? null,
      logo: e.logo ?? null,
      marketCap: e.marketCap ?? null,
      listedCompanies: e.listedCompanies ?? null,
      avgDailyVolume: e.avgDailyVolume ?? null,
    }))
  );

  console.log(`✓ exchanges — ${exchanges.length} records`);

  // ───────────────── CURRENCIES ─────────────────
  const { currencies } = readJson("currencies.json");

  await knex("currencies").del();

  await insertChunked(
    knex,
    "currencies",
    currencies.map((c: any) => ({
      code: c.code,
      name: c.name,
      symbol: c.symbol,
      country: c.country,
      countryCode: c.countryCode,
      region: c.region,
      type: c.type ?? "fiat",
      centralBank: c.centralBank ?? null,
      description: c.description ?? null,
      logo: c.logo ?? null,
    }))
  );

  console.log(`✓ currencies — ${currencies.length} records`);

  // ───────────────── CRYPTOCURRENCIES ─────────────────
  const { cryptocurrencies } = readJson("cryptocurrencies.json");

  await knex("cryptocurrencies").del();

  await insertChunked(
    knex,
    "cryptocurrencies",
    cryptocurrencies.map((c: any) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      category: c.category,
      description: c.description ?? null,
      launched: c.launched ?? null,
      founder: c.founder ?? null,
      maxSupply: c.maxSupply ?? null,
      circulatingSupply: c.circulatingSupply ?? null,
      consensusMechanism: c.consensusMechanism ?? null,
      blockTime: c.blockTime ?? null,
      logo: c.logo ?? null,
    }))
  );

  console.log(`✓ cryptocurrencies — ${cryptocurrencies.length} records`);

  // ───────────────── MARKET REGIONS ─────────────────
  const { regions } = readJson("regions.json");

  await knex("market_regions").del();

  await insertChunked(
    knex,
    "market_regions",
    regions.map((r: any) => ({
      id: r.id,
      name: r.name,
      group: r.group ?? "Asia-Pacific",
      summary: r.summary ?? null,
      countries: JSON.stringify(r.countries ?? []),
      keyIndices: JSON.stringify(r.keyIndices ?? []),
      gdpGrowth: r.gdpGrowth ?? null,
      inflation: r.inflation ?? null,
      commodityImpact: JSON.stringify(r.commodityImpact ?? []),
      calendarFocus: JSON.stringify(r.calendarFocus ?? []),
      sectorLeaders: JSON.stringify(r.sectorLeaders ?? []),
      newsThemes: JSON.stringify(r.newsThemes ?? []),
    }))
  );

  console.log(`✓ market_regions — ${regions.length} records`);

  // ───────────────── STOCK SECTORS ─────────────────
  const { sectors } = readJson("sectors.json");

  await knex("stock_sectors").del();

  await insertChunked(
    knex,
    "stock_sectors",
    sectors.map((s: any) => ({
      id: s.id,
      name: s.name,
      category: s.category ?? "Growth",
      summary: s.summary ?? null,
      topCompanies: JSON.stringify(s.topCompanies ?? []),
      etfs: JSON.stringify(s.etfs ?? []),
      peRatio: s.peRatio ?? null,
      performanceYtd: s.performanceYtd ?? null,
      trendingStocks: JSON.stringify(s.trendingStocks ?? []),
      dividendLeaders: JSON.stringify(s.dividendLeaders ?? []),
      newsThemes: JSON.stringify(s.newsThemes ?? []),
    }))
  );

  console.log(`✓ stock_sectors — ${sectors.length} records`);

  // ───────────────── COMMODITIES ─────────────────
  const { commodities } = readJson("commodities.json");

  await knex("commodities").del();

  await insertChunked(
    knex,
    "commodities",
    commodities.map((c: any) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      category: c.category,
      unit: c.unit ?? "USD",
      spotPrice: c.spotPrice ?? 0,
      changePercent24h: c.changePercent24h ?? null,
      futuresContract: c.futuresContract ?? null,
      demandTrends: JSON.stringify(c.demandTrends ?? {}),
      currencyCorrelation: JSON.stringify(
        c.currencyCorrelation ?? {}
      ),
      economicImpact: c.economicImpact ?? null,
    }))
  );

  console.log(`✓ commodities — ${commodities.length} records`);

  // ───────────────── NEWS ─────────────────
  const { articles } = readJson("news.json");

  await knex("news").del();

  await insertChunked(
    knex,
    "news",
    articles.map((a: any) => ({
      title: a.title,
      description: a.summary ?? null,
      content: a.content ?? null,
      source: a.source ?? "Unknown",
      imageUrl: a.image ?? null,
      url: a.url ?? `https://placeholder.com/${a.id}`,
      publishedAt: a.publishedAt
        ? new Date(a.publishedAt)
        : new Date(),
      category: a.category ?? "market",
      relevantAssets: JSON.stringify(a.tags ?? []),
    }))
  );

  console.log(`✓ news — ${articles.length} records`);

  console.log("\nSeed complete! Ab server run karo.\n");
}