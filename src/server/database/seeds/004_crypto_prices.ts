import type { Knex } from "knex";

// Real approximate prices (May 2026)
const PRICES: Record<string, { price: number; rank: number; ath: number; atl: number }> = {
  bitcoin:        { price: 67500,   rank: 1,  ath: 73750,   atl: 67.81   },
  ethereum:       { price: 3450,    rank: 2,  ath: 4878,    atl: 0.43    },
  tether:         { price: 1.00,    rank: 3,  ath: 1.32,    atl: 0.572   },
  bnb:            { price: 605,     rank: 4,  ath: 686.31,  atl: 0.03    },
  solana:         { price: 168,     rank: 5,  ath: 259.96,  atl: 0.5     },
  "usd-coin":     { price: 1.00,    rank: 6,  ath: 1.17,    atl: 0.877   },
  ripple:         { price: 0.58,    rank: 7,  ath: 3.84,    atl: 0.002   },
  dogecoin:       { price: 0.165,   rank: 8,  ath: 0.7376,  atl: 0.00008 },
  tron:           { price: 0.135,   rank: 9,  ath: 0.3,     atl: 0.0017  },
  cardano:        { price: 0.52,    rank: 10, ath: 3.09,    atl: 0.017   },
  avalanche:      { price: 37.5,    rank: 11, ath: 146.22,  atl: 2.8     },
  shiba_inu:      { price: 0.000018,rank: 12, ath: 0.000086,atl: 0.000000000056 },
  polkadot:       { price: 7.2,     rank: 13, ath: 54.98,   atl: 2.7     },
  chainlink:      { price: 15.4,    rank: 14, ath: 52.7,    atl: 0.148   },
  polygon:        { price: 0.78,    rank: 15, ath: 2.92,    atl: 0.003   },
  dai:            { price: 1.00,    rank: 16, ath: 1.22,    atl: 0.897   },
  litecoin:       { price: 85,      rank: 17, ath: 410.26,  atl: 1.15    },
  uniswap:        { price: 9.2,     rank: 18, ath: 44.97,   atl: 0.419   },
  cosmos:         { price: 8.8,     rank: 19, ath: 44.45,   atl: 1.16    },
  stellar:        { price: 0.12,    rank: 20, ath: 0.875,   atl: 0.00017 },
};

const EXCHANGES = ["Binance", "Coinbase", "Kraken", "OKX", "Bybit"];

async function insertChunked(knex: Knex, table: string, rows: object[], chunkSize = 100) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    await knex(table).insert(rows.slice(i, i + chunkSize)).onConflict().ignore();
  }
}

export async function seed(knex: Knex): Promise<void> {
  console.log("\n🌱 Seeding crypto prices...\n");

  // DB mein actual crypto IDs fetch karo
  const dbCryptos = await knex("cryptocurrencies").select("id", "symbol", "circulatingSupply");
  console.log(`  Found ${dbCryptos.length} cryptocurrencies in DB`);

  // ── CRYPTO PRICES ──────────────────────────────────────────────────────────
  await knex("crypto_prices").del();
  const priceRows: object[] = [];

  for (const crypto of dbCryptos) {
    const p = PRICES[crypto.id] ?? { price: 1.5, rank: 99, ath: 10, atl: 0.001 };
    const changeSign = crypto.id.length % 2 === 0 ? 1 : -1;
    const changePct  = parseFloat((changeSign * (1.5 + Math.random() * 3)).toFixed(2));

    priceRows.push({
      cryptoId:          crypto.id,
      symbol:            crypto.symbol,
      price:             p.price,
      marketCap:         Math.floor(p.price * (crypto.circulatingSupply || 1e8)),
      volume24h:         Math.floor(p.price * (crypto.circulatingSupply || 1e8) * 0.04),
      change24h:         parseFloat((p.price * changePct / 100).toFixed(8)),
      changePercent24h:  changePct,
      ath:               p.ath,
      atl:               p.atl,
      circulatingSupply: crypto.circulatingSupply ?? 0,
      rank:              p.rank,
      timestamp:         new Date(),
    });
  }

  await insertChunked(knex, "crypto_prices", priceRows);
  console.log(`✓ crypto_prices   — ${priceRows.length} records`);

  // ── TRADING PAIRS ─────────────────────────────────────────────────────────
  await knex("trading_pairs").del();
  const pairRows: object[] = [];

  for (const crypto of dbCryptos) {
    const p       = PRICES[crypto.id] ?? { price: 1.5 };
    const quotes  = ["USDT", "USDC", "BTC", "ETH", "BNB"];

    for (const quote of quotes) {
      if (crypto.symbol === quote) continue;

      // BTC quote price mein convert
      const btcPrice = PRICES["bitcoin"]?.price ?? 67500;
      const quotePrice = quote === "BTC" ? p.price / btcPrice
                        : quote === "ETH" ? p.price / (PRICES["ethereum"]?.price ?? 3450)
                        : quote === "BNB" ? p.price / (PRICES["bnb"]?.price ?? 605)
                        : p.price;

      for (const exchange of EXCHANGES) {
        pairRows.push({
          pair:       `${crypto.symbol}/${quote}`,
          baseAsset:  crypto.symbol,
          quoteAsset: quote,
          price:      parseFloat(quotePrice.toFixed(8)),
          volume24h:  Math.floor(p.price * (crypto.circulatingSupply || 1e8) * 0.04 / EXCHANGES.length),
          exchange,
          lastUpdated: new Date(),
        });
      }
    }
  }

  await insertChunked(knex, "trading_pairs", pairRows, 200);
  console.log(`✓ trading_pairs   — ${pairRows.length} records`);

  console.log("\n Crypto data seeded!\n");
}
