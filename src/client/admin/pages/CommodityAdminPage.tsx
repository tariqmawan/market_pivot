import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import { useI18n } from "../../i18n";
import {
  useCommodityAdminStore,
  type AdminCommodity,
} from "../stores/commodityStore";


const CATEGORY_OPTIONS = [
  "Energy",
  "Metals",
  "Agriculture",
  "Industrial",
  "Soft",
  "Livestock",
].map((c) => ({ value: c, label: c }));

const UNIT_OPTIONS = [
  "barrel",
  "ounce",
  "ton",
  "pound",
  "bushel",
  "gallon",
  "MMBtu",
  "kilogram",
].map((u) => ({ value: u, label: u }));

const EXCHANGE_OPTIONS = ["NYMEX", "COMEX", "CBOT", "ICE", "LME", "SHFE", "DCE"].map((e) => ({
  value: e,
  label: e,
}));

const columns: AdminColumn<AdminCommodity>[] = [
  { key: "symbol", label: "Sym", width: "90px" },
  { key: "name", label: "Commodity" },
  { key: "category", label: "Category", width: "120px" },
  {
    key: "spotPrice",
    label: "Spot",
    align: "right",
    render: (r) => `$${r.spotPrice.toFixed(2)}/${r.unit}`,
    value: (r) => r.spotPrice,
  },
  {
    key: "changePercent24h",
    label: "24h",
    align: "right",
    render: (r) => (
      <span style={{ color: r.changePercent24h >= 0 ? "#6ee7b7" : "#ff9090", fontWeight: 800 }}>
        {r.changePercent24h >= 0 ? "+" : ""}
        {r.changePercent24h.toFixed(2)}%
      </span>
    ),
    value: (r) => r.changePercent24h,
  },
  { key: "futuresContract", label: "Futures", width: "100px" },
  {
    key: "active",
    label: "Active",
    width: "80px",
    render: (r) => (r.active ? "✅" : "—"),
    value: (r) => (r.active ? 1 : 0),
  },
];

