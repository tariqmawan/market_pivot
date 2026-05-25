import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import { requireAuth } from "../middleware/auth";
import { sanitizeShortText } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  // Sab watchlist routes protected hain — login zaroori hai
  router.use(requireAuth);

  // GET /api/watchlist — user ki saari watchlists
  router.get("/", async (req: Request, res: Response) => {
    try {
      const lists = await db("watchlists")
        .where({ userId: req.user!.userId })
        .select("id", "name", "items", "created_at")
        .orderBy("created_at", "asc");

      // items JSON string se parse karo
      const data = lists.map((l: any) => ({
        ...l,
        items: JSON.parse(l.items ?? "[]"),
      }));

      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch watchlists", timestamp: new Date() });
    }
  });

  // POST /api/watchlist — nayi watchlist banao
  router.post("/", async (req: Request, res: Response) => {
    try {
      const name = sanitizeShortText(req.body?.name ?? "My Watchlist", 60);

      const [row] = await db("watchlists")
        .insert({ userId: req.user!.userId, name, items: JSON.stringify([]) })
        .returning("*");

      res.status(201).json({
        success: true,
        data: { ...row, items: [] },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to create watchlist", timestamp: new Date() });
    }
  });

  // POST /api/watchlist/:id/add — item add karo
  router.post("/:id/add", async (req: Request, res: Response) => {
    try {
      const { assetId, assetType, name } = req.body;

      if (!assetId || !assetType) {
        return res.status(400).json({
          success: false, error: "assetId aur assetType zaroori hain", timestamp: new Date(),
        });
      }

      // Watchlist is user ki hai?
      const list = await db("watchlists")
        .where({ id: req.params.id, userId: req.user!.userId })
        .first();

      if (!list) {
        return res.status(404).json({
          success: false, error: "Watchlist nahi mili", timestamp: new Date(),
        });
      }

      const items: any[] = JSON.parse(list.items ?? "[]");

      // Duplicate check
      const alreadyExists = items.some(
        (i: any) => i.assetId === assetId && i.assetType === assetType
      );
      if (alreadyExists) {
        return res.status(409).json({
          success: false, error: "Yeh item pehle se watchlist mein hai", timestamp: new Date(),
        });
      }

      items.push({ assetId, assetType, name: name ?? assetId, addedAt: new Date() });

      await db("watchlists")
        .where({ id: req.params.id })
        .update({ items: JSON.stringify(items), updated_at: new Date() });

      res.json({ success: true, data: { items }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to add item", timestamp: new Date() });
    }
  });

  // DELETE /api/watchlist/:id/remove/:assetId — item hatao
  router.delete("/:id/remove/:assetId", async (req: Request, res: Response) => {
    try {
      const list = await db("watchlists")
        .where({ id: req.params.id, userId: req.user!.userId })
        .first();

      if (!list) {
        return res.status(404).json({
          success: false, error: "Watchlist nahi mili", timestamp: new Date(),
        });
      }

      const items: any[] = JSON.parse(list.items ?? "[]");
      const filtered = items.filter((i: any) => i.assetId !== req.params.assetId);

      await db("watchlists")
        .where({ id: req.params.id })
        .update({ items: JSON.stringify(filtered), updated_at: new Date() });

      res.json({ success: true, data: { items: filtered }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to remove item", timestamp: new Date() });
    }
  });

  // DELETE /api/watchlist/:id — puri watchlist delete karo
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await db("watchlists")
        .where({ id: req.params.id, userId: req.user!.userId })
        .delete();

      if (!deleted) {
        return res.status(404).json({
          success: false, error: "Watchlist nahi mili", timestamp: new Date(),
        });
      }

      res.json({ success: true, data: { message: "Watchlist delete ho gayi" }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to delete watchlist", timestamp: new Date() });
    }
  });

  return router;
}
