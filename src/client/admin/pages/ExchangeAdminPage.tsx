import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import { useExchangeAdminStore, type AdminExchange } from "../stores/exchangeStore";
import { useI18n } from "../../i18n";



const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "pre_market", label: "Pre-market" },
  { value: "after_hours", label: "After-hours" },
  { value: "halted", label: "Halted" },
];

const MARKET_TYPE_OPTIONS = [
  { value: "stock", label: "Stock" },
  { value: "derivative", label: "Derivative" },
  { value: "crypto", label: "Crypto" },
  { value: "commodity", label: "Commodity" },
  { value: "bond", label: "Bond" },
  { value: "forex", label: "Forex" },
];

const REGION_OPTIONS = [
  "North America",
  "Latin America",
  "Europe",
  "Asia",
  "Oceania",
  "Middle East",
  "Africa",
].map((r) => ({ value: r, label: r }));

const TIMEZONE_PRESETS = [
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Frankfurt",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Singapore",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Australia/Sydney",
  "Africa/Johannesburg",
].map((tz) => ({ value: tz, label: tz }));

const columns: AdminColumn<AdminExchange>[] = [
  { key: "code", label: "Code", width: "90px" },
  { key: "name", label: "Name" },
  { key: "region", label: "Region", width: "140px" },
  { key: "country", label: "Country", width: "150px" },
  { key: "currency", label: "FX", width: "70px" },
  {
    key: "status",
    label: "Status",
    width: "120px",
    render: (r) => (
      <span
        style={{
          padding: "3px 8px",
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          background:
            r.status === "open"
              ? "rgba(16,185,129,0.15)"
              : r.status === "halted"
              ? "rgba(239,68,68,0.18)"
              : "rgba(248,250,252,0.08)",
          color:
            r.status === "open"
              ? "#6ee7b7"
              : r.status === "halted"
              ? "#ff9090"
              : "rgba(248,250,252,0.7)",
        }}
      >
        {r.status.replace("_", " ")}
      </span>
    ),
  },
  {
    key: "tradingOpen",
    label: "Hours",
    width: "120px",
    render: (r) => `${r.tradingOpen}–${r.tradingClose}`,
  },
  {
    key: "marketCap",
    label: "Market Cap",
    align: "right",
    render: (r) => (r.marketCap ? `$${(r.marketCap / 1e12).toFixed(2)}T` : "—"),
    value: (r) => r.marketCap,
  },
  {
    key: "listedCompanies",
    label: "Listings",
    align: "right",
    render: (r) => r.listedCompanies.toLocaleString(),
    value: (r) => r.listedCompanies,
  },
];

const filters: AdminFilterDef[] = [
  { key: "region", label: "Region", type: "select", options: REGION_OPTIONS },
  {
    key: "marketType",
    label: "Market Type",
    type: "select",
    options: MARKET_TYPE_OPTIONS,
  },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
  {
    key: "currency",
    label: "Currency",
    type: "text",
    placeholder: "e.g. USD",
  },
];

const formFields: FormFieldDef<AdminExchange>[] = [
  { key: "code", label: "Exchange Code", type: "text", required: true, placeholder: "NYSE" },
  { key: "name", label: "Exchange Name", type: "text", required: true, placeholder: "New York Stock Exchange" },
  { key: "country", label: "Country", type: "text", required: true },
  { key: "countryCode", label: "Country Code", type: "text", placeholder: "US" },
  { key: "region", label: "Region", type: "select", options: REGION_OPTIONS, required: true },
  { key: "timezone", label: "Timezone", type: "select", options: TIMEZONE_PRESETS, required: true },
  { key: "currency", label: "Currency", type: "text", required: true, placeholder: "USD" },
  { key: "marketType", label: "Market Type", type: "select", options: MARKET_TYPE_OPTIONS, required: true },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true },
  { key: "mainIndex", label: "Main Index Symbol", type: "text", placeholder: "SPX" },
  { key: "mainIndexName", label: "Main Index Name", type: "text", placeholder: "S&P 500" },
  { key: "tradingOpen", label: "Session Open", type: "time", required: true },
  { key: "tradingClose", label: "Session Close", type: "time", required: true },
  { key: "website", label: "Website", type: "url", placeholder: "https://" },
  { key: "logo", label: "Logo URL", type: "url", placeholder: "/logos/exchanges/xyz.svg" },
  { key: "founded", label: "Founded", type: "number", min: 1500, max: 2100 },
  { key: "listedCompanies", label: "Listed Companies", type: "number", min: 0 },
  { key: "avgDailyVolume", label: "Avg Daily Volume (USD)", type: "number", min: 0 },
  { key: "marketCap", label: "Market Cap (USD)", type: "number", min: 0 },
  { key: "description", label: "Description", type: "textarea", span: 2 },
];

export default function ExchangeAdminPage() {
  const { t } = useI18n();
  const items = useExchangeAdminStore((s) => s.items);
  const update = useExchangeAdminStore((s) => s.update);

  return (
    <AdminCrudPage<AdminExchange>
      title={t("src_client_admin_pages_exchangeadminpage__l158__h0")}
      subtitle="Trading venues, sessions, regions, status, holidays, and metadata"
      useStore={useExchangeAdminStore}
      columns={columns}
      formFields={formFields}
      filters={filters}
      searchKeys={["code", "name", "country", "region", "mainIndex", "currency"]}
      defaultEntry={{
        code: "",
        name: "",
        country: "",
        countryCode: "",
        region: "North America",
        timezone: "America/New_York",
        currency: "USD",
        marketType: "stock",
        status: "open",
        mainIndex: "",
        mainIndexName: "",
        tradingOpen: "09:30",
        tradingClose: "16:00",
        website: "",
        logo: "",
        founded: null,
        listedCompanies: 0,
        avgDailyVolume: 0,
        marketCap: 0,
        description: "",
        holidays: [],
      }}
      analytics={(rows) => {
        const open = rows.filter((r) => r.status === "open").length;
        const halted = rows.filter((r) => r.status === "halted").length;
        const totalMarketCap = rows.reduce((s, r) => s + r.marketCap, 0);
        const totalListings = rows.reduce((s, r) => s + r.listedCompanies, 0);
        return [
          { label: "Total Exchanges", value: rows.length },
          { label: "Open Now", value: open, tone: "positive" },
          { label: "Halted", value: halted, tone: halted > 0 ? "negative" : "neutral" },
          { label: "Aggregate Market Cap", value: `$${(totalMarketCap / 1e12).toFixed(1)}T` },
          { label: "Listings", value: totalListings.toLocaleString() },
        ];
      }}
      extraBulkActions={[
        {
          label: "Mark Open",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "open" })),
        },
        {
          label: "Mark Closed",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "closed" })),
        },
        {
          label: "Halt",
          destructive: true,
          confirm: "Halt trading on all selected exchanges?",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "halted" })),
        },
      ]}
      exportName="exchanges"
      validate={(entry) => {
        const errs: Partial<Record<keyof AdminExchange, string>> = {};
        if (!/^[A-Z0-9.-]{2,12}$/.test(entry.code.trim().toUpperCase()))
          errs.code = "Code must be 2–12 chars, uppercase letters/digits";
        if (
          items.some(
            (i) => i.code.toUpperCase() === entry.code.trim().toUpperCase() && i.id !== entry.id
          )
        )
          errs.code = "Exchange code already exists";
        if (entry.tradingOpen >= entry.tradingClose)
          errs.tradingClose = "Close time must be after open time";
        return errs;
      }}
    />
  );
}
