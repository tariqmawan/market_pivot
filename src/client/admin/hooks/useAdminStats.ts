import React from "react";
import { adminGet } from "../api/client";
import type { DashboardStats } from "../types";
import { useAuthStore } from "../../stores/authStore";

export function useAdminStats(live = true) {
  const { accessToken } = useAuthStore();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminGet<DashboardStats>("/stats");
      setStats(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    if (!live || !accessToken) return;

    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/ws/admin?token=${encodeURIComponent(accessToken)}`);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "stats" && stats) {
          setStats((s) =>
            s
              ? {
                  ...s,
                  users: { ...s.users, total: msg.data.users ?? s.users.total },
                  content: { ...s.content, news: msg.data.news ?? s.content.news },
                  sync: { running: msg.data.syncRunning ?? s.sync.running },
                }
              : s
          );
        }
      } catch {
        /* ignore */
      }
    };

    return () => ws.close();
  }, [live, accessToken, stats]);

  return { stats, loading, error, reload: load };
}
