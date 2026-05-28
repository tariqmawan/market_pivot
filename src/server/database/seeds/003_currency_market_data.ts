import type { Knex } from "knex";

// Major currencies with realistic economic data
const CURRENCY_ECONOMIC_DATA: Record<string, {
  interestRate: number; inflationRate: number; gdpGrowth: number;
  unemploymentRate: number; currentAccountGdp: number; debtGdp: number;
}> = {
  USD: { interestRate: 5.25, inflationRate: 3.1,  gdpGrowth: 2.5,  unemploymentRate: 3.7,  currentAccountGdp: -3.3, debtGdp: 123.3 },
  EUR: { interestRate: 4.50, inflationRate: 2.4,  gdpGrowth: 0.4,  unemploymentRate: 6.1,  currentAccountGdp:  2.1, debtGdp:  91.6 },
  GBP: { interestRate: 5.25, inflationRate: 3.2,  gdpGrowth: 0.1,  unemploymentRate: 4.2,  currentAccountGdp: -3.5, debtGdp:  99.8 },
  JPY: { interestRate: 0.10, inflationRate: 2.6,  gdpGrowth: 1.9,  unemploymentRate: 2.6,  currentAccountGdp:  3.5, debtGdp: 255.2 },
  CHF: { interestRate: 1.75, inflationRate: 1.1,  gdpGrowth: 1.3,  unemploymentRate: 2.1,  currentAccountGdp:  8.9, debtGdp:  41.0 },
  AUD: { interestRate: 4.35, inflationRate: 3.8,  gdpGrowth: 2.0,  unemploymentRate: 3.8,  currentAccountGdp: -0.7, debtGdp:  55.1 },
  CAD: { interestRate: 5.00, inflationRate: 3.1,  gdpGrowth: 1.2,  unemploymentRate: 5.8,  currentAccountGdp: -1.8, debtGdp: 111.8 },
  CNY: { interestRate: 3.45, inflationRate: 0.3,  gdpGrowth: 5.2,  unemploymentRate: 5.1,  currentAccountGdp:  1.5, debtGdp:  83.6 },
  INR: { interestRate: 6.50, inflationRate: 5.4,  gdpGrowth: 7.2,  unemploymentRate: 7.6,  currentAccountGdp: -1.8, debtGdp:  83.9 },
  KRW: { interestRate: 3.50, inflationRate: 2.3,  gdpGrowth: 1.4,  unemploymentRate: 2.9,  currentAccountGdp:  2.4, debtGdp:  54.3 },
  SGD: { interestRate: 3.68, inflationRate: 2.7,  gdpGrowth: 1.1,  unemploymentRate: 2.0,  currentAccountGdp: 17.0, debtGdp: 167.3 },
  HKD: { interestRate: 5.75, inflationRate: 2.1,  gdpGrowth: 3.2,  unemploymentRate: 2.9,  currentAccountGdp:  4.6, debtGdp:   0.0 },
  BRL: { interestRate:10.75, inflationRate: 4.6,  gdpGrowth: 2.9,  unemploymentRate: 7.8,  currentAccountGdp: -1.6, debtGdp:  89.1 },
  MXN: { interestRate:11.00, inflationRate: 4.5,  gdpGrowth: 3.0,  unemploymentRate: 2.8,  currentAccountGdp: -0.9, debtGdp:  46.5 },
  ZAR: { interestRate: 8.25, inflationRate: 5.3,  gdpGrowth: 0.8,  unemploymentRate:33.5,  currentAccountGdp: -2.2, debtGdp:  70.7 },
  TRY: { interestRate:40.00, inflationRate:65.0,  gdpGrowth: 5.1,  unemploymentRate: 9.7,  currentAccountGdp: -3.7, debtGdp:  31.4 },
  RUB: { interestRate:16.00, inflationRate: 7.4,  gdpGrowth: 3.6,  unemploymentRate: 2.9,  currentAccountGdp:  4.5, debtGdp:  18.9 },
  SAR: { interestRate: 6.00, inflationRate: 1.7,  gdpGrowth: 0.8,  unemploymentRate: 4.8,  currentAccountGdp:  4.2, debtGdp:  23.9 },
  AED: { interestRate: 5.40, inflationRate: 3.5,  gdpGrowth: 3.4,  unemploymentRate: 2.3,  currentAccountGdp:  9.1, debtGdp:  29.7 },
  NOK: { interestRate: 4.50, inflationRate: 3.6,  gdpGrowth: 0.5,  unemploymentRate: 3.7,  currentAccountGdp: 22.0, debtGdp:  36.7 },
  SEK: { interestRate: 4.00, inflationRate: 3.7,  gdpGrowth: 0.1,  unemploymentRate: 8.5,  currentAccountGdp:  5.3, debtGdp:  31.6 },
  DKK: { interestRate: 3.60, inflationRate: 2.8,  gdpGrowth: 1.8,  unemploymentRate: 4.9,  currentAccountGdp:  9.0, debtGdp:  29.3 },
  NZD: { interestRate: 5.50, inflationRate: 4.0,  gdpGrowth: 0.6,  unemploymentRate: 4.0,  currentAccountGdp: -6.5, debtGdp:  46.3 },
  PLN: { interestRate: 5.75, inflationRate: 5.0,  gdpGrowth: 2.9,  unemploymentRate: 5.1,  currentAccountGdp: -0.5, debtGdp:  49.6 },
  CZK: { interestRate: 5.75, inflationRate: 2.5,  gdpGrowth: 0.4,  unemploymentRate: 2.6,  currentAccountGdp:  0.9, debtGdp:  44.1 },
  HUF: { interestRate: 7.75, inflationRate: 4.5,  gdpGrowth: 1.5,  unemploymentRate: 4.1,  currentAccountGdp:  1.0, debtGdp:  73.5 },
  IDR: { interestRate: 6.00, inflationRate: 2.6,  gdpGrowth: 5.0,  unemploymentRate: 5.3,  currentAccountGdp: -0.1, debtGdp:  39.4 },
  THB: { interestRate: 2.50, inflationRate: 1.3,  gdpGrowth: 2.7,  unemploymentRate: 1.0,  currentAccountGdp:  1.4, debtGdp:  62.3 },
  MYR: { interestRate: 3.00, inflationRate: 2.0,  gdpGrowth: 4.3,  unemploymentRate: 3.4,  currentAccountGdp:  1.6, debtGdp:  65.2 },
  PHP: { interestRate: 6.50, inflationRate: 3.3,  gdpGrowth: 5.6,  unemploymentRate: 3.1,  currentAccountGdp: -3.1, debtGdp:  61.1 },
  PKR: { interestRate:21.00, inflationRate:20.0,  gdpGrowth: 2.4,  unemploymentRate: 6.5,  currentAccountGdp: -0.7, debtGdp:  74.3 },
  BDT: { interestRate: 8.00, inflationRate: 9.9,  gdpGrowth: 6.0,  unemploymentRate: 5.1,  currentAccountGdp: -0.4, debtGdp:  39.0 },
  VND: { interestRate: 4.50, inflationRate: 3.3,  gdpGrowth: 5.0,  unemploymentRate: 2.3,  currentAccountGdp:  4.9, debtGdp:  34.0 },
  EGP: { interestRate:27.25, inflationRate:33.0,  gdpGrowth: 3.9,  unemploymentRate: 7.4,  currentAccountGdp: -2.1, debtGdp:  95.5 },
  NGN: { interestRate:24.75, inflationRate:30.0,  gdpGrowth: 3.2,  unemploymentRate:37.0,  currentAccountGdp:  2.5, debtGdp:  38.7 },
  KES: { interestRate:13.00, inflationRate: 6.8,  gdpGrowth: 5.0,  unemploymentRate: 5.7,  currentAccountGdp: -4.7, debtGdp:  68.9 },
  GHS: { interestRate:29.00, inflationRate:25.0,  gdpGrowth: 2.3,  unemploymentRate:14.7,  currentAccountGdp: -2.4, debtGdp:  84.3 },
  QAR: { interestRate: 5.75, inflationRate: 2.8,  gdpGrowth: 1.7,  unemploymentRate: 0.1,  currentAccountGdp: 15.0, debtGdp:  40.9 },
  KWD: { interestRate: 4.25, inflationRate: 3.6,  gdpGrowth: -0.6, unemploymentRate: 0.6,  currentAccountGdp: 25.0, debtGdp:   3.1 },
  ILS: { interestRate: 4.75, inflationRate: 2.8,  gdpGrowth: 2.0,  unemploymentRate: 3.6,  currentAccountGdp:  4.0, debtGdp:  60.6 },
  ARS: { interestRate:60.00, inflationRate:250.0, gdpGrowth:-2.5,  unemploymentRate: 6.9,  currentAccountGdp:  0.7, debtGdp:  89.5 },
  CLP: { interestRate: 5.75, inflationRate: 3.9,  gdpGrowth: 2.3,  unemploymentRate: 8.8,  currentAccountGdp: -3.4, debtGdp:  37.0 },
  COP: { interestRate:11.75, inflationRate: 7.0,  gdpGrowth: 1.6,  unemploymentRate:10.3,  currentAccountGdp: -2.6, debtGdp:  55.3 },
  PEN: { interestRate: 6.25, inflationRate: 2.5,  gdpGrowth: 2.4,  unemploymentRate: 6.3,  currentAccountGdp: -1.1, debtGdp:  34.3 },
  UYU: { interestRate: 9.25, inflationRate: 5.0,  gdpGrowth: 3.8,  unemploymentRate: 8.3,  currentAccountGdp: -0.9, debtGdp:  61.2 },
  TWD: { interestRate: 2.00, inflationRate: 2.4,  gdpGrowth: 3.1,  unemploymentRate: 3.5,  currentAccountGdp: 12.8, debtGdp:  26.9 },
};

