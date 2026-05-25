import { Router } from "express";
import type { Knex } from "knex";
import { requirePermission } from "../../middleware/auth";
import { PERMISSIONS } from "../../lib/permissions";
import { writeAuditLog } from "../services/auditService";
import { parsePagination, paginationMeta } from "../services/pagination";
import { sanitizeShortText } from "../../security";

export function createNewsRouter(db: Knex) {
  const router = Router();

  router.get("/", requirePermission(PERMISSIONS.NEWS_VIEW), async (req, res) => {
    try {
      const { page, limit, offset } = parsePagination(req);
      const [data, [{ count }]] = await Promise.all([
        db("news").orderBy("publishedAt", "desc").offset(offset).limit(limit),
        db("news").count("id as count"),
      ]);
      res.json({
        success: true,
        data,
        pagination: paginationMeta(page, limit, Number(count)),
        timestamp: new Date(),
      });
    } catch {
      res.status(500).json({ success: false, error: "News fetch failed", timestamp: new Date() });
    }
  });

  router.post("/", requirePermission(PERMISSIONS.NEWS_EDIT), async (req, res) => {
    try {
      const title = sanitizeShortText(req.body.title, 200);
      const source = sanitizeShortText(req.body.source, 80);
      const url = sanitizeShortText(req.body.url, 500);
      const category = sanitizeShortText(req.body.category, 40);
      if (!title || !source || !url || !category) {
        return res.status(400).json({ success: false, error: "title, source, url, category required", timestamp: new Date() });
      }

      const [row] = await db("news")
        .insert({
          title,
          description: req.body.description ?? "",
          content: req.body.content ?? "",
          source,
          url,
          category,
          imageUrl: req.body.imageUrl ?? null,
          publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
          relevantAssets: JSON.stringify(req.body.relevantAssets ?? []),
        })
        .returning("*");

      await writeAuditLog(db, req, "news.create", "news", row.id);
      res.status(201).json({ success: true, data: row, timestamp: new Date() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "News create failed", timestamp: new Date() });
    }
  });

  router.put("/:id", requirePermission(PERMISSIONS.NEWS_EDIT), async (req, res) => {
    try {
      const allowed = ["title", "description", "content", "source", "url", "category", "imageUrl"];
      const updates: Record<string, unknown> = { updated_at: new Date() };
      for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
      }
      if (req.body.status === "draft") updates.publishedAt = null;
      if (req.body.status === "published" && !updates.publishedAt) updates.publishedAt = new Date();

      await db("news").where({ id: req.params.id }).update(updates);
      await writeAuditLog(db, req, "news.update", "news", req.params.id);
      res.json({ success: true, data: { message: "Updated" }, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Update failed", timestamp: new Date() });
    }
  });

  router.delete("/:id", requirePermission(PERMISSIONS.NEWS_EDIT), async (req, res) => {
    try {
      await db("news").where({ id: req.params.id }).delete();
      await writeAuditLog(db, req, "news.delete", "news", req.params.id);
      res.json({ success: true, data: { message: "Deleted" }, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Delete failed", timestamp: new Date() });
    }
  });

  return router;
}
