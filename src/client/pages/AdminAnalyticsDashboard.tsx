import React from "react";
import { useLocation } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Area, AreaChart, Pie, PieChart, Tooltip, Cell } from "recharts";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import GlassCard from "../components/admin/GlassCard";
import { useAuthStore } from "../stores/authStore";
import AdminPanel from "./AdminPanel";

type Datum = { x: string; revenue: number; sales: number; profit: number; growth: number };

function sampleData(): Datum[] {
  return [
    { x: "Jan", revenue: 42, sales: 28, profit: 16, growth: 7.2 },
    { x: "Feb", revenue: 46, sales: 31, profit: 19, growth: 8.1 },
    { x: "Mar", revenue: 51, sales: 34, profit: 22, growth: 9.0 },
    { x: "Apr", revenue: 48, sales: 33, profit: 20, growth: 7.8 },
    { x: "May", revenue: 58, sales: 40, profit: 26, growth: 10.4 },
    { x: "Jun", revenue: 62, sales: 44, profit: 29, growth: 11.1 },
    { x: "Jul", revenue: 60, sales: 41, profit: 27, growth: 9.9 },
    { x: "Aug", revenue: 66, sales: 46, profit: 31, growth: 12.2 },
  ];
}

function StatChip({ label, value, tone }: { label: string; value: string; tone: "pos" | "neg" | "neu" }) {
  return (
    <div className={`mp-admin-kpi mp-admin-kpi-${tone}`}>
      <span className="mp-admin-kpi-label">{label}</span>
      <strong className="mp-admin-kpi-value">{value}</strong>
    </div>
  );
}

