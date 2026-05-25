import React from "react";
import GlassCard from "../../components/admin/GlassCard";
import PageHeader from "../components/ui/PageHeader";
import { useAdminStats } from "../hooks/useAdminStats";

function StatChip({ label, value, tone = "neu" }: { label: string; value: string; tone?: string }) {
  return (
    <div className={`mp-admin-kpi mp-admin-kpi-${tone}`}>
      <span className="mp-admin-kpi-label">{label}</span>
      <strong className="mp-admin-kpi-value">{value}</strong>
    </div>
  );
}

export default function DashboardPage() {
  const { stats, loading, error, reload } = useAdminStats(true);

  if (error) {
    return (
      <div className="mp-admin-content">
        <PageHeader title="Dashboard" subtitle="Live platform metrics" />
        <p className="mp-admin-error-text">{error}</p>
        <button type="button" className="mp-admin-action-btn" onClick={() => void reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mp-admin-content">
      <PageHeader
        title="Dashboard"
        subtitle="Real-time data from PostgreSQL — updates every 15s via WebSocket"
        actions={
          <button type="button" className="mp-admin-action-btn" onClick={() => void reload()} disabled={loading}>
            Refresh
          </button>
        }
      />

      <section className="mp-admin-grid-4">
        <StatChip label="Total Users" value={loading ? "…" : String(stats?.users.total ?? 0)} tone="pos" />
        <StatChip label="Active Users" value={loading ? "…" : String(stats?.users.active ?? 0)} />
        <StatChip label="Active Subscriptions" value={loading ? "…" : String(stats?.subscriptions.active ?? 0)} />
        <StatChip label="MRR Estimate" value={loading ? "…" : `$${stats?.revenue.mrrEstimate ?? 0}`} tone="neu" />
      </section>

      <section className="mp-admin-grid-3" style={{ marginTop: 16 }}>
        <StatChip label="Exchanges" value={String(stats?.market.exchanges ?? 0)} />
        <StatChip label="Cryptocurrencies" value={String(stats?.market.cryptos ?? 0)} />
        <StatChip label="News Articles" value={String(stats?.content.news ?? 0)} />
      </section>

      <section className="mp-admin-grid-2" style={{ marginTop: 16 }}>
        <GlassCard>
          <div className="mp-admin-card-head">
            <h3>Market sync</h3>
            <span className="mp-admin-muted">{stats?.sync.running ? `${stats.sync.running} jobs running` : "All idle"}</span>
          </div>
          <p className="mp-admin-muted">Regions: {stats?.market.regions ?? 0} · Sectors: {stats?.market.sectors ?? 0} · Commodities: {stats?.market.commodities ?? 0}</p>
        </GlassCard>
        <GlassCard>
          <div className="mp-admin-card-head">
            <h3>Content pipeline</h3>
            <span className="mp-admin-muted">Economic events: {stats?.content.events ?? 0}</span>
          </div>
          <p className="mp-admin-muted">API requests today: {stats?.apiUsage.requestsToday ?? 0} (wire external providers next)</p>
        </GlassCard>
      </section>
    </div>
  );
}
