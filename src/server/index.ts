import http from "http";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import db from "./db";

import { createRouter as createAuthRouter }        from "./routes/auth";
import { createRouter as createExchangesRouter }   from "./routes/exchanges";
import { createRouter as createCurrenciesRouter }  from "./routes/currencies";
import { createRouter as createCryptosRouter }     from "./routes/cryptocurrencies";
import { createRouter as createRegionsRouter }     from "./routes/regions";
import { createRouter as createSectorsRouter }     from "./routes/sectors";
import { createRouter as createCommoditiesRouter } from "./routes/commodities";
import { createRouter as createNewsRouter }        from "./routes/news";
import { createRouter as createChartsRouter }      from "./routes/charts";
import { createRouter as createBondsRouter }       from "./routes/bonds";
import { createRouter as createEtfsRouter }        from "./routes/etfs";
import { createRouter as createIndicesRouter }     from "./routes/indices";
import { createRouter as createScreenerRouter }  from "./routes/screener";
import { createRouter as createCalendarRouter }  from "./routes/calendar";
import { createRouter as createAdminRouter }     from "./routes/admin";
import { createRouter as createWatchlistRouter }   from "./routes/watchlist";

import { corsOptions, createRateLimiter, sanitizeShortText, securityHeaders } from "./security";
import { initAdminWebSocket } from "./websocket/adminHub";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(createRateLimiter());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// ─── Health check ──────────────────────────────────────────────────────────────
app.get("/health", async (req: Request, res: Response) => {
  try {
    await db.raw("SELECT 1");
    res.json({ status: "OK", db: "connected", timestamp: new Date() });
  } catch {
    res.status(503).json({ status: "OK", db: "disconnected", timestamp: new Date() });
  }
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",       createAuthRouter(db));
app.use("/api/exchanges",  createExchangesRouter(db));
app.use("/api/currencies", createCurrenciesRouter(db));
app.use("/api/cryptos",    createCryptosRouter(db));
app.use("/api/regions",    createRegionsRouter(db));
app.use("/api/sectors",    createSectorsRouter(db));
app.use("/api/commodities",createCommoditiesRouter(db));
app.use("/api/news",       createNewsRouter(db));
app.use("/api/charts",     createChartsRouter(db));
app.use("/api/bonds",      createBondsRouter(db));
app.use("/api/etfs",       createEtfsRouter(db));
app.use("/api/indices",    createIndicesRouter(db));
app.use("/api/watchlist",  createWatchlistRouter(db));
app.use("/api/screener",   createScreenerRouter(db));
app.use("/api/calendar",   createCalendarRouter(db));
app.use("/api/admin",      createAdminRouter(db));

// ─── Dashboard ────────────────────────────────────────────────────────────────
app.get("/api/dashboard", async (req: Request, res: Response) => {
  try {
    const [exchanges, currencies, cryptos, regions, sectors, commodities] =
      await Promise.all([
        db("exchanges").select("id","name","country","mainIndex","marketCap").limit(5),
        db("currencies").select("code","name","symbol","country").limit(6),
        db("cryptocurrencies").select("id","name","symbol","category").limit(6),
        db("market_regions").select("id","name","gdpGrowth","inflation").limit(10),
        db("stock_sectors").select("id","name","performanceYtd","peRatio").limit(6),
        db("commodities").select("id","name","spotPrice","changePercent24h").limit(6),
      ]);

    res.json({
      success: true,
      data: {
        stocks:     { topExchanges: exchanges, gainers: [], losers: [] },
        currencies: { reserves: currencies,    gainers: [], losers: [] },
        crypto:     { topCryptos: cryptos,     gainers: [], losers: [] },
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

// ─── Global overview ──────────────────────────────────────────────────────────
app.get("/api/global", async (req: Request, res: Response) => {
  try {
    const [exchTotal, cryptoCount, regCount, secCount, comCats] = await Promise.all([
      db("exchanges").sum("marketCap as total").first(),
      db("cryptocurrencies").count("id as count").first(),
      db("market_regions").count("id as count").first(),
      db("stock_sectors").count("id as count").first(),
      db("commodities").distinct("category").select("category"),
    ]);

    res.json({
      success: true,
      data: {
        stocks:      { totalMarketCap: Number(exchTotal?.total ?? 0) },
        crypto:      { totalCoins: Number(cryptoCount?.count ?? 0), btcDominance: 0, fear_and_greed_index: 0 },
        fx:          { majorPairs: ["EUR/USD","USD/JPY","GBP/USD","AUD/USD","USD/INR"], volatility: 0 },
        regions:     Number(regCount?.count ?? 0),
        sectors:     Number(secCount?.count ?? 0),
        commodities: { categories: comCats.map((c: any) => c.category) },
        timestamp: new Date(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Global fetch failed", timestamp: new Date() });
  }
});

// ─── Search ───────────────────────────────────────────────────────────────────
app.get("/api/search", async (req: Request, res: Response) => {
  const q    = sanitizeShortText(req.query.q);
  const type = sanitizeShortText(req.query.type, 20);
  const like = `%${q.toLowerCase()}%`;

  try {
    const [exchanges, currencies, cryptos, regions, sectors, commodities, indices] =
      await Promise.all([
        db("exchanges").whereILike("name", like).orWhereILike("id", like).select("id","name","country","currency").limit(8),
        db("currencies").whereILike("name", like).orWhereILike("code", like).select("code as id","name","country").limit(8),
        db("cryptocurrencies").whereILike("name", like).orWhereILike("symbol", like).select("id","name","symbol","category").limit(8),
        db("market_regions").whereILike("name", like).select("id","name").limit(5),
        db("stock_sectors").whereILike("name", like).select("id","name","performanceYtd").limit(5),
        db("commodities").whereILike("name", like).orWhereILike("symbol", like).select("id","name","symbol","category").limit(5),
        db("indices").whereILike("name", like).orWhereILike("symbol", like).select("symbol as id","name","country").limit(5),
      ]);

    const results = [
      ...exchanges.map((e: any)   => ({ type: "exchange",  id: e.id,   title: e.name, meta: `${e.country}` })),
      ...currencies.map((c: any)  => ({ type: "currency",  id: c.id,   title: c.name, meta: c.country })),
      ...cryptos.map((c: any)     => ({ type: "crypto",    id: c.id,   title: c.name, meta: c.symbol })),
      ...regions.map((r: any)     => ({ type: "region",    id: r.id,   title: r.name, meta: "Region" })),
      ...sectors.map((s: any)     => ({ type: "sector",    id: s.id,   title: s.name, meta: `${s.performanceYtd}% YTD` })),
      ...commodities.map((c: any) => ({ type: "commodity", id: c.id,   title: c.name, meta: c.category })),
      ...indices.map((i: any)     => ({ type: "index",     id: i.id,   title: i.name, meta: i.country })),
    ].filter((item) => !type || item.type === type);

    res.json({ success: true, data: results.slice(0, 25), timestamp: new Date() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Search failed", timestamp: new Date() });
  }
});

// ─── Error handlers ───────────────────────────────────────────────────────────
app.use(errorHandler);
app.use(notFoundHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const server = http.createServer(app);
initAdminWebSocket(server, db);

server.listen(PORT, () => {
  console.log(`MarketsPivot API running on http://localhost:${PORT}`);
  console.log(`Admin WebSocket: ws://localhost:${PORT}/ws/admin?token=<accessToken>`);
});

export default app;
