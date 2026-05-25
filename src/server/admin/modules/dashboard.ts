import { Router } from "express";
import type { Knex } from "knex";
import { requirePermission } from "../../middleware/auth";
import { PERMISSIONS } from "../../lib/permissions";

export function createDashboardRouter(db: Knex) {
  const router = Router();

  router.get("/stats", requirePermission(PERMISSIONS.DASHBOARD_VIEW), async (_req, res) => {
    try {
      const [
        usersCount,
        activeUsers,
        exchangesCount,
        cryptosCount,
        currenciesCount,
        newsCount,
        eventsCount,
        regionsCount,
        sectorsCount,
        commoditiesCount,
        subsActive,
        syncRunning,
      ] = await Promise.all([
        db("users").count("id as count").first(),
        db("users").where({ isActive: true }).count("id as count").first(),
        db("exchanges").count("id as count").first(),
        db("cryptocurrencies").count("id as count").first(),
        db("currencies").count("code as count").first(),
        db("news").count("id as count").first(),
        db("economic_events").count("id as count").first(),
        db("market_regions").count("id as count").first(),
        db("stock_sectors").count("id as count").first(),
        db("commodities").count("id as count").first(),
        db("user_subscriptions").where({ status: "active" }).count("id as count").first().catch(() => ({ count: 0 })),
        db("data_sync_jobs").where({ status: "running" }).count("id as count").first().catch(() => ({ count: 0 })),
      ]);

      const plans = await db("subscription_plans").sum("priceMonthly as mrr").first().catch(() => ({ mrr: 0 }));

      res.json({
        success: true,
        data: {
          users: { total: Number(usersCount?.count ?? 0), active: Number(activeUsers?.count ?? 0) },
          subscriptions: { active: Number(subsActive?.count ?? 0) },
          revenue: { mrrEstimate: Number(plans?.mrr ?? 0) },
          market: {
            exchanges: Number(exchangesCount?.count ?? 0),
            cryptos: Number(cryptosCount?.count ?? 0),
            currencies: Number(currenciesCount?.count ?? 0),
            regions: Number(regionsCount?.count ?? 0),
            sectors: Number(sectorsCount?.count ?? 0),
            commodities: Number(commoditiesCount?.count ?? 0),
          },
          content: { news: Number(newsCount?.count ?? 0), events: Number(eventsCount?.count ?? 0) },
          sync: { running: Number(syncRunning?.count ?? 0) },
          apiUsage: { requestsToday: 0 },
          traffic: { pageviews24h: 0 },
        },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Stats fetch failed", timestamp: new Date() });
    }
  });

  router.get("/sync-jobs", requirePermission(PERMISSIONS.DASHBOARD_VIEW), async (_req, res) => {
    try {
      const jobs = await db("data_sync_jobs").orderBy("updated_at", "desc").limit(50).catch(() => []);
      res.json({ success: true, data: jobs, timestamp: new Date() });
    } catch {
      res.json({ success: true, data: [], timestamp: new Date() });
    }
  });

  router.get("/audit-logs", requirePermission(PERMISSIONS.AUDIT_VIEW), async (req, res) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 30);
      const [data, [{ count }]] = await Promise.all([
        db("audit_logs").orderBy("created_at", "desc").offset((page - 1) * limit).limit(limit),
        db("audit_logs").count("id as count"),
      ]);
      res.json({
        success: true,
        data,
        pagination: { page, limit, total: Number(count), pages: Math.ceil(Number(count) / limit) },
        timestamp: new Date(),
      });
    } catch {
      res.status(500).json({ success: false, error: "Audit logs unavailable", timestamp: new Date() });
    }
  });

  return router;
}
