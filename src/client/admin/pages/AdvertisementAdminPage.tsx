import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import { useI18n } from "../../i18n";
import {
  useAdCampaignAdminStore,
  type AdminAdCampaign,
  type AdPlacement,
} from "../stores/adStore";


const PLACEMENT_OPTIONS: { value: AdPlacement; label: string }[] = [
  { value: "homepage_hero", label: "Homepage Hero" },
  { value: "dashboard_top", label: "Dashboard Top" },
  { value: "sidebar", label: "Sidebar" },
  { value: "article_inline", label: "Article Inline" },
  { value: "footer", label: "Footer" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "expired", label: "Expired" },
];

const DEVICE_OPTIONS = [
  { value: "desktop", label: "Desktop" },
  { value: "tablet", label: "Tablet" },
  { value: "mobile", label: "Mobile" },
];

const REGION_OPTIONS = [
  "North America",
  "Latin America",
  "Europe",
  "Asia",
  "Middle East",
  "Africa",
  "Oceania",
].map((r) => ({ value: r, label: r }));

const columns: AdminColumn<AdminAdCampaign>[] = [
  { key: "name", label: "Campaign" },
  { key: "advertiser", label: "Advertiser", width: "160px" },
  {
    key: "placement",
    label: "Placement",
    width: "150px",
    render: (r) =>
      PLACEMENT_OPTIONS.find((p) => p.value === r.placement)?.label ?? r.placement,
  },
  {
    key: "impressionsTotal",
    label: "Impressions",
    align: "right",
    render: (r) => `${(r.impressionsTotal / 1000).toFixed(1)}K`,
    value: (r) => r.impressionsTotal,
  },
  {
    key: "clicksTotal",
    label: "Clicks",
    align: "right",
    render: (r) => r.clicksTotal.toLocaleString(),
    value: (r) => r.clicksTotal,
  },
  {
    key: "ctr",
    label: "CTR",
    align: "right",
    render: (r) =>
      r.impressionsTotal > 0
        ? `${((r.clicksTotal / r.impressionsTotal) * 100).toFixed(2)}%`
        : "—",
    value: (r) =>
      r.impressionsTotal > 0 ? (r.clicksTotal / r.impressionsTotal) * 100 : 0,
  },
  {
    key: "revenueTotal",
    label: "Revenue",
    align: "right",
    render: (r) => `$${r.revenueTotal.toFixed(2)}`,
    value: (r) => r.revenueTotal,
  },
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
              : r.status === "scheduled"
              ? "rgba(209,170,114,0.15)"
              : r.status === "paused"
              ? "rgba(251,191,36,0.15)"
              : r.status === "expired"
              ? "rgba(239,68,68,0.18)"
              : "rgba(248,250,252,0.08)",
          color:
            r.status === "active"
              ? "#6ee7b7"
              : r.status === "scheduled"
              ? "#f0c060"
              : r.status === "paused"
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
];

const filters: AdminFilterDef[] = [
  { key: "placement", label: "Placement", type: "select", options: PLACEMENT_OPTIONS },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
  { key: "advertiser", label: "Advertiser", type: "text" },
];

