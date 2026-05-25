import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import { parsePositiveInt } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  // GET /api/indices
  router.get("/", async (req: Request, res: Response) => {
    try {
      const { region, country } = req.query;
      let query = db("indices");
      if (region)  query = query.whereILike("region",  `%${region}%`);
      if (country) query = query.whereILike("country", `%${country}%`);

      const data = await query.select("*").orderBy("region").orderBy("name");
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch indices", timestamp: new Date() });
    }
  });

  // GET /api/indices/:symbol
  router.get("/:symbol", async (req: Request, res: Response) => {
    try {
      const index = await db("indices")
        .whereRaw("LOWER(symbol) = ?", [req.params.symbol.toLowerCase()])
        .first();
      if (!index)
        return res.status(404).json({ success: false, error: "Index not found", timestamp: new Date() });
      res.json({ success: true, data: index, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch index", timestamp: new Date() });
    }
  });

  // GET /api/indices/:symbol/chart
  router.get("/:symbol/chart", async (req: Request, res: Response) => {
    try {
      const timeframe = String(req.query.timeframe ?? "1M");
      const data = await db("chart_data")
        .where({ assetId: req.params.symbol, assetType: "index", timeframe })
        .orderBy("timestamp", "asc")
        .select("timestamp", "open", "high", "low", "close", "volume");
      res.json({ success: true, data: { symbol: req.params.symbol, timeframe, data }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch chart", timestamp: new Date() });
    }
  });

  return router;
}
