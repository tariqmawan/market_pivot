import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import type { StockExchange, ApiResponse, PaginatedResponse } from "../../types";
import { parsePositiveInt } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  // GET /api/exchanges
  router.get("/", async (req: Request, res: Response<PaginatedResponse<StockExchange>>) => {
    try {
      const { region, country } = req.query;
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 10);

      let query = db("exchanges");
      if (region)  query = query.where({ region: String(region) });
      if (country) query = query.where({ country: String(country) });

      const [data, [{ count }]] = await Promise.all([
        query.clone().select("*").offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("id as count"),
      ]);
      const total = Number(count);

      res.json({
        success: true,
        data,
        pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch exchanges", timestamp: new Date() } as any);
    }
  });

  // GET /api/exchanges/:id
  router.get("/:id", async (req: Request, res: Response<ApiResponse<StockExchange>>) => {
    try {
      const exchange = await db("exchanges").where({ id: req.params.id }).first();
      if (!exchange)
        return res.status(404).json({ success: false, error: "Exchange not found", timestamp: new Date() });

      res.json({ success: true, data: exchange, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch exchange", timestamp: new Date() } as any);
    }
  });

  // GET /api/exchanges/:id/summary
  router.get("/:id/summary", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const [index, gainers, losers, mostActive, sectors] = await Promise.all([
        db("index_snapshots").where({ exchangeId: id }).orderBy("timestamp", "desc").first(),
        db("market_movers").where({ exchangeId: id, type: "gainer" }).orderBy("percentChange", "desc").limit(5),
        db("market_movers").where({ exchangeId: id, type: "loser"  }).orderBy("percentChange", "asc" ).limit(5),
        db("market_movers").where({ exchangeId: id, type: "active" }).orderBy("volume", "desc").limit(5),
        db("sector_performance").where({ exchangeId: id }).orderBy("timestamp", "desc").limit(10),
      ]);

      res.json({
        success: true,
        data: {
          index: index ?? {},
          gainers,
          losers,
          mostActive,
          sectors,
          breadth: {
            advancers: index?.advancers ?? 0,
            decliners: index?.decliners ?? 0,
            unchanged: 0,
          },
        },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch market summary", timestamp: new Date() });
    }
  });

  // GET /api/exchanges/:id/top-movers
  router.get("/:id/top-movers", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const type  = String(req.query.type  ?? "gainer");
      const limit = parsePositiveInt(req.query.limit, 20);

      const data = await db("market_movers")
        .where({ exchangeId: id, type })
        .orderBy(type === "active" ? "volume" : "percentChange", type === "loser" ? "asc" : "desc")
        .limit(limit);

      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch top movers", timestamp: new Date() });
    }
  });

  // GET /api/exchanges/:id/chart
  router.get("/:id/chart", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const timeframe = String(req.query.timeframe ?? "24H");

      const data = await db("chart_data")
        .where({ assetId: id, assetType: "exchange", timeframe })
        .orderBy("timestamp", "asc")
        .select("timestamp", "open", "high", "low", "close", "volume");

      res.json({ success: true, data: { assetId: id, timeframe, data }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch chart data", timestamp: new Date() });
    }
  });

  // GET /api/exchanges/:id/sectors
  router.get("/:id/sectors", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const data = await db("sector_performance")
        .where({ exchangeId: id })
        .orderBy("timestamp", "desc")
        .select("sectorName", "performance", "companies", "marketCap")
        .limit(20);

      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch sector data", timestamp: new Date() });
    }
  });

  // GET /api/exchanges/:id/news
  router.get("/:id/news", async (req: Request, res: Response) => {
    try {
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 20);

      const [data, [{ count }]] = await Promise.all([
        db("news").orderBy("publishedAt", "desc")
          .offset((pageNumber - 1) * pageSize).limit(pageSize),
        db("news").count("id as count"),
      ]);
      const total = Number(count);

      res.json({
        success: true,
        data,
        pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch news", timestamp: new Date() });
    }
  });

  // GET /api/exchanges/:id/companies  (table baad mein banaenge — abhi empty)
  router.get("/:id/companies", async (req: Request, res: Response) => {
    const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
    const pageSize   = parsePositiveInt(req.query.limit, 20);
    res.json({
      success: true,
      data: [],
      pagination: { page: pageNumber, limit: pageSize, total: 0, pages: 0 },
      timestamp: new Date(),
    });
  });

  // GET /api/exchanges/compare/multiple
  router.get("/compare/multiple", async (req: Request, res: Response) => {
    try {
      const ids = (Array.isArray(req.query.ids) ? req.query.ids : [req.query.ids]).filter(Boolean) as string[];
      const data = await db("exchanges").whereIn("id", ids).select("*");
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to compare exchanges", timestamp: new Date() });
    }
  });

  return router;
}
