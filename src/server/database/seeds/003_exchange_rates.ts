import type { Knex } from "knex";

// Real approximate rates (USD base — May 2026)
const USD_RATES: Record<string, number> = {
  USD: 1,      EUR: 0.923,  GBP: 0.786,  JPY: 153.2,  CNY: 7.24,
  INR: 83.4,   AUD: 1.532,  CAD: 1.363,  CHF: 0.903,  HKD: 7.831,
  SGD: 1.345,  KRW: 1342,   BRL: 5.12,   MXN: 17.2,   NOK: 10.61,
  SEK: 10.37,  DKK: 6.88,   NZD: 1.671,  ZAR: 18.64,  AED: 3.672,
};

async function insertChunked(knex: Knex, table: string, rows: object[], chunkSize = 200) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    await knex(table).insert(rows.slice(i, i + chunkSize)).onConflict().ignore();
  }
}

export async function seed(knex: Knex): Promise<void> {
  console.log("\n🌱 Seeding exchange rates...\n");

  await knex("exchange_rates").del();

  const rows: object[] = [];
  const codes = Object.keys(USD_RATES);
  const now   = new Date();

  // Har currency pair ke liye rate calculate karo
  for (const from of codes) {
    for (const to of codes) {
      if (from === to) continue;
      const rate   = USD_RATES[to] / USD_RATES[from];
      const spread = rate * 0.001; // 0.1% spread
      rows.push({
        fromCode:  from,
        toCode:    to,
        rate:      parseFloat(rate.toFixed(6)),
        bid:       parseFloat((rate - spread / 2).toFixed(6)),
        ask:       parseFloat((rate + spread / 2).toFixed(6)),
        spread:    parseFloat(spread.toFixed(6)),
        timestamp: now,
      });
    }
  }

  await insertChunked(knex, "exchange_rates", rows);
  console.log(`✓ exchange_rates  — ${rows.length} pairs (${codes.length} currencies)`);

  // Currency economic data update karo
  const economicData: Record<string, { interestRate: number; inflationRate: number; gdpGrowth: number }> = {
    USD: { interestRate: 5.25,  inflationRate: 3.4,  gdpGrowth: 2.8  },
    EUR: { interestRate: 4.50,  inflationRate: 2.8,  gdpGrowth: 0.6  },
    GBP: { interestRate: 5.25,  inflationRate: 3.2,  gdpGrowth: 0.3  },
    JPY: { interestRate: 0.10,  inflationRate: 2.6,  gdpGrowth: 1.2  },
    CNY: { interestRate: 3.45,  inflationRate: 0.3,  gdpGrowth: 5.3  },
    INR: { interestRate: 6.50,  inflationRate: 4.9,  gdpGrowth: 7.8  },
    AUD: { interestRate: 4.35,  inflationRate: 3.8,  gdpGrowth: 1.5  },
    CAD: { interestRate: 5.00,  inflationRate: 2.9,  gdpGrowth: 1.7  },
    CHF: { interestRate: 1.75,  inflationRate: 1.1,  gdpGrowth: 1.3  },
    HKD: { interestRate: 5.75,  inflationRate: 2.1,  gdpGrowth: 3.2  },
    SGD: { interestRate: 3.68,  inflationRate: 3.1,  gdpGrowth: 2.2  },
    KRW: { interestRate: 3.50,  inflationRate: 2.9,  gdpGrowth: 2.4  },
    BRL: { interestRate: 10.50, inflationRate: 3.9,  gdpGrowth: 2.9  },
    ZAR: { interestRate: 8.25,  inflationRate: 5.3,  gdpGrowth: 0.8  },
    AED: { interestRate: 5.40,  inflationRate: 3.4,  gdpGrowth: 3.8  },
  };

  for (const [code, data] of Object.entries(economicData)) {
    await knex("currencies")
      .where({ code })
      .update({
        interestRate:  data.interestRate,
        inflationRate: data.inflationRate,
        gdpGrowth:     data.gdpGrowth,
        updated_at:    now,
      })
      .catch(() => {}); // column nahi hai toh ignore karo
  }
  console.log(`✓ currencies economic data updated`);

  console.log("\n Exchange rates seeded!\n");
}
