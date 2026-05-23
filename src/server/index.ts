import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// DB instance — ek baar banao, sab jagah pass karo
import db from "./db";

// Route factories — ab har route ek function hai jo db leta hai
import { createRouter as createExchangesRouter }     from "./routes/exchanges";
import { createRouter as createCurrenciesRouter }    from "./routes/currencies";
import { createRouter as createCryptosRouter }       from "./routes/cryptocurrencies";
import { createRouter as createRegionsRouter }       from "./routes/regions";
import { createRouter as createSectorsRouter }       from "./routes/sectors";
import { createRouter as createCommoditiesRouter }   from "./routes/commodities";
import { createRouter as createNewsRouter }          from "./routes/news";
import { createRouter as createChartsRouter }        from "./routes/charts";
import { createRouter as createAuthRouter }          from "./routes/auth.routes";


import {
  corsOptions,
  createRateLimiter,
  sanitizeShortText,
  securityHeaders,
} from "./security";

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(createRateLimiter());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// ─── Health check ──────────────────────────────────────────────────────────────
app.get("/health", async (req: Request, res: Response) => {
  try {
    await db.raw("SELECT 1"); // DB connection test
    res.json({ status: "OK", db: "connected", timestamp: new Date() });
  } catch {
    res.status(503).json({ status: "OK", db: "disconnected", timestamp: new Date() });
  }
});

// ─── API Routes — db pass ho raha hai har router ko ───────────────────────────
app.use("/api/auth",        createAuthRouter(db));
app.use("/api/exchanges",   createExchangesRouter(db));
app.use("/api/currencies",  createCurrenciesRouter(db));
app.use("/api/cryptos",     createCryptosRouter(db));
app.use("/api/regions",     createRegionsRouter(db));
app.use("/api/sectors",     createSectorsRouter(db));
app.use("/api/commodities", createCommoditiesRouter(db));
app.use("/api/news",        createNewsRouter(db));
app.use("/api/charts",      createChartsRouter(db));

// ─── Dashboard — DB se data ────────────────────────────────────────────────────
app.get("/api/dashboard", async (req: Request, res: Response) => {
  try {
    const [exchanges, currencies, cryptos, regions, sectors, commodities] =
      await Promise.all([
        db("exchanges").select("*").limit(5),
        db("currencies").select("*").limit(6),
        db("cryptocurrencies").select("*").limit(6),
        db("market_regions").select("id","name","gdpGrowth","inflation").limit(10),
        db("stock_sectors").select("id","name","performanceYtd","peRatio").limit(6),
        db("commodities").select("id","name","spotPrice","changePercent24h").limit(6),
      ]);

    res.json({
      success: true,
      data: {
        stocks:      { topExchanges: exchanges, gainers: [], losers: [] },
        currencies:  { reserves: currencies,    gainers: [], losers: [] },
        crypto:      { topCryptos: cryptos,      gainers: [], losers: [] },
        regions,
        sectors,
        commodities,
        news: [],
        timestamp: new Date(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Dashboard fetch failed", timestamp: new Date() });
  }
});

// ─── Global Market Overview ────────────────────────────────────────────────────
app.get("/api/global", async (req: Request, res: Response) => {
  try {
    const [exchanges, cryptos, currencies, regionsCount, sectorsCount, commodities] =
      await Promise.all([
        db("exchanges").sum("marketCap as total").first(),
        db("cryptocurrencies").count("id as count").first(),
        db("currencies").select("code").limit(10),
        db("market_regions").count("id as count").first(),
        db("stock_sectors").count("id as count").first(),
        db("commodities").select("category").distinct("category"),
      ]);

    res.json({
      success: true,
      data: {
        stocks: {
          totalMarketCap: Number(exchanges?.total ?? 0),
        },
        crypto: {
          totalCoins:         Number(cryptos?.count ?? 0),
          btcDominance:       0,   // live API se aayega baad mein
          fear_and_greed_index: 0,
        },
        fx: {
          majorPairs: ["EUR/USD", "USD/JPY", "GBP/USD", "GBP/USD", "AUD/USD", "USD/INR"],
          volatility: 0,
        },
        regions:    Number(regionsCount?.count ?? 0),
        sectors:    Number(sectorsCount?.count ?? 0),
        commodities: {
          categories: commodities.map((c: any) => c.category),
        },
        timestamp: new Date(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Global fetch failed", timestamp: new Date() });
  }
});

// ─── Search ────────────────────────────────────────────────────────────────────
app.get("/api/search", async (req: Request, res: Response) => {
  const q    = sanitizeShortText(req.query.q);
  const type = sanitizeShortText(req.query.type, 20);
  const query = `%${q.toLowerCase()}%`;

  try {
    const [exchanges, currencies, cryptos, regions, sectors, commodities] =
      await Promise.all([
        db("exchanges")
          .whereILike("name", query).orWhereILike("id", query)
          .select("id","name","country","currency").limit(10),
        db("currencies")
          .whereILike("name", query).orWhereILike("code", query)
          .select("code as id","name","country","centralBank").limit(10),
        db("cryptocurrencies")
          .whereILike("name", query).orWhereILike("symbol", query)
          .select("id","name","symbol","category").limit(10),
        db("market_regions")
          .whereILike("name", query)
          .select("id","name").limit(5),
        db("stock_sectors")
          .whereILike("name", query)
          .select("id","name","performanceYtd").limit(5),
        db("commodities")
          .whereILike("name", query).orWhereILike("symbol", query)
          .select("id","name","symbol","category").limit(5),
      ]);

    const results = [
      ...exchanges.map((e: any)   => ({ type: "exchange",  id: e.id,     title: e.name,   meta: `${e.country} / ${e.currency}` })),
      ...currencies.map((c: any)  => ({ type: "currency",  id: c.id,     title: c.name,   meta: `${c.country} / ${c.centralBank}` })),
      ...cryptos.map((c: any)     => ({ type: "crypto",    id: c.id,     title: c.name,   meta: `${c.symbol} / ${c.category}` })),
      ...regions.map((r: any)     => ({ type: "region",    id: r.id,     title: r.name,   meta: "Region" })),
      ...sectors.map((s: any)     => ({ type: "sector",    id: s.id,     title: s.name,   meta: `${s.performanceYtd}% YTD` })),
      ...commodities.map((c: any) => ({ type: "commodity", id: c.id,     title: c.name,   meta: `${c.symbol} / ${c.category}` })),
    ].filter((item) => !type || item.type === type);

    res.json({ success: true, data: results.slice(0, 25), timestamp: new Date() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Search failed", timestamp: new Date() });
  }
});

// ─── Error handlers ────────────────────────────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error", timestamp: new Date() });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Route not found", timestamp: new Date() });
});

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`MarketsPivot API running on http://localhost:${PORT}`);
});

export default app;
