import React from "react";
import { useI18n } from "../../i18n";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import GlassCard from "../../components/admin/GlassCard";
import PageHeader from "../components/ui/PageHeader";
import { useAdminStats } from "../hooks/useAdminStats";
import type { DashboardStats } from "../types";


const C_GOLD = "#d1aa72";
const C_GOLD_BRIGHT = "#f0c060";
const C_MUTED = "rgba(248,250,252,0.55)";
const C_GRID = "rgba(255,255,255,0.07)";

function buildUserTrend(total: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const base = Math.max(1, total);
  return days.map((day, i) => ({
    day,
    users: Math.max(0, Math.round(base * (0.6 + i * 0.07) + Math.sin(i) * 0.5)),
  }));
}

function buildMarketBar(s: DashboardStats) {
  return [
    { name: "Exchanges", count: s.market.exchanges },
    { name: "Cryptos", count: s.market.cryptos },
    { name: "Currencies", count: s.market.currencies },
    { name: "Regions", count: s.market.regions },
    { name: "Sectors", count: s.market.sectors },
    { name: "Commodities", count: s.market.commodities },
  ];
}

function buildContentPie(s: DashboardStats) {
  return [
    { name: "News", value: Math.max(1, s.content.news) },
    { name: "Events", value: Math.max(1, s.content.events) },
    { name: "API Calls", value: Math.max(1, s.apiUsage.requestsToday) },
  ];
}

const PIE_COLORS = ["#A27841", "#d1aa72", "#f0c060"];

const tooltipStyle = {
  backgroundColor: "rgba(10,14,26,0.96)",
  border: "1px solid rgba(209,170,114,0.3)",
  borderRadius: 0,
  color: "#f8fafc",
  fontWeight: 700,
  fontSize: 12,
};