function Progress({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="mp-admin-progress">
      <div className="mp-admin-progress-top">
        <span>{label}</span>
        <span className="mp-admin-progress-val">{pct}%</span>
      </div>
      <div className="mp-admin-progress-track">
        <div className="mp-admin-progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AvatarStack() {
  const users = ["A", "M", "K", "S", "J"];
  return (
    <div className="mp-admin-avatar-stack" aria-label="Team avatars">
      {users.map((u, i) => (
        <div key={u} className="mp-admin-avatar" style={{ left: i * -10 }}>
          {u}
        </div>
      ))}
    </div>
  );
}

function RecentActivity() {
  const items = [
    { t: "11m ago", text: "Invoice batch synced", who: "Billing" },
    { t: "38m ago", text: "Role updated for finance team", who: "RBAC" },
    { t: "2h ago", text: "New payout scheduled", who: "Payments" },
    { t: "Yesterday", text: "Customer churn risk flagged", who: "Signals" },
    { t: "2d ago", text: "Audit log exported", who: "Compliance" },
  ];

  return (
    <div className="mp-admin-activity">
      {items.map((it, idx) => (
        <div key={idx} className="mp-admin-activity-row">
          <span className="mp-admin-activity-time">{it.t}</span>
          <div className="mp-admin-activity-dot" aria-hidden="true" />
          <div className="mp-admin-activity-main">
            <div className="mp-admin-activity-text">{it.text}</div>
            <div className="mp-admin-activity-who">{it.who}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DataTable() {
  const rows = [
    { id: "INV-1042", customer: "Apex Capital", plan: "Pro", mrr: 12000, status: "Active" },
    { id: "INV-1041", customer: "Northwind", plan: "Enterprise", mrr: 34000, status: "Active" },
    { id: "INV-1039", customer: "BluePeak", plan: "Pro", mrr: 9800, status: "Past Due" },
    { id: "INV-1037", customer: "Helio Labs", plan: "Growth", mrr: 7400, status: "Active" },
    { id: "INV-1032", customer: "Quanta Systems", plan: "Enterprise", mrr: 41000, status: "Active" },
  ];

  return (
    <div className="mp-admin-table-wrap">
      <table className="mp-admin-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Plan</th>
            <th className="mp-admin-table-right">MRR</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.customer}</td>
              <td>{r.plan}</td>
              <td className="mp-admin-table-right">${r.mrr.toLocaleString()}</td>
              <td>
                <span className={`mp-admin-status ${r.status === "Active" ? "ok" : "warn"}`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  status: "Active" | "Suspended";
  lastActive: string;
};

type CustomerFormState = Omit<CustomerRow, "id">;

function hashToInt(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function planFromEmail(email: string): CustomerRow["plan"] {
  const h = hashToInt(email.toLowerCase());
  const mod = h % 100;
  if (mod < 55) return "Free";
  if (mod < 85) return "Pro";
  return "Enterprise";
}

function statusFromEmail(email: string): CustomerRow["status"] {
  const h = hashToInt(email.toLowerCase());
  return h % 10 === 0 ? "Suspended" : "Active";
}

function lastActiveFromEmail(email: string): string {
  const h = hashToInt(email.toLowerCase());
  const mins = h % 1400;
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const defaultCustomerRows = (seedEmail?: string | null): CustomerRow[] => {
  const base: Array<{ name: string; email: string }> = [
    { name: "Apex Capital", email: "apex@capital.com" },
    { name: "Northwind Trading", email: "hello@northwind.com" },
    { name: "BluePeak Labs", email: "team@bluepeak.io" },
    { name: "Helio Systems", email: "admin@helio.co" },
    { name: "Quanta Finance", email: "ops@quantafinance.com" },
    { name: "Orchid Markets", email: "contact@orchidmarkets.com" },
    { name: "Violet Ridge", email: "support@violetrid.ge" },
    { name: "Atlas Quant", email: "hi@atlasquant.ai" },
    { name: "Saffron Capital", email: "saffron@capital.in" },
    { name: "Cobalt Partners", email: "cobalt@partners.net" },
  ];

  const includeSeed = seedEmail ? { name: "Current Admin User", email: seedEmail } : null;
  return [...(includeSeed ? [includeSeed] : []), ...base].slice(0, 12).map((u) => ({
    id: `u_${hashToInt(u.email)}`,
    name: u.name,
    email: u.email,
    plan: planFromEmail(u.email),
    status: statusFromEmail(u.email),
    lastActive: lastActiveFromEmail(u.email),
  }));
};

const emptyCustomerForm: CustomerFormState = {
  name: "",
  email: "",
  plan: "Free",
  status: "Active",
  lastActive: "Just now",
};

function CustomersTable({ seedEmail }: { seedEmail?: string | null }) {
  const storageKey = "mp_admin_customers";
  const [rows, setRows] = React.useState<CustomerRow[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultCustomerRows(seedEmail);
  });
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<CustomerFormState>(emptyCustomerForm);
  const editing = editingId !== null;

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(rows));
  }, [rows]);

  const openCreate = () => {
    setEditingId("new");
    setForm(emptyCustomerForm);
  };

  const openEdit = (row: CustomerRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      email: row.email,
      plan: row.plan,
      status: row.status,
      lastActive: row.lastActive,
    });
  };

  const closeEditor = () => {
    setEditingId(null);
    setForm(emptyCustomerForm);
  };

  const saveCustomer = () => {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    if (!trimmedName || !trimmedEmail) {
      alert("Name and email are required.");
      return;
    }

    if (editingId === "new") {
      const id = `u_${Date.now()}`;
      setRows((current) => [{ id, ...form, name: trimmedName, email: trimmedEmail }, ...current]);
    } else if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId ? { ...row, ...form, name: trimmedName, email: trimmedEmail } : row
        )
      );
    }
    closeEditor();
  };

  const deleteCustomer = (id: string) => {
    const customer = rows.find((row) => row.id === id);
    if (!customer) return;
    const confirmed = window.confirm(`Delete ${customer.name}?`);
    if (!confirmed) return;
    setRows((current) => current.filter((row) => row.id !== id));
  };

  const resetCustomers = () => {
    const confirmed = window.confirm("Reset customer list to demo defaults?");
    if (!confirmed) return;
    setRows(defaultCustomerRows(seedEmail));
  };

  const counts = rows.reduce(
    (acc, r) => {
      acc.total++;
      acc[r.plan]++;
      return acc;
    },
    { total: 0, Free: 0, Pro: 0, Enterprise: 0 } as Record<"total" | CustomerRow["plan"], number>
  );

  return (
    <div>
      <div className="mp-admin-titlebar">
        <div>
          <h1>Customers</h1>
          <p>Add, edit, update, delete, suspend, and reset customer records for the admin console.</p>
        </div>
        <button type="button" className="mp-admin-action-btn" onClick={openCreate}>
          Add Customer
        </button>
      </div>

      <section className="mp-admin-grid-3" style={{ marginBottom: 12 }}>
        <GlassCard>
          <StatChip label="Total Customers" value={String(counts.total)} tone="neu" />
        </GlassCard>
        <GlassCard>
          <StatChip label="Paid Users" value={String(counts.Pro + counts.Enterprise)} tone="pos" />
        </GlassCard>
        <GlassCard>
          <StatChip label="Free Users" value={String(counts.Free)} tone="neg" />
        </GlassCard>
      </section>

      <section>
        <GlassCard>
          <div className="mp-admin-card-head">
            <h2>User List</h2>
            <button type="button" className="link-button" onClick={resetCustomers}>
              Reset defaults
            </button>
          </div>

          <div className="mp-admin-table-wrap">
            <table className="mp-admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th className="mp-admin-table-right">Last Active</th>
                  <th className="mp-admin-table-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td style={{ opacity: 0.9 }}>{r.email}</td>
                    <td>
                      <span
                        className={`mp-admin-status ${
                          r.plan === "Enterprise" ? "ok" : r.plan === "Pro" ? "warn" : ""
                        }`}
                      >
                        {r.plan}
                      </span>
                    </td>
                    <td>
                      <span className={`mp-admin-status ${r.status === "Active" ? "ok" : "warn"}`}>{r.status}</span>
                    </td>
                    <td className="mp-admin-table-right">{r.lastActive}</td>
                    <td className="mp-admin-table-right">
                      <button type="button" className="secondary-action" onClick={() => openEdit(r)}>
                        Edit
                      </button>
                      <button type="button" className="link-button" onClick={() => deleteCustomer(r.id)} style={{ marginLeft: 8 }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {editing && (
        <div className="modal-overlay" onClick={closeEditor}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h2>{editingId === "new" ? "Add Customer" : "Edit Customer"}</h2>
            </div>
            <div className="mp-admin-customer-form">
              <label>
                Name
                <input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
              </label>
              <label>
                Email
                <input value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
              </label>
              <label>
                Plan
                <select value={form.plan} onChange={(e) => setForm((current) => ({ ...current, plan: e.target.value as CustomerRow["plan"] }))}>
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </label>
              <label>
                Status
                <select value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value as CustomerRow["status"] }))}>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>
              <label>
                Last Active
                <input value={form.lastActive} onChange={(e) => setForm((current) => ({ ...current, lastActive: e.target.value }))} />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button type="button" className="primary-action" onClick={saveCustomer}>
                {editingId === "new" ? "Create" : "Update"}
              </button>
              <button type="button" className="secondary-action" onClick={closeEditor}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type RolePermission = "Analytics" | "Customers" | "Billing" | "Market Data" | "Settings";

type AdminRole = {
  id: string;
  name: string;
  description: string;
  members: number;
  status: "Active" | "Limited";
  permissions: RolePermission[];
};

const allPermissions: RolePermission[] = ["Analytics", "Customers", "Billing", "Market Data", "Settings"];

const initialRoles: AdminRole[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full console access, security controls, billing, and data operations.",
    members: 2,
    status: "Active",
    permissions: ["Analytics", "Customers", "Billing", "Market Data", "Settings"],
  },
  {
    id: "finance",
    name: "Finance Manager",
    description: "Revenue, billing, payouts, invoices, and customer plan visibility.",
    members: 4,
    status: "Active",
    permissions: ["Analytics", "Customers", "Billing"],
  },
  {
    id: "editor",
    name: "Market Data Editor",
    description: "Maintains exchanges, currencies, crypto, sector, region, and commodity data.",
    members: 7,
    status: "Active",
    permissions: ["Analytics", "Market Data"],
  },
  {
    id: "support",
    name: "Support Analyst",
    description: "Read-only customer visibility for account support and triage.",
    members: 11,
    status: "Limited",
    permissions: ["Customers"],
  },
];

