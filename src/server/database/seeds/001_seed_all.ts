import type { Knex } from "knex";
import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "src/data");

// JSON read helper
const readJson = (filename: string) =>
  JSON.parse(fs.readFileSync(path.resolve(DATA_DIR, filename), "utf8"));

// Chunked insert helper
async function insertChunked(knex: Knex, table: string, rows: object[], chunkSize = 100) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    await knex(table).insert(rows.slice(i, i + chunkSize)).onConflict().ignore();
  }
}

export async function seed(knex: Knex): Promise<void> {
  console.log("\n🌱 Seeding database...\n");

  // ── EXCHANGES ──────────────────────────────────────────────────────────────
  const { exchanges } = readJson("exchanges.json");
  await knex("exchanges").del();
  await insertChunked(knex, "exchanges", exchanges.map((e: any) => ({
    id:                  e.id,
    name:                e.name,
    country:             e.country,
    countryCode:         e.countryCode,
    region:              e.region,
    timezone:            e.timezone,
    currency:            e.currency,
    tradingHours_open:   e.tradingHours?.open  ?? "09:00",
    tradingHours_close:  e.tradingHours?.close ?? "17:00",
    mainIndex:           e.mainIndex,
    mainIndexName:       e.mainIndexName,
    description:         e.description         ?? null,
    founded:             e.founded             ?? null,
    website:             e.website             ?? null,
    logo:                e.logo                ?? null,
    marketCap:           e.marketCap           ?? null,
    listedCompanies:     e.listedCompanies     ?? null,
    avgDailyVolume:      e.avgDailyVolume      ?? null,
  })));
  console.log(`✓ exchanges       — ${exchanges.length} records`);

  // ── CURRENCIES ────────────────────────────────────────────────────────────
  const { currencies } = readJson("currencies.json");
  await knex("currencies").del();
  await insertChunked(knex, "currencies", currencies.map((c: any) => ({
    code:        c.code,
    name:        c.name,
    symbol:      c.symbol,
    country:     c.country,
    countryCode: c.countryCode,
    region:      c.region,
    type:        c.type        ?? "fiat",
    centralBank: c.centralBank ?? null,
    description: c.description ?? null,
    logo:        c.logo        ?? null,
  })));
  console.log(`✓ currencies      — ${currencies.length} records`);

  // ── CRYPTOCURRENCIES ──────────────────────────────────────────────────────
  const { cryptocurrencies } = readJson("cryptocurrencies.json");
  await knex("cryptocurrencies").del();
  await insertChunked(knex, "cryptocurrencies", cryptocurrencies.map((c: any) => ({
    id:                 c.id,
    symbol:             c.symbol,
    name:               c.name,
    category:           c.category,
    description:        c.description        ?? null,
    launched:           c.launched           ?? null,
    founder:            c.founder            ?? null,
    maxSupply:          c.maxSupply          ?? null,
    circulatingSupply:  c.circulatingSupply  ?? null,
    consensusMechanism: c.consensusMechanism ?? null,
    blockTime:          c.blockTime          ?? null,
    logo:               c.logo               ?? null,
  })));
  console.log(`✓ cryptocurrencies — ${cryptocurrencies.length} records`);

  // ── MARKET REGIONS ────────────────────────────────────────────────────────
  const { regions } = readJson("regions.json");
  await knex("market_regions").del();
  await insertChunked(knex, "market_regions", regions.map((r: any) => ({
    id:               r.id,
    name:             r.name,
    group:            r.group            ?? "Asia-Pacific",
    summary:          r.summary          ?? null,
    countries:        JSON.stringify(r.countries        ?? []),
    keyIndices:       JSON.stringify(r.keyIndices       ?? []),
    gdpGrowth:        r.gdpGrowth        ?? null,
    inflation:        r.inflation        ?? null,
    commodityImpact:  JSON.stringify(r.commodityImpact  ?? []),
    calendarFocus:    JSON.stringify(r.calendarFocus    ?? []),
    sectorLeaders:    JSON.stringify(r.sectorLeaders    ?? []),
    newsThemes:       JSON.stringify(r.newsThemes       ?? []),
  })));
  console.log(`✓ market_regions  — ${regions.length} records`);

  // ── STOCK SECTORS ─────────────────────────────────────────────────────────
  const { sectors } = readJson("sectors.json");
  await knex("stock_sectors").del();
  await insertChunked(knex, "stock_sectors", sectors.map((s: any) => ({
    id:              s.id,
    name:            s.name,
    category:        s.category        ?? "Growth",
    summary:         s.summary         ?? null,
    topCompanies:    JSON.stringify(s.topCompanies    ?? []),
    etfs:            JSON.stringify(s.etfs            ?? []),
    peRatio:         s.peRatio         ?? null,
    performanceYtd:  s.performanceYtd  ?? null,
    trendingStocks:  JSON.stringify(s.trendingStocks  ?? []),
    dividendLeaders: JSON.stringify(s.dividendLeaders ?? []),
    newsThemes:      JSON.stringify(s.newsThemes      ?? []),
  })));
  console.log(`✓ stock_sectors   — ${sectors.length} records`);

  // ── COMMODITIES ───────────────────────────────────────────────────────────
  const { commodities } = readJson("commodities.json");
  await knex("commodities").del();
  await insertChunked(knex, "commodities", commodities.map((c: any) => ({
    id:                  c.id,
    name:                c.name,
    symbol:              c.symbol,
    category:            c.category,
    unit:                c.unit                ?? "USD",
    spotPrice:           c.spotPrice           ?? 0,
    changePercent24h:    c.changePercent24h    ?? null,
    futuresContract:     c.futuresContract     ?? null,
    demandTrends:        JSON.stringify(c.demandTrends        ?? {}),
    currencyCorrelation: JSON.stringify(c.currencyCorrelation ?? {}),
    economicImpact:      c.economicImpact      ?? null,
  })));
  console.log(`✓ commodities     — ${commodities.length} records`);

  // ── NEWS ──────────────────────────────────────────────────────────────────
  const { articles } = readJson("news.json");
  await knex("news").del();
  await insertChunked(knex, "news", articles.map((a: any) => ({
    title:          a.title,
    description:    a.summary   ?? null,
    content:        a.content   ?? null,
    source:         a.source    ?? "Unknown",
    imageUrl:       a.image     ?? null,
    url:            a.url       ?? `https://placeholder.com/${a.id}`,
    publishedAt:    a.publishedAt ? new Date(a.publishedAt) : new Date(),
    category:       a.category  ?? "market",
    relevantAssets: JSON.stringify(a.tags ?? []),
  })));
  console.log(`✓ news            — ${articles.length} records`);

  // ── BONDS & YIELDS ────────────────────────────────────────────────────────
  const { bondsYields } = readJson("bonds_yields.json");
  await knex("bonds_yields").del();
  await insertChunked(knex, "bonds_yields", bondsYields.map((b: any) => ({
    id:               b.id,
    country:          b.country,
    instrument:       b.instrument,
    curvePoint:       b.curvePoint,
    currency:         b.currency,
    tenor:            b.tenor,
    yieldPercent:     b.yieldPercent     ?? 0,
    changePercentDay: b.changePercentDay ?? 0,
    ytdPercent:       b.ytdPercent       ?? 0,
  })));
  console.log(`✓ bonds_yields    — ${bondsYields.length} records`);

  // ── ETFs — sectors se extract karo ────────────────────────────────────────
  const etfMap = new Map<string, { symbol: string; name: string; category: string }>();
  sectors.forEach((s: any) => {
    (s.etfs ?? []).forEach((etf: string) => {
      if (!etfMap.has(etf)) {
        etfMap.set(etf, { symbol: etf, name: etf, category: s.category ?? "Equity" });
      }
    });
  });
  const etfRows = Array.from(etfMap.values());
  await knex("etfs").del();
  await insertChunked(knex, "etfs", etfRows.map((e) => ({
    symbol:       e.symbol,
    name:         e.name,
    category:     e.category,
    region:       "Global",
    price:        0,
    change1d:     0,
    changeYtd:    0,
    aum:          0,
    expenseRatio: 0,
    holdings:     JSON.stringify([]),
  })));
  console.log(`✓ etfs            — ${etfRows.length} records`);

  // ── INDICES — exchanges se extract karo ───────────────────────────────────
  await knex("indices").del();
  await insertChunked(knex, "indices", exchanges.map((e: any) => ({
    symbol:     e.mainIndex,
    name:       e.mainIndexName ?? e.mainIndex,
    country:    e.country,
    region:     e.region,
    exchangeId: e.id,
    value:      0,
    change1d:   0,
    changeYtd:  0,
    marketCap:  e.marketCap      ?? 0,
    components: e.listedCompanies ?? 0,
  })));
  console.log(`✓ indices         — ${exchanges.length} records`);

  console.log("\n✅ Seed complete!\n");
}

