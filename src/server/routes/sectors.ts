import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import type { StockSector, ApiResponse, PaginatedResponse } from "../../types";
import { parsePositiveInt } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  router.get("/", async (req: Request, res: Response<PaginatedResponse<StockSector>>) => {
    try {
      const { category } = req.query;
      const pageNumber   = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize     = parsePositiveInt(req.query.limit, 20);
      let query = db("stock_sectors");
      if (category) query = query.where({ category: String(category) });
      const [data, [{ count }]] = await Promise.all([
        query.clone().select("*").offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("id as count"),
      ]);
      const total = Number(count);
      res.json({ success: true, data, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch sectors", timestamp: new Date() } as any);
    }
  });

  router.get("/:id", async (req: Request, res: Response<ApiResponse<StockSector>>) => {
    try {
      const sector = await db("stock_sectors").whereRaw("LOWER(id) = ?", [req.params.id.toLowerCase()]).first();
      if (!sector) return res.status(404).json({ success: false, error: "Sector not found", timestamp: new Date() });
      res.json({ success: true, data: sector, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch sector", timestamp: new Date() } as any);
    }
  });

  return router;
}
