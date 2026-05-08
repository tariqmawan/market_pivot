import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import exchangesRouter from "./routes/exchanges";
import currenciesRouter from "./routes/currencies";
import cryptocurrenciesRouter from "./routes/cryptocurrencies";
import { corsOptions, createRateLimiter, sanitizeShortText, securityHeaders } from "./security";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Dashboard/Overview Routes
app.get("/api/dashboard", (req, res) => {
  // TODO: Implement dashboard logic
  // - Get market overview across all asset classes
  // - Get user preferences
  // - Return personalized dashboard data
  res.json({
    success: true,
    data: {
      stocks: {
        topExchanges: [],
        gainers: [],
        losers: [],
      },
      currencies: {
        topPairs: [],
        gainers: [],
        losers: [],
      },
      crypto: {
        topCryptos: [],
        gainers: [],
        losers: [],
      },
      news: [],
      timestamp: new Date(),
    },
  });
});

// Global Market Data
app.get("/api/global", (req, res) => {
  // TODO: Implement global market stats
  // - Total market cap (stocks, crypto)
  // - Global indices
  // - Market sentiment
  res.json({
    success: true,
    data: {
      stocks: {
        totalMarketCap: 0,
        topIndices: [],
      },
      crypto: {
        totalMarketCap: 0,
        btcDominance: 0,
        ethDominance: 0,
        fear_and_greed_index: 0,
      },
      fx: {
        majorPairs: [],
        volatility: 0,
      },
      timestamp: new Date(),
    },
  });
});

// Search endpoint
app.get("/api/search", (req, res) => {
  const q = sanitizeShortText(req.query.q);
  const type = sanitizeShortText(req.query.type, 20);
  // TODO: Implement global search
  // - Search exchanges, currencies, cryptos
  // - Return matching results with type indicator
  res.json({
    success: true,
    data: [],
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
