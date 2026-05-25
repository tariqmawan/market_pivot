import type { Knex } from "knex";

/** Add super_admin to the PostgreSQL enum used by users.role */
export async function up(knex: Knex): Promise<void> {
  const row = await knex.raw<{ rows: Array<{ typname: string }> }>(`
    SELECT t.typname
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_type t ON a.atttypid = t.oid
    WHERE c.relname = 'users'
      AND a.attname = 'role'
      AND t.typtype = 'e'
    LIMIT 1;
  `);

  const enumName = row.rows?.[0]?.typname;
  if (!enumName) {
    console.warn("users.role enum not found — skipping super_admin migration");
    return;
  }

  const exists = await knex.raw<{ rows: Array<{ ok: number }> }>(`
    SELECT 1 AS ok FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = ? AND e.enumlabel = 'super_admin'
    LIMIT 1;
  `, [enumName]);

  if (exists.rows?.length) return;

  await knex.raw(`ALTER TYPE ?? ADD VALUE 'super_admin'`, [enumName]);
}

export async function down(_knex: Knex): Promise<void> {
  // PostgreSQL cannot drop enum values safely
}
