import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import type { MarketRegion, ApiResponse, PaginatedResponse } from "../../types";
import { parsePositiveInt } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  router.get("/", async (req: Request, res: Response<PaginatedResponse<MarketRegion>>) => {
    try {
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 20);
      const [data, [{ count }]] = await Promise.all([
        db("market_regions").select("*").offset((pageNumber - 1) * pageSize).limit(pageSize),
        db("market_regions").count("id as count"),
      ]);
      const total = Number(count);
      res.json({ success: true, data, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch regions", timestamp: new Date() } as any);
    }
  });

  router.get("/:id", async (req: Request, res: Response<ApiResponse<MarketRegion>>) => {
    try {
      const region = await db("market_regions").whereRaw("LOWER(id) = ?", [req.params.id.toLowerCase()]).first();
      if (!region) return res.status(404).json({ success: false, error: "Region not found", timestamp: new Date() });
      res.json({ success: true, data: region, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch region", timestamp: new Date() } as any);
    }
  });

  return router;
}