const formFields: FormFieldDef<AdminAdCampaign>[] = [
  { key: "name", label: "Campaign Name", type: "text", required: true },
  { key: "advertiser", label: "Advertiser", type: "text", required: true },
  { key: "placement", label: "Placement", type: "select", options: PLACEMENT_OPTIONS, required: true },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true },
  { key: "bannerImageUrl", label: "Banner Image URL", type: "url", required: true, span: 2 },
  { key: "destinationUrl", label: "Destination URL", type: "url", required: true, span: 2 },
  { key: "altText", label: "Alt Text (a11y)", type: "text", span: 2 },
  { key: "startDate", label: "Start Date", type: "date", required: true },
  { key: "endDate", label: "End Date", type: "date", required: true },
  { key: "dailyBudget", label: "Daily Budget (USD)", type: "number", min: 0 },
  { key: "cpm", label: "CPM (USD)", type: "number", step: 0.01, min: 0 },
  { key: "cpc", label: "CPC (USD)", type: "number", step: 0.01, min: 0 },
  { key: "impressionsToday", label: "Impressions Today", type: "number", min: 0 },
  { key: "impressionsTotal", label: "Impressions Total", type: "number", min: 0 },
  { key: "clicksToday", label: "Clicks Today", type: "number", min: 0 },
  { key: "clicksTotal", label: "Clicks Total", type: "number", min: 0 },
  { key: "revenueToday", label: "Revenue Today", type: "number", step: 0.01, min: 0 },
  { key: "revenueTotal", label: "Revenue Total", type: "number", step: 0.01, min: 0 },
  {
    key: "targetRegions",
    label: "Target Regions",
    type: "tags",
    span: 2,
    help: `Suggested: ${REGION_OPTIONS.map((r) => r.value).join(", ")}`,
  },
  {
    key: "targetDevices",
    label: "Target Devices",
    type: "tags",
    span: 2,
    help: `Suggested: ${DEVICE_OPTIONS.map((d) => d.value).join(", ")}`,
  },
  { key: "notes", label: "Notes", type: "textarea", span: 2 },
];

export default function AdvertisementAdminPage() {
  const { t } = useI18n();
  const update = useAdCampaignAdminStore((s) => s.update);

  return (
    <AdminCrudPage<AdminAdCampaign>
      title={t("src_client_admin_pages_advertisementadminpage__l172__h0")}
      subtitle="Campaigns, banners, placements, scheduling, impression / click analytics, revenue"
      useStore={useAdCampaignAdminStore}
      columns={columns}
      formFields={formFields}
      filters={filters}
      searchKeys={["name", "advertiser", "placement", "notes"]}
      defaultEntry={{
        name: "",
        advertiser: "",
        placement: "homepage_hero",
        bannerImageUrl: "",
        destinationUrl: "",
        altText: "",
        status: "draft",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        dailyBudget: 100,
        impressionsToday: 0,
        impressionsTotal: 0,
        clicksToday: 0,
        clicksTotal: 0,
        revenueToday: 0,
        revenueTotal: 0,
        cpm: 1.5,
        cpc: 0.2,
        targetRegions: [],
        targetDevices: ["desktop", "tablet", "mobile"],
        notes: "",
      }}
      analytics={(rows) => {
        const active = rows.filter((r) => r.status === "active").length;
        const scheduled = rows.filter((r) => r.status === "scheduled").length;
        const totalImpressions = rows.reduce((s, r) => s + r.impressionsTotal, 0);
        const totalClicks = rows.reduce((s, r) => s + r.clicksTotal, 0);
        const totalRevenue = rows.reduce((s, r) => s + r.revenueTotal, 0);
        const ctr =
          totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        return [
          { label: "Campaigns", value: rows.length },
          { label: "Active", value: active, tone: "positive" },
          { label: "Scheduled", value: scheduled },
          { label: "Impressions", value: `${(totalImpressions / 1000).toFixed(1)}K` },
          { label: "CTR", value: `${ctr.toFixed(2)}%` },
          { label: "Revenue", value: `$${totalRevenue.toFixed(0)}` },
        ];
      }}
      extraBulkActions={[
        { label: "▶ Activate", onRun: (ids) => ids.forEach((id) => update(id, { status: "active" })) },
        { label: "⏸ Pause", onRun: (ids) => ids.forEach((id) => update(id, { status: "paused" })) },
        {
          label: "🗓 Schedule",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "scheduled" })),
        },
      ]}
      exportName="ad-campaigns"
      validate={(entry) => {
        const errs: Partial<Record<keyof AdminAdCampaign, string>> = {};
        if (!entry.name.trim()) errs.name = "Name required";
        if (!entry.bannerImageUrl.trim()) errs.bannerImageUrl = "Banner required";
        if (!entry.destinationUrl.trim()) errs.destinationUrl = "Destination required";
        if (entry.startDate && entry.endDate && entry.startDate > entry.endDate)
          errs.endDate = "End date must be on/after start date";
        if (entry.dailyBudget < 0) errs.dailyBudget = "Budget must be non-negative";
        return errs;
      }}
    />
  );
}
