import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  // ── ECONOMIC EVENTS ────────────────────────────────────────────────────────
  await knex.schema.createTable("economic_events", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("country").notNullable();
    table.string("countryCode").defaultTo("");
    table.enum("impact", ["High", "Medium", "Low"]).notNullable().defaultTo("Medium");
    table.timestamp("eventDate").notNullable();
    table.string("time").defaultTo("");
    table.string("forecast").defaultTo("");
    table.string("previous").defaultTo("");
    table.string("actual").defaultTo("");
    table.string("category").defaultTo("general");    // CPI, GDP, Rate, Employment...
    table.boolean("isRecurring").defaultTo(false);
    table.timestamps(true, true);
    table.index(["eventDate", "country"]);
    table.index(["impact", "eventDate"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("economic_events");
}
