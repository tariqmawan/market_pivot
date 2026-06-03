import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import { useSectorAdminStore, type AdminSector } from "../stores/sectorStore";
import { useI18n } from "../../i18n";



const CATEGORY_OPTIONS = ["Growth", "Cyclical", "Defensive", "Thematic", "Income"].map((c) => ({
  value: c,
  label: c,
}));

const VOLATILITY_OPTIONS = ["Low", "Medium", "High", "Very High"].map((v) => ({
  value: v,
  label: v,
}));

const INVESTOR_PROFILE_OPTIONS = [
  "Conservative",
  "Balanced",
  "Growth",
  "Aggressive",
  "Speculative",
].map((v) => ({ value: v, label: v }));

const columns: AdminColumn<AdminSector>[] = [
  {
    key: "icon",
    label: "",
    width: "40px",
    render: (r) => <span style={{ fontSize: 20 }}>{r.icon}</span>,
    sortable: false,
  },
  { key: "name", label: "Sector" },
  { key: "category", label: "Category", width: "120px" },
  {
    key: "marketCapUSD",
    label: "Market Cap",
    align: "right",
    render: (r) =>
      r.marketCapUSD >= 1e12
        ? `$${(r.marketCapUSD / 1e12).toFixed(2)}T`
        : `$${(r.marketCapUSD / 1e9).toFixed(2)}B`,
    value: (r) => r.marketCapUSD,
  },
  {
    key: "weightPct",
    label: "Weight",
    align: "right",
    render: (r) => `${r.weightPct.toFixed(2)}%`,
    value: (r) => r.weightPct,
  },
  {
    key: "peRatio",
    label: "P/E",
    align: "right",
    render: (r) => r.peRatio.toFixed(1),
    value: (r) => r.peRatio,
  },
  {
    key: "performanceYtd",
    label: "YTD",
    align: "right",
    render: (r) => (
      <span style={{ color: r.performanceYtd >= 0 ? "#6ee7b7" : "#ff9090", fontWeight: 800 }}>
        {r.performanceYtd >= 0 ? "+" : ""}
        {r.performanceYtd.toFixed(2)}%
      </span>
    ),
    value: (r) => r.performanceYtd,
  },
  {
    key: "dividendYield",
    label: "Yield",
    align: "right",
    render: (r) => `${r.dividendYield.toFixed(2)}%`,
    value: (r) => r.dividendYield,
  },
];

const filters: AdminFilterDef[] = [
  { key: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS },
  { key: "volatility", label: "Volatility", type: "select", options: VOLATILITY_OPTIONS },
];

const formFields: FormFieldDef<AdminSector>[] = [
  { key: "slug", label: "Slug", type: "text", required: true, placeholder: "technology" },
  { key: "name", label: "Sector Name", type: "text", required: true },
  { key: "icon", label: "Emoji Icon", type: "text", placeholder: "💻" },
  { key: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS, required: true },
  { key: "volatility", label: "Volatility", type: "select", options: VOLATILITY_OPTIONS },
  {
    key: "investorProfile",
    label: "Investor Profile",
    type: "select",
    options: INVESTOR_PROFILE_OPTIONS,
  },
  { key: "marketCapUSD", label: "Market Cap (USD)", type: "number", min: 0 },
  { key: "weightPct", label: "Weight %", type: "number", step: 0.01, min: 0 },
  { key: "peRatio", label: "P/E Ratio", type: "number", step: 0.1 },
  { key: "performanceYtd", label: "YTD %", type: "number", step: 0.1 },
  { key: "dividendYield", label: "Dividend Yield %", type: "number", step: 0.01, min: 0 },
  { key: "industries", label: "Industries", type: "tags", span: 2 },
  { key: "etfs", label: "ETFs", type: "tags", span: 2 },
  { key: "topCompanies", label: "Top Companies", type: "tags", span: 2 },
  { key: "trendingStocks", label: "Trending Stocks", type: "tags", span: 2 },
  { key: "dividendLeaders", label: "Dividend Leaders", type: "tags", span: 2 },
  { key: "relatedRegions", label: "Related Regions", type: "tags", span: 2 },
  { key: "newsThemes", label: "News Themes", type: "tags", span: 2 },
  { key: "summary", label: "Summary", type: "textarea", span: 2 },
  { key: "description", label: "Description", type: "textarea", span: 2 },
];

export default function SectorAdminPage() {
  const { t } = useI18n();
  const items = useSectorAdminStore((s) => s.items);

  const handleRecalcWeights = () => {
    const total = items.reduce((s, r) => s + r.marketCapUSD, 0);
    if (total === 0) {
      window.alert("All sectors have zero market cap — set values first.");
      return;
    }
    items.forEach((sec) => {
      useSectorAdminStore.getState().update(sec.id, {
        weightPct: Number(((sec.marketCapUSD / total) * 100).toFixed(2)),
      });
    });
    window.alert(`Recalculated weights for ${items.length} sectors.`);
  };

  return (
    <AdminCrudPage<AdminSector>
      title={t("src_client_admin_pages_sectoradminpage__l133__h0")}
      subtitle="Industry sectors, ETFs, market exposure metrics, and performance analytics"
      useStore={useSectorAdminStore}
      columns={columns}
      formFields={formFields}
      filters={filters}
      searchKeys={["name", "category", "summary", "description"]}
      defaultEntry={{
        slug: "",
        name: "",
        icon: "📊",
        category: "Growth",
        summary: "",
        description: "",
        industries: [],
        etfs: [],
        topCompanies: [],
        trendingStocks: [],
        dividendLeaders: [],
        relatedRegions: [],
        marketCapUSD: 0,
        weightPct: 0,
        peRatio: 0,
        performanceYtd: 0,
        dividendYield: 0,
        volatility: "Medium",
        investorProfile: "Balanced",
        newsThemes: [],
      }}
      analytics={(rows) => {
        const total = rows.reduce((s, r) => s + r.marketCapUSD, 0);
        const avgPE = rows.reduce((s, r) => s + r.peRatio, 0) / Math.max(1, rows.length);
        const avgYTD = rows.reduce((s, r) => s + r.performanceYtd, 0) / Math.max(1, rows.length);
        const best = [...rows].sort((a, b) => b.performanceYtd - a.performanceYtd)[0];
        return [
          { label: "Sectors", value: rows.length },
          { label: "Aggregate Cap", value: `$${(total / 1e12).toFixed(2)}T` },
          { label: "Avg P/E", value: avgPE.toFixed(1) },
          {
            label: "Avg YTD",
            value: `${avgYTD.toFixed(2)}%`,
            tone: avgYTD >= 0 ? "positive" : "negative",
          },
          {
            label: "Top YTD",
            value: best ? `${best.name} (${best.performanceYtd.toFixed(1)}%)` : "—",
          },
        ];
      }}
      extraBulkActions={[
        { label: "↻ Recalc Weights", onRun: () => handleRecalcWeights() },
      ]}
      exportName="sectors"
      validate={(entry) => {
        const errs: Partial<Record<keyof AdminSector, string>> = {};
        if (!entry.slug.trim()) errs.slug = "Slug required";
        if (items.some((s) => s.slug === entry.slug && s.id !== entry.id))
          errs.slug = "Slug already exists";
        return errs;
      }}
    />
  );
}
