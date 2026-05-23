import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import { parsePositiveInt, sanitizeShortText } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const pageNumber   = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize     = parsePositiveInt(req.query.limit, 20);
      let query = db("news");
      if (category) query = query.where({ category: String(category) });
      const [data, [{ count }]] = await Promise.all([
        query.clone().orderBy("publishedAt", "desc").offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("id as count"),
      ]);
      const total = Number(count);
      res.json({ success: true, data, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch news", timestamp: new Date() });
    }
  });

  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const article = await db("news").where({ id: req.params.id }).first();
      if (!article) return res.status(404).json({ success: false, error: "Article not found", timestamp: new Date() });
      res.json({ success: true, data: article, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch article", timestamp: new Date() });
    }
  });

  return router;
}
