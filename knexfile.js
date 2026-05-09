const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "marketpivot",
    },
    migrations: {
      directory: "./src/server/database/migrations",
    },
    seeds: {
      directory: "./src/server/database/seeds",
    },
    pool: { min: 2, max: 10 },
  },

  production: {
    client: "postgresql",
    connection: () => requireEnv("DATABASE_URL"),
    migrations: {
      directory: "./dist/server/database/migrations",
    },
    seeds: {
      directory: "./dist/server/database/seeds",
    },
    pool: { min: 2, max: 10 },
  },
};
