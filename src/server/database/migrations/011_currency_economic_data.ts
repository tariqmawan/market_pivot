import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const cols = ["interestRate", "inflationRate", "gdpGrowth", "unemploymentRate", "currentAccountGdp", "debtGdp"] as const;
  const existing = await Promise.all(cols.map((c) => knex.schema.hasColumn("currencies", c)));
  const missing = cols.filter((_, i) => !existing[i]);
  if (missing.length === 0) return;
  await knex.schema.alterTable("currencies", (table) => {
    if (missing.includes("interestRate"))      table.decimal("interestRate", 8, 2).defaultTo(0);
    if (missing.includes("inflationRate"))     table.decimal("inflationRate", 8, 2).defaultTo(0);
    if (missing.includes("gdpGrowth"))         table.decimal("gdpGrowth", 8, 2).defaultTo(0);
    if (missing.includes("unemploymentRate"))  table.decimal("unemploymentRate", 8, 2).defaultTo(0);
    if (missing.includes("currentAccountGdp")) table.decimal("currentAccountGdp", 8, 2).defaultTo(0);
    if (missing.includes("debtGdp"))           table.decimal("debtGdp", 8, 2).defaultTo(0);
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
