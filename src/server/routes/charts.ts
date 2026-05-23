import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";

export function createRouter(db: Knex) {
  const router = Router();

  // Universal chart endpoint — koi bhi asset
  router.get("/:assetType/:assetId", async (req: Request, res: Response) => {
    try {
      const { assetType, assetId } = req.params;
      const timeframe = String(req.query.timeframe ?? "24H");
      const data = await db("chart_data")
        .where({ assetId, assetType, timeframe })
        .orderBy("timestamp", "asc")
        .select("timestamp", "open", "high", "low", "close", "volume");
      res.json({ success: true, data: { assetId, assetType, timeframe, data }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch chart data", timestamp: new Date() });
    }
  });

  return router;
}
