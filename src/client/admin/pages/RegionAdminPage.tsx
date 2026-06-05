import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import { useRegionAdminStore, type AdminRegion } from "../stores/regionStore";
import { useI18n } from "../../i18n";



const TYPE_OPTIONS = [
  { value: "Developed", label: "Developed" },
  { value: "Emerging", label: "Emerging" },
  { value: "Frontier", label: "Frontier" },
];

const columns: AdminColumn<AdminRegion>[] = [
  { key: "name", label: "Region" },
  { key: "type", label: "Type", width: "120px" },
  {
    key: "countries",
    label: "Countries",
    width: "100px",
    align: "right",
    render: (r) => r.countries.length,
    value: (r) => r.countries.length,
  },
  {
    key: "gdpGrowth",
    label: "GDP Growth",
    align: "right",
    render: (r) => `${r.gdpGrowth.toFixed(1)}%`,
    value: (r) => r.gdpGrowth,
  },
  {
    key: "inflation",
    label: "CPI",
    align: "right",
    render: (r) => `${r.inflation.toFixed(1)}%`,
    value: (r) => r.inflation,
  },
  {
    key: "unemployment",
    label: "Unemp.",
    align: "right",
    render: (r) => `${r.unemployment.toFixed(1)}%`,
    value: (r) => r.unemployment,
  },
  {
    key: "interestRate",
    label: "Rate",
    align: "right",
    render: (r) => `${r.interestRate.toFixed(2)}%`,
    value: (r) => r.interestRate,
  },
];

const formFields: FormFieldDef<AdminRegion>[] = [
  { key: "slug", label: "Slug", type: "text", required: true, placeholder: "americas" },
  { key: "name", label: "Region Name", type: "text", required: true },
  { key: "type", label: "Type", type: "select", options: TYPE_OPTIONS, required: true },
  { key: "population", label: "Population", type: "text", placeholder: "1.0B" },
  { key: "summary", label: "Summary", type: "textarea", span: 2 },
  { key: "countries", label: "Countries", type: "tags", span: 2 },
  { key: "currencies", label: "Currencies", type: "tags" },
  { key: "majorExchanges", label: "Major Exchanges", type: "tags" },
  { key: "keyIndices", label: "Key Indices", type: "tags" },
  { key: "sectorLeaders", label: "Sector Leaders", type: "tags" },
  { key: "gdpUSD", label: "GDP (USD)", type: "number", min: 0 },
  { key: "gdpGrowth", label: "GDP Growth %", type: "number", step: 0.1 },
  { key: "inflation", label: "Inflation %", type: "number", step: 0.1 },
  { key: "unemployment", label: "Unemployment %", type: "number", step: 0.1 },
  { key: "interestRate", label: "Interest Rate %", type: "number", step: 0.05 },
  { key: "marketCap", label: "Market Cap (USD)", type: "number", min: 0 },
  { key: "tradeBalance", label: "Trade Balance", type: "text" },
  { key: "calendarFocus", label: "Calendar Focus", type: "tags", span: 2 },
  { key: "newsThemes", label: "News Themes", type: "tags", span: 2 },
  { key: "commodityImpact", label: "Commodity Impact", type: "textarea", span: 2 },
  { key: "macroOutlook", label: "Macro Outlook", type: "textarea", span: 2 },
];

export default function RegionAdminPage() {
  const { t } = useI18n();
  const items = useRegionAdminStore((s) => s.items);

  return (
    <AdminCrudPage<AdminRegion>
      title={t("src_client_admin_pages_regionadminpage__l83__h0")}
      subtitle="Macro regions, GDP, inflation, employment, and economic outlook"
      useStore={useRegionAdminStore}
      columns={columns}
      formFields={formFields}
      searchKeys={["name", "type", "summary"]}
      defaultEntry={{
        slug: "",
        name: "",
        type: "Developed",
        summary: "",
        countries: [],
        currencies: [],
        keyIndices: [],
        majorExchanges: [],
        sectorLeaders: [],
        gdpUSD: 0,
        gdpGrowth: 0,
        inflation: 0,
        unemployment: 0,
        interestRate: 0,
        population: "",
        marketCap: 0,
        commodityImpact: "",
        tradeBalance: "",
        calendarFocus: [],
        newsThemes: [],
        macroOutlook: "",
      }}
      analytics={(rows) => {
        const totalCountries = rows.reduce((s, r) => s + r.countries.length, 0);
        const avgGrowth = rows.reduce((s, r) => s + r.gdpGrowth, 0) / Math.max(1, rows.length);
        const avgCPI = rows.reduce((s, r) => s + r.inflation, 0) / Math.max(1, rows.length);
        return [
          { label: "Regions", value: rows.length },
          { label: "Countries Covered", value: totalCountries },
          { label: "Avg GDP Growth", value: `${avgGrowth.toFixed(2)}%`, tone: avgGrowth >= 0 ? "positive" : "negative" },
          { label: "Avg Inflation", value: `${avgCPI.toFixed(1)}%` },
        ];
      }}
      exportName="regions"
      validate={(entry) => {
        const errs: Partial<Record<keyof AdminRegion, string>> = {};
        if (!entry.slug.trim()) errs.slug = "Slug required";
        if (items.some((r) => r.slug === entry.slug && r.id !== entry.id))
          errs.slug = "Slug already exists";
        if (!entry.name.trim()) errs.name = "Region name required";
        return errs;
      }}
    />
  );
}
