import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import {
  useApiKeyAdminStore,
  maskApiKey,
  type AdminApiKey,
  type ApiProvider,
} from "../stores/apiKeyStore";

const PROVIDER_OPTIONS: { value: ApiProvider; label: string }[] = [
  { value: "Finnhub", label: "Finnhub" },
  { value: "CoinGecko", label: "CoinGecko" },
  { value: "AlphaVantage", label: "Alpha Vantage" },
  { value: "FRED", label: "FRED" },
  { value: "TwelveData", label: "Twelve Data" },
  { value: "Polygon", label: "Polygon" },
  { value: "Custom", label: "Custom" },
];

const ENVIRONMENT_OPTIONS = [
  { value: "production", label: "production" },
  { value: "staging", label: "staging" },
  { value: "development", label: "development" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
  { value: "rotating", label: "Rotating" },
  { value: "expired", label: "Expired" },
];

const columns: AdminColumn<AdminApiKey>[] = [
  { key: "provider", label: "Provider", width: "130px" },
  { key: "label", label: "Label" },
  { key: "environment", label: "Env", width: "110px" },
  { key: "keyMasked", label: "Key", width: "220px", render: (r) => <code style={{ fontSize: 12 }}>{r.keyMasked}</code> },
  {
    key: "monthlyUsage",
    label: "Usage / Quota",
    align: "right",
    render: (r) => {
      const pct = r.monthlyQuota ? (r.monthlyUsage / r.monthlyQuota) * 100 : 0;
      const tone = pct > 90 ? "#ff9090" : pct > 70 ? "#fbbf24" : "#6ee7b7";
      return (
        <div>
          <div style={{ fontWeight: 800 }}>
            {(r.monthlyUsage / 1000).toFixed(1)}K / {(r.monthlyQuota / 1000).toFixed(0)}K
          </div>
          <div
            style={{
              marginTop: 4,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: tone }} />
          </div>
        </div>
      );
    },
    value: (r) => (r.monthlyQuota ? r.monthlyUsage / r.monthlyQuota : 0),
  },
  {
    key: "rateLimitPerMin",
    label: "Rate Limit",
    align: "right",
    render: (r) => `${r.rateLimitPerMin}/min`,
    value: (r) => r.rateLimitPerMin,
  },
  { key: "expiresAt", label: "Expires", width: "130px" },
  {
    key: "status",
    label: "Status",
    width: "110px",
    render: (r) => (
      <span
        style={{
          padding: "3px 8px",
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 800,
          background:
            r.status === "active"
              ? "rgba(16,185,129,0.15)"
              : r.status === "rotating"
              ? "rgba(251,191,36,0.15)"
              : r.status === "expired"
              ? "rgba(239,68,68,0.18)"
              : "rgba(248,250,252,0.08)",
          color:
            r.status === "active"
              ? "#6ee7b7"
              : r.status === "rotating"
              ? "#fbbf24"
              : r.status === "expired"
              ? "#ff9090"
              : "rgba(248,250,252,0.7)",
        }}
      >
        {r.status}
      </span>
    ),
  },
  {
    key: "healthy",
    label: "Health",
    width: "80px",
    render: (r) => (r.healthy ? "🟢" : "🔴"),
    value: (r) => (r.healthy ? 1 : 0),
  },
];

const filters: AdminFilterDef[] = [
  { key: "provider", label: "Provider", type: "select", options: PROVIDER_OPTIONS },
  { key: "environment", label: "Environment", type: "select", options: ENVIRONMENT_OPTIONS },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
];

const formFields: FormFieldDef<AdminApiKey>[] = [
  { key: "provider", label: "Provider", type: "select", options: PROVIDER_OPTIONS, required: true },
  { key: "label", label: "Label", type: "text", required: true, placeholder: "e.g. Finnhub Production" },
  { key: "environment", label: "Environment", type: "select", options: ENVIRONMENT_OPTIONS, required: true },
  {
    key: "keyMasked",
    label: "Raw API Key (will be masked on save)",
    type: "text",
    required: true,
    placeholder: "paste full key — never displayed again",
    span: 2,
  },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true },
  { key: "healthy", label: "Healthy", type: "checkbox" },
  { key: "rateLimitPerMin", label: "Rate Limit (req/min)", type: "number", min: 1 },
  { key: "monthlyQuota", label: "Monthly Quota", type: "number", min: 0 },
  { key: "monthlyUsage", label: "Monthly Usage (recorded)", type: "number", min: 0 },
  { key: "expiresAt", label: "Expires At", type: "date" },
  { key: "lastRotatedAt", label: "Last Rotated", type: "date" },
  { key: "lastUsedAt", label: "Last Used", type: "date" },
  { key: "notes", label: "Notes", type: "textarea", span: 2 },
];

