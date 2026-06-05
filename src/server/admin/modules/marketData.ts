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
    const entity = req.params.entity;
    const cfg = ENTITIES[entity];
    if (!cfg) {
      return res.status(404).json({ success: false, error: "Unknown entity", timestamp: new Date() });
    }

    try {
      // For each entity we whitelist the columns the client is allowed to supply.
      // This is the symmetric counterpart of the `editable` allow-list used for PUT.
      const createable: Record<string, string[]> = {
        exchanges:       ["id", "name", "country", "countryCode", "region", "timezone", "currency", "mainIndex", "mainIndexName", "website", "description", "marketCap", "listedCompanies", "avgDailyVolume"],
        cryptos:         ["id", "symbol", "name", "description", "category", "maxSupply", "circulatingSupply"],
        currencies:      ["code", "name", "description", "centralBank", "symbol"],
        regions:         ["id", "name", "gdpGrowth", "inflation"],
        sectors:         ["id", "name", "performanceYtd", "peRatio"],
        commodities:     ["id", "name", "symbol", "category", "spotPrice", "changePercent24h"],
        etfs:            ["symbol", "name", "description"],
        indices:         ["symbol", "name", "description"],
      };
      const cols = createable[entity];
      if (!cols) {
        return res.status(400).json({ success: false, error: "Create not configured for this entity", timestamp: new Date() });
      }

      const row: Record<string, unknown> = { created_at: new Date(), updated_at: new Date() };
      for (const col of cols) {
        if (req.body[col] === undefined) continue;
        row[col] = typeof req.body[col] === "string"
          ? sanitizeShortText(req.body[col], 500)
          : req.body[col];
      }
      // Ensure primary key is present.
      if (!row[cfg.idCol]) {
        return res.status(400).json({ success: false, error: `${cfg.idCol} is required`, timestamp: new Date() });
      }

      await db(cfg.table).insert(row);
      await writeAuditLog(db, req, "market.create", cfg.table, String(row[cfg.idCol]));

      res.status(201).json({ success: true, data: row, timestamp: new Date() });
    } catch (error: unknown) {
      const msg = error instanceof Error && error.message.includes("duplicate")
        ? `${entity} already exists`
        : "Create failed";
      res.status(500).json({ success: false, error: msg, timestamp: new Date() });
    }
  });

  router.delete("/:entity/:id", requirePermission(PERMISSIONS.MARKET_EDIT), async (req, res) => {
    const cfg = ENTITIES[req.params.entity];
    if (!cfg) {
      return res.status(404).json({ success: false, error: "Unknown entity", timestamp: new Date() });
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
