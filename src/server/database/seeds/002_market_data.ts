import type { Knex } from "knex";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = path.resolve(process.cwd(), "src/data");

const readJson = (filename: string) =>
  JSON.parse(fs.readFileSync(path.resolve(DATA_DIR, filename), "utf8"));

async function insertChunked(knex: Knex, table: string, rows: object[], chunkSize = 100) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    await knex(table).insert(rows.slice(i, i + chunkSize)).onConflict().ignore();
  }
}

// Realistic stock data — key = exact exchange ID from DB (uppercase)
const STOCKS: Record<string, Array<{ symbol: string; company: string }>> = {
  NYSE:    [{ symbol:"JPM",     company:"JPMorgan Chase"       }, { symbol:"XOM",  company:"ExxonMobil"          }, { symbol:"JNJ",  company:"Johnson & Johnson"  }, { symbol:"WMT",  company:"Walmart"               }, { symbol:"BAC",  company:"Bank of America"     }],
  NASDAQ:  [{ symbol:"AAPL",    company:"Apple Inc."           }, { symbol:"MSFT", company:"Microsoft Corp."      }, { symbol:"NVDA", company:"NVIDIA Corp."        }, { symbol:"GOOG", company:"Alphabet Inc."          }, { symbol:"META", company:"Meta Platforms"       }],
  LSE:     [{ symbol:"HSBA",    company:"HSBC Holdings"        }, { symbol:"BP",   company:"BP plc"              }, { symbol:"RIO",  company:"Rio Tinto"           }, { symbol:"AZN",  company:"AstraZeneca"           }, { symbol:"SHEL", company:"Shell plc"            }],
  TSE:     [{ symbol:"7203.T",  company:"Toyota Motor"         }, { symbol:"6758.T",company:"Sony Group"         }, { symbol:"8306.T",company:"Mitsubishi UFJ"     }, { symbol:"9984.T",company:"SoftBank Group"       }, { symbol:"7974.T",company:"Nintendo"             }],
  SSE:     [{ symbol:"600519",  company:"Kweichow Moutai"      }, { symbol:"601398",company:"ICBC"              }, { symbol:"600036",company:"China Merchants Bank"}, { symbol:"601318",company:"Ping An Insurance"    }, { symbol:"600276",company:"Jiangsu Hengrui"      }],
  SZSE:    [{ symbol:"000001",  company:"Ping An Bank"         }, { symbol:"000333",company:"Midea Group"       }, { symbol:"002415",company:"Hikvision"           }, { symbol:"000858",company:"Wuliangye Yibin"       }, { symbol:"300750",company:"CATL"                }],
  HKEX:   [{ symbol:"0700",   company:"Tencent Holdings"      }, { symbol:"9988",  company:"Alibaba Group"      }, { symbol:"0941",  company:"China Mobile"        }, { symbol:"1299",  company:"AIA Group"            }, { symbol:"0005",  company:"HSBC Holdings"       }],
  NSE:     [{ symbol:"RELIANCE",company:"Reliance Industries"  }, { symbol:"TCS",   company:"Tata Consultancy"  }, { symbol:"HDFCBANK",company:"HDFC Bank"         }, { symbol:"INFY",  company:"Infosys"              }, { symbol:"ICICIBANK",company:"ICICI Bank"        }],
  BSE:     [{ symbol:"500325",  company:"Reliance Industries"  }, { symbol:"532540",company:"Tata Consultancy"  }, { symbol:"500180",company:"HDFC Bank"           }, { symbol:"500209",company:"Infosys Ltd"          }, { symbol:"532174",company:"ICICI Bank"           }],
  EURONEXT:[{ symbol:"MC.PA",   company:"LVMH"                 }, { symbol:"TTE.PA",company:"TotalEnergies"     }, { symbol:"SAN.PA",company:"Sanofi"              }, { symbol:"BNP.PA",company:"BNP Paribas"          }, { symbol:"OR.PA", company:"L'Oreal"             }],
  TSX:     [{ symbol:"RY.TO",   company:"Royal Bank of Canada" }, { symbol:"TD.TO", company:"TD Bank"           }, { symbol:"ENB.TO",company:"Enbridge Inc."       }, { symbol:"CNR.TO",company:"CN Rail"              }, { symbol:"BMO.TO",company:"Bank of Montreal"    }],
  XETRA:   [{ symbol:"SAP",     company:"SAP SE"               }, { symbol:"SIE",   company:"Siemens AG"        }, { symbol:"ALV",   company:"Allianz SE"          }, { symbol:"MRK",   company:"Merck KGaA"           }, { symbol:"BMW",   company:"BMW AG"              }],
  ASX:     [{ symbol:"BHP.AX",  company:"BHP Group"            }, { symbol:"CBA.AX",company:"Commonwealth Bank" }, { symbol:"CSL.AX",company:"CSL Ltd"             }, { symbol:"NAB.AX",company:"National Aus Bank"    }, { symbol:"WBC.AX",company:"Westpac Banking"     }],
  KRX:     [{ symbol:"005930",  company:"Samsung Electronics"  }, { symbol:"000660",company:"SK Hynix"          }, { symbol:"005380",company:"Hyundai Motor"        }, { symbol:"035420",company:"NAVER Corp"           }, { symbol:"051910",company:"LG Chem"             }],
  TADAWUL: [{ symbol:"2222",    company:"Saudi Aramco"         }, { symbol:"1120",  company:"Al Rajhi Bank"     }, { symbol:"2010",  company:"SABIC"               }, { symbol:"1180",  company:"Al Rajhi Takaful"     }, { symbol:"2350",  company:"Saudi Telecom"       }],
};

