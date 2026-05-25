import { Router } from "express";
import type { Knex } from "knex";
import { requirePermission } from "../../middleware/auth";
import { PERMISSIONS } from "../../lib/permissions";
import { canAssignRole, isValidRole } from "../../lib/roles";
import { writeAuditLog } from "../services/auditService";
import { parsePagination, paginationMeta } from "../services/pagination";

export function createUsersRouter(db: Knex) {
  const router = Router();

  router.get("/", requirePermission(PERMISSIONS.USERS_VIEW), async (req, res) => {
    try {
      const { page, limit, search, offset } = parsePagination(req);
      let baseQuery = db("users");
      if (search) {
        baseQuery = baseQuery.where((qb) => {
          qb.whereILike("email", `%${search}%`).orWhereILike("name", `%${search}%`);
        });
      }

      const [data, [{ count }]] = await Promise.all([
        baseQuery.clone()
          .select("id", "name", "email", "role", "isActive", "isEmailVerified", "lastLoginAt", "created_at")
          .orderBy("created_at", "desc")
          .offset(offset)
          .limit(limit),
        baseQuery.clone().count("id as count"),
      ]);

      res.json({
        success: true,
        data,
        pagination: paginationMeta(page, limit, Number(count)),
        timestamp: new Date(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Users fetch failed", timestamp: new Date() });
    }
  });

  router.get("/:id/sessions", requirePermission(PERMISSIONS.USERS_VIEW), async (req, res) => {
    try {
      const sessions = await db("refresh_tokens")
        .where({ userId: req.params.id, isRevoked: false })
        .select("id", "userAgent", "ipAddress", "expiresAt", "created_at")
        .orderBy("created_at", "desc");
      res.json({ success: true, data: sessions, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Sessions fetch failed", timestamp: new Date() });
    }
  });

  router.get("/:id/login-history", requirePermission(PERMISSIONS.USERS_VIEW), async (req, res) => {
    try {
      const history = await db("login_history")
        .where({ userId: req.params.id })
        .orderBy("created_at", "desc")
        .limit(50)
        .catch(() => []);
      res.json({ success: true, data: history, timestamp: new Date() });
    } catch {
      res.json({ success: true, data: [], timestamp: new Date() });
    }
  });

  router.put("/:id/toggle", requirePermission(PERMISSIONS.USERS_EDIT), async (req, res) => {
    try {
      const user = await db("users").where({ id: req.params.id }).first();
      if (!user) return res.status(404).json({ success: false, error: "User not found", timestamp: new Date() });

      await db("users").where({ id: req.params.id }).update({ isActive: !user.isActive });
      await writeAuditLog(db, req, "user.suspend_toggle", "users", user.id, { isActive: !user.isActive });

      res.json({ success: true, data: { isActive: !user.isActive }, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Update failed", timestamp: new Date() });
    }
  });

  router.put("/:id/role", requirePermission(PERMISSIONS.USERS_ROLE), async (req, res) => {
    try {
      const { role } = req.body;
      if (!isValidRole(role)) {
        return res.status(400).json({ success: false, error: "Invalid role", timestamp: new Date() });
      }
      if (!canAssignRole(req.user!.role, role)) {
        return res.status(403).json({ success: false, error: "Not authorized to assign this role", timestamp: new Date() });
      }
      const targetId = Number(req.params.id);
      if (targetId === req.user!.userId) {
        return res.status(403).json({ success: false, error: "Cannot change your own role", timestamp: new Date() });
      }

      await db("users").where({ id: targetId }).update({ role });
      await writeAuditLog(db, req, "user.role_change", "users", targetId, { role });

      res.json({ success: true, data: { role }, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Role update failed", timestamp: new Date() });
    }
  });

  router.delete("/:id/sessions", requirePermission(PERMISSIONS.USERS_EDIT), async (req, res) => {
    try {
      await db("refresh_tokens").where({ userId: req.params.id }).update({ isRevoked: true });
      await writeAuditLog(db, req, "user.sessions_revoke", "users", req.params.id);
      res.json({ success: true, data: { message: "All sessions revoked" }, timestamp: new Date() });
    } catch {
      res.status(500).json({ success: false, error: "Revoke failed", timestamp: new Date() });
    }
  });

  return router;
}
