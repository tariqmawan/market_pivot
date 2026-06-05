import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  // ── USERS ──────────────────────────────────────────────────────────────────
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();            // bcrypt hash
    table.string("name").notNullable();
    table.enum("role", ["user", "admin", "editor", "analyst"]).defaultTo("user");
    table.boolean("isActive").defaultTo(true);
    table.boolean("isEmailVerified").defaultTo(false);
    table.timestamp("lastLoginAt");
    table.timestamps(true, true);
    table.index("email");
  });

  // ── REFRESH TOKENS ─────────────────────────────────────────────────────────
  await knex.schema.createTable("refresh_tokens", (table) => {
    table.increments("id").primary();
    table.integer("userId").notNullable();
    table.string("token", 500).notNullable().unique();
    table.timestamp("expiresAt").notNullable();
    table.boolean("isRevoked").defaultTo(false);
    table.string("userAgent");                         // browser info
    table.string("ipAddress");
    table.timestamps(true, true);
    table.foreign("userId").references("users.id").onDelete("CASCADE");
    table.index(["userId", "isRevoked"]);
  });

  // ── WATCHLISTS ─────────────────────────────────────────────────────────────
  await knex.schema.createTable("watchlists", (table) => {
    table.increments("id").primary();
    table.integer("userId").notNullable();
    table.string("name").notNullable().defaultTo("My Watchlist");
    table.text("items");                               // JSON array of asset ids
    table.timestamps(true, true);
    table.foreign("userId").references("users.id").onDelete("CASCADE");
    table.index("userId");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("watchlists");
  await knex.schema.dropTableIfExists("refresh_tokens");
  await knex.schema.dropTableIfExists("users");
}
