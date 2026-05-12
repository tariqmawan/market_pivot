import express from "express";
import type { Request, Response, NextFunction } from "express";

import cors from "cors";
import dotenv from "dotenv";

// Import route handlers
import commoditiesRouter from "./routes/commodities";
import exchangesRouter from "./routes/exchanges";
import currenciesRouter from "./routes/currencies";
import cryptocurrenciesRouter from "./routes/cryptocurrencies";
import regionsRouter from "./routes/regions";
import sectorsRouter from "./routes/sectors";
import newsRouter from "./routes/news";
import chartsRouter from "./routes/charts";
import { corsOptions, createRateLimiter, sanitizeShortText, securityHeaders } from "./security";

// Import JSON data
import commoditiesData from "../data/commodities.json";
import cryptoData from "../data/cryptocurrencies.json";
import currenciesData from "../data/currencies.json";
import exchangesData from "../data/exchanges.json";
import regionsData from "../data/regions.json";
import sectorsData from "../data/sectors.json";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const exchanges: any = (exchangesData as any).exchanges;
const currencies: any = (currenciesData as any).currencies;
const cryptocurrencies: any = (cryptoData as any).cryptocurrencies;
const regions: any = (regionsData as any).regions;
const sectors: any = (sectorsData as any).sectors;
const commodities: any = (commoditiesData as any).commodities;

// Middleware
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(createRateLimiter());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// API Routes
app.use("/api/exchanges", exchangesRouter);
app.use("/api/currencies", currenciesRouter);
app.use("/api/cryptos", cryptocurrenciesRouter);
app.use("/api/regions", regionsRouter);
app.use("/api/sectors", sectorsRouter);
app.use("/api/commodities", commoditiesRouter);
app.use("/api/news", newsRouter);
app.use("/api/charts", chartsRouter);

// Dashboard/Overview Routes
app.get("/api/dashboard", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      stocks: {
        topExchanges: exchanges.slice(0, 5),
        gainers: [],
        losers: [],
      },
      currencies: {
        reserves: currencies.slice(0, 6),
        gainers: [],
        losers: [],
      },
      crypto: {
        topCryptos: cryptocurrencies.slice(0, 6),
        gainers: [],
        losers: [],
      },
      regions: regions.map((region: any) => ({
        id: region.id,
        name: region.name,
        gdpGrowth: region.gdpGrowth,
        inflation: region.inflation,
        majorExchanges: region.majorExchanges.length,
      })),
      sectors: sectors.slice(0, 6).map((sector: any) => ({
        id: sector.id,
        name: sector.name,
        performanceYtd: sector.performanceYtd,
        peRatio: sector.peRatio,
      })),
      commodities: commodities.slice(0, 6).map((commodity: any) => ({
        id: commodity.id,
        name: commodity.name,
        spotPrice: commodity.spotPrice,
        changePercent24h: commodity.changePercent24h,
      })),
      news: [],
      timestamp: new Date(),
    },
  });
});

// Global Market Data
app.get("/api/global", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      stocks: {
        totalMarketCap: exchanges.reduce((sum: number, exchange: any) => sum + exchange.marketCap, 0),
        topIndices: exchanges.slice(0, 8).map((exchange: any) => exchange.mainIndex),
      },
      crypto: {
        totalMarketCap: cryptocurrencies.reduce(
          (sum: number, crypto: any) => sum + crypto.circulatingSupply * (crypto.symbol === "BTC" ? 65000 : crypto.symbol === "ETH" ? 3200 : 10),
          0
        ),
        btcDominance: 0,
        ethDominance: 0,
        fear_and_greed_index: 0,
      },
      fx: {
        majorPairs: ["EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF", "AUD/USD", "USD/INR"],
        volatility: 0,
      },
      regions: regions.length,
      sectors: sectors.length,
      commodities: {
        count: commodities.length,
        categories: [...new Set(commodities.map((commodity: any) => commodity.category))],
      },
      timestamp: new Date(),
    },
  });
});

// Search endpoint
app.get("/api/search", (req: Request, res: Response) => {
  const q = sanitizeShortText(req.query.q);
  const type = sanitizeShortText(req.query.type, 20);
  const query = q.toLowerCase();
  const matches = [
    ...exchanges.map((item: any) => ({ type: "exchange", id: item.id, title: item.name, meta: `${item.country} / ${item.currency}` })),
    ...currencies.map((item: any) => ({ type: "currency", id: item.code, title: item.name, meta: `${item.country} / ${item.centralBank}` })),
    ...cryptocurrencies.map((item: any) => ({ type: "crypto", id: item.id, title: item.name, meta: `${item.symbol} / ${item.category}` })),
    ...regions.map((item: any) => ({ type: "region", id: item.id, title: item.name, meta: (item.countries as any[]).join(", ") })),
    ...sectors.map((item: any) => ({ type: "sector", id: item.id, title: item.name, meta: `${item.category} / ${item.performanceYtd}% YTD` })),
    ...commodities.map((item: any) => ({ type: "commodity", id: item.id, title: item.name, meta: `${item.symbol} / ${item.category}` })),
  ].filter((item: any) => {
    if (type && item.type !== type) return false;
    if (!query) return true;
    return `${item.title} ${item.id} ${item.meta}`.toLowerCase().includes(query);
  });

  res.json({
    success: true,
    data: matches.slice(0, 25),
    timestamp: new Date(),
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      timestamp: new Date(),
    });
  }
);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    timestamp: new Date(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`MarketsPivot API Server running on http://localhost:${PORT}`);
});

export default app;