// Realistic exchange rates (relative to USD)
const USD_RATES: Record<string, number> = {
  EUR: 0.9185, GBP: 0.7896, JPY: 149.82, CHF: 0.8943, AUD: 1.5362,
  CAD: 1.3521, CNY: 7.2451, INR: 83.24,  KRW: 1328.5, SGD: 1.3421,
  HKD: 7.8215, BRL: 4.9812, MXN: 17.152, ZAR: 18.732, TRY: 32.15,
  RUB: 92.45,  SAR: 3.7503, AED: 3.6725, NOK: 10.612, SEK: 10.432,
  DKK: 6.8852, NZD: 1.6412, PLN: 3.9812, CZK: 23.152, HUF: 360.2,
  IDR: 15682,  THB: 35.12,  MYR: 4.6812, PHP: 56.32,  PKR: 278.5,
  BDT: 109.82, VND: 24812,  EGP: 30.95,  NGN: 1582.5, KES: 129.8,
  QAR: 3.6412, KWD: 0.3081, ILS: 3.7215, ARS: 850.2,  CLP: 952.4,
  COP: 3912.5, PEN: 3.7412, TWD: 31.452, MKD: 57.12,  BGN: 1.7982,
  RON: 4.5812, HRK: 6.9221, DZD: 134.52, MAD: 10.052, TND: 3.1251,
  GHS: 14.52,  UGX: 3712.5, TZS: 2512.8, ZMW: 25.52,  BIF: 2852.5,
  CDF: 2712.5, XOF: 602.25, XAF: 602.25, BWP: 13.52,  NAD: 18.732,
  MZN: 63.412, SZL: 18.52,  LSL: 18.52,  LKR: 312.82, MMK: 2098.5,
  KHR: 4098.5, LAK: 20812,  MNT: 3412.5, NPR: 133.25, BTN: 83.24,
  MVR: 15.412, AFN: 70.512, IQD: 1312.5, SYP: 13012,  LBP: 89812,
  JOD: 0.7091, OMR: 0.3851, BHD: 0.3769, YER: 250.42, DJF: 177.82,
  ETB: 56.812, SOS: 570.25, SDG: 600.12, LYD: 4.8412,
};

