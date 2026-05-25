import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import { parsePositiveInt } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  // GET /api/bonds
  router.get("/", async (req: Request, res: Response) => {
    try {
      const { country, tenor } = req.query;
      let query = db("bonds_yields");
      if (country) query = query.whereILike("country", `%${country}%`);
      if (tenor)   query = query.where({ tenor: String(tenor) });

      const data = await query.select("*").orderBy("country");
      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch bonds", timestamp: new Date() });
    }
  });

  // GET /api/bonds/:id
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const bond = await db("bonds_yields")
        .whereRaw("LOWER(id) = ?", [req.params.id.toLowerCase()])
        .first();
      if (!bond)
        return res.status(404).json({ success: false, error: "Bond not found", timestamp: new Date() });
      res.json({ success: true, data: bond, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch bond", timestamp: new Date() });
    }
  });

  return router;
}
