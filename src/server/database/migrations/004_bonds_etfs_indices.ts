import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  // ── BONDS & YIELDS ─────────────────────────────────────────────────────────
  await knex.schema.createTable("bonds_yields", (table) => {
    table.string("id").primary();
    table.string("country").notNullable();
    table.string("instrument").notNullable();
    table.string("curvePoint").notNullable();
    table.string("currency").notNullable();
    table.string("tenor").notNullable();
    table.decimal("yieldPercent",     8, 4).defaultTo(0);
    table.decimal("changePercentDay", 8, 4).defaultTo(0);
    table.decimal("ytdPercent",       8, 4).defaultTo(0);
    table.timestamps(true, true);
    table.index(["country", "tenor"]);
  });

  // ── ETFs ───────────────────────────────────────────────────────────────────
  await knex.schema.createTable("etfs", (table) => {
    table.increments("id").primary();
    table.string("symbol").notNullable().unique();
    table.string("name").notNullable();
    table.string("category").notNullable();
    table.string("region").defaultTo("Global");
    table.decimal("price",       12, 4).defaultTo(0);
    table.decimal("change1d",     8, 4).defaultTo(0);
    table.decimal("changeYtd",    8, 4).defaultTo(0);
    table.decimal("aum",         20, 2).defaultTo(0);       // assets under management
    table.decimal("expenseRatio", 8, 4).defaultTo(0);
    table.text("holdings");                                  // JSON array
    table.timestamps(true, true);
    table.index(["category", "region"]);
  });

  // ── INDICES ────────────────────────────────────────────────────────────────
  await knex.schema.createTable("indices", (table) => {
    table.string("symbol").primary();
    table.string("name").notNullable();
    table.string("country").notNullable();
    table.string("region").notNullable();
    table.string("exchangeId");                              // linked exchange
    table.decimal("value",      16, 4).defaultTo(0);
    table.decimal("change1d",    8, 4).defaultTo(0);
    table.decimal("changeYtd",   8, 4).defaultTo(0);
    table.decimal("marketCap",  20, 2).defaultTo(0);
    table.integer("components").defaultTo(0);               // kitne stocks
    table.timestamps(true, true);
    table.index(["region", "country"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("indices");
  await knex.schema.dropTableIfExists("etfs");
  await knex.schema.dropTableIfExists("bonds_yields");
}
