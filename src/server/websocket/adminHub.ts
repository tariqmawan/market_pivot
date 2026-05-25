import type { Server } from "http";
import type { Knex } from "knex";
import { WebSocketServer, WebSocket } from "ws";
import { verifyAccessToken } from "../middleware/auth";
import { isStaffRole } from "../lib/roles";

let wss: WebSocketServer | null = null;

async function fetchStats(db: Knex) {
  const [users, news, sync] = await Promise.all([
    db("users").count("id as count").first(),
    db("news").count("id as count").first(),
    db("data_sync_jobs").where({ status: "running" }).count("id as count").first().catch(() => ({ count: 0 })),
  ]);
  return {
    users: Number(users?.count ?? 0),
    news: Number(news?.count ?? 0),
    syncRunning: Number(sync?.count ?? 0),
    at: new Date().toISOString(),
  };
}

export function initAdminWebSocket(server: Server, db: Knex) {
  wss = new WebSocketServer({ server, path: "/ws/admin" });

  wss.on("connection", (socket, req) => {
    const url = new URL(req.url ?? "", "http://localhost");
    const token = url.searchParams.get("token");
    if (!token) {
      socket.close(4001, "Unauthorized");
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      if (!isStaffRole(payload.role)) {
        socket.close(4003, "Forbidden");
        return;
      }
    } catch {
      socket.close(4001, "Invalid token");
      return;
    }

    const push = async () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "stats", data: await fetchStats(db) }));
      }
    };

    void push();
    const interval = setInterval(() => void push(), 15000);

    socket.on("close", () => clearInterval(interval));
  });
}

export function broadcastAdminEvent(type: string, data: unknown) {
  if (!wss) return;
  const msg = JSON.stringify({ type, data, at: new Date().toISOString() });
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  }
}
