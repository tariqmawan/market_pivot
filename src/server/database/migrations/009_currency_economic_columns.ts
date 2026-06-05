import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("currencies", (table) => {
    table.decimal("interestRate",  8, 4).nullable();
    table.decimal("inflationRate", 8, 4).nullable();
    table.decimal("gdpGrowth",     8, 4).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("currencies", (table) => {
    table.dropColumn("interestRate");
    table.dropColumn("inflationRate");
    table.dropColumn("gdpGrowth");
  });
}
