import type { Knex } from "knex";
import bcrypt from "bcryptjs";

/**
 * Bootstrap admin account — run: npm run db:seed
 * Login: admin@marketspivot.com / AdminSetup123!
 */
export async function seed(knex: Knex): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@marketspivot.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "AdminSetup123!";
  const role = process.env.SEED_ADMIN_ROLE || "admin";

  const existing = await knex("users").where({ email }).first();
  if (existing) {
    if (existing.role !== role && existing.role !== "super_admin") {
      await knex("users").where({ id: existing.id }).update({ role });
      console.log(`✓ admin user role updated to ${role}`);
    } else {
      console.log("✓ admin user already exists");
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const [inserted] = await knex("users")
    .insert({
      name: "MarketsPivot Admin",
      email,
      password: hashedPassword,
      role,
      isActive: true,
      isEmailVerified: true,
    })
    .returning("id");

  const userId = inserted.id ?? inserted;

  await knex("watchlists").insert({
    userId,
    name: "Admin Watchlist",
    items: JSON.stringify([]),
  });

  await knex("user_preferences").insert({
    userId: String(userId),
    baseCurrency: "USD",
    favoriteExchanges: JSON.stringify([]),
    favoriteCryptocurrencies: JSON.stringify([]),
    favoriteCurrencies: JSON.stringify([]),
    theme: "dark",
    layout: "grid",
  });

  console.log(`✓ admin user seeded — ${email} (role: ${role})`);
}
