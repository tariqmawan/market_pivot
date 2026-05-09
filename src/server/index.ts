import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import commoditiesData from "../data/commodities.json";
import cryptoData from "../data/cryptocurrencies.json";
import currenciesData from "../data/currencies.json";
import exchangesData from "../data/exchanges.json";
import regionsData from "../data/regions.json";
import sectorsData from "../data/sectors.json";
import commoditiesRouter from "./routes/commodities";
import exchangesRouter from "./routes/exchanges";
import currenciesRouter from "./routes/currencies";
import cryptocurrenciesRouter from "./routes/cryptocurrencies";
import regionsRouter from "./routes/regions";
import sectorsRouter from "./routes/sectors";
import { corsOptions, createRateLimiter, sanitizeShortText, securityHeaders } from "./security";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const exchanges = exchangesData.exchanges;
const currencies = currenciesData.currencies;
const cryptocurrencies = cryptoData.cryptocurrencies;
const regions = regionsData.regions;
const sectors = sectorsData.sectors;
const commodities = commoditiesData.commodities;

// Middleware
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(createRateLimiter());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// API Routes
app.use("/api/exchanges", exchangesRouter);
app.use("/api/currencies", currenciesRouter);
app.use("/api/cryptos", cryptocurrenciesRouter);
app.use("/api/regions", regionsRouter);
app.use("/api/sectors", sectorsRouter);
app.use("/api/commodities", commoditiesRouter);

// Dashboard/Overview Routes
app.get("/api/dashboard", (req, res) => {
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
      regions: regions.map((region) => ({
        id: region.id,
        name: region.name,
        gdpGrowth: region.gdpGrowth,
        inflation: region.inflation,
        majorExchanges: region.majorExchanges.length,
      })),
      sectors: sectors.slice(0, 6).map((sector) => ({
        id: sector.id,
        name: sector.name,
        performanceYtd: sector.performanceYtd,
        peRatio: sector.peRatio,
      })),
      commodities: commodities.slice(0, 6).map((commodity) => ({
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
app.get("/api/global", (req, res) => {
  res.json({
    success: true,
    data: {
      stocks: {
        totalMarketCap: exchanges.reduce((sum, exchange) => sum + exchange.marketCap, 0),
        topIndices: exchanges.slice(0, 8).map((exchange) => exchange.mainIndex),
      },
      crypto: {
        totalMarketCap: cryptocurrencies.reduce(
          (sum, crypto) => sum + crypto.circulatingSupply * (crypto.symbol === "BTC" ? 65000 : crypto.symbol === "ETH" ? 3200 : 10),
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
        categories: [...new Set(commodities.map((commodity) => commodity.category))],
      },
      timestamp: new Date(),
    },
  });
});

// Search endpoint
app.get("/api/search", (req, res) => {
  const q = sanitizeShortText(req.query.q);
  const type = sanitizeShortText(req.query.type, 20);
  const query = q.toLowerCase();
  const matches = [
    ...exchanges.map((item) => ({ type: "exchange", id: item.id, title: item.name, meta: `${item.country} / ${item.currency}` })),
    ...currencies.map((item) => ({ type: "currency", id: item.code, title: item.name, meta: `${item.country} / ${item.centralBank}` })),
    ...cryptocurrencies.map((item) => ({ type: "crypto", id: item.id, title: item.name, meta: `${item.symbol} / ${item.category}` })),
    ...regions.map((item) => ({ type: "region", id: item.id, title: item.name, meta: item.countries.join(", ") })),
    ...sectors.map((item) => ({ type: "sector", id: item.id, title: item.name, meta: `${item.category} / ${item.performanceYtd}% YTD` })),
    ...commodities.map((item) => ({ type: "commodity", id: item.id, title: item.name, meta: `${item.symbol} / ${item.category}` })),
  ].filter((item) => {
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
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
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
app.use((req, res) => {
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