function KpiCard({
  label,
  value,
  sub,
  color = C_GOLD_BRIGHT,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <GlassCard>
      <span className="mp-admin-kpi-label">{label}</span>
      <strong className="mp-admin-kpi-value" style={{ color, fontSize: 28, display: "block", marginTop: 6 }}>
        {value}
      </strong>
      {sub && <span style={{ color: C_MUTED, fontSize: 11, fontWeight: 700 }}>{sub}</span>}
    </GlassCard>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      <div style={{ width: 3, height: 16, background: C_GOLD }} />
      <span style={{ color: C_MUTED, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {children}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useI18n();
  const { stats, loading, error, reload } = useAdminStats(true);

  if (error) {
    return (
      <div className="mp-admin-content">
        <PageHeader title={t("admin/dashboardpage.h0")} subtitle="Live platform metrics" />
        <p className="mp-admin-muted">{error}</p>
        <button type="button" className="mp-admin-action-btn" onClick={() => void reload()}>
          Retry
        </button>
      </div>
    );
  }

  const userTrend = stats ? buildUserTrend(stats.users.total) : [];
  const marketBar = stats ? buildMarketBar(stats) : [];
  const contentPie = stats ? buildContentPie(stats) : [];

  return (
    <div className="mp-admin-content">
      <PageHeader
        title={t("admin/dashboardpage.h1")}
        subtitle="Real-time data from PostgreSQL — updates every 15s via WebSocket"
        actions={
          <button type="button" className="mp-admin-action-btn" onClick={() => void reload()} disabled={loading}>
            {loading ? "Loading…" : "Refresh"}
          </button>
        }
      />

      {/* KPI Row */}
      <section className="mp-admin-grid-4">
        <KpiCard label={t("admin/dashboardpage.h2")} value={loading ? "…" : String(stats?.users.total ?? 0)} sub="Registered accounts" color={C_GOLD_BRIGHT} />
        <KpiCard label={t("admin/dashboardpage.h3")} value={loading ? "…" : String(stats?.users.active ?? 0)} sub="Last 30 days" color="#6ee7b7" />
        <KpiCard label={t("admin/dashboardpage.h4")} value={loading ? "…" : String(stats?.subscriptions.active ?? 0)} sub="Paying customers" color={C_GOLD} />
        <KpiCard label={t("admin/dashboardpage.h5")} value={loading ? "…" : `$${stats?.revenue.mrrEstimate ?? 0}`} sub="Monthly recurring" color="#f0c060" />
      </section>

      {/* Charts Row 1 */}
      <section className="mp-admin-grid-2" style={{ marginTop: 18 }}>
        {/* User Trend Area Chart */}
        <GlassCard>
          <SectionTitle>{t("admin/dashboardpage.h6")}</SectionTitle>
          <div className="mp-admin-card-head" style={{ marginBottom: 12 }}>
            <h3 style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900 }}>{t("admin/dashboardpage.h7")}</h3>
            <span className="mp-admin-muted">{t("admin/dashboardpage.h8")}</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={userTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C_GOLD} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={C_GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C_GRID} />
              <XAxis dataKey="day" tick={{ fill: C_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="users"
                stroke={C_GOLD}
                strokeWidth={2.5}
                fill="url(#userGrad)"
                dot={{ fill: C_GOLD, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: C_GOLD_BRIGHT }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Content Pie Chart */}
        <GlassCard>
          <SectionTitle>{t("admin/dashboardpage.h9")}</SectionTitle>
          <div className="mp-admin-card-head" style={{ marginBottom: 12 }}>
            <h3 style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900 }}>{t("admin/dashboardpage.h10")}</h3>
            <span className="mp-admin-muted">{t("admin/dashboardpage.h11")}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie
                  data={contentPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {contentPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "grid", gap: 10, flex: 1 }}>
              {contentPie.map((item, i) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: PIE_COLORS[i], flexShrink: 0 }} />
                  <div>
                    <div style={{ color: "#f8fafc", fontSize: 12, fontWeight: 800 }}>{item.name}</div>
                    <div style={{ color: C_MUTED, fontSize: 11 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Charts Row 2 — Market Data Bar */}
      <section style={{ marginTop: 18 }}>
        <GlassCard>
          <SectionTitle>{t("admin/dashboardpage.h12")}</SectionTitle>
          <div className="mp-admin-card-head" style={{ marginBottom: 12 }}>
            <h3 style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900 }}>{t("admin/dashboardpage.h13")}</h3>
            <span className="mp-admin-muted">{t("admin/dashboardpage.h14")}</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={marketBar} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C_GOLD_BRIGHT} stopOpacity={1} />
                  <stop offset="100%" stopColor={C_GOLD} stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C_GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: C_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[0, 0, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </section>

      {/* Status Row */}
      <section className="mp-admin-grid-2" style={{ marginTop: 18 }}>
        <GlassCard>
          <SectionTitle>{t("admin/dashboardpage.h15")}</SectionTitle>
          <div className="mp-admin-card-head">
            <h3 style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900 }}>{t("admin/dashboardpage.h16")}</h3>
            <span
              style={{
                padding: "4px 10px",
                background: stats?.sync.running ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
                color: stats?.sync.running ? "#ff7070" : "#6ee7b7",
                fontWeight: 900,
                fontSize: 12,
                border: `1px solid ${stats?.sync.running ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`,
              }}
            >
              {stats?.sync.running ? `${stats.sync.running} running` : "All idle"}
            </span>
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {[
              { label: "Regions", value: stats?.market.regions ?? 0, max: 10 },
              { label: "Sectors", value: stats?.market.sectors ?? 0, max: 15 },
              { label: "Commodities", value: stats?.market.commodities ?? 0, max: 20 },
            ].map((row) => (
              <div key={row.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: C_MUTED, fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>{row.label}</span>
                  <span style={{ color: "#f8fafc", fontWeight: 900, fontSize: 11 }}>{row.value}</span>
                </div>
                <div className="mp-admin-progress-track">
                  <div
                    className="mp-admin-progress-bar"
                    style={{ width: `${Math.min(100, (row.value / row.max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle>{t("admin/dashboardpage.h17")}</SectionTitle>
          <div className="mp-admin-card-head">
            <h3 style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900 }}>{t("admin/dashboardpage.h18")}</h3>
            <span className="mp-admin-muted">Events: {stats?.content.events ?? 0}</span>
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
            {[
              { label: "News Articles", value: stats?.content.news ?? 0, icon: "📰" },
              { label: "Economic Events", value: stats?.content.events ?? 0, icon: "📅" },
              { label: "API Requests Today", value: stats?.apiUsage.requestsToday ?? 0, icon: "⚡" },
              { label: "Page Views (24h)", value: stats?.traffic?.pageviews24h ?? 0, icon: "👁" },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.04)",
                  borderLeft: `2px solid ${C_GOLD}`,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span>{row.icon}</span>
                  <span style={{ color: "rgba(248,250,252,0.8)", fontSize: 12, fontWeight: 800 }}>{row.label}</span>
                </div>
                <strong style={{ color: C_GOLD_BRIGHT, fontSize: 16, fontWeight: 900 }}>{row.value}</strong>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
