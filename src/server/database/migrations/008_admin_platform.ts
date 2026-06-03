import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("audit_logs", (table) => {
    table.increments("id").primary();
    table.integer("actorId").references("users.id").onDelete("SET NULL");
    table.string("actorEmail", 120);
    table.string("action", 80).notNullable();
    table.string("resource", 80).notNullable();
    table.string("resourceId", 64);
    table.jsonb("metadata");
    table.string("ipAddress", 45);
    table.string("userAgent", 255);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index(["resource", "created_at"]);
    table.index(["actorId", "created_at"]);
  });

  await knex.schema.createTable("login_history", (table) => {
    table.increments("id").primary();
    table.integer("userId").notNullable().references("users.id").onDelete("CASCADE");
    table.string("ipAddress", 45);
    table.string("userAgent", 255);
    table.boolean("success").defaultTo(true);
    table.string("failureReason", 120);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index(["userId", "created_at"]);
  });

  await knex.schema.createTable("subscription_plans", (table) => {
    table.increments("id").primary();
    table.string("slug", 60).notNullable().unique();
    table.string("name", 120).notNullable();
    table.text("description");
    table.decimal("priceMonthly", 10, 2).notNullable().defaultTo(0);
    table.decimal("priceYearly", 10, 2).notNullable().defaultTo(0);
    table.string("currency", 3).defaultTo("USD");
    table.jsonb("features").defaultTo("[]");
    table.boolean("isActive").defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("user_subscriptions", (table) => {
    table.increments("id").primary();
    table.integer("userId").notNullable().references("users.id").onDelete("CASCADE");
    table.integer("planId").notNullable().references("subscription_plans.id");
    table.enum("status", ["active", "trialing", "past_due", "canceled", "paused"]).defaultTo("active");
    table.timestamp("currentPeriodStart");
    table.timestamp("currentPeriodEnd");
    table.timestamp("canceledAt");
    table.timestamps(true, true);
    table.index(["userId", "status"]);
  });

  await knex.schema.createTable("api_keys", (table) => {
    table.increments("id").primary();
    table.integer("userId").references("users.id").onDelete("CASCADE");
    table.string("name", 120).notNullable();
    table.string("keyPrefix", 12).notNullable();
    table.string("keyHash", 128).notNullable();
    table.integer("rateLimit").defaultTo(1000);
    table.bigInteger("usageCount").defaultTo(0);
    table.timestamp("lastUsedAt");
    table.boolean("isActive").defaultTo(true);
    table.timestamp("expiresAt");
    table.timestamps(true, true);
    table.index(["keyPrefix"]);
  });

  await knex.schema.createTable("data_sync_jobs", (table) => {
    table.increments("id").primary();
    table.string("provider", 60).notNullable();
    table.string("entity", 60).notNullable();
    table.enum("status", ["idle", "running", "success", "failed"]).defaultTo("idle");
    table.integer("recordsProcessed").defaultTo(0);
    table.text("lastError");
    table.timestamp("startedAt");
    table.timestamp("finishedAt");
    table.timestamp("nextRunAt");
    table.timestamps(true, true);
    table.index(["entity", "status"]);
  });

  await knex.schema.createTable("seo_pages", (table) => {
    table.increments("id").primary();
    table.string("path", 255).notNullable().unique();
    table.string("metaTitle", 120);
    table.string("metaDescription", 320);
    table.string("canonicalUrl", 255);
    table.jsonb("schemaMarkup");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("ad_campaigns", (table) => {
    table.increments("id").primary();
    table.string("name", 120).notNullable();
    table.string("placement", 60).notNullable();
    table.string("imageUrl", 500);
    table.string("targetUrl", 500);
    table.boolean("isActive").defaultTo(true);
    table.integer("impressions").defaultTo(0);
    table.integer("clicks").defaultTo(0);
    table.timestamp("startsAt");
    table.timestamp("endsAt");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("ad_campaigns");
  await knex.schema.dropTableIfExists("seo_pages");
  await knex.schema.dropTableIfExists("data_sync_jobs");
  await knex.schema.dropTableIfExists("api_keys");
  await knex.schema.dropTableIfExists("user_subscriptions");
  await knex.schema.dropTableIfExists("subscription_plans");
  await knex.schema.dropTableIfExists("login_history");
  await knex.schema.dropTableIfExists("audit_logs");
}
