import React from "react";
import { adminGet, adminPut, adminDelete } from "../api/client";
import type { AdminUser } from "../types";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import { useAuthStore } from "../../stores/authStore";

const ROLES = ["user", "admin", "editor", "analyst", "super_admin"];

export default function UsersPage() {
  const { user: actor } = useAuthStore();
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminGet<AdminUser[]>("/users", { page, limit: 20, search });
      setUsers(res.data);
      setTotal(res.pagination?.total ?? res.data.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const toggleActive = async (u: AdminUser) => {
    try {
      await adminPut(`/users/${u.id}/toggle`);
      setMessage(`${u.email} ${u.isActive ? "suspended" : "activated"}`);
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  };

  const changeRole = async (u: AdminUser, role: string) => {
    try {
      await adminPut(`/users/${u.id}/role`, { role });
      setMessage(`Role updated to ${role}`);
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Role update failed");
    }
  };

  const revokeSessions = async (u: AdminUser) => {
    if (!confirm(`Revoke all sessions for ${u.email}?`)) return;
    try {
      await adminDelete(`/users/${u.id}/sessions`);
      setMessage("Sessions revoked");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Revoke failed");
    }
  };

  return (
    <div className="mp-admin-content">
      <PageHeader title="User Management" subtitle="CRUD, roles, suspend, session control" />

      <div className="mp-admin-toolbar">
        <input
          className="mp-admin-search"
          placeholder="Search email or name…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <button type="button" className="mp-admin-action-btn" onClick={() => void load()}>
          Search
        </button>
      </div>

      {message ? <p className="mp-admin-success-text">{message}</p> : null}
      {error ? <p className="mp-admin-error-text">{error}</p> : null}

      <DataTable
        loading={loading}
        rows={users}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          {
            key: "role",
            label: "Role",
            render: (u) =>
              actor?.role === "super_admin" || actor?.role === "admin" ? (
                <select
                  value={u.role}
                  onChange={(e) => void changeRole(u, e.target.value)}
                  disabled={u.id === Number(actor?.id)}
                  className="mp-admin-select"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              ) : (
                u.role
              ),
          },
          {
            key: "isActive",
            label: "Status",
            render: (u) => (
              <span className={`mp-admin-status ${u.isActive ? "ok" : "warn"}`}>
                {u.isActive ? "Active" : "Suspended"}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (u) => (
              <div className="mp-admin-row-actions">
                <button type="button" className="mp-admin-link-btn" onClick={() => void toggleActive(u)}>
                  {u.isActive ? "Suspend" : "Activate"}
                </button>
                <button type="button" className="mp-admin-link-btn" onClick={() => void revokeSessions(u)}>
                  Revoke sessions
                </button>
              </div>
            ),
          },
        ]}
      />

      <div className="mp-admin-pagination">
        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>Page {page} · {total} users</span>
        <button type="button" disabled={users.length < 20} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
