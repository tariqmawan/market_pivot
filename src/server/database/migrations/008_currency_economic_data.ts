import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("currencies", (table) => {
    table.decimal("interestRate", 8, 2).defaultTo(0);
    table.decimal("inflationRate", 8, 2).defaultTo(0);
    table.decimal("gdpGrowth", 8, 2).defaultTo(0);
    table.decimal("unemploymentRate", 8, 2).defaultTo(0);
    table.decimal("currentAccountGdp", 8, 2).defaultTo(0);
    table.decimal("debtGdp", 8, 2).defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("currencies", (table) => {
    table.dropColumn("interestRate");
    table.dropColumn("inflationRate");
    table.dropColumn("gdpGrowth");
    table.dropColumn("unemploymentRate");
    table.dropColumn("currentAccountGdp");
    table.dropColumn("debtGdp");
  });
}
