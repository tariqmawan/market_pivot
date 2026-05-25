import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  const plans = [
    { slug: "free", name: "Free", priceMonthly: 0, priceYearly: 0, features: JSON.stringify(["Delayed quotes", "Basic watchlist"]) },
    { slug: "pro", name: "Pro", priceMonthly: 29.99, priceYearly: 299, features: JSON.stringify(["Real-time data", "Advanced charts", "API access"]) },
    { slug: "enterprise", name: "Enterprise", priceMonthly: 199, priceYearly: 1990, features: JSON.stringify(["Unlimited API", "Priority support", "Custom integrations"]) },
  ];

  for (const plan of plans) {
    const exists = await knex("subscription_plans").where({ slug: plan.slug }).first();
    if (!exists) await knex("subscription_plans").insert(plan);
  }
  console.log("✓ subscription plans seeded");
}
