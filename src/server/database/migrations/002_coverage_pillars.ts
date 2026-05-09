import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("market_regions", (table) => {
    table.string("id").primary();
    table.string("name").notNullable().unique();
    table.enum("group", ["Americas", "Europe", "Asia-Pacific", "Middle East & Africa"]).notNullable();
    table.text("summary");
    table.text("countries");
    table.text("keyIndices");
    table.decimal("gdpGrowth", 8, 2);
    table.decimal("inflation", 8, 2);
    table.text("commodityImpact");
    table.text("calendarFocus");
    table.text("sectorLeaders");
    table.text("newsThemes");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("stock_sectors", (table) => {
    table.string("id").primary();
    table.string("name").notNullable().unique();
    table.enum("category", ["Growth", "Cyclical", "Defensive", "Thematic", "Income"]).notNullable();
    table.text("summary");
    table.text("topCompanies");
    table.text("etfs");
    table.decimal("peRatio", 8, 2);
    table.decimal("performanceYtd", 8, 2);
    table.text("trendingStocks");
    table.text("dividendLeaders");
    table.text("newsThemes");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("commodities", (table) => {
    table.string("id").primary();
    table.string("name").notNullable().unique();
    table.string("symbol").notNullable().unique();
    table.enum("category", ["Energy", "Metals", "Agriculture", "Industrial"]).notNullable();
    table.string("unit").notNullable();
    table.decimal("spotPrice", 18, 4).notNullable();
    table.decimal("changePercent24h", 8, 2);
    table.string("futuresContract");
    table.text("demandTrends");
    table.text("currencyCorrelation");
    table.text("economicImpact");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("region_exchanges", (table) => {
    table.string("regionId").notNullable();
    table.string("exchangeId").notNullable();
    table.primary(["regionId", "exchangeId"]);
    table.foreign("regionId").references("market_regions.id").onDelete("CASCADE");
    table.foreign("exchangeId").references("exchanges.id").onDelete("CASCADE");
  });

  await knex.schema.createTable("region_currencies", (table) => {
    table.string("regionId").notNullable();
    table.string("currencyCode").notNullable();
    table.primary(["regionId", "currencyCode"]);
    table.foreign("regionId").references("market_regions.id").onDelete("CASCADE");
    table.foreign("currencyCode").references("currencies.code").onDelete("CASCADE");
  });

  await knex.schema.createTable("sector_regions", (table) => {
    table.string("sectorId").notNullable();
    table.string("regionId").notNullable();
    table.primary(["sectorId", "regionId"]);
    table.foreign("sectorId").references("stock_sectors.id").onDelete("CASCADE");
    table.foreign("regionId").references("market_regions.id").onDelete("CASCADE");
  });

  await knex.schema.createTable("commodity_regions", (table) => {
    table.string("commodityId").notNullable();
    table.string("regionId").notNullable();
    table.primary(["commodityId", "regionId"]);
    table.foreign("commodityId").references("commodities.id").onDelete("CASCADE");
    table.foreign("regionId").references("market_regions.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("commodity_regions");
  await knex.schema.dropTableIfExists("sector_regions");
  await knex.schema.dropTableIfExists("region_currencies");
  await knex.schema.dropTableIfExists("region_exchanges");
  await knex.schema.dropTableIfExists("commodities");
  await knex.schema.dropTableIfExists("stock_sectors");
  await knex.schema.dropTableIfExists("market_regions");
}
