import { Router } from "express";
import type { Knex } from "knex";
import { requirePermission } from "../../middleware/auth";
import { PERMISSIONS } from "../../lib/permissions";
import { writeAuditLog } from "../services/auditService";
import { parsePagination, paginationMeta } from "../services/pagination";
import { sanitizeShortText } from "../../security";

type EntityConfig = {
  table: string;
  idCol: string;
  editable?: string[];
  searchCols?: string[];
};

const ENTITIES: Record<string, EntityConfig> = {
  exchanges: { table: "exchanges", idCol: "id", editable: ["name", "description", "website", "marketCap", "listedCompanies", "avgDailyVolume"], searchCols: ["name", "id", "country"] },
  cryptos: { table: "cryptocurrencies", idCol: "id", editable: ["name", "description", "category", "maxSupply", "circulatingSupply"], searchCols: ["name", "symbol"] },
  currencies: { table: "currencies", idCol: "code", editable: ["name", "description", "centralBank"], searchCols: ["name", "code"] },
  regions: { table: "market_regions", idCol: "id", editable: ["name", "gdpGrowth", "inflation"], searchCols: ["name"] },
  sectors: { table: "stock_sectors", idCol: "id", editable: ["name", "performanceYtd", "peRatio"], searchCols: ["name"] },
  commodities: { table: "commodities", idCol: "id", editable: ["name", "spotPrice", "changePercent24h", "category"], searchCols: ["name", "symbol"] },
  etfs: { table: "etfs", idCol: "symbol", searchCols: ["name", "symbol"] },
  indices: { table: "indices", idCol: "symbol", searchCols: ["name", "symbol"] },
};

export function createMarketDataRouter(db: Knex) {
  const router = Router();

  router.get("/:entity", requirePermission(PERMISSIONS.MARKET_VIEW), async (req, res) => {
    const cfg = ENTITIES[req.params.entity];
    if (!cfg) return res.status(404).json({ success: false, error: "Unknown entity", timestamp: new Date() });

    try {
      const { page, limit, search, offset, sortBy, sortDir } = parsePagination(req, 50);
      let baseQuery = db(cfg.table);
      if (search && cfg.searchCols?.length) {
        baseQuery = baseQuery.where((qb) => {
          for (const col of cfg.searchCols!) {
            qb.orWhereILike(col, `%${search}%`);
          }
        });
      }

      const orderCol = sortBy && cfg.searchCols?.includes(sortBy) ? sortBy : cfg.idCol;
      const [data, countRow] = await Promise.all([
        baseQuery.clone().select("*").orderBy(orderCol, sortDir).offset(offset).limit(limit),
        baseQuery.clone().count(`${cfg.idCol} as count`).first(),
      ]);
      const total = Number(countRow?.count ?? 0);

      res.json({
        success: true,
        data,
        pagination: paginationMeta(page, limit, total),
        timestamp: new Date(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Fetch failed", timestamp: new Date() });
    }
  });

  router.put("/:entity/:id", requirePermission(PERMISSIONS.MARKET_EDIT), async (req, res) => {
    const cfg = ENTITIES[req.params.entity];
    if (!cfg?.editable) {
      return res.status(404).json({ success: false, error: "Entity not editable", timestamp: new Date() });
    }

    try {
      const updates: Record<string, unknown> = { updated_at: new Date() };
      for (const key of cfg.editable) {
        if (req.body[key] !== undefined) {
          updates[key] = typeof req.body[key] === "string" ? sanitizeShortText(req.body[key], 500) : req.body[key];
        }
      }
      await db(cfg.table).where({ [cfg.idCol]: req.params.id }).update(updates);
      await writeAuditLog(db, req, "market.update", cfg.table, req.params.id, updates);

      res.json({ success: true, data: { message: "Updated" }, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Update failed", timestamp: new Date() });
    }
  });

  router.post("/:entity", requirePermission(PERMISSIONS.MARKET_EDIT), async (req, res) => {
    const cfg = ENTITIES[req.params.entity];
    if (!cfg || req.params.entity !== "exchanges") {
      return res.status(400).json({ success: false, error: "Create only supported for exchanges", timestamp: new Date() });
    }

    try {
      const id = sanitizeShortText(req.body.id, 20);
      const name = sanitizeShortText(req.body.name, 120);
      if (!id || !name) {
        return res.status(400).json({ success: false, error: "id and name required", timestamp: new Date() });
      }

      const row = {
        id,
        name,
        country: sanitizeShortText(req.body.country, 80) || "Unknown",
        countryCode: sanitizeShortText(req.body.countryCode, 4) || "XX",
        region: sanitizeShortText(req.body.region, 80) || "Global",
        timezone: req.body.timezone || "UTC",
        currency: req.body.currency || "USD",
        tradingHours_open: "09:00",
        tradingHours_close: "17:00",
        mainIndex: req.body.mainIndex || id,
        mainIndexName: req.body.mainIndexName || name,
      };

      await db("exchanges").insert(row);
      await writeAuditLog(db, req, "market.create", "exchanges", id);

      res.status(201).json({ success: true, data: row, timestamp: new Date() });
    } catch (error: unknown) {
      const msg = error instanceof Error && error.message.includes("duplicate") ? "Exchange ID already exists" : "Create failed";
      res.status(500).json({ success: false, error: msg, timestamp: new Date() });
    }
  });

  router.delete("/:entity/:id", requirePermission(PERMISSIONS.MARKET_EDIT), async (req, res) => {
    const cfg = ENTITIES[req.params.entity];
    if (!cfg || req.params.entity !== "exchanges") {
      return res.status(400).json({ success: false, error: "Delete only supported for exchanges", timestamp: new Date() });
    }

    try {
      await db(cfg.table).where({ [cfg.idCol]: req.params.id }).delete();
      await writeAuditLog(db, req, "market.delete", cfg.table, req.params.id);
      res.json({ success: true, data: { message: "Deleted" }, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Delete failed", timestamp: new Date() });
    }
  });

  return router;
}
