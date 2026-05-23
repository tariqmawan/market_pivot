import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import type { Currency, ApiResponse, PaginatedResponse } from "../../types";
import { parsePositiveInt, sanitizeShortText } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  // GET /api/currencies
  router.get("/", async (req: Request, res: Response<PaginatedResponse<Currency>>) => {
    try {
      const { region } = req.query;
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 20);

      let query = db("currencies");
      if (region) query = query.where({ region: String(region) });

      const [data, [{ count }]] = await Promise.all([
        query.clone().select("*").offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("code as count"),
      ]);
      const total = Number(count);

      res.json({
        success: true, data,
        pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch currencies", timestamp: new Date() } as any);
    }
  });

  // GET /api/currencies/pairs/top-traded  (specific route pehle — /:code se conflict na ho)
  router.get("/pairs/top-traded", async (req: Request, res: Response) => {
    try {
      const limit = parsePositiveInt(req.query.limit, 20);
      const data = await db("currency_pairs").orderBy("lastUpdated", "desc").limit(limit);
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch top pairs", timestamp: new Date() });
    }
  });

  // GET /api/currencies/:code
  router.get("/:code", async (req: Request, res: Response<ApiResponse<Currency>>) => {
    try {
      const currency = await db("currencies")
        .whereRaw("LOWER(code) = ?", [req.params.code.toLowerCase()])
        .first();
      if (!currency)
        return res.status(404).json({ success: false, error: "Currency not found", timestamp: new Date() });
      res.json({ success: true, data: currency, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch currency", timestamp: new Date() } as any);
    }
  });

  // GET /api/currencies/:code/rates
  router.get("/:code/rates", async (req: Request, res: Response) => {
    try {
      const code = req.params.code.toUpperCase();
      const rates = await db("exchange_rates")
        .where({ fromCode: code })
        .orderBy("timestamp", "desc")
        .select("toCode", "rate", "bid", "ask", "spread", "timestamp")
        .limit(20);
      res.json({ success: true, data: { baseCurrency: code, rates }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch exchange rates", timestamp: new Date() });
    }
  });

  // GET /api/currencies/:from/:to
  router.get("/:from/:to", async (req: Request, res: Response) => {
    try {
      const from = req.params.from.toUpperCase();
      const to   = req.params.to.toUpperCase();
      const row  = await db("exchange_rates")
        .where({ fromCode: from, toCode: to })
        .orderBy("timestamp", "desc")
        .first();

      res.json({
        success: true,
        data: { from, to, rate: row?.rate ?? 0, bid: row?.bid ?? 0, ask: row?.ask ?? 0, spread: row?.spread ?? 0, timestamp: row?.timestamp ?? new Date() },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch exchange rate", timestamp: new Date() });
    }
  });

  // POST /api/currencies/convert/amount
  router.post("/convert/amount", async (req: Request, res: Response) => {
    try {
      const fromCode = sanitizeShortText(req.body?.fromCode, 10).toUpperCase();
      const toCode   = sanitizeShortText(req.body?.toCode,   10).toUpperCase();
      const amount   = Number(req.body?.amount);

      if (!fromCode || !toCode || !Number.isFinite(amount) || amount < 0)
        return res.status(400).json({ success: false, error: "Invalid conversion request", timestamp: new Date() });

      const row = await db("exchange_rates")
        .where({ fromCode, toCode })
        .orderBy("timestamp", "desc")
        .first();

      const rate     = row?.rate ?? 0;
      const toAmount = rate ? amount * rate : 0;

      res.json({ success: true, data: { fromCode, fromAmount: amount, toCode, toAmount, rate }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to convert currency", timestamp: new Date() });
    }
  });

  // GET /api/currencies/:code/chart
  router.get("/:code/chart", async (req: Request, res: Response) => {
    try {
      const code      = req.params.code.toUpperCase();
      const against   = String(req.query.against  ?? "USD").toUpperCase();
      const timeframe = String(req.query.timeframe ?? "1M");

      // chart_data mein currency pair ka data store hoga — assetId = "EUR_USD" format
      const data = await db("chart_data")
        .where({ assetId: `${code}_${against}`, assetType: "currency", timeframe })
        .orderBy("timestamp", "asc")
        .select("timestamp", "open", "high", "low", "close", "volume");

      res.json({ success: true, data: { pair: `${code}/${against}`, timeframe, data }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch chart data", timestamp: new Date() });
    }
  });

  // GET /api/currencies/:code/pairs
  router.get("/:code/pairs", async (req: Request, res: Response) => {
    try {
      const code  = req.params.code.toUpperCase();
      const limit = parsePositiveInt(req.query.limit, 10);
      const data  = await db("currency_pairs")
        .where({ baseCurrency: code }).orWhere({ quoteCurrency: code })
        .orderBy("lastUpdated", "desc")
        .limit(limit);
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch currency pairs", timestamp: new Date() });
    }
  });

  // GET /api/currencies/:code/news
  router.get("/:code/news", async (req: Request, res: Response) => {
    try {
      const pageNumber = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 20);
      const [data, [{ count }]] = await Promise.all([
        db("news").whereIn("category", ["economic", "regulatory"])
          .orderBy("publishedAt", "desc")
          .offset((pageNumber - 1) * pageSize).limit(pageSize),
        db("news").whereIn("category", ["economic", "regulatory"]).count("id as count"),
      ]);
      const total = Number(count);
      res.json({ success: true, data, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch news", timestamp: new Date() });
    }
  });

  // GET /api/currencies/:code/economic-data
  router.get("/:code/economic-data", async (req: Request, res: Response) => {
    try {
      const code     = req.params.code.toUpperCase();
      const currency = await db("currencies").whereRaw("LOWER(code) = ?", [code.toLowerCase()]).first();
      if (!currency)
        return res.status(404).json({ success: false, error: "Currency not found", timestamp: new Date() });

      // JSON columns stored as text — parse karo
      res.json({
        success: true,
        data: {
          currency: code,
          interestRate:  currency.interestRate  ?? 0,
          inflationRate: currency.inflationRate ?? 0,
          gdpGrowth:     currency.gdpGrowth     ?? 0,
          lastUpdated:   currency.updated_at    ?? new Date(),
        },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch economic data", timestamp: new Date() });
    }
  });

  // GET /api/currencies/:code/linked-markets
  router.get("/:code/linked-markets", async (req: Request, res: Response) => {
    try {
      const code      = req.params.code.toUpperCase();
      const exchanges = await db("exchanges").where({ currency: code }).select("id", "name", "country");
      const pairs     = await db("trading_pairs").where({ quoteAsset: code }).select("pair", "baseAsset", "price", "volume24h").limit(10);
      res.json({ success: true, data: { exchanges, cryptoPairs: pairs }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch linked markets", timestamp: new Date() });
    }
  });

  return router;
}
