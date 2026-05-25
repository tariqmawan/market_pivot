import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import { parsePositiveInt, sanitizeShortText } from "../security";

export function createRouter(db: Knex) {
  const router = Router();

  // GET /api/screener/stocks
  router.get("/stocks", async (req: Request, res: Response) => {
    try {
      const {
        exchange, sector, region,
        minPrice, maxPrice,
        minChange, maxChange,
        minMarketCap, maxMarketCap,
        sortBy = "name", sortDir = "asc",
      } = req.query;

      const pageNumber = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 50);

      // exchanges table se data — companies baad mein add hongi
      let baseQuery = db("exchanges");

      if (exchange) baseQuery = baseQuery.whereILike("id",      `%${exchange}%`);
      if (region)   baseQuery = baseQuery.whereILike("region",  `%${region}%`);
      if (sector)   baseQuery = baseQuery.whereILike("currency",`%${sector}%`);

      const validSortCols = ["name", "marketCap", "volume"];
      const col = validSortCols.includes(String(sortBy)) ? String(sortBy) : "name";
      const dir = sortDir === "desc" ? "desc" : "asc";

      const [data, [{ count }]] = await Promise.all([
        baseQuery.clone().select(
          "id as symbol", "name", "country as exchange",
          db.raw("'' as sector"),
          "marketCap", "avgDailyVolume as volume",
          db.raw("0 as price"), db.raw("0 as change1d")
        ).orderBy(col, dir)
          .offset((pageNumber - 1) * pageSize)
          .limit(pageSize),
        baseQuery.clone().count("id as count"),
      ]);

      res.json({
        success: true, data,
        pagination: { page: pageNumber, limit: pageSize, total: Number(count), pages: Math.ceil(Number(count) / pageSize) },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Screener failed", timestamp: new Date() });
    }
  });

  // GET /api/screener/crypto
  router.get("/crypto", async (req: Request, res: Response) => {
    try {
      const { category, sortBy = "name", sortDir = "asc" } = req.query;
      const pageNumber = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 50);

      let baseQuery = db("cryptocurrencies");

      if (category) baseQuery = baseQuery.whereILike("category", `%${category}%`);

      const validSortCols = ["name", "symbol", "category"];
      const col = validSortCols.includes(String(sortBy)) ? String(sortBy) : "name";
      const dir = sortDir === "desc" ? "desc" : "asc";

      const [data, [{ count }]] = await Promise.all([
        baseQuery.clone().select(
          "id as symbol", "name", "symbol as ticker", "category",
          "circulatingSupply as supply",
          db.raw("0 as price"), db.raw("0 as change1d"), db.raw("0 as marketCap")
        ).orderBy(col, dir)
          .offset((pageNumber - 1) * pageSize)
          .limit(pageSize),
        baseQuery.clone().count("id as count"),
      ]);

      res.json({
        success: true, data,
        pagination: { page: pageNumber, limit: pageSize, total: Number(count), pages: Math.ceil(Number(count) / pageSize) },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Crypto screener failed", timestamp: new Date() });
    }
  });

  // GET /api/screener/forex
  router.get("/forex", async (req: Request, res: Response) => {
    try {
      const { region, type } = req.query;
      const pageNumber = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 50);

      let baseQuery = db("currencies");
      if (region) baseQuery = baseQuery.whereILike("region", `%${region}%`);
      if (type)   baseQuery = baseQuery.where({ type: String(type) });

      const [data, [{ count }]] = await Promise.all([
        baseQuery.clone().select("*")
          .offset((pageNumber - 1) * pageSize)
          .limit(pageSize),
        baseQuery.clone().count("code as count"),
      ]);

      res.json({
        success: true, data,
        pagination: { page: pageNumber, limit: pageSize, total: Number(count), pages: Math.ceil(Number(count) / pageSize) },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Forex screener failed", timestamp: new Date() });
    }
  });

  // GET /api/screener/etfs
  router.get("/etfs", async (req: Request, res: Response) => {
    try {
      const { category, region } = req.query;
      const pageNumber = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 50);

      let baseQuery = db("etfs");
      if (category) baseQuery = baseQuery.whereILike("category", `%${category}%`);
      if (region)   baseQuery = baseQuery.whereILike("region",   `%${region}%`);

      const [data, [{ count }]] = await Promise.all([
        baseQuery.clone().select("*")
          .offset((pageNumber - 1) * pageSize)
          .limit(pageSize),
        baseQuery.clone().count("symbol as count"),
      ]);

      res.json({
        success: true, data,
        pagination: { page: pageNumber, limit: pageSize, total: Number(count), pages: Math.ceil(Number(count) / pageSize) },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "ETF screener failed", timestamp: new Date() });
    }
  });

  return router;
}