// ───────────────── ECONOMIC EVENTS SEED ─────────────────
// Note: Main seed() function ke andar yeh call ho raha hai
// Yahan standalone export hai taaki migrate ke baad separately run ho sake
export async function seedCalendarEvents(knex: Knex): Promise<void> {
  await knex("economic_events").del();

  const now = new Date();
  const d = (daysFromNow: number, hour = 8, min = 30) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + daysFromNow);
    dt.setHours(hour, min, 0, 0);
    return dt;
  };

  const events = [
    // Today
    { title: "CPI m/m",              country: "US",    countryCode: "US", impact: "High",   eventDate: d(0, 8,  30), time: "08:30", forecast: "0.3%",       previous: "0.1%",      actual: "0.4%",    category: "inflation"   },
    { title: "Retail Sales",         country: "EU",    countryCode: "EU", impact: "Medium", eventDate: d(0, 10, 0),  time: "10:00", forecast: "-0.2%",      previous: "0.4%",      actual: "-0.1%",   category: "retail"      },
    { title: "Industrial Production",country: "India", countryCode: "IN", impact: "Medium", eventDate: d(0, 12, 15), time: "12:15", forecast: "4.1%",       previous: "3.8%",      actual: "4.4%",    category: "production"  },
    // Tomorrow
    { title: "GDP q/q",              country: "UK",    countryCode: "GB", impact: "Low",    eventDate: d(1, 13, 30), time: "13:30", forecast: "0.1%",       previous: "0.0%",      actual: "",        category: "gdp"         },
    { title: "Trade Balance",        country: "China", countryCode: "CN", impact: "Medium", eventDate: d(1, 9,  0),  time: "09:00", forecast: "$72.3B",     previous: "$70.1B",    actual: "",        category: "trade"       },
    { title: "PPI m/m",              country: "US",    countryCode: "US", impact: "Medium", eventDate: d(1, 8,  30), time: "08:30", forecast: "0.2%",       previous: "0.2%",      actual: "",        category: "inflation"   },
    // This Week
    { title: "BoJ Rate Decision",    country: "Japan", countryCode: "JP", impact: "High",   eventDate: d(3, 15, 0),  time: "15:00", forecast: "Unchanged",  previous: "Unchanged", actual: "Pending", category: "interest_rate" },
    { title: "FOMC Minutes",         country: "US",    countryCode: "US", impact: "High",   eventDate: d(3, 18, 0),  time: "18:00", forecast: "Hawkish",    previous: "Neutral",   actual: "Pending", category: "interest_rate" },
    { title: "Unemployment Rate",    country: "EU",    countryCode: "EU", impact: "High",   eventDate: d(4, 11, 0),  time: "11:00", forecast: "6.1%",       previous: "6.2%",      actual: "",        category: "employment"  },
    { title: "Core PCE Price Index", country: "US",    countryCode: "US", impact: "High",   eventDate: d(5, 8,  30), time: "08:30", forecast: "0.3%",       previous: "0.3%",      actual: "",        category: "inflation"   },
    { title: "Manufacturing PMI",    country: "UK",    countryCode: "GB", impact: "Medium", eventDate: d(5, 9,  30), time: "09:30", forecast: "49.2",       previous: "48.6",      actual: "",        category: "pmi"         },
    { title: "RBI Rate Decision",    country: "India", countryCode: "IN", impact: "High",   eventDate: d(6, 10, 0),  time: "10:00", forecast: "Unchanged",  previous: "6.25%",     actual: "",        category: "interest_rate" },
    // Next Week
    { title: "NFP Employment",       country: "US",    countryCode: "US", impact: "High",   eventDate: d(8, 8,  30), time: "08:30", forecast: "185K",       previous: "175K",      actual: "",        category: "employment"  },
    { title: "ECB Rate Decision",    country: "EU",    countryCode: "EU", impact: "High",   eventDate: d(9, 13, 45), time: "13:45", forecast: "Unchanged",  previous: "2.5%",      actual: "",        category: "interest_rate" },
    { title: "UK CPI y/y",           country: "UK",    countryCode: "GB", impact: "High",   eventDate: d(9, 7,  0),  time: "07:00", forecast: "2.8%",       previous: "2.6%",      actual: "",        category: "inflation"   },
    { title: "GDP Growth Rate",      country: "China", countryCode: "CN", impact: "High",   eventDate: d(10, 10, 0), time: "10:00", forecast: "4.9%",       previous: "5.0%",      actual: "",        category: "gdp"         },
    { title: "Inflation Rate",       country: "Japan", countryCode: "JP", impact: "Medium", eventDate: d(11, 8, 30), time: "08:30", forecast: "2.2%",       previous: "2.4%",      actual: "",        category: "inflation"   },
  ];

  await insertChunked(knex, "economic_events", events);
  console.log(`✓ economic_events — ${events.length} records`);
}
