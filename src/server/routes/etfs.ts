import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import { parsePositiveInt } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  // GET /api/etfs
  router.get("/", async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const pageNumber = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 40);

      let query = db("etfs");
      if (category) query = query.whereILike("category", `%${category}%`);

      const [data, [{ count }]] = await Promise.all([
        query.clone().select("*").offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("symbol as count"),
      ]);
      const total = Number(count);

      res.json({
        success: true, data,
        pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch ETFs", timestamp: new Date() });
    }
  });

  // GET /api/etfs/:symbol
  router.get("/:symbol", async (req: Request, res: Response) => {
    try {
      const etf = await db("etfs")
        .whereRaw("LOWER(symbol) = ?", [req.params.symbol.toLowerCase()])
        .first();
      if (!etf)
        return res.status(404).json({ success: false, error: "ETF not found", timestamp: new Date() });
      res.json({ success: true, data: etf, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch ETF", timestamp: new Date() });
    }
  });

  return router;
}
