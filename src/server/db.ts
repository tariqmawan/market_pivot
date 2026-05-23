import dotenv from "dotenv";
dotenv.config();

import knex from "knex";

const config = {
  client: "postgresql",

  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "marketpivot",
  },

  pool: {
    min: 2,
    max: 10,
  },
};

const db = knex(config);

export default db;