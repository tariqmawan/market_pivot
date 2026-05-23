import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import type { Commodity, ApiResponse, PaginatedResponse } from "../../types";
import { parsePositiveInt } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  router.get("/", async (req: Request, res: Response<PaginatedResponse<Commodity>>) => {
    try {
      const { category } = req.query;
      const pageNumber   = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize     = parsePositiveInt(req.query.limit, 20);
      let query = db("commodities");
      if (category) query = query.where({ category: String(category) });
      const [data, [{ count }]] = await Promise.all([
        query.clone().select("*").offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("id as count"),
      ]);
      const total = Number(count);
      res.json({ success: true, data, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch commodities", timestamp: new Date() } as any);
    }
  });

  router.get("/:id", async (req: Request, res: Response<ApiResponse<Commodity>>) => {
    try {
      const id = req.params.id.toLowerCase();
      const commodity = await db("commodities").whereRaw("LOWER(id) = ? OR LOWER(symbol) = ?", [id, id]).first();
      if (!commodity) return res.status(404).json({ success: false, error: "Commodity not found", timestamp: new Date() });
      res.json({ success: true, data: commodity, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch commodity", timestamp: new Date() } as any);
    }
  });

  return router;
}
