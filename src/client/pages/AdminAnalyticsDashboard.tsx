import React from "react";
import { Line, LineChart, ResponsiveContainer, Area, AreaChart, Pie, PieChart, Tooltip, Cell } from "recharts";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import GlassCard from "../components/admin/GlassCard";
import { useAuthStore } from "../stores/authStore";

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

function CustomersTable({ seedEmail }: { seedEmail?: string | null }) {
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
  const rows = [...(includeSeed ? [includeSeed] : []), ...base]
    .slice(0, 12)
    .map((u) => ({
      id: `u_${hashToInt(u.email)}`,
      name: u.name,
      email: u.email,
      plan: planFromEmail(u.email),
      status: statusFromEmail(u.email),
      lastActive: lastActiveFromEmail(u.email),
    })) as CustomerRow[];

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
          <p>Demo user list (Paid/Free derived from email). Use real subscription data later.</p>
        </div>
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
            <span className="mp-admin-muted">Plan & activity</span>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function getTabFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "";
  } catch {
    return "";
  }
}

export default function AdminAnalyticsDashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const data = React.useMemo(() => sampleData(), []);
  const { user } = useAuthStore();

  const tab = getTabFromUrl();

  if (tab === "customers") {
    return (
      <div className="mp-admin-shell">
        <AdminSidebar mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen((v) => !v)} />
        <div className="mp-admin-main">
          <AdminHeader onMobileToggle={() => setMobileOpen((v) => !v)} />
          <main className="mp-admin-content">
            <CustomersTable seedEmail={user?.email ?? null} />
          </main>
        </div>
      </div>
    );
  }

  const lineData = data.map((d) => ({ name: d.x, value: d.revenue }));
  const areaData = data.map((d) => ({ name: d.x, value: d.sales }));
  const donutData = [
    { name: "Revenue", value: 58, color: "#22c55e" },
    { name: "Profit", value: 28, color: "#60a5fa" },
    { name: "Operating", value: 14, color: "#a78bfa" },
  ];

  return (
    <div className="mp-admin-shell">
      <AdminSidebar mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen((v) => !v)} />
      <div className="mp-admin-main">
        <AdminHeader onMobileToggle={() => setMobileOpen((v) => !v)} />

        <main className="mp-admin-content">
          <div className="mp-admin-titlebar">
            <div>
              <h1>Analytics Overview</h1>
              <p>Premium fintech dashboard UI with glassmorphism and charts.</p>
            </div>
          </div>

          <section className="mp-admin-grid-3">
            <GlassCard>
              <StatChip label="Revenue" value="$1.24M" tone="pos" />
            </GlassCard>
            <GlassCard>
              <StatChip label="Sales" value="$842K" tone="pos" />
            </GlassCard>
            <GlassCard>
              <StatChip label="Profit" value="$312K" tone="neu" />
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
                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="mp-admin-chart-card">
              <div className="mp-admin-card-head">
                <h2>Sales Distribution</h2>
                <span className="mp-admin-muted">Area chart</span>
              </div>
              <div className="mp-admin-chart">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={areaData}>
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.18} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </section>

          <section className="mp-admin-grid-3">
            <GlassCard className="mp-admin-chart-card">
              <div className="mp-admin-card-head">
                <h2>Donut Mix</h2>
                <span className="mp-admin-muted">Revenue vs profit</span>
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
                <h2>Growth</h2>
                <span className="mp-admin-muted">Progress bars</span>
              </div>
              <div className="mp-admin-progress-stack">
                <Progress label="MRR Momentum" value={72} />
                <Progress label="Active Users" value={61} />
                <Progress label="Churn Control" value={48} />
              </div>
            </GlassCard>

            <GlassCard>
              <div className="mp-admin-card-head">
                <h2>Team</h2>
                <span className="mp-admin-muted">Avatars</span>
              </div>
              <AvatarStack />
              <div className="mp-admin-team-meta">
                <div className="mp-admin-team-row">
                  <span>Ops</span>
                  <strong>Realtime</strong>
                </div>
                <div className="mp-admin-team-row">
                  <span>Finance</span>
                  <strong>Weekly</strong>
                </div>
              </div>
            </GlassCard>
          </section>

          <section className="mp-admin-grid-2">
            <GlassCard>
              <div className="mp-admin-card-head">
                <h2>Recent Activity</h2>
                <span className="mp-admin-muted">Timeline</span>
              </div>
              <RecentActivity />
            </GlassCard>

            <GlassCard>
              <div className="mp-admin-card-head">
                <h2>Invoices</h2>
                <span className="mp-admin-muted">Data table</span>
              </div>
              <DataTable />
            </GlassCard>
          </section>
        </main>
      </div>
    </div>
  );
}