export default function ApiKeyAdminPage() {
  const items = useApiKeyAdminStore((s) => s.items);
  const update = useApiKeyAdminStore((s) => s.update);

  return (
    <AdminCrudPage<AdminApiKey>
      title="API Keys"
      subtitle="Provider keys, environments, rotation, quota monitoring, health checks"
      useStore={useApiKeyAdminStore}
      columns={columns}
      formFields={formFields}
      filters={filters}
      searchKeys={["provider", "label", "environment", "notes"]}
      defaultEntry={{
        provider: "Finnhub",
        label: "",
        environment: "production",
        keyMasked: "",
        status: "active",
        rateLimitPerMin: 60,
        monthlyQuota: 100000,
        monthlyUsage: 0,
        expiresAt: "",
        lastRotatedAt: new Date().toISOString().split("T")[0],
        lastUsedAt: "",
        healthy: true,
        notes: "",
      }}
      analytics={(rows) => {
        const active = rows.filter((r) => r.status === "active").length;
        const rotating = rows.filter((r) => r.status === "rotating").length;
        const expired = rows.filter((r) => r.status === "expired").length;
        const overQuota = rows.filter(
          (r) => r.monthlyQuota > 0 && r.monthlyUsage / r.monthlyQuota > 0.9
        ).length;
        const totalUsage = rows.reduce((s, r) => s + r.monthlyUsage, 0);
        return [
          { label: "Total Keys", value: rows.length },
          { label: "Active", value: active, tone: "positive" },
          { label: "Rotating", value: rotating, tone: "warn" },
          { label: "Expired", value: expired, tone: expired > 0 ? "negative" : "neutral" },
          { label: "Near Quota (>90%)", value: overQuota, tone: overQuota > 0 ? "warn" : "neutral" },
          { label: "Calls (this period)", value: `${(totalUsage / 1000).toFixed(1)}K` },
        ];
      }}
      rowExtraActions={(row) => (
        <button
          type="button"
          className="mp-admin-link-btn"
          onClick={() => {
            const next = window.prompt(`Rotate key for ${row.label} — paste new raw key:`);
            if (!next) return;
            update(row.id, {
              keyMasked: maskApiKey(next),
              lastRotatedAt: new Date().toISOString().split("T")[0],
              status: "active",
            });
          }}
        >
          Rotate
        </button>
      )}
      extraBulkActions={[
        {
          label: "Disable",
          destructive: true,
          confirm: "Disable selected API keys?",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "disabled" })),
        },
        {
          label: "Mark Healthy",
          onRun: (ids) => ids.forEach((id) => update(id, { healthy: true })),
        },
      ]}
      exportName="api-keys"
      validate={(entry) => {
        const errs: Partial<Record<keyof AdminApiKey, string>> = {};
        if (!entry.label.trim()) errs.label = "Label required";
        if (!entry.keyMasked.trim()) errs.keyMasked = "Key required";
        if (entry.monthlyUsage > entry.monthlyQuota && entry.monthlyQuota > 0)
          errs.monthlyUsage = "Usage cannot exceed quota";
        // mask the raw key on save if a clearly unmasked value was provided
        if (entry.keyMasked && !entry.keyMasked.includes("•") && entry.keyMasked.length > 12) {
          entry.keyMasked = maskApiKey(entry.keyMasked);
        }
        if (items.some((k) => k.label === entry.label && k.id !== entry.id))
          errs.label = "A key with this label already exists";
        return errs;
      }}
    />
  );
}
