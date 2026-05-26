import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import type { Knex } from "knex";
import type { Cryptocurrency, ApiResponse, PaginatedResponse } from "../../types";
import { parsePositiveInt } from "../security";
import { asyncHandler } from "../lib/asyncHandler";
import { sendError, sendSuccess } from "../lib/apiResponse";
import {
  getCryptoNews,
  getExchangeVolumes,
  getLatestPrice,
  getTradingPairs,
  isValidCryptoSlug,
  normalizeCryptoPriceRow,
  resolveCrypto,
} from "../services/cryptoService";

function logRouteError(route: string, err: unknown) {
  console.error(`[cryptos] ${route}:`, err instanceof Error ? err.message : err);
}

export function createRouter(db: Knex) {
  const router = Router();

  router.get("/", asyncHandler(async (req, res) => {
    try {
      const { category } = req.query;
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize = parsePositiveInt(req.query.limit, 20);

      let query = db("cryptocurrencies");
      if (category) query = query.where({ category: String(category) });

      const [data, [{ count }]] = await Promise.all([
        query.clone().select("*").offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("id as count"),
      ]);
      const total = Number(count);

      res.json({
        success: true,
        data,
        pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
        timestamp: new Date(),
      });
    } catch (err) {
      logRouteError("GET /", err);
      sendError(res, 500, "Failed to fetch cryptocurrencies");
    }
  }));

  router.get("/market/overview", asyncHandler(async (_req, res) => {
    try {
      const [gainers, losers, trending] = await Promise.all([
        db("crypto_prices").orderBy("changePercent24h", "desc").limit(5),
        db("crypto_prices").orderBy("changePercent24h", "asc").limit(5),
        db("crypto_prices").orderBy("volume24h", "desc").limit(5),
      ]);
      const [{ totalMarketCap }] = await db("crypto_prices").sum("marketCap as totalMarketCap");

      sendSuccess(res, {
        gainers: gainers.map(normalizeCryptoPriceRow),
        losers: losers.map(normalizeCryptoPriceRow),
        trending: trending.map(normalizeCryptoPriceRow),
        marketStats: {
          totalMarketCap: Number(totalMarketCap ?? 0),
          btcDominance: 0,
          fear_and_greed_index: 0,
        },
      });
    } catch (err) {
      logRouteError("GET /market/overview", err);
      sendError(res, 500, "Failed to fetch market overview");
    }
  }));

  router.get("/market/top-gainers", asyncHandler(async (req, res) => {
    try {
      const limit = parsePositiveInt(req.query.limit, 20);
      const data = await db("crypto_prices").orderBy("changePercent24h", "desc").limit(limit);
      sendSuccess(res, data.map(normalizeCryptoPriceRow));
    } catch (err) {
      logRouteError("GET /market/top-gainers", err);
      sendError(res, 500, "Failed to fetch top gainers");
    }
  }));

  router.get("/market/top-losers", asyncHandler(async (req, res) => {
    try {
      const limit = parsePositiveInt(req.query.limit, 20);
      const data = await db("crypto_prices").orderBy("changePercent24h", "asc").limit(limit);
      sendSuccess(res, data.map(normalizeCryptoPriceRow));
    } catch (err) {
      logRouteError("GET /market/top-losers", err);
      sendError(res, 500, "Failed to fetch top losers");
    }
  }));

  router.get("/category/:category", asyncHandler(async (req, res) => {
    try {
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize = parsePositiveInt(req.query.limit, 20);
      const query = db("cryptocurrencies").where({ category: req.params.category });

      const [data, [{ count }]] = await Promise.all([
        query.clone().offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("id as count"),
      ]);
      const total = Number(count);
      res.json({
        success: true,
        data,
        pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
        timestamp: new Date(),
      });
    } catch (err) {
      logRouteError("GET /category/:category", err);
      sendError(res, 500, "Failed to fetch cryptos by category");
    }
  }));

  const requireCrypto = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const param = req.params.id;
    if (!param || !isValidCryptoSlug(param)) {
      sendError(res, 400, "Invalid cryptocurrency identifier");
      return;
    }
    const crypto = await resolveCrypto(db, param);
    if (!crypto) {
      sendError(res, 404, "Cryptocurrency not found");
      return;
    }
    (req as Request & { crypto: Cryptocurrency }).crypto = crypto;
    next();
  });

  router.get("/:id", asyncHandler(async (req, res: Response<ApiResponse<Cryptocurrency>>) => {
    try {
      if (!isValidCryptoSlug(req.params.id)) {
        sendError(res, 400, "Invalid cryptocurrency identifier");
        return;
      }
      const crypto = await resolveCrypto(db, req.params.id);
      if (!crypto) {
        sendError(res, 404, "Cryptocurrency not found");
        return;
      }
      res.json({ success: true, data: crypto, timestamp: new Date() });
    } catch (err) {
      logRouteError("GET /:id", err);
      sendError(res, 500, "Failed to fetch cryptocurrency");
    }
  }));

  router.get("/:id/price", requireCrypto, asyncHandler(async (req, res) => {
    try {
      const crypto = (req as Request & { crypto: Cryptocurrency }).crypto;
      const data = await getLatestPrice(db, crypto.id);
      if (!data) {
        sendError(res, 404, "Price data not found");
        return;
      }
      sendSuccess(res, data);
    } catch (err) {
      logRouteError("GET /:id/price", err);
      sendError(res, 500, "Failed to fetch price");
    }
  }));

  router.get("/:id/chart", asyncHandler(async (req, res) => {
    try {
      const timeframe = String(req.query.timeframe ?? "7D");
      const data = await db("chart_data")
        .where({ assetId: req.params.id, assetType: "crypto", timeframe })
        .orderBy("timestamp", "asc")
        .select("timestamp", "value", "volume", "high", "low");
      sendSuccess(res, { id: req.params.id, timeframe, data });
    } catch (err) {
      logRouteError("GET /:id/chart", err);
      sendError(res, 500, "Failed to fetch chart data");
    }
  }));

  router.get("/:id/pairs", requireCrypto, asyncHandler(async (req, res) => {
    try {
      const crypto = (req as Request & { crypto: Cryptocurrency }).crypto;
      const limit = parsePositiveInt(req.query.limit, 20);
      const data = await getTradingPairs(db, crypto.symbol, limit);
      sendSuccess(res, data ?? []);
    } catch (err) {
      logRouteError("GET /:id/pairs", err);
      sendError(res, 500, "Failed to fetch trading pairs");
    }
  }));

  router.get("/:id/news", requireCrypto, asyncHandler(async (req, res) => {
    try {
      const crypto = (req as Request & { crypto: Cryptocurrency }).crypto;
      const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
      const pageSize = parsePositiveInt(req.query.limit, 20);
      const { data, total, pages } = await getCryptoNews(db, crypto, pageNumber, pageSize);
      res.json({
        success: true,
        data,
        pagination: { page: pageNumber, limit: pageSize, total, pages },
        timestamp: new Date(),
      });
    } catch (err) {
      logRouteError("GET /:id/news", err);
      sendError(res, 500, "Failed to fetch news");
    }
  }));

  router.get("/:id/on-chain", asyncHandler(async (req, res) => {
    const { id } = req.params;
    sendSuccess(res, {
      id,
      transactionsPerDay: 0,
      activeAddresses: 0,
      networkFees: 0,
      note: "Live API integration pending",
    });
  }));

  router.get("/:id/exchanges", requireCrypto, asyncHandler(async (req, res) => {
    try {
      const crypto = (req as Request & { crypto: Cryptocurrency }).crypto;
      const limit = parsePositiveInt(req.query.limit, 20);
      const data = await getExchangeVolumes(db, crypto.symbol, limit);
      sendSuccess(res, data ?? []);
    } catch (err) {
      logRouteError("GET /:id/exchanges", err);
      sendError(res, 500, "Failed to fetch exchanges");
    }
  }));

  return router;
}
