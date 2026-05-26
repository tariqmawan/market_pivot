import type { Knex } from "knex";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const readJson = (filename: string) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../data", filename), "utf8"));

async function insertChunked(knex: Knex, table: string, rows: object[], chunkSize = 100) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    await knex(table).insert(rows.slice(i, i + chunkSize)).onConflict().ignore();
  }
}

// Realistic stock data per exchange
const STOCKS: Record<string, Array<{ symbol: string; company: string; sector: string }>> = {
  nyse:    [{ symbol:"JPM",  company:"JPMorgan Chase",       sector:"Banking"    }, { symbol:"XOM",  company:"ExxonMobil",         sector:"Energy"     }, { symbol:"JNJ",  company:"Johnson & Johnson",  sector:"Healthcare" }, { symbol:"WMT",  company:"Walmart",              sector:"Retail"     }, { symbol:"BAC",  company:"Bank of America",     sector:"Banking"    }],
  nasdaq:  [{ symbol:"AAPL", company:"Apple Inc.",           sector:"Technology" }, { symbol:"MSFT", company:"Microsoft Corp.",      sector:"Technology" }, { symbol:"NVDA", company:"NVIDIA Corp.",        sector:"Technology" }, { symbol:"GOOG", company:"Alphabet Inc.",         sector:"Technology" }, { symbol:"META", company:"Meta Platforms",       sector:"Technology" }],
  lse:     [{ symbol:"HSBA", company:"HSBC Holdings",        sector:"Banking"    }, { symbol:"BP",   company:"BP plc",              sector:"Energy"     }, { symbol:"RIO",  company:"Rio Tinto",           sector:"Mining"     }, { symbol:"AZN",  company:"AstraZeneca",          sector:"Healthcare" }, { symbol:"SHEL", company:"Shell plc",            sector:"Energy"     }],
  tse:     [{ symbol:"7203", company:"Toyota Motor",         sector:"Auto"       }, { symbol:"6758", company:"Sony Group",          sector:"Technology" }, { symbol:"8306", company:"Mitsubishi UFJ",      sector:"Banking"    }, { symbol:"9984", company:"SoftBank Group",       sector:"Technology" }, { symbol:"7974", company:"Nintendo",              sector:"Technology" }],
  sse:     [{ symbol:"600519",company:"Kweichow Moutai",     sector:"Consumer"   }, { symbol:"601398",company:"ICBC",              sector:"Banking"    }, { symbol:"600036",company:"China Merchants Bank",sector:"Banking"    }, { symbol:"601318",company:"Ping An Insurance",  sector:"Finance"    }, { symbol:"600276",company:"Jiangsu Hengrui",    sector:"Healthcare" }],
  hkex:   [{ symbol:"0700", company:"Tencent Holdings",     sector:"Technology" }, { symbol:"9988", company:"Alibaba Group",        sector:"Technology" }, { symbol:"0941", company:"China Mobile",         sector:"Telecom"    }, { symbol:"1299", company:"AIA Group",            sector:"Insurance"  }, { symbol:"0005", company:"HSBC Holdings",       sector:"Banking"    }],
  nse:     [{ symbol:"RELIANCE",company:"Reliance Industries",sector:"Energy"    }, { symbol:"TCS",  company:"Tata Consultancy",    sector:"Technology" }, { symbol:"HDFC", company:"HDFC Bank",            sector:"Banking"    }, { symbol:"INFY", company:"Infosys",              sector:"Technology" }, { symbol:"ICICI",company:"ICICI Bank",          sector:"Banking"    }],
  bse:     [{ symbol:"500325",company:"Reliance Industries",  sector:"Energy"    }, { symbol:"532540",company:"Tata Consultancy",  sector:"Technology" }, { symbol:"500180",company:"HDFC Bank",          sector:"Banking"    }, { symbol:"500209",company:"Infosys Ltd",        sector:"Technology" }, { symbol:"532174",company:"ICICI Bank",         sector:"Banking"    }],
  euronext:[{ symbol:"MC",   company:"LVMH",                 sector:"Luxury"     }, { symbol:"TTE",  company:"TotalEnergies",       sector:"Energy"     }, { symbol:"SAN",  company:"Sanofi",              sector:"Healthcare" }, { symbol:"BNP",  company:"BNP Paribas",          sector:"Banking"    }, { symbol:"OR",   company:"L'Oreal",             sector:"Consumer"   }],
  tsx:     [{ symbol:"RY",   company:"Royal Bank of Canada", sector:"Banking"    }, { symbol:"TD",   company:"TD Bank",             sector:"Banking"    }, { symbol:"ENB",  company:"Enbridge Inc.",        sector:"Energy"     }, { symbol:"CNR",  company:"CN Rail",              sector:"Transport"  }, { symbol:"BMO",  company:"Bank of Montreal",    sector:"Banking"    }],
};

