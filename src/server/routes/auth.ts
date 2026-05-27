import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import bcrypt from "bcryptjs";
import { sanitizeShortText } from "../security";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  requireAuth,
  setRefreshCookie,
  clearRefreshCookie,
  REFRESH_COOKIE_NAME,
} from "../middleware/auth";
import { resolveRegistrationRole, ROLES, type UserRole } from "../lib/roles";

function authUserDto(user: { id: number; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function issueSession(
  db: Knex,
  req: Request,
  res: Response,
  user: { id: number; email: string; role: string }
) {
  const payload = { userId: user.id, email: user.email, role: user.role as UserRole };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await db("refresh_tokens").insert({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: req.headers["user-agent"] ?? null,
    ipAddress: req.ip ?? null,
  });

  setRefreshCookie(res, refreshToken);
  return { accessToken, payload };
}

export function createRouter(db: Knex) {
  const router = Router();

  // ── POST /api/auth/register ───────────────────────────────────────────────
  router.post("/register", async (req: Request, res: Response) => {
    try {
      const name     = sanitizeShortText(req.body?.name,  60);
      const email    = sanitizeShortText(req.body?.email, 100).toLowerCase();
      const password = req.body?.password as string;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: "Name, email aur password zaroori hain",
          timestamp: new Date(),
        });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false, error: "Email sahi nahi hai", timestamp: new Date(),
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false, error: "Password kam se kam 8 characters ka hona chahiye", timestamp: new Date(),
        });
      }

      // Email pehle se exist karta hai?
      const existing = await db("users").where({ email }).first();
      if (existing) {
        return res.status(409).json({
          success: false, message: "Yeh email pehle se registered hai", timestamp: new Date(),
        });
      }

      // Password hash karo
      const hashedPassword = await bcrypt.hash(password, 12);

      // Server decides role — never trust req.body.role (privilege escalation prevention)
      const role = resolveRegistrationRole(req.body?.adminSetupSecret);

      // User banao
      const [userId] = await db("users")
        .insert({ name, email, password: hashedPassword, role })
        .returning("id");

      // Default watchlist banao
      await db("watchlists").insert({
        userId: userId.id ?? userId,
        name: "My Watchlist",
        items: JSON.stringify([]),
      });

      // Default preferences
      await db("user_preferences").insert({
        userId: String(userId.id ?? userId),
        baseCurrency: "USD",
        favoriteExchanges: JSON.stringify([]),
        favoriteCryptocurrencies: JSON.stringify([]),
        favoriteCurrencies: JSON.stringify([]),
        theme: "dark",
        layout: "grid",
      });

      const id = userId.id ?? userId;
      const { accessToken } = await issueSession(db, req, res, { id, email, role });

      return res.status(201).json({
        success: true,
        data: {
          user: { id, name, email, role },
          accessToken,
        },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ success: false, error: "Registration failed", timestamp: new Date() });
    }
  });

  // ── POST /api/auth/login ──────────────────────────────────────────────────
  router.post("/login", async (req: Request, res: Response) => {
    try {
      const email    = sanitizeShortText(req.body?.email, 100).toLowerCase();
      const password = req.body?.password as string;

      if (!email || !password) {
        return res.status(400).json({
          success: false, error: "Email aur password dono chahiye", timestamp: new Date(),
        });
      }

      // User dhundo
      const user = await db("users").where({ email }).first();
      if (!user) {
        return res.status(401).json({
          success: false, error: "Email ya password galat hai", timestamp: new Date(),
        });
      }

      // Account active hai?
      if (!user.isActive) {
        return res.status(403).json({
          success: false, error: "Account suspend kar diya gaya hai", timestamp: new Date(),
        });
      }

      // Password check karo
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false, error: "Email ya password galat hai", timestamp: new Date(),
        });
      }

      // Last login update karo
      await db("users").where({ id: user.id }).update({ lastLoginAt: new Date() });

      await db("login_history")
        .insert({
          userId: user.id,
          ipAddress: req.ip ?? null,
          userAgent: (req.headers["user-agent"] as string)?.slice(0, 255) ?? null,
          success: true,
        })
        .catch(() => undefined);

      // Purane tokens revoke karo (ek user ke max 5 sessions)
      const oldTokens = await db("refresh_tokens")
        .where({ userId: user.id, isRevoked: false })
        .orderBy("created_at", "asc");

      if (oldTokens.length >= 5) {
        await db("refresh_tokens")
          .where({ id: oldTokens[0].id })
          .update({ isRevoked: true });
      }

      const { accessToken } = await issueSession(db, req, res, user);

      return res.json({
        success: true,
        data: {
          user: authUserDto(user),
          accessToken,
        },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, error: "Login failed", timestamp: new Date() });
    }
  });

  // ── POST /api/auth/refresh ────────────────────────────────────────────────
  // ✅ Refresh token ab cookie se padha jaata hai — req.body se nahi
  router.post("/refresh", async (req: Request, res: Response) => {
    try {
      // Cookie se refresh token nikalo
      const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

      if (!refreshToken) {
        return res.status(401).json({
          success: false, error: "Refresh token nahi mila", timestamp: new Date(),
        });
      }

      // Token DB mein hai aur valid hai?
      const storedToken = await db("refresh_tokens")
        .where({ token: refreshToken, isRevoked: false })
        .first();

      if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
        // Cookie clear karo agar expired/invalid hai
        clearRefreshCookie(res);
        return res.status(401).json({
          success: false, error: "Refresh token invalid ya expire ho gaya", timestamp: new Date(),
        });
      }

      // JWT verify karo (with refresh secret)
      const decoded = verifyRefreshToken(refreshToken);
      const user = await db("users").where({ id: decoded.userId }).first();

      if (!user || !user.isActive) {
        clearRefreshCookie(res);
        return res.status(401).json({
          success: false, error: "User nahi mila ya inactive hai", timestamp: new Date(),
        });
      }

      // ── Token Rotation ─────────────────────────────────────────────────────
      // Purana token revoke karo — prevents replay attacks
      await db("refresh_tokens").where({ id: storedToken.id }).update({ isRevoked: true });

      // Naye tokens generate karo
      const payload = { userId: user.id, email: user.email, role: user.role };
      const newAccessToken  = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      // Naya refresh token DB mein save karo
      await db("refresh_tokens").insert({
        userId: user.id,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent:  req.headers["user-agent"] ?? null,
        ipAddress:  req.ip ?? null,
      });

      //  Naya refresh token cookie mein set karo (rotation complete)
      setRefreshCookie(res, newRefreshToken);

      return res.json({
        success: true,
        data: { accessToken: newAccessToken },
        //  refreshToken response body mein NAHI — sirf cookie mein
        timestamp: new Date(),
      });
    } catch (error) {
      clearRefreshCookie(res);
      res.status(401).json({ success: false, error: "Token refresh failed", timestamp: new Date() });
    }
  });

  // ── POST /api/auth/logout ─────────────────────────────────────────────────
  //  Refresh token cookie se padha jaata hai + cookie clear hoti hai
  router.post("/logout", requireAuth, async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

      if (refreshToken) {
        // DB mein revoke karo
        await db("refresh_tokens")
          .where({ token: refreshToken, userId: req.user!.userId })
          .update({ isRevoked: true });
      }

      //  Cookie clear karo
      clearRefreshCookie(res);

      return res.json({
        success: true, data: { message: "Logout successful" }, timestamp: new Date(),
      });
    } catch (error) {
      // Even on error, clear the cookie
      clearRefreshCookie(res);
      res.status(500).json({ success: false, error: "Logout failed", timestamp: new Date() });
    }
  });

  // ── GET /api/auth/me ──────────────────────────────────────────────────────
  router.get("/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await db("users")
        .where({ id: req.user!.userId })
        .select("id", "name", "email", "role", "isActive", "isEmailVerified", "lastLoginAt", "created_at")
        .first();

      if (!user) {
        return res.status(404).json({
          success: false, error: "User nahi mila", timestamp: new Date(),
        });
      }

      // Preferences bhi saath mein do
      const preferences = await db("user_preferences")
        .where({ userId: String(user.id) })
        .first();

      return res.json({
        success: true,
        data: { ...user, preferences: preferences ?? null },
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Profile fetch failed", timestamp: new Date() });
    }
  });

  // ── PUT /api/auth/me ── Profile update ───────────────────────────────────
  router.put("/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const name = sanitizeShortText(req.body?.name, 60);
      if (!name) {
        return res.status(400).json({
          success: false, error: "Name zaroori hai", timestamp: new Date(),
        });
      }

      await db("users")
        .where({ id: req.user!.userId })
        .update({ name, updated_at: new Date() });

      return res.json({
        success: true, data: { message: "Profile update ho gaya" }, timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Profile update failed", timestamp: new Date() });
    }
  });

  // ── PUT /api/auth/change-password ─────────────────────────────────────────
  router.put("/change-password", requireAuth, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false, error: "Purana aur naya dono password chahiye", timestamp: new Date(),
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false, error: "Naya password kam se kam 8 characters ka hona chahiye", timestamp: new Date(),
        });
      }

      const user = await db("users").where({ id: req.user!.userId }).first();
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false, error: "Purana password galat hai", timestamp: new Date(),
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await db("users").where({ id: req.user!.userId }).update({ password: hashedPassword });

      // Sare refresh tokens revoke karo (security ke liye)
      await db("refresh_tokens")
        .where({ userId: req.user!.userId })
        .update({ isRevoked: true });

      // Cookie bhi clear karo — user ko dobara login karna hoga
      clearRefreshCookie(res);

      return res.json({
        success: true, data: { message: "Password badal gaya — dobara login karo" }, timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Password change failed", timestamp: new Date() });
    }
  });

  return router;
}
