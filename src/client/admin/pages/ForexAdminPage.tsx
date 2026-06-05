import React from "react";
import PageHeader from "../components/ui/PageHeader";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import { useI18n } from "../../i18n";
import {
  useCurrencyAdminStore,
  useCurrencyPairAdminStore,
  type AdminCurrency,
  type AdminCurrencyPair,
} from "../stores/forexStore";


const TIER_OPTIONS = [
  { value: "major", label: "Major" },
  { value: "cross", label: "Cross" },
  { value: "exotic", label: "Exotic" },
];

const TYPE_OPTIONS = [
  { value: "fiat", label: "Fiat" },
  { value: "commodity", label: "Commodity" },
  { value: "crypto", label: "Crypto" },
];

const REGION_OPTIONS = [
  "Americas",
  "Europe",
  "Asia",
  "Asia Pacific",
  "Middle East",
  "Africa",
  "Oceania",
].map((r) => ({ value: r, label: r }));

const RESERVE_OPTIONS = [
  "Primary Reserve",
  "Secondary Reserve",
  "Regional",
  "Emerging",
].map((r) => ({ value: r, label: r }));

const currencyColumns: AdminColumn<AdminCurrency>[] = [
  { key: "code", label: "Code", width: "80px" },
  { key: "name", label: "Name" },
  { key: "country", label: "Country", width: "160px" },
  { key: "region", label: "Region", width: "130px" },
  { key: "centralBank", label: "Central Bank" },
  {
    key: "interestRate",
    label: "Rate",
    align: "right",
    render: (r) => `${r.interestRate.toFixed(2)}%`,
    value: (r) => r.interestRate,
  },
  {
    key: "inflation",
    label: "CPI",
    align: "right",
    render: (r) => `${r.inflation.toFixed(1)}%`,
    value: (r) => r.inflation,
  },
  {
    key: "active",
    label: "Active",
    width: "80px",
    render: (r) => (r.active ? "✅" : "—"),
    value: (r) => (r.active ? 1 : 0),
  },
];

