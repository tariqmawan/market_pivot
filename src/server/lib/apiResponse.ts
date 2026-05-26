import type { Response } from "express";

export function sendError(
  res: Response,
  status: number,
  message: string,
  opts?: { error?: string | null }
) {
  res.status(status).json({
    success: false,
    message,
    error: opts?.error ?? null,
    timestamp: new Date(),
  });
}

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  res.status(status).json({ success: true, data, timestamp: new Date() });
}