const DEFAULT_STOCKS = [
  { symbol:"STK1", company:"Blue Chip Corp"     },
  { symbol:"STK2", company:"Growth Capital Ltd" },
  { symbol:"STK3", company:"Prime Industries"   },
  { symbol:"STK4", company:"Apex Ventures"      },
  { symbol:"STK5", company:"Index Leader Corp"  },
];

export async function seed(knex: Knex): Promise<void> {
  console.log("\n🌱 Seeding market data...\n");

  // ── ADMIN USER ────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL    || "admin@marketspivot.com";
  const adminPass  = process.env.ADMIN_PASSWORD || "Admin@123456";
  const existing   = await knex("users").where({ email: adminEmail }).first();

  if (!existing) {
    const hashed = await bcrypt.hash(adminPass, 12);
    const [row] = await knex("users")
      .insert({ name: "Super Admin", email: adminEmail, password: hashed, role: "super_admin", isActive: true, isEmailVerified: true })
      .returning("id");
    const adminId = row?.id ?? row;
    await knex("watchlists").insert({ userId: adminId, name: "My Watchlist", items: "[]" }).onConflict().ignore();
    console.log(`✓ admin user      — created: ${adminEmail}`);
  } else {
    console.log(`✓ admin user      — already exists`);
  }

  // ── FETCH ACTUAL EXCHANGE IDs FROM DB ─────────────────────────────────────
  const dbExchanges = await knex("exchanges").select("id", "marketCap", "avgDailyVolume", "listedCompanies");
  console.log(`  Found ${dbExchanges.length} exchanges in DB`);

  // ── MARKET MOVERS ─────────────────────────────────────────────────────────
  await knex("market_movers").del();
  const moversRows: object[] = [];

  for (const exchange of dbExchanges) {
    const id     = exchange.id;  // exact ID from DB — uppercase
    const stocks = STOCKS[id] ?? DEFAULT_STOCKS;

    // Gainers
    stocks.forEach((stock, i) => {
      const pct   = parseFloat((3.8 - i * 0.4 + Math.random() * 0.5).toFixed(2));
      const price = parseFloat((20 + i * 25 + id.length * 2).toFixed(2));
      moversRows.push({ exchangeId: id, symbol: stock.symbol, company: stock.company, price, change: parseFloat((price * pct / 100).toFixed(2)), percentChange: pct, volume: Math.floor((exchange.avgDailyVolume || 1e9) / (i + 5)), marketCap: Math.floor((exchange.marketCap || 1e12) / (i + 8)), type: "gainer" });
    });

    // Losers
    stocks.forEach((stock, i) => {
      const pct   = parseFloat((-(2.9 + i * 0.35 + Math.random() * 0.4)).toFixed(2));
      const price = parseFloat((15 + i * 20 + id.length * 1.5).toFixed(2));
      moversRows.push({ exchangeId: id, symbol: stock.symbol + "B", company: stock.company + " B", price, change: parseFloat((price * pct / 100).toFixed(2)), percentChange: pct, volume: Math.floor((exchange.avgDailyVolume || 1e9) / (i + 6)), marketCap: Math.floor((exchange.marketCap || 1e12) / (i + 10)), type: "loser" });
    });

    // Most Active
    stocks.forEach((stock, i) => {
      const pct   = parseFloat((i % 2 === 0 ? 1.4 + i * 0.2 : -(0.9 + i * 0.15)).toFixed(2));
      const price = parseFloat((30 + i * 15).toFixed(2));
      moversRows.push({ exchangeId: id, symbol: stock.symbol + "C", company: stock.company, price, change: parseFloat((price * pct / 100).toFixed(2)), percentChange: pct, volume: Math.floor((exchange.avgDailyVolume || 1e9) / (i + 2)), marketCap: Math.floor((exchange.marketCap || 1e12) / (i + 5)), type: "active" });
    });
  }

  await insertChunked(knex, "market_movers", moversRows);
  console.log(`✓ market_movers   — ${moversRows.length} records`);

  // ── SECTOR PERFORMANCE ────────────────────────────────────────────────────
  await knex("sector_performance").del();
  const SECTORS = ["Technology", "Banking", "Energy", "Healthcare", "Consumer", "Finance", "Industrial", "Materials"];
  const sectorRows: object[] = [];

  for (const exchange of dbExchanges) {
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
  const { exchanges: jsonExchanges } = readJson("exchanges.json");
  await knex("index_snapshots").del();

  const snapshotRows = dbExchanges.map((e: any) => {
    const jsonEx = jsonExchanges.find((j: any) => j.id === e.id) ?? {};
    const base   = parseFloat(Math.max(900, (e.marketCap || 1e12) / 1e10).toFixed(2));
    return {
      exchangeId:    e.id,
      symbol:        jsonEx.mainIndex      ?? e.id,
      name:          jsonEx.mainIndexName  ?? e.id,
      value:         base,
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

  console.log(`\n Market data seeded!\n`);
  console.log(`   Admin: ${adminEmail} / ${adminPass}\n`);
}
