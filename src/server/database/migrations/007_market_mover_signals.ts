import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("market_movers", (table) => {
    table.json("signals");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("market_movers", (table) => {
    table.dropColumn("signals");
  });
}
