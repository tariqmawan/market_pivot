import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_production";

// ── Token generators ──────────────────────────────────────────────────────────
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

// ── Protected route middleware ────────────────────────────────────────────────
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token nahi mila — pehle login karo",
        timestamp: new Date(),
      });
    }

    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: "Token invalid ya expire ho gaya — dobara login karo",
      timestamp: new Date(),
    });
  }
}

// ── Admin-only middleware ─────────────────────────────────────────────────────
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Sirf admin access kar sakta hai",
        timestamp: new Date(),
      });
    }
    next();
  });
}
