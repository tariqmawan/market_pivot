import type { Request } from "express";

export function parsePagination(req: Request, defaultLimit = 20, maxLimit = 100) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(req.query.limit) || defaultLimit));
  const search = String(req.query.search ?? "").trim();
  const sortBy = String(req.query.sortBy ?? "");
  const sortDir = String(req.query.sortDir ?? "desc").toLowerCase() === "asc" ? "asc" : "desc";
  return { page, limit, search, sortBy, sortDir, offset: (page - 1) * limit };
}

export function paginationMeta(page: number, limit: number, total: number) {
  return { page, limit, total, pages: Math.ceil(total / limit) || 1 };
}
