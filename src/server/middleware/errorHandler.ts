import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("[API Error]", err instanceof Error ? err.message : err);
  if (process.env.NODE_ENV !== "production" && err instanceof Error) {
    console.error(err.stack);
  }
  if (res.headersSent) return;
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: null,
    timestamp: new Date(),
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: null,
    timestamp: new Date(),
  });
}
