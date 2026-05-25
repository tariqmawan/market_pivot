import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { isAdminRole, STAFF_ROLES, type UserRole } from "../lib/roles";
import { hasPermission, type Permission } from "../lib/permissions";

// ── JWT Payload ──────────────────────────────────────────────────────────────
export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// ── Separate secrets for access vs refresh tokens ────────────────────────────
// Using different secrets prevents "token confusion" attacks where an attacker
// could use a refresh token as an access token or vice versa.
const ACCESS_SECRET  = process.env.JWT_SECRET         || "change_this_access_secret_in_production";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "change_this_refresh_secret_in_production";

// ── Token expiration constants ───────────────────────────────────────────────
const ACCESS_TOKEN_EXPIRY  = "15m";                    // Short-lived: 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d";                     // Long-lived: 7 days
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

// ── Cookie name constant ─────────────────────────────────────────────────────
export const REFRESH_COOKIE_NAME = "mp_refresh";

// ── Token generators ─────────────────────────────────────────────────────────
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: JwtPayload): string {
  // Unique jti ensures token rotation never hits the DB unique constraint
  return jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

// ── Token verifiers ──────────────────────────────────────────────────────────
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

// Legacy alias — some routes may still call verifyToken
export const verifyToken = verifyAccessToken;

// ── HttpOnly Cookie helpers ──────────────────────────────────────────────────
// These ensure the refresh token is NEVER accessible to JavaScript.

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly:  true,                                     // JS can't read this cookie
    secure:    process.env.NODE_ENV === "production",    // HTTPS only in prod
    sameSite:  "strict",                                 // CSRF protection
    path:      "/api/auth",                              // Only sent to auth endpoints
    maxAge:    REFRESH_COOKIE_MAX_AGE,                   // 7 days
  });
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === "production",
    sameSite:  "strict",
    path:      "/api/auth",
  });
}

// ── Protected route middleware ────────────────────────────────────────────────
// Validates the access token from the Authorization header.
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
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: "Token invalid ya expire ho gaya — dobara login karo",
      timestamp: new Date(),
    });
  }
}

/** Require one of the given roles (after JWT auth) */
export function requireRole(...allowed: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      if (!req.user || !allowed.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: "Is route ke liye permission nahi hai",
          timestamp: new Date(),
        });
      }
      next();
    });
  };
}

// ── Admin dashboard + /api/admin ──────────────────────────────────────────────
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || !isAdminRole(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Sirf admin access kar sakta hai",
        timestamp: new Date(),
      });
    }
    next();
  });
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  requireRole("super_admin")(req, res, next);
}

/** Any staff role (admin, editor, analyst, super_admin) */
export function requireStaff(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || !STAFF_ROLES.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Staff access required",
        timestamp: new Date(),
      });
    }
    next();
  });
}

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    requireStaff(req, res, () => {
      if (!req.user || !hasPermission(req.user.role, permission)) {
        return res.status(403).json({
          success: false,
          error: "Insufficient permissions",
          timestamp: new Date(),
        });
      }
      next();
    });
  };
}
