import { Router } from "express";
import type { Knex } from "knex";
import { requireStaff } from "../middleware/auth";
import { createDashboardRouter } from "./modules/dashboard";
import { createUsersRouter } from "./modules/users";
import { createMarketDataRouter } from "./modules/marketData";
import { createNewsRouter } from "./modules/news";
import { createBillingRouter } from "./modules/billing";
import { createPlatformRouter } from "./modules/platform";

/**
 * Enterprise admin API — versioned under /api/admin/v1
 * Legacy routes in routes/admin.ts re-export this router for backward compatibility.
 */
export function createAdminRouter(db: Knex) {
  const router = Router();
  router.use(requireStaff);

  router.use("/", createDashboardRouter(db));
  router.use("/users", createUsersRouter(db));
  router.use("/market", createMarketDataRouter(db));
  router.use("/news", createNewsRouter(db));
  router.use("/billing", createBillingRouter(db));
  router.use("/platform", createPlatformRouter(db));

  return router;
}
