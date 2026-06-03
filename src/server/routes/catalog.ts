// GET /api/catalog — unified symbol-search catalog.
// Reads the same JSON seed data the client used to import statically, so the
// symbol search dropdown (Watchlist, AddSymbol) still works without any
// client-side JSON imports. The data shape is a flat list of searchable
// instruments with the fields the picker needs (symbol, name, type, exchange).

import { Router, type Request, type Response } from "express";
import { readFileSync } from "fs";
import { join } from "path";

interface CatalogItem {
  symbol: string;
  name: string;
  type: "stock" | "currency" | "crypto" | "index" | "etf" | "commodity";
  exchange?: string;
  currency?: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

let cache: CatalogItem[] | null = null;
let cacheStamp = 0;
const CACHE_TTL_MS = 60_000; // refresh at most once per minute

function loadCatalog(): CatalogItem[] {
  const now = Date.now();
  if (cache && now - cacheStamp < CACHE_TTL_MS) return cache;
  cacheStamp = now;
  const dataDir = join(__dirname, "..", "..", "data");
  const result: CatalogItem[] = [];

  const safe = (path: string) => {
    try {
      return JSON.parse(readFileSync(join(dataDir, path), "utf8")) as unknown;
    } catch {
      return [];
    }
  };

  const stocks = safe("stocks.json") as Array<{ symbol?: string; name?: string; exchange?: string; currency?: string; price?: number; change?: number; changePercent?: number }>;
  for (const s of stocks) {
    if (s.symbol && s.name) {
      result.push({
        symbol: s.symbol,
        name: s.name,
        type: "stock",
        exchange: s.exchange,
        currency: s.currency,
        price: s.price,
        change: s.change,
        changePercent: s.changePercent,
      });
    }
  }

  const currencies = safe("currencies.json") as Array<{ code?: string; name?: string }>;
  for (const c of currencies) {
    if (c.code && c.name) {
      result.push({ symbol: c.code, name: c.name, type: "currency" });
    }
  }

  const cryptos = safe("cryptocurrencies.json") as Array<{ symbol?: string; name?: string; type?: string }>;
  for (const cr of cryptos) {
    if (cr.symbol && cr.name) {
      result.push({ symbol: cr.symbol, name: cr.name, type: "crypto" });
    }
  }

  cache = result;
  return result;
}

export function createCatalogRouter(): Router {
  const router = Router();

  // GET /api/catalog?q=APP&type=stock&limit=20
  router.get("/", (req: Request, res: Response) => {
    try {
      const q = String(req.query.q ?? "").trim().toLowerCase();
      const type = req.query.type ? String(req.query.type) : null;
      const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? "20"), 10) || 20));

      const all = loadCatalog();
      let filtered = all;
      if (type) filtered = filtered.filter((c) => c.type === type);
      if (q) {
        filtered = filtered.filter(
          (c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
        );
      }
      res.json({ success: true, data: filtered.slice(0, limit), total: filtered.length, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to load catalog", timestamp: new Date() });
    }
  });

  // GET /api/stocks/:symbol — single stock detail. Reuses the cached catalog.
  router.get("/:symbol", (req: Request, res: Response) => {
    try {
      const sym = String(req.params.symbol ?? "").toLowerCase();
      const all = loadCatalog().filter((c) => c.type === "stock");
      const found = all.find((c) => c.symbol.toLowerCase() === sym);
      if (!found) {
        res.status(404).json({ success: false, error: "Stock not found", timestamp: new Date() });
        return;
      }
      res.json({ success: true, data: found, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to load stock", timestamp: new Date() });
    }
  });

  return router;
}