function AdminRolesPage() {
  const [roles, setRoles] = React.useState<AdminRole[]>(initialRoles);
  const [selectedId, setSelectedId] = React.useState(initialRoles[0].id);
  const selectedRole = roles.find((role) => role.id === selectedId) ?? roles[0];
  const activeRoles = roles.filter((role) => role.status === "Active").length;
  const totalMembers = roles.reduce((sum, role) => sum + role.members, 0);

  const togglePermission = (roleId: string, permission: RolePermission) => {
    setRoles((current) =>
      current.map((role) => {
        if (role.id !== roleId) return role;
        const hasPermission = role.permissions.includes(permission);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter((item) => item !== permission)
            : [...role.permissions, permission],
        };
      })
    );
  };

  return (
    <>
      <div className="mp-admin-titlebar">
        <div>
          <h1>Roles & Access</h1>
          <p>Manage admin roles, permission groups, and operational access levels.</p>
        </div>
        <button type="button" className="mp-admin-action-btn">
          New Role
        </button>
      </div>

      <section className="mp-admin-grid-3">
        <GlassCard>
          <StatChip label="Total Roles" value={String(roles.length)} tone="neu" />
        </GlassCard>
        <GlassCard>
          <StatChip label="Active Roles" value={String(activeRoles)} tone="pos" />
        </GlassCard>
        <GlassCard>
          <StatChip label="Assigned Users" value={String(totalMembers)} tone="neu" />
        </GlassCard>
      </section>

      <section className="mp-admin-grid-2 mp-admin-roles-layout">
        <GlassCard>
          <div className="mp-admin-card-head">
            <h2>Role Directory</h2>
            <span className="mp-admin-muted">Select a role</span>
          </div>

          <div className="mp-admin-role-list">
            {roles.map((role) => (
              <button
                type="button"
                key={role.id}
                className={`mp-admin-role-row ${selectedRole.id === role.id ? "active" : ""}`}
                onClick={() => setSelectedId(role.id)}
              >
                <span className="mp-admin-role-mark">{role.name.charAt(0)}</span>
                <span className="mp-admin-role-main">
                  <strong>{role.name}</strong>
                  <small>{role.description}</small>
                </span>
                <span className={`mp-admin-status ${role.status === "Active" ? "ok" : "warn"}`}>{role.status}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mp-admin-card-head">
            <h2>{selectedRole.name}</h2>
            <span className="mp-admin-muted">{selectedRole.members} members</span>
          </div>

          <div className="mp-admin-role-detail">
            <p>{selectedRole.description}</p>
            <div className="mp-admin-permission-grid">
              {allPermissions.map((permission) => {
                const enabled = selectedRole.permissions.includes(permission);
                return (
                  <button
                    type="button"
                    key={permission}
                    className={`mp-admin-permission ${enabled ? "enabled" : ""}`}
                    onClick={() => togglePermission(selectedRole.id, permission)}
                    aria-pressed={enabled}
                  >
                    <span>{permission}</span>
                    <strong>{enabled ? "Enabled" : "Off"}</strong>
                  </button>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </section>

      <section>
        <GlassCard>
          <div className="mp-admin-card-head">
            <h2>Permission Matrix</h2>
            <span className="mp-admin-muted">Current access map</span>
          </div>
          <div className="mp-admin-table-wrap">
            <table className="mp-admin-table">
              <thead>
                <tr>
                  <th>Role</th>
                  {allPermissions.map((permission) => (
                    <th key={permission}>{permission}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    {allPermissions.map((permission) => (
                      <td key={permission}>
                        <span className={`mp-admin-access-dot ${role.permissions.includes(permission) ? "on" : ""}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>
    </>
  );
}

function ToggleCard({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" className={`mp-admin-toggle-card ${enabled ? "on" : ""}`} onClick={onToggle} aria-pressed={enabled}>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <i aria-hidden="true" />
    </button>
  );
}

function AdminSettingsPage() {
  const [settings, setSettings] = React.useState({
    maintenance: false,
    dataSync: true,
    auditTrail: true,
    emailAlerts: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <>
      <div className="mp-admin-titlebar">
        <div>
          <h1>Admin Settings</h1>
          <p>Control platform operations, notifications, security, and market data content.</p>
        </div>
        <button type="button" className="mp-admin-action-btn">
          Save Changes
        </button>
      </div>

      <section className="mp-admin-settings-hero">
        <GlassCard>
          <div className="mp-admin-settings-callout">
            <span>Environment</span>
            <strong>Production Console</strong>
            <p>All switches are local UI controls right now. Wire these to backend configuration when admin APIs are ready.</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mp-admin-settings-summary">
            <div>
              <span>Security</span>
              <strong>Audit trail on</strong>
            </div>
            <div>
              <span>Data Sync</span>
              <strong>{settings.dataSync ? "Active" : "Paused"}</strong>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="mp-admin-grid-2">
        <GlassCard>
          <div className="mp-admin-card-head">
            <h2>Platform Controls</h2>
            <span className="mp-admin-muted">Runtime flags</span>
          </div>
          <div className="mp-admin-toggle-list">
            <ToggleCard
              title="Maintenance Mode"
              description="Temporarily gate public market pages during critical updates."
              enabled={settings.maintenance}
              onToggle={() => toggle("maintenance")}
            />
            <ToggleCard
              title="Market Data Sync"
              description="Allow scheduled exchange, FX, crypto, sector, and commodity refresh jobs."
              enabled={settings.dataSync}
              onToggle={() => toggle("dataSync")}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mp-admin-card-head">
            <h2>Security & Alerts</h2>
            <span className="mp-admin-muted">Admin notifications</span>
          </div>
          <div className="mp-admin-toggle-list">
            <ToggleCard
              title="Audit Trail"
              description="Record admin edits, role changes, and data manager operations."
              enabled={settings.auditTrail}
              onToggle={() => toggle("auditTrail")}
            />
            <ToggleCard
              title="Email Alerts"
              description="Notify owners when billing, role, or data quality events need attention."
              enabled={settings.emailAlerts}
              onToggle={() => toggle("emailAlerts")}
            />
          </div>
        </GlassCard>
      </section>

      <section className="mp-admin-grid-3">
        {[
          ["API Health", "99.98%", "ok"],
          ["Pending Reviews", "12", "warn"],
          ["Content Pillars", "6", "ok"],
        ].map(([label, value, tone]) => (
          <GlassCard key={label}>
            <StatChip label={label} value={value} tone={tone === "warn" ? "neg" : "pos"} />
          </GlassCard>
        ))}
      </section>

      <section className="mp-admin-settings-data">
        <GlassCard>
          <div className="mp-admin-card-head">
            <h2>Market Data Manager</h2>
            <span className="mp-admin-muted">LocalStorage backed editor</span>
          </div>
          <AdminPanel />
        </GlassCard>
      </section>
    </>
  );
}

function SimplePanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="mp-admin-titlebar">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </>
  );
}

const adminModuleCopy: Record<string, { title: string; subtitle: string; metrics: Array<[string, string, "pos" | "neg" | "neu"]> }> = {
  "api-usage": {
    title: "API Usage",
    subtitle: "Rate limits, endpoint traffic, plan usage, and subscription-based access controls.",
    metrics: [["Requests Today", "1.8M", "pos"], ["Avg Latency", "142ms", "neu"], ["Limit Breaches", "3", "neg"]],
  },
  "data-sync": {
    title: "Data Sync Status",
    subtitle: "Exchange, stock, FX, crypto, commodity, region, and sector refresh monitoring.",
    metrics: [["Healthy Jobs", "42", "pos"], ["Queued Imports", "7", "neu"], ["Failed Jobs", "1", "neg"]],
  },
  "news-ingestion": {
    title: "News Ingestion",
    subtitle: "Feed imports, deduplication, AI summaries, and article publishing status.",
    metrics: [["Feeds Online", "18", "pos"], ["Drafts", "26", "neu"], ["Needs Review", "5", "neg"]],
  },
  "news-cms": {
    title: "News CMS",
    subtitle: "Publishing, categories, tags, featured articles, AI summaries, and SEO metadata.",
    metrics: [["Published", "312", "pos"], ["Featured", "9", "neu"], ["Review Queue", "14", "neg"]],
  },
  "economic-calendar": {
    title: "Economic Calendar Management",
    subtitle: "Central bank meetings, CPI, GDP, employment data, FOMC events, and recurring releases.",
    metrics: [["Events", "184", "neu"], ["High Impact", "28", "neg"], ["API Linked", "6", "pos"]],
  },
  seo: {
    title: "SEO Management",
    subtitle: "Meta titles, schema markup, sitemap generation, URL management, and canonical controls.",
    metrics: [["Indexed Pages", "2.4K", "pos"], ["Schema Types", "11", "neu"], ["Warnings", "8", "neg"]],
  },
  ads: {
    title: "Advertisement Management",
    subtitle: "Banner placements, sponsored content, campaign analytics, and ad manager integrations.",
    metrics: [["Campaigns", "12", "pos"], ["Fill Rate", "78%", "neu"], ["Pending Creatives", "4", "neg"]],
  },
  "api-management": {
    title: "API Management",
    subtitle: "API keys, rate limiting, usage analytics, endpoint monitoring, and paid access.",
    metrics: [["Active Keys", "86", "pos"], ["Endpoints", "34", "neu"], ["Revoked Keys", "2", "neg"]],
  },
  "ai-analytics": {
    title: "AI & Analytics",
    subtitle: "Future scaling workspace for AI summaries, sentiment, reports, and recommendations.",
    metrics: [["Models", "4", "neu"], ["Reports", "128", "pos"], ["Review Needed", "11", "neg"]],
  },
};

const marketDataTabs = new Set(["exchanges", "stocks", "forex", "crypto", "commodities", "regions", "sectors"]);

function EnterpriseAdminModule({ tab }: { tab: string }) {
  const fallback = {
    title: "Admin Module",
    subtitle: "Enterprise console workspace for this platform area.",
    metrics: [["Status", "Ready", "pos"], ["Tasks", "0", "neu"], ["Alerts", "0", "neu"]],
  } satisfies (typeof adminModuleCopy)[string];
  const module = adminModuleCopy[tab] ?? fallback;

  return (
    <SimplePanel title={module.title} subtitle={module.subtitle}>
      <section className="mp-admin-grid-3">
        {module.metrics.map(([label, value, tone]) => (
          <GlassCard key={label}>
            <StatChip label={label} value={value} tone={tone} />
          </GlassCard>
        ))}
      </section>

      <section className="mp-admin-grid-2">
        <GlassCard>
          <div className="mp-admin-card-head">
            <h2>Operational Scope</h2>
            <span className="mp-admin-muted">Planned controls</span>
          </div>
          <div className="mp-admin-progress-stack">
            <Progress label="CRUD workflows" value={72} />
            <Progress label="API integration" value={58} />
            <Progress label="Audit coverage" value={64} />
          </div>
        </GlassCard>
        <GlassCard>
          <div className="mp-admin-card-head">
            <h2>Recent Activity</h2>
            <span className="mp-admin-muted">Module timeline</span>
          </div>
          <RecentActivity />
        </GlassCard>
      </section>
    </SimplePanel>
  );
}

export default function AdminAnalyticsDashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const data = React.useMemo(() => sampleData(), []);
  const { user } = useAuthStore();
  const location = useLocation();

  const tab = React.useMemo(() => new URLSearchParams(location.search).get("tab") || "", [location.search]);

  const lineData = data.map((d) => ({ name: d.x, value: d.revenue }));
  const areaData = data.map((d) => ({ name: d.x, value: d.sales }));
  const donutData = [
    { name: "Revenue", value: 58, color: "#A27841" },
    { name: "Profit", value: 28, color: "#d1aa72" },
    { name: "Operating", value: 14, color: "#6f4d25" },
  ];

  const renderMain = () => {
    if (marketDataTabs.has(tab)) {
      return (
        <main className="mp-admin-content">
          <SimplePanel
            title="Market Data Management"
            subtitle="Manage exchanges, stocks, forex, crypto, commodities, regions, and sectors from the local data editor."
          >
            <GlassCard>
              <AdminPanel />
            </GlassCard>
          </SimplePanel>
        </main>
      );
    }

    if (adminModuleCopy[tab]) {
      return (
        <main className="mp-admin-content">
          <EnterpriseAdminModule tab={tab} />
        </main>
      );
    }

    if (tab === "customers") {
      return (
        <main className="mp-admin-content">
          <CustomersTable seedEmail={user?.email ?? null} />
        </main>
      );
    }

    if (tab === "roles") {
      return (
        <main className="mp-admin-content">
          <AdminRolesPage />
        </main>
      );
    }

    if (tab === "settings") {
      return (
        <main className="mp-admin-content">
          <AdminSettingsPage />
        </main>
      );
    }

    // Remaining sidebar tabs: render working demo panels so every menu item loads.
    if (tab === "revenue") {
      return (
        <main className="mp-admin-content">
          <SimplePanel title="Revenue" subtitle="Demo charts and KPIs."
          >
            <section className="mp-admin-grid-3">
              <GlassCard>
                <StatChip label="ARR" value="$9.84M" tone="pos" />
              </GlassCard>
              <GlassCard>
                <StatChip label="MRR" value="$820K" tone="pos" />
              </GlassCard>
              <GlassCard>
                <StatChip label="Churn" value="1.8%" tone="neu" />
              </GlassCard>
            </section>

            <section className="mp-admin-grid-2">
              <GlassCard className="mp-admin-chart-card">
                <div className="mp-admin-card-head">
                  <h2>Revenue Trend</h2>
                  <span className="mp-admin-muted">Last 8 months</span>
                </div>
                <div className="mp-admin-chart">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={lineData}>
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#A27841" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard className="mp-admin-chart-card">
                <div className="mp-admin-card-head">
                  <h2>Revenue Mix</h2>
                  <span className="mp-admin-muted">Donut overview</span>
                </div>
                <div className="mp-admin-chart">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Tooltip />
                      <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                        {donutData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </section>
          </SimplePanel>
        </main>
      );
    }

    if (tab === "payouts") {
      return (
        <main className="mp-admin-content">
          <SimplePanel title="Payouts" subtitle="Demo payouts table + recent activity.">
            <section className="mp-admin-grid-2">
              <GlassCard>
                <div className="mp-admin-card-head">
                  <h2>Recent Payouts</h2>
                  <span className="mp-admin-muted">Generated data</span>
                </div>
                <DataTable />
              </GlassCard>
              <GlassCard>
                <div className="mp-admin-card-head">
                  <h2>Activity</h2>
                  <span className="mp-admin-muted">Timeline</span>
                </div>
                <RecentActivity />
              </GlassCard>
            </section>
          </SimplePanel>
        </main>
      );
    }

    if (tab === "billing") {
      return (
        <main className="mp-admin-content">
          <SimplePanel title="Billing" subtitle="Demo billing KPIs and controls.">
            <section className="mp-admin-grid-3">
              <GlassCard>
                <StatChip label="Invoices" value="142" tone="neu" />
              </GlassCard>
              <GlassCard>
                <StatChip label="Paid" value="128" tone="pos" />
              </GlassCard>
              <GlassCard>
                <StatChip label="Due" value="14" tone="neg" />
              </GlassCard>
            </section>

            <section className="mp-admin-grid-2">
              <GlassCard>
                <div className="mp-admin-card-head">
                  <h2>Invoice List</h2>
                  <span className="mp-admin-muted">Data table</span>
                </div>
                <DataTable />
              </GlassCard>
              <GlassCard>
                <div className="mp-admin-card-head">
                  <h2>Sales Distribution</h2>
                  <span className="mp-admin-muted">Area chart</span>
                </div>
                <div className="mp-admin-chart">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={areaData}>
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#A27841" fill="#A27841" fillOpacity={0.18} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </section>
          </SimplePanel>
        </main>
      );
    }

    const systemHealth = [
      ["Exchange Uptime", 99],
      ["Data Sync", 92],
      ["News Ingestion", 84],
      ["API Availability", 98],
    ] as const;

    // Default: Admin Dashboard overview
    return (
      <main className="mp-admin-content">
        <div className="mp-admin-titlebar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Operational command center for users, subscriptions, API usage, traffic, revenue, data sync, exchange uptime, and news ingestion.</p>
          </div>
        </div>

        <section className="mp-admin-grid-4">
          <GlassCard>
            <StatChip label="Total Users" value="128.4K" tone="pos" />
          </GlassCard>
          <GlassCard>
            <StatChip label="Active Subscriptions" value="18.7K" tone="pos" />
          </GlassCard>
          <GlassCard>
            <StatChip label="API Calls Today" value="1.8M" tone="neu" />
          </GlassCard>
          <GlassCard>
            <StatChip label="Revenue" value="$1.24M" tone="pos" />
          </GlassCard>
        </section>

        <section className="mp-admin-grid-2">
          <GlassCard className="mp-admin-chart-card">
                <div className="mp-admin-card-head">
                  <h2>Traffic Analytics</h2>
                  <span className="mp-admin-muted">Visits and paid conversion proxy</span>
                </div>
                <div className="mp-admin-chart">
                  <ResponsiveContainer width="100%" height={240}>
                <LineChart data={lineData}>
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#A27841" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

              <GlassCard className="mp-admin-chart-card">
                <div className="mp-admin-card-head">
                  <h2>API Usage</h2>
                  <span className="mp-admin-muted">Endpoint volume trend</span>
                </div>
                <div className="mp-admin-chart">
                  <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={areaData}>
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#A27841" fill="#A27841" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </section>

        <section className="mp-admin-grid-3">
          <GlassCard className="mp-admin-chart-card">
            <div className="mp-admin-card-head">
              <h2>Revenue Mix</h2>
              <span className="mp-admin-muted">Subscriptions, API, ads</span>
            </div>
            <div className="mp-admin-chart">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Tooltip />
                  <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                    {donutData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mp-admin-card-head">
              <h2>System Health</h2>
              <span className="mp-admin-muted">Live operations</span>
            </div>
            <div className="mp-admin-progress-stack">
              {systemHealth.map(([label, value]) => (
                <Progress key={label} label={label} value={value} />
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mp-admin-card-head">
              <h2>Admin Roles</h2>
              <span className="mp-admin-muted">Console access</span>
            </div>
            <AvatarStack />
            <div className="mp-admin-team-meta">
              <div className="mp-admin-team-row">
                <span>Super Admin</span>
                <strong>2</strong>
              </div>
              <div className="mp-admin-team-row">
                <span>Editors and Analysts</span>
                <strong>14</strong>
              </div>
            </div>
          </GlassCard>
        </section>

        <section className="mp-admin-grid-2">
          <GlassCard>
            <div className="mp-admin-card-head">
              <h2>Ingestion Activity</h2>
              <span className="mp-admin-muted">Sync and CMS timeline</span>
            </div>
            <RecentActivity />
          </GlassCard>

          <GlassCard>
            <div className="mp-admin-card-head">
              <h2>Subscription Billing</h2>
              <span className="mp-admin-muted">Plans and invoices</span>
            </div>
            <DataTable />
          </GlassCard>
        </section>
      </main>
    );
  };

  return (
    <div className="mp-admin-shell">
      <AdminSidebar mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen((v) => !v)} />
      <div className="mp-admin-main">
        <AdminHeader onMobileToggle={() => setMobileOpen((v) => !v)} />
        {renderMain()}
      </div>
    </div>
  );
}