const filters: AdminFilterDef[] = [
  { key: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS },
  { key: "unit", label: "Unit", type: "select", options: UNIT_OPTIONS },
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

const formFields: FormFieldDef<AdminCommodity>[] = [
  { key: "slug", label: "Slug", type: "text", required: true, placeholder: "crude-oil" },
  { key: "symbol", label: "Symbol", type: "text", required: true, placeholder: "WTI" },
  { key: "name", label: "Name", type: "text", required: true },
  { key: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS, required: true },
  { key: "unit", label: "Unit", type: "select", options: UNIT_OPTIONS, required: true },
  { key: "spotPrice", label: "Spot Price (USD)", type: "number", step: 0.01, min: 0, required: true },
  { key: "changePercent24h", label: "24h Change %", type: "number", step: 0.01 },
  { key: "futuresContract", label: "Futures Ticker", type: "text", placeholder: "CL" },
  { key: "active", label: "Active", type: "checkbox" },
  { key: "productionRegions", label: "Production Regions", type: "tags" },
  { key: "supplyRegions", label: "Supply Regions", type: "tags" },
  { key: "demandRegions", label: "Demand Regions", type: "tags" },
  { key: "demandTrends", label: "Demand Trends", type: "tags", span: 2 },
  { key: "currencyCorrelation", label: "FX Correlation", type: "textarea", span: 2 },
  { key: "economicImpact", label: "Economic Impact", type: "textarea", span: 2 },
];

export default function CommodityAdminPage() {
  const { t } = useI18n();
  const items = useCommodityAdminStore((s) => s.items);
  const update = useCommodityAdminStore((s) => s.update);

  const [showSpecModal, setShowSpecModal] = React.useState<AdminCommodity | null>(null);
  const [spec, setSpec] = React.useState<AdminCommodity["contractSpec"]>({
    exchange: "NYMEX",
    ticker: "",
    contractSize: "",
    tickSize: "",
  });

  React.useEffect(() => {
    if (showSpecModal) setSpec(showSpecModal.contractSpec);
  }, [showSpecModal]);

  return (
    <>
      <AdminCrudPage<AdminCommodity>
        title={t("src_client_admin_pages_commodityadminpage__l120__h0")}
        subtitle="Spot pricing, futures specs, production and supply regions, demand drivers"
        useStore={useCommodityAdminStore}
        columns={columns}
        formFields={formFields}
        filters={filters}
        searchKeys={["symbol", "name", "category", "futuresContract"]}
        defaultEntry={{
          slug: "",
          symbol: "",
          name: "",
          category: "Energy",
          unit: "barrel",
          spotPrice: 0,
          changePercent24h: 0,
          futuresContract: "",
          contractSpec: { exchange: "NYMEX", ticker: "", contractSize: "", tickSize: "0.01" },
          productionRegions: [],
          supplyRegions: [],
          demandRegions: [],
          demandTrends: [],
          currencyCorrelation: "",
          economicImpact: "",
          active: true,
        }}
        analytics={(rows) => {
          const energy = rows.filter((r) => r.category === "Energy").length;
          const metals = rows.filter((r) => r.category === "Metals").length;
          const agri = rows.filter((r) => r.category === "Agriculture").length;
          const avg = rows.reduce((s, r) => s + r.changePercent24h, 0) / Math.max(1, rows.length);
          return [
            { label: "Total", value: rows.length },
            { label: "Energy", value: energy },
            { label: "Metals", value: metals },
            { label: "Agriculture", value: agri },
            { label: "Avg 24h", value: `${avg.toFixed(2)}%`, tone: avg >= 0 ? "positive" : "negative" },
          ];
        }}
        rowExtraActions={(row) => (
          <button
            type="button"
            className="mp-admin-link-btn"
            onClick={() => setShowSpecModal(row)}
            title={t("src_client_admin_pages_commodityadminpage__l163__h1")}
          >
            Spec
          </button>
        )}
        extraBulkActions={[
          {
            label: "Activate",
            onRun: (ids) => ids.forEach((id) => update(id, { active: true })),
          },
          {
            label: "Deactivate",
            destructive: true,
            confirm: "Deactivate selected commodities?",
            onRun: (ids) => ids.forEach((id) => update(id, { active: false })),
          },
        ]}
        exportName="commodities"
        validate={(entry) => {
          const errs: Partial<Record<keyof AdminCommodity, string>> = {};
          const sym = entry.symbol.trim().toUpperCase();
          if (!/^[A-Z0-9]{1,8}$/.test(sym))
            errs.symbol = "Symbol must be 1–8 uppercase letters/digits";
          if (items.some((c) => c.symbol.toUpperCase() === sym && c.id !== entry.id))
            errs.symbol = "Symbol already exists";
          if (!entry.slug.trim()) errs.slug = "Slug required";
          return errs;
        }}
      />

      {showSpecModal && (
        <div className="mp-admin-modal-overlay" onClick={() => setShowSpecModal(null)}>
          <div
            className="mp-admin-modal"
            style={{ maxWidth: 520 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, marginBottom: 16, color: "#f8fafc" }}>
              Contract Spec — {showSpecModal.name}
            </h3>
            <div style={{ display: "grid", gap: 12 }}>
              <label style={{ display: "grid", gap: 4, color: "rgba(248,250,252,0.7)", fontSize: 12, fontWeight: 800 }}>
                EXCHANGE
                <select
                  className="mp-admin-search"
                  value={spec.exchange}
                  onChange={(e) => setSpec((s) => ({ ...s, exchange: e.target.value }))}
                >
                  {EXCHANGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: 4, color: "rgba(248,250,252,0.7)", fontSize: 12, fontWeight: 800 }}>
                TICKER
                <input
                  className="mp-admin-search"
                  value={spec.ticker}
                  onChange={(e) => setSpec((s) => ({ ...s, ticker: e.target.value }))}
                />
              </label>
              <label style={{ display: "grid", gap: 4, color: "rgba(248,250,252,0.7)", fontSize: 12, fontWeight: 800 }}>
                CONTRACT SIZE
                <input
                  className="mp-admin-search"
                  value={spec.contractSize}
                  onChange={(e) => setSpec((s) => ({ ...s, contractSize: e.target.value }))}
                />
              </label>
              <label style={{ display: "grid", gap: 4, color: "rgba(248,250,252,0.7)", fontSize: 12, fontWeight: 800 }}>
                TICK SIZE
                <input
                  className="mp-admin-search"
                  value={spec.tickSize}
                  onChange={(e) => setSpec((s) => ({ ...s, tickSize: e.target.value }))}
                />
              </label>
            </div>
            <div className="mp-admin-modal-actions" style={{ marginTop: 16 }}>
              <button
                type="button"
                className="mp-admin-action-btn"
                onClick={() => {
                  update(showSpecModal.id, { contractSpec: spec });
                  setShowSpecModal(null);
                }}
              >
                Save spec
              </button>
              <button
                type="button"
                className="mp-admin-link-btn"
                onClick={() => setShowSpecModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
