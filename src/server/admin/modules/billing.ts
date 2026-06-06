import { Router } from "express";
import type { Knex } from "knex";
import { requirePermission } from "../../middleware/auth";
import { PERMISSIONS } from "../../lib/permissions";
import { writeAuditLog } from "../services/auditService";

export function createBillingRouter(db: Knex) {
  const router = Router();

  router.get("/plans", requirePermission(PERMISSIONS.BILLING_VIEW), async (_req, res) => {
    try {
      const plans = await db("subscription_plans").orderBy("priceMonthly", "asc");
      res.json({ success: true, data: plans, timestamp: new Date() });
    } catch {
      res.json({ success: true, data: [], timestamp: new Date() });
    }
  });

  router.post("/plans", requirePermission(PERMISSIONS.BILLING_EDIT), async (req, res) => {
    try {
      const [row] = await db("subscription_plans")
        .insert({
          slug: req.body.slug,
          name: req.body.name,
          description: req.body.description ?? "",
          priceMonthly: req.body.priceMonthly ?? 0,
          priceYearly: req.body.priceYearly ?? 0,
          features: JSON.stringify(req.body.features ?? []),
        })
        .returning("*");
      await writeAuditLog(db, req, "billing.plan_create", "subscription_plans", row.id);
      res.status(201).json({ success: true, data: row, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Plan create failed", timestamp: new Date() });
    }
  });

  router.put("/plans/:id", requirePermission(PERMISSIONS.BILLING_EDIT), async (req, res) => {
    try {
      const { id } = req.params;
      const [row] = await db("subscription_plans")
        .where({ id })
        .update({
          slug: req.body.slug,
          name: req.body.name,
          description: req.body.description ?? "",
          priceMonthly: req.body.priceMonthly ?? 0,
          priceYearly: req.body.priceYearly ?? 0,
          currency: req.body.currency ?? "USD",
          features: JSON.stringify(req.body.features ?? []),
          isActive: req.body.isActive ?? true,
          updated_at: db.fn.now(),
        })
        .returning("*");
      await writeAuditLog(db, req, "billing.plan_update", "subscription_plans", Number(id));
      res.json({ success: true, data: row, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Plan update failed", timestamp: new Date() });
    }
  });

  router.delete("/plans/:id", requirePermission(PERMISSIONS.BILLING_EDIT), async (req, res) => {
    try {
      const { id } = req.params;
      await db("subscription_plans").where({ id }).delete();
      await writeAuditLog(db, req, "billing.plan_delete", "subscription_plans", Number(id));
      res.json({ success: true, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Plan delete failed", timestamp: new Date() });
    }
  });

  router.get("/subscriptions", requirePermission(PERMISSIONS.BILLING_VIEW), async (req, res) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 20);
      const data = await db("user_subscriptions as s")
        .join("users as u", "s.userId", "u.id")
        .join("subscription_plans as p", "s.planId", "p.id")
        .select("s.*", "u.email", "u.name", "p.name as planName", "p.slug as planSlug")
        .orderBy("s.created_at", "desc")
        .offset((page - 1) * limit)
        .limit(limit);
      res.json({ success: true, data, timestamp: new Date() });
    } catch {
      res.json({ success: true, data: [], timestamp: new Date() });
    }
  });

  return router;
}
