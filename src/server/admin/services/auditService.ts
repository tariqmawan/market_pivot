import type { Knex } from "knex";
import type { Request } from "express";

export async function writeAuditLog(
  db: Knex,
  req: Request,
  action: string,
  resource: string,
  resourceId?: string | number,
  metadata?: Record<string, unknown>
) {
  try {
    await db("audit_logs").insert({
      actorId: req.user?.userId ?? null,
      actorEmail: req.user?.email ?? null,
      action,
      resource,
      resourceId: resourceId != null ? String(resourceId) : null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ipAddress: req.ip ?? null,
      userAgent: (req.headers["user-agent"] as string)?.slice(0, 255) ?? null,
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}
