import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Purana constraint hatao aur naya add karo
  await knex.schema.alterTable("news", (table) => {
    // enum column drop karo
    table.dropColumn("category");
  });

  await knex.schema.alterTable("news", (table) => {
    // Sab categories ke saath naya column add karo
    table
      .enum("category", [
        "market",
        "markets",
        "company",
        "economic",
        "regulatory",
        "crypto",
        "fx",
        "commodities",
        "technology",
        "general",
      ])
      .notNullable()
      .defaultTo("market");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("news", (table) => {
    table.dropColumn("category");
  });
  await knex.schema.alterTable("news", (table) => {
    table
      .enum("category", ["market", "company", "economic", "regulatory"])
      .notNullable()
      .defaultTo("market");
  });
}
