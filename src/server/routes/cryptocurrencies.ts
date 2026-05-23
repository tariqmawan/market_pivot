import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import type { Cryptocurrency, ApiResponse, PaginatedResponse } from "../../types";
import { parsePositiveInt } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  // GET /api/cryptos
  router.get("/", async (req: Request, res: Response<PaginatedResponse<Cryptocurrency>>) => {
    try {
      const { category } = req.query;
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 20);

      let query = db("cryptocurrencies");
      if (category) query = query.where({ category: String(category) });

      const [data, [{ count }]] = await Promise.all([
        query.clone().select("*").offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("id as count"),
      ]);
      const total = Number(count);

      res.json({ success: true, data, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch cryptocurrencies", timestamp: new Date() } as any);
    }
  });

  // Specific routes pehle (/:id se pehle)
  router.get("/market/overview", async (req: Request, res: Response) => {
    try {
      const [gainers, losers, trending] = await Promise.all([
        db("crypto_prices").orderBy("changePercent24h", "desc").limit(5),
        db("crypto_prices").orderBy("changePercent24h", "asc" ).limit(5),
        db("crypto_prices").orderBy("volume24h",        "desc").limit(5),
      ]);
      const [{ totalMarketCap }] = await db("crypto_prices").sum("marketCap as totalMarketCap");

      res.json({ success: true, data: { gainers, losers, trending, marketStats: { totalMarketCap: Number(totalMarketCap ?? 0), btcDominance: 0, fear_and_greed_index: 0 } }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch market overview", timestamp: new Date() });
    }
  });

  router.get("/market/top-gainers", async (req: Request, res: Response) => {
    try {
      const limit = parsePositiveInt(req.query.limit, 20);
      const data  = await db("crypto_prices").orderBy("changePercent24h", "desc").limit(limit);
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch top gainers", timestamp: new Date() });
    }
  });

  router.get("/market/top-losers", async (req: Request, res: Response) => {
    try {
      const limit = parsePositiveInt(req.query.limit, 20);
      const data  = await db("crypto_prices").orderBy("changePercent24h", "asc").limit(limit);
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch top losers", timestamp: new Date() });
    }
  });

  router.get("/category/:category", async (req: Request, res: Response) => {
    try {
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 20);
      const query = db("cryptocurrencies").where({ category: req.params.category });

      const [data, [{ count }]] = await Promise.all([
        query.clone().offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("id as count"),
      ]);
      res.json({ success: true, data, pagination: { page: pageNumber, limit: pageSize, total: Number(count), pages: Math.ceil(Number(count) / pageSize) }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch cryptos by category", timestamp: new Date() });
    }
  });

  // GET /api/cryptos/:id
  router.get("/:id", async (req: Request, res: Response<ApiResponse<Cryptocurrency>>) => {
    try {
      const id = req.params.id.toLowerCase();
      const crypto = await db("cryptocurrencies")
        .whereRaw("LOWER(id) = ? OR LOWER(symbol) = ?", [id, id])
        .first();
      if (!crypto)
        return res.status(404).json({ success: false, error: "Cryptocurrency not found", timestamp: new Date() });
      res.json({ success: true, data: crypto, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch cryptocurrency", timestamp: new Date() } as any);
    }
  });

  // GET /api/cryptos/:id/price
  router.get("/:id/price", async (req: Request, res: Response) => {
    try {
      const data = await db("crypto_prices")
        .where({ cryptoId: req.params.id })
        .orderBy("timestamp", "desc")
        .first();
      if (!data)
        return res.status(404).json({ success: false, error: "Price data not found", timestamp: new Date() });
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch price", timestamp: new Date() });
    }
  });

  // GET /api/cryptos/:id/chart
  router.get("/:id/chart", async (req: Request, res: Response) => {
    try {
      const timeframe = String(req.query.timeframe ?? "7D");
      const data = await db("chart_data")
        .where({ assetId: req.params.id, assetType: "crypto", timeframe })
        .orderBy("timestamp", "asc")
        .select("timestamp", "open", "high", "low", "close", "volume");
      res.json({ success: true, data: { id: req.params.id, timeframe, data }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch chart data", timestamp: new Date() });
    }
  });

  // GET /api/cryptos/:id/pairs
  router.get("/:id/pairs", async (req: Request, res: Response) => {
    try {
      const limit = parsePositiveInt(req.query.limit, 20);
      const data  = await db("trading_pairs")
        .where({ baseAsset: req.params.id.toUpperCase() })
        .orderBy("volume24h", "desc")
        .limit(limit);
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch trading pairs", timestamp: new Date() });
    }
  });

  // GET /api/cryptos/:id/news
  router.get("/:id/news", async (req: Request, res: Response) => {
    try {
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 20);
      const id         = req.params.id.toLowerCase();

      // relevantAssets JSON column mein crypto id check karo
      const [data, [{ count }]] = await Promise.all([
        db("news").whereRaw("LOWER(relevantAssets) LIKE ?", [`%${id}%`])
          .orderBy("publishedAt", "desc").offset((pageNumber - 1) * pageSize).limit(pageSize),
        db("news").whereRaw("LOWER(relevantAssets) LIKE ?", [`%${id}%`]).count("id as count"),
      ]);
      res.json({ success: true, data, pagination: { page: pageNumber, limit: pageSize, total: Number(count), pages: Math.ceil(Number(count) / pageSize) }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch news", timestamp: new Date() });
    }
  });

  // GET /api/cryptos/:id/on-chain  (live data ke liye placeholder)
  router.get("/:id/on-chain", async (req: Request, res: Response) => {
    const { id } = req.params;
    res.json({ success: true, data: { id, transactionsPerDay: 0, activeAddresses: 0, networkFees: 0, note: "Live API integration pending" }, timestamp: new Date() });
  });

  // GET /api/cryptos/:id/exchanges
  router.get("/:id/exchanges", async (req: Request, res: Response) => {
    try {
      const limit = parsePositiveInt(req.query.limit, 20);
      const data  = await db("trading_pairs")
        .where({ baseAsset: req.params.id.toUpperCase() })
        .select("exchange", db.raw("SUM(volume24h) as totalVolume"))
        .groupBy("exchange")
        .orderBy("totalVolume", "desc")
        .limit(limit);
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch exchanges", timestamp: new Date() });
    }
  });

  return router;
}
