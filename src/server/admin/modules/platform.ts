import { Router } from "express";
import type { Knex } from "knex";
import crypto from "crypto";
import { requirePermission } from "../../middleware/auth";
import { PERMISSIONS } from "../../lib/permissions";
import { getPermissionsForRole } from "../../lib/permissions";
import { writeAuditLog } from "../services/auditService";

export function createPlatformRouter(db: Knex) {
  const router = Router();

  router.get("/permissions", async (req, res) => {
    res.json({
      success: true,
      data: { role: req.user!.role, permissions: getPermissionsForRole(req.user!.role) },
      timestamp: new Date(),
    });
  });

  router.get("/api-keys", requirePermission(PERMISSIONS.API_VIEW), async (_req, res) => {
    try {
      const keys = await db("api_keys")
        .select("id", "name", "keyPrefix", "rateLimit", "usageCount", "lastUsedAt", "isActive", "expiresAt", "created_at")
        .orderBy("created_at", "desc");
      res.json({ success: true, data: keys, timestamp: new Date() });
    } catch {
      res.json({ success: true, data: [], timestamp: new Date() });
    }
  });

  router.post("/api-keys", requirePermission(PERMISSIONS.API_EDIT), async (req, res) => {
    try {
      const name = String(req.body.name ?? "API Key").slice(0, 120);
      const rawKey = `mp_${crypto.randomBytes(24).toString("hex")}`;
      const keyPrefix = rawKey.slice(0, 12);
      const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

      const [row] = await db("api_keys")
        .insert({
          userId: req.user!.userId,
          name,
          keyPrefix,
          keyHash,
          rateLimit: Number(req.body.rateLimit) || 1000,
        })
        .returning("id", "name", "keyPrefix", "rateLimit", "created_at");

      await writeAuditLog(db, req, "api_key.create", "api_keys", row.id);

      res.status(201).json({
        success: true,
        data: { ...row, key: rawKey },
        timestamp: new Date(),
      });
    } catch {
      res.status(500).json({ success: false, error: "API key create failed", timestamp: new Date() });
    }
  });

  router.get("/seo", requirePermission(PERMISSIONS.SEO_EDIT), async (_req, res) => {
    try {
      const pages = await db("seo_pages").orderBy("path");
      res.json({ success: true, data: pages, timestamp: new Date() });
    } catch {
      res.json({ success: true, data: [], timestamp: new Date() });
    }
  });

  router.put("/seo/:id", requirePermission(PERMISSIONS.SEO_EDIT), async (req, res) => {
    try {
      await db("seo_pages").where({ id: req.params.id }).update({
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        canonicalUrl: req.body.canonicalUrl,
        updated_at: new Date(),
      });
      res.json({ success: true, data: { message: "SEO updated" }, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "SEO update failed", timestamp: new Date() });
    }
  });

  router.get("/ads", requirePermission(PERMISSIONS.ADS_EDIT), async (_req, res) => {
    try {
      const campaigns = await db("ad_campaigns").orderBy("created_at", "desc");
      res.json({ success: true, data: campaigns, timestamp: new Date() });
    } catch {
      res.json({ success: true, data: [], timestamp: new Date() });
    }
  });

  return router;
}