const DEFAULT_STOCKS = [
  { symbol:"IDX1",  company:"Index Leader Corp",    sector:"Technology" },
  { symbol:"IDX2",  company:"Blue Chip Holdings",   sector:"Finance"    },
  { symbol:"IDX3",  company:"Growth Capital Ltd",   sector:"Energy"     },
  { symbol:"IDX4",  company:"Prime Industries",     sector:"Healthcare" },
  { symbol:"IDX5",  company:"Apex Ventures",        sector:"Consumer"   },
];

export async function seed(knex: Knex): Promise<void> {
  console.log("\n🌱 Seeding market data...\n");

  // ── ADMIN USER ────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL    || "admin@marketspivot.com";
  const adminPass  = process.env.ADMIN_PASSWORD || "Admin@123456";
  const existing   = await knex("users").where({ email: adminEmail }).first();

  if (!existing) {
    const hashed = await bcrypt.hash(adminPass, 12);
    const [adminRow] = await knex("users")
      .insert({ name: "Super Admin", email: adminEmail, password: hashed, role: "super_admin", isActive: true, isEmailVerified: true })
      .returning("id");
    const adminId = adminRow?.id ?? adminRow;
    await knex("watchlists").insert({ userId: adminId, name: "My Watchlist", items: "[]" });
    console.log(`✓ admin user      — ${adminEmail} / ${adminPass}`);
  } else {
    console.log(`✓ admin user      — already exists`);
  }

  // ── MARKET MOVERS ─────────────────────────────────────────────────────────
  const { exchanges } = readJson("exchanges.json");
  await knex("market_movers").del();

  const moversRows: object[] = [];

  for (const exchange of exchanges) {
    const stocks = STOCKS[exchange.id] ?? DEFAULT_STOCKS;

    // Gainers — top 5
    stocks.forEach((stock, i) => {
      const percentChange = 3.8 - i * 0.4 + Math.random() * 0.5;
      const price = 20 + i * 25 + exchange.id.length * 3;
      moversRows.push({
        exchangeId:    exchange.id,
        symbol:        stock.symbol,
        company:       stock.company,
        price:         parseFloat(price.toFixed(2)),
        change:        parseFloat((price * percentChange / 100).toFixed(2)),
        percentChange: parseFloat(percentChange.toFixed(2)),
        volume:        Math.floor((exchange.avgDailyVolume || 1e9) / (i + 5)),
        marketCap:     Math.floor((exchange.marketCap || 1e12) / (i + 8)),
        type:          "gainer",
        signals:       JSON.stringify({ momentumScore: 90 - i * 5, unusualVolume: i === 0 }),
      });
    });

    // Losers — top 5
    stocks.forEach((stock, i) => {
      const percentChange = -(2.9 + i * 0.35 + Math.random() * 0.4);
      const price = 15 + i * 20 + exchange.id.length * 2;
      moversRows.push({
        exchangeId:    exchange.id,
        symbol:        stock.symbol + "X",
        company:       stock.company + " (Short)",
        price:         parseFloat(price.toFixed(2)),
        change:        parseFloat((price * percentChange / 100).toFixed(2)),
        percentChange: parseFloat(percentChange.toFixed(2)),
        volume:        Math.floor((exchange.avgDailyVolume || 1e9) / (i + 6)),
        marketCap:     Math.floor((exchange.marketCap || 1e12) / (i + 10)),
        type:          "loser",
        signals:       JSON.stringify({ crashAlert: i === 0, oversold: i < 2, reversalProb: 65 - i * 5 }),
      });
    });

    // Most Active — top 5
    stocks.forEach((stock, i) => {
      const percentChange = i % 2 === 0 ? 1.4 + i * 0.2 : -(0.9 + i * 0.15);
      const price = 30 + i * 15;
      moversRows.push({
        exchangeId:    exchange.id,
        symbol:        stock.symbol + "V",
        company:       stock.company,
        price:         parseFloat(price.toFixed(2)),
        change:        parseFloat((price * percentChange / 100).toFixed(2)),
        percentChange: parseFloat(percentChange.toFixed(2)),
        volume:        Math.floor((exchange.avgDailyVolume || 1e9) / (i + 2)),
        marketCap:     Math.floor((exchange.marketCap || 1e12) / (i + 5)),
        type:          "active",
        signals:       JSON.stringify({ whaleSignal: i === 0, unusualActivity: i < 3 }),
      });
    });
  }

  await insertChunked(knex, "market_movers", moversRows);
  console.log(`✓ market_movers   — ${moversRows.length} records (${exchanges.length} exchanges × 15)`);

  // ── SECTOR PERFORMANCE ────────────────────────────────────────────────────
  await knex("sector_performance").del();
  const SECTORS = ["Technology","Banking","Energy","Healthcare","Consumer","Finance","Industrial","Materials"];
  const sectorRows: object[] = [];

  for (const exchange of exchanges) {
    SECTORS.forEach((sectorName, i) => {
      sectorRows.push({
        exchangeId:  exchange.id,
        sectorName,
        performance: parseFloat(((i % 3 === 0 ? 1 : -1) * (0.5 + i * 0.3) + Math.random()).toFixed(2)),
        companies:   Math.floor((exchange.listedCompanies || 100) / SECTORS.length),
        marketCap:   Math.floor((exchange.marketCap || 1e12) / SECTORS.length),
        symbols:     JSON.stringify([]),
      });
    });
  }

  await insertChunked(knex, "sector_performance", sectorRows);
  console.log(`✓ sector_perf     — ${sectorRows.length} records`);

  // ── INDEX SNAPSHOTS ───────────────────────────────────────────────────────
  await knex("index_snapshots").del();
  const snapshotRows = exchanges.map((e: any) => {
    const base = Math.max(900, (e.marketCap || 1e12) / 1e10);
    return {
      exchangeId:    e.id,
      symbol:        e.mainIndex,
      name:          e.mainIndexName ?? e.mainIndex,
      value:         parseFloat(base.toFixed(2)),
      previousClose: parseFloat((base * 0.992).toFixed(2)),
      change:        parseFloat((base * 0.008).toFixed(2)),
      percentChange: 0.80,
      volume:        e.avgDailyVolume ?? 0,
      advancers:     Math.round((e.listedCompanies || 100) * 0.54),
      decliners:     Math.round((e.listedCompanies || 100) * 0.38),
      timestamp:     new Date(),
    };
  });

  await insertChunked(knex, "index_snapshots", snapshotRows);
  console.log(`✓ index_snapshots — ${snapshotRows.length} records`);

  console.log("\n Market data seeded!\n");
  console.log(`   Admin login: ${process.env.ADMIN_EMAIL || "admin@marketspivot.com"}`);
  console.log(`   Password:    ${process.env.ADMIN_PASSWORD || "Admin@123456"}`);
  console.log(`   (Apne .env mein ADMIN_EMAIL aur ADMIN_PASSWORD set karo)\n`);
}
