import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Exchanges Table
  await knex.schema.createTable("exchanges", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("country").notNullable();
    table.string("countryCode").notNullable();
    table.string("region").notNullable();
    table.string("timezone").notNullable();
    table.string("currency").notNullable();
    table.string("tradingHours_open").notNullable();
    table.string("tradingHours_close").notNullable();
    table.string("mainIndex").notNullable();
    table.string("mainIndexName").notNullable();
    table.text("description");
    table.integer("founded");
    table.string("website");
    table.string("logo");
    table.bigInteger("marketCap");
    table.integer("listedCompanies");
    table.bigInteger("avgDailyVolume");
    table.timestamps(true, true);
  });

  // Index Snapshots Table
  await knex.schema.createTable("index_snapshots", (table) => {
    table.increments("id");
    table.string("exchangeId").notNullable();
    table.string("symbol").notNullable();
    table.string("name").notNullable();
    table.decimal("value", 18, 2).notNullable();
    table.decimal("previousClose", 18, 2);
    table.decimal("change", 18, 2);
    table.decimal("percentChange", 8, 2);
    table.bigInteger("volume");
    table.integer("advancers");
    table.integer("decliners");
    table.timestamp("timestamp").defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.foreign("exchangeId").references("exchanges.id");
    table.index(["exchangeId", "timestamp"]);
  });

  // Top Movers Table
  await knex.schema.createTable("market_movers", (table) => {
    table.increments("id");
    table.string("exchangeId").notNullable();
    table.string("symbol").notNullable();
    table.string("company").notNullable();
    table.decimal("price", 18, 2).notNullable();
    table.decimal("change", 18, 2);
    table.decimal("percentChange", 8, 2);
    table.bigInteger("volume");
    table.bigInteger("marketCap");
    table.enum("type", ["gainer", "loser", "active"]).notNullable();
    table.timestamp("timestamp").defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.foreign("exchangeId").references("exchanges.id");
    table.index(["exchangeId", "type", "timestamp"]);
  });

  // Sector Performance Table
  await knex.schema.createTable("sector_performance", (table) => {
    table.increments("id");
    table.string("exchangeId").notNullable();
    table.string("sectorName").notNullable();
    table.text("symbols");
    table.decimal("performance", 8, 2);
    table.integer("companies");
    table.bigInteger("marketCap");
    table.timestamp("timestamp").defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.foreign("exchangeId").references("exchanges.id");
    table.index(["exchangeId", "timestamp"]);
  });

  // Currencies Table
  await knex.schema.createTable("currencies", (table) => {
    table.string("code").primary();
    table.string("name").notNullable();
    table.string("symbol").notNullable();
    table.string("country").notNullable();
    table.string("countryCode").notNullable();
    table.string("region").notNullable();
    table.enum("type", ["fiat", "commodity", "crypto"]).notNullable();
    table.string("centralBank");
    table.text("description");
    table.string("logo");
    table.timestamps(true, true);
  });

  // Exchange Rates Table
  await knex.schema.createTable("exchange_rates", (table) => {
    table.increments("id");
    table.string("fromCode").notNullable();
    table.string("toCode").notNullable();
    table.decimal("rate", 18, 8).notNullable();
    table.decimal("bid", 18, 8);
    table.decimal("ask", 18, 8);
    table.decimal("spread", 18, 8);
    table.timestamp("timestamp").defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.foreign("fromCode").references("currencies.code");
    table.foreign("toCode").references("currencies.code");
    table.index(["fromCode", "toCode", "timestamp"]);
  });

  // Currency Pairs Table (Popular pairs)
  await knex.schema.createTable("currency_pairs", (table) => {
    table.increments("id");
    table.string("pair").notNullable().unique();
    table.string("baseCurrency").notNullable();
    table.string("quoteCurrency").notNullable();
    table.decimal("rate", 18, 8).notNullable();
    table.decimal("change24h", 8, 2);
    table.decimal("high52w", 18, 8);
    table.decimal("low52w", 18, 8);
    table.decimal("volatility", 8, 4);
    table.timestamp("lastUpdated").defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });

  // Cryptocurrencies Table
  await knex.schema.createTable("cryptocurrencies", (table) => {
    table.string("id").primary();
    table.string("symbol").notNullable().unique();
    table.string("name").notNullable().unique();
    table.enum("category", [
      "Layer 1",
      "Layer 2",
      "DeFi",
      "Stablecoin",
      "Infrastructure",
      "Payments",
      "Emerging/Growth",
    ]).notNullable();
    table.text("description");
    table.integer("launched");
    table.string("founder");
    table.bigInteger("maxSupply");
    table.bigInteger("circulatingSupply");
    table.string("consensusMechanism");
    table.decimal("blockTime", 8, 2);
    table.string("logo");
    table.timestamps(true, true);
  });

  // Crypto Prices Table
  await knex.schema.createTable("crypto_prices", (table) => {
    table.increments("id");
    table.string("cryptoId").notNullable();
    table.string("symbol").notNullable();
    table.decimal("price", 18, 8).notNullable();
    table.bigInteger("marketCap");
    table.bigInteger("volume24h");
    table.decimal("change24h", 18, 2);
    table.decimal("changePercent24h", 8, 2);
    table.decimal("ath", 18, 8);
    table.decimal("atl", 18, 8);
    table.bigInteger("circulatingSupply");
    table.integer("rank");
    table.timestamp("timestamp").defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.foreign("cryptoId").references("cryptocurrencies.id");
    table.index(["cryptoId", "timestamp"]);
  });

  // Trading Pairs Table (Crypto pairs)
  await knex.schema.createTable("trading_pairs", (table) => {
    table.increments("id");
    table.string("pair").notNullable();
    table.string("baseAsset").notNullable();
    table.string("quoteAsset").notNullable();
    table.decimal("price", 18, 8).notNullable();
    table.bigInteger("volume24h");
    table.string("exchange").notNullable();
    table.timestamp("lastUpdated").defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.unique(["pair", "exchange"]);
  });

  // News Table
  await knex.schema.createTable("news", (table) => {
    table.increments("id");
    table.string("title").notNullable();
    table.text("description");
    table.text("content");
    table.string("source").notNullable();
    table.string("imageUrl");
    table.string("url").notNullable().unique();
    table.timestamp("publishedAt").notNullable();
    table.enum("category", ["market", "company", "economic", "regulatory"]).notNullable();
    table.text("relevantAssets"); // JSON array
    table.timestamps(true, true);
    table.index(["category", "publishedAt"]);
  });

  // Chart Data Table
  await knex.schema.createTable("chart_data", (table) => {
    table.increments("id");
    table.string("assetId").notNullable();
    table.enum("assetType", ["exchange", "currency", "crypto"]).notNullable();
    table.enum("timeframe", ["1H", "24H", "7D", "1M", "1Y", "ALL"]).notNullable();
    table.timestamp("timestamp").notNullable();
    table.decimal("value", 18, 8).notNullable();
    table.bigInteger("volume");
    table.decimal("high", 18, 8);
    table.decimal("low", 18, 8);
    table.decimal("open", 18, 8);
    table.decimal("close", 18, 8);
    table.timestamps(true, true);
    table.index(["assetId", "assetType", "timeframe", "timestamp"]);
  });

  // User Preferences Table
  await knex.schema.createTable("user_preferences", (table) => {
    table.increments("id");
    table.string("userId").notNullable().unique();
    table.string("baseCurrency").defaultTo("USD");
    table.text("favoriteExchanges"); // JSON array
    table.text("favoriteCryptocurrencies"); // JSON array
    table.text("favoriteCurrencies"); // JSON array
    table.enum("theme", ["light", "dark"]).defaultTo("dark");
    table.enum("layout", ["grid", "list"]).defaultTo("grid");
    table.timestamps(true, true);
    table.index("userId");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_preferences");
  await knex.schema.dropTableIfExists("chart_data");
  await knex.schema.dropTableIfExists("news");
  await knex.schema.dropTableIfExists("trading_pairs");
  await knex.schema.dropTableIfExists("crypto_prices");
  await knex.schema.dropTableIfExists("cryptocurrencies");
  await knex.schema.dropTableIfExists("currency_pairs");
  await knex.schema.dropTableIfExists("exchange_rates");
  await knex.schema.dropTableIfExists("currencies");
  await knex.schema.dropTableIfExists("sector_performance");
  await knex.schema.dropTableIfExists("market_movers");
  await knex.schema.dropTableIfExists("index_snapshots");
  await knex.schema.dropTableIfExists("exchanges");
}
