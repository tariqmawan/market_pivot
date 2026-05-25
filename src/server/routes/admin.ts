import type { Knex } from "knex";
import { createAdminRouter } from "../admin";

/** @deprecated Import createAdminRouter from ../admin — kept for index.ts compatibility */
export function createRouter(db: Knex) {
  return createAdminRouter(db);
}
