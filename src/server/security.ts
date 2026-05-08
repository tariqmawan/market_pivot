import type { NextFunction, Request, Response } from "express";

const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:5173"];
const MAX_PAGE_SIZE = 100;

export const getAllowedOrigins = (): string[] => {
  const configured = process.env.CORS_ORIGIN;
  if (!configured) return DEFAULT_ALLOWED_ORIGINS;

  return configured
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || getAllowedOrigins().includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS origin denied"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
  );
  next();
};

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 300,
} = {}) => {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const record = hits.get(key);

    if (!record || record.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    record.count += 1;
    if (record.count > max) {
      res.status(429).json({
        success: false,
        error: "Too many requests",
        timestamp: new Date(),
      });
      return;
    }

    next();
  };
};

export const parsePositiveInt = (
  value: unknown,
  defaultValue: number,
  max = MAX_PAGE_SIZE
) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return defaultValue;
  }

  return Math.min(parsed, max);
};

export const sanitizeShortText = (value: unknown, maxLength = 80) => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, maxLength);
};