const currencyFilters: AdminFilterDef[] = [
  { key: "region", label: "Region", type: "select", options: REGION_OPTIONS },
  { key: "type", label: "Type", type: "select", options: TYPE_OPTIONS },
  {
    key: "active",
    label: "Status",
    type: "select",
    options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
];

const currencyFields: FormFieldDef<AdminCurrency>[] = [
  { key: "code", label: "Code (ISO)", type: "text", required: true, placeholder: "USD" },
  { key: "name", label: "Name", type: "text", required: true, placeholder: "US Dollar" },
  { key: "symbol", label: "Symbol", type: "text", placeholder: "$" },
  { key: "type", label: "Type", type: "select", options: TYPE_OPTIONS, required: true },
  { key: "country", label: "Country", type: "text", required: true },
  { key: "countryCode", label: "Country Code", type: "text", placeholder: "US" },
  { key: "region", label: "Region", type: "select", options: REGION_OPTIONS, required: true },
  { key: "centralBank", label: "Central Bank", type: "text", required: true },
  { key: "interestRate", label: "Interest Rate %", type: "number", step: 0.05, min: -5, max: 50 },
  { key: "inflation", label: "Inflation %", type: "number", step: 0.1, min: -20, max: 200 },
  { key: "gdpGrowth", label: "GDP Growth %", type: "number", step: 0.1, min: -20, max: 20 },
  { key: "reserveStatus", label: "Reserve Status", type: "select", options: RESERVE_OPTIONS },
  { key: "capitalFlows", label: "Capital Flows", type: "text", placeholder: "Open / Restricted" },
  { key: "logo", label: "Logo URL", type: "url" },
  { key: "active", label: "Active", type: "checkbox" },
  { key: "description", label: "Description", type: "textarea", span: 2 },
];

const pairColumns: AdminColumn<AdminCurrencyPair>[] = [
  {
    key: "pair",
    label: "Pair",
    width: "120px",
    render: (r) => <strong>{r.base}/{r.quote}</strong>,
    value: (r) => `${r.base}/${r.quote}`,
  },
  { key: "base", label: "Base", width: "80px" },
  { key: "quote", label: "Quote", width: "80px" },
  {
    key: "tier",
    label: "Tier",
    width: "100px",
    render: (r) => (
      <span
        style={{
          padding: "3px 8px",
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          background:
            r.tier === "major"
              ? "rgba(16,185,129,0.15)"
              : r.tier === "cross"
              ? "rgba(209,170,114,0.15)"
              : "rgba(239,68,68,0.15)",
          color:
            r.tier === "major" ? "#6ee7b7" : r.tier === "cross" ? "#f0c060" : "#ff9090",
        }}
      >
        {r.tier}
      </span>
    ),
  },
  {
    key: "spread",
    label: "Spread (pips)",
    align: "right",
    render: (r) => r.spread.toFixed(2),
    value: (r) => r.spread,
  },
  {
    key: "active",
    label: "Active",
    width: "80px",
    render: (r) => (r.active ? "✅" : "—"),
    value: (r) => (r.active ? 1 : 0),
  },
];

const pairFilters: AdminFilterDef[] = [
  { key: "tier", label: "Tier", type: "select", options: TIER_OPTIONS },
  { key: "base", label: "Base", type: "text", placeholder: "USD" },
  { key: "quote", label: "Quote", type: "text", placeholder: "EUR" },
];

export default function ForexAdminPage() {
  const { t } = useI18n();
  const [tab, setTab] = React.useState<"currencies" | "pairs">("currencies");
  const currencies = useCurrencyAdminStore((s) => s.items);

  const pairFields: FormFieldDef<AdminCurrencyPair>[] = React.useMemo(() => {
    const opts = currencies
      .filter((c) => c.active)
      .map((c) => ({ value: c.code, label: `${c.code} — ${c.name}` }));
    return [
      { key: "base", label: "Base Currency", type: "select", options: opts, required: true },
      { key: "quote", label: "Quote Currency", type: "select", options: opts, required: true },
      { key: "tier", label: "Tier", type: "select", options: TIER_OPTIONS, required: true },
      { key: "spread", label: "Typical Spread (pips)", type: "number", step: 0.1, min: 0 },
      { key: "active", label: "Active", type: "checkbox" },
      { key: "notes", label: "Notes", type: "textarea", span: 2 },
    ];
  }, [currencies]);

  return (
    <div>
      <div className="mp-admin-content" style={{ paddingBottom: 0 }}>
        <PageHeader
          title={t("src_client_admin_pages_forexadminpage__l185__h0")}
          subtitle="Currencies, central banks, interest rates, and trading pairs"
        />
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {(["currencies", "pairs"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className="mp-admin-action-btn"
              onClick={() => setTab(t)}
              style={
                tab === t
                  ? undefined
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(248,250,252,0.82)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }
              }
            >
              {t === "currencies" ? "Currencies" : "Currency Pairs"}
            </button>
          ))}
        </div>
      </div>

      {tab === "currencies" ? (
        <AdminCrudPage<AdminCurrency>
          title={t("src_client_admin_pages_forexadminpage__l213__h1")}
          subtitle="Fiat and reserve currencies with central bank metadata"
          useStore={useCurrencyAdminStore}
          columns={currencyColumns}
          formFields={currencyFields}
          filters={currencyFilters}
          searchKeys={["code", "name", "country", "centralBank", "region"]}
          defaultEntry={{
            code: "",
            name: "",
            symbol: "",
            country: "",
            countryCode: "",
            region: "Americas",
            type: "fiat",
            centralBank: "",
            interestRate: 0,
            inflation: 0,
            gdpGrowth: 0,
            reserveStatus: "Regional",
            capitalFlows: "Open",
            description: "",
            logo: "",
            active: true,
          }}
          analytics={(rows) => {
            const active = rows.filter((r) => r.active).length;
            const avgRate =
              rows.reduce((s, r) => s + r.interestRate, 0) / Math.max(1, rows.length);
            const avgCPI =
              rows.reduce((s, r) => s + r.inflation, 0) / Math.max(1, rows.length);
            return [
              { label: "Currencies", value: rows.length },
              { label: "Active", value: active, tone: "positive" },
              { label: "Avg Policy Rate", value: `${avgRate.toFixed(2)}%` },
              { label: "Avg Inflation", value: `${avgCPI.toFixed(1)}%` },
            ];
          }}
          exportName="currencies"
          validate={(entry) => {
            const errs: Partial<Record<keyof AdminCurrency, string>> = {};
            const code = entry.code.trim().toUpperCase();
            if (!/^[A-Z]{3,4}$/.test(code))
              errs.code = "Code must be 3–4 uppercase letters (ISO 4217)";
            if (currencies.some((c) => c.code.toUpperCase() === code && c.id !== entry.id))
              errs.code = "Currency already exists";
            return errs;
          }}
        />
      ) : (
        <AdminCrudPage<AdminCurrencyPair>
          title={t("src_client_admin_pages_forexadminpage__l264__h2")}
          subtitle="Major, cross, and exotic pairs with spread management"
          useStore={useCurrencyPairAdminStore}
          columns={pairColumns}
          formFields={pairFields}
          filters={pairFilters}
          searchKeys={["base", "quote", "tier"]}
          defaultEntry={{
            base: "EUR",
            quote: "USD",
            tier: "major",
            spread: 0.8,
            notes: "",
            active: true,
          }}
          analytics={(rows) => {
            const major = rows.filter((r) => r.tier === "major").length;
            const cross = rows.filter((r) => r.tier === "cross").length;
            const exotic = rows.filter((r) => r.tier === "exotic").length;
            return [
              { label: "Total Pairs", value: rows.length },
              { label: "Major", value: major, tone: "positive" },
              { label: "Cross", value: cross },
              { label: "Exotic", value: exotic, tone: "warn" },
            ];
          }}
          exportName="currency-pairs"
          validate={(entry) => {
            const errs: Partial<Record<keyof AdminCurrencyPair, string>> = {};
            if (entry.base === entry.quote)
              errs.quote = "Base and quote must differ";
            return errs;
          }}
        />
      )}
    </div>
  );
}