function makeChartPoints(basePair: string, rate: number, count = 90) {
  const rows = [];
  const now = new Date();
  let current = rate;
  for (let i = count; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const pct = (Math.random() - 0.49) * 0.008;
    current = current * (1 + pct);
    rows.push({
      assetId: basePair,
      assetType: "currency",
      timeframe: "24H",
      timestamp: ts,
      value: parseFloat(current.toFixed(6)),
      open:  parseFloat((current * (1 - Math.random() * 0.003)).toFixed(6)),
      close: parseFloat(current.toFixed(6)),
      high:  parseFloat((current * (1 + Math.random() * 0.004)).toFixed(6)),
      low:   parseFloat((current * (1 - Math.random() * 0.004)).toFixed(6)),
      volume: null,
    });
  }
  return rows;
}

export async function seed(knex: Knex): Promise<void> {
  console.log("\n Seeding currency market data...\n");

  // 1. Update currencies with economic data
  for (const [code, data] of Object.entries(CURRENCY_ECONOMIC_DATA)) {
    await knex("currencies").where({ code }).update(data).catch(() => {});
  }
  console.log(`✓ currency econ   — ${Object.keys(CURRENCY_ECONOMIC_DATA).length} records updated`);

  // 2. Seed exchange_rates
  await knex("exchange_rates").del();
  const rateRows: object[] = [];
  const majors = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "CNY", "INR"];

  for (const fromCode of majors) {
    const fromUsd = fromCode === "USD" ? 1 : (1 / (USD_RATES[fromCode] ?? 1));
    for (const [toCode, toUsdRate] of Object.entries(USD_RATES)) {
      if (fromCode === toCode) continue;
      const rate = fromCode === "USD" ? toUsdRate : toUsdRate / fromUsd;
      rateRows.push({
        fromCode,
        toCode,
        rate:   parseFloat(rate.toFixed(8)),
        bid:    parseFloat((rate * 0.9998).toFixed(8)),
        ask:    parseFloat((rate * 1.0002).toFixed(8)),
        spread: parseFloat((rate * 0.0004).toFixed(8)),
      });
    }
  }
  // Chunked insert
  for (let i = 0; i < rateRows.length; i += 200) {
    await knex("exchange_rates").insert(rateRows.slice(i, i + 200)).onConflict().ignore();
  }
  console.log(`✓ exchange_rates  — ${rateRows.length} records`);

  // 3. Seed currency_pairs (popular FX pairs)
  await knex("currency_pairs").del();
  const popularPairs = [
    { pair: "EUR/USD", base: "EUR", quote: "USD" },
    { pair: "GBP/USD", base: "GBP", quote: "USD" },
    { pair: "USD/JPY", base: "USD", quote: "JPY" },
    { pair: "USD/CHF", base: "USD", quote: "CHF" },
    { pair: "AUD/USD", base: "AUD", quote: "USD" },
    { pair: "USD/CAD", base: "USD", quote: "CAD" },
    { pair: "NZD/USD", base: "NZD", quote: "USD" },
    { pair: "EUR/GBP", base: "EUR", quote: "GBP" },
    { pair: "EUR/JPY", base: "EUR", quote: "JPY" },
    { pair: "GBP/JPY", base: "GBP", quote: "JPY" },
    { pair: "USD/CNY", base: "USD", quote: "CNY" },
    { pair: "USD/INR", base: "USD", quote: "INR" },
    { pair: "USD/KRW", base: "USD", quote: "KRW" },
    { pair: "USD/SGD", base: "USD", quote: "SGD" },
    { pair: "USD/MXN", base: "USD", quote: "MXN" },
    { pair: "USD/BRL", base: "USD", quote: "BRL" },
    { pair: "USD/ZAR", base: "USD", quote: "ZAR" },
    { pair: "USD/TRY", base: "USD", quote: "TRY" },
    { pair: "EUR/CHF", base: "EUR", quote: "CHF" },
    { pair: "AUD/JPY", base: "AUD", quote: "JPY" },
  ];

  const pairRows = popularPairs.map((p, i) => {
    const baseUsd = p.base === "USD" ? 1 : (1 / (USD_RATES[p.base] ?? 1));
    const quoteUsd = p.quote === "USD" ? 1 : (USD_RATES[p.quote] ?? 1);
    const rate = baseUsd * quoteUsd;
    const ch = (Math.random() - 0.5) * 1.5;
    return {
      pair:          p.pair,
      baseCurrency:  p.base,
      quoteCurrency: p.quote,
      rate:     parseFloat(rate.toFixed(6)),
      change24h: parseFloat(ch.toFixed(2)),
      high52w:   parseFloat((rate * 1.12).toFixed(6)),
      low52w:    parseFloat((rate * 0.88).toFixed(6)),
      volatility: parseFloat((Math.random() * 0.15 + 0.05).toFixed(4)),
    };
  });
  await knex("currency_pairs").insert(pairRows).onConflict("pair").ignore();
  console.log(`✓ currency_pairs  — ${pairRows.length} records`);

  // 4. Seed chart_data for major currency pairs
  await knex("chart_data").where({ assetType: "currency" }).del();
  const chartRows: object[] = [];
  const chartPairs = [
    { id: "EUR_USD", rate: 1 / USD_RATES["EUR"] },
    { id: "GBP_USD", rate: 1 / USD_RATES["GBP"] },
    { id: "USD_JPY", rate: USD_RATES["JPY"] },
    { id: "USD_INR", rate: USD_RATES["INR"] },
    { id: "USD_CNY", rate: USD_RATES["CNY"] },
    { id: "AUD_USD", rate: 1 / USD_RATES["AUD"] },
    { id: "USD_CAD", rate: USD_RATES["CAD"] },
    { id: "USD_CHF", rate: USD_RATES["CHF"] },
  ];
  for (const cp of chartPairs) {
    chartRows.push(...makeChartPoints(cp.id, cp.rate, 90));
  }
  for (let i = 0; i < chartRows.length; i += 200) {
    await knex("chart_data").insert(chartRows.slice(i, i + 200)).onConflict().ignore();
  }
  console.log(`✓ chart_data (fx) — ${chartRows.length} points`);

  console.log("\n Currency market data seeded!\n");
}
