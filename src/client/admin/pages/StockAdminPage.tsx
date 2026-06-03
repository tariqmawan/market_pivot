import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import { useStockAdminStore, type AdminStock } from "../stores/stockStore";
import { useExchangeAdminStore } from "../stores/exchangeStore";

const SECTOR_OPTIONS = [
  "Technology",
  "Banking",
  "Financial Services",
  "Healthcare",
  "Pharmaceuticals",
  "Energy",
  "Consumer Discretionary",
  "Consumer Staples",
  "Industrials",
  "Materials",
  "Real Estate",
  "Communication Services",
  "Utilities",
  "Semiconductor",
  "AI",
  "EV",
  "Mining",
].map((s) => ({ value: s, label: s }));

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "ipo_pending", label: "IPO Pending" },
  { value: "delisted", label: "Delisted" },
  { value: "suspended", label: "Suspended" },
];

const columns: AdminColumn<AdminStock>[] = [
  { key: "ticker", label: "Ticker", width: "90px" },
  { key: "name", label: "Company" },
  { key: "exchange", label: "Exchange", width: "110px" },
  { key: "sector", label: "Sector", width: "150px" },
  { key: "industry", label: "Industry" },
  {
    key: "marketCap",
    label: "Market Cap",
    align: "right",
    render: (r) =>
      r.marketCap >= 1e12
        ? `$${(r.marketCap / 1e12).toFixed(2)}T`
        : r.marketCap >= 1e9
        ? `$${(r.marketCap / 1e9).toFixed(2)}B`
        : `$${(r.marketCap / 1e6).toFixed(2)}M`,
    value: (r) => r.marketCap,
  },
  {
    key: "pe",
    label: "P/E",
    align: "right",
    render: (r) => r.pe.toFixed(1),
    value: (r) => r.pe,
  },
  {
    key: "dividendYield",
    label: "Yield",
    align: "right",
    render: (r) => `${r.dividendYield.toFixed(2)}%`,
    value: (r) => r.dividendYield,
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
              : r.status === "ipo_pending"
              ? "rgba(251,191,36,0.15)"
              : r.status === "delisted"
              ? "rgba(239,68,68,0.18)"
              : "rgba(248,250,252,0.08)",
          color:
            r.status === "active"
              ? "#6ee7b7"
              : r.status === "ipo_pending"
              ? "#fbbf24"
              : r.status === "delisted"
              ? "#ff9090"
              : "rgba(248,250,252,0.7)",
        }}
      >
        {r.status.replace("_", " ")}
      </span>
    ),
  },
];

export default function StockAdminPage() {
  const items = useStockAdminStore((s) => s.items);
  const update = useStockAdminStore((s) => s.update);
  const addMany = useStockAdminStore((s) => s.addMany);
  const exchanges = useExchangeAdminStore((s) => s.items);

  const exchangeOptions = React.useMemo(
    () => exchanges.map((e) => ({ value: e.code, label: `${e.code} — ${e.name}` })),
    [exchanges]
  );

  const filters: AdminFilterDef[] = React.useMemo(
    () => [
      { key: "exchange", label: "Exchange", type: "select", options: exchangeOptions },
      { key: "sector", label: "Sector", type: "select", options: SECTOR_OPTIONS },
      { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      { key: "industry", label: "Industry", type: "text", placeholder: "Substring" },
    ],
    [exchangeOptions]
  );

  const formFields: FormFieldDef<AdminStock>[] = React.useMemo(
    () => [
      { key: "ticker", label: "Ticker", type: "text", required: true, placeholder: "AAPL" },
      { key: "name", label: "Company Name", type: "text", required: true, span: 2 },
      { key: "exchange", label: "Exchange", type: "select", options: exchangeOptions, required: true },
      { key: "sector", label: "Sector", type: "select", options: SECTOR_OPTIONS, required: true },
      { key: "industry", label: "Industry", type: "text", required: true },
      { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true },
      { key: "ceo", label: "CEO", type: "text" },
      { key: "headquarters", label: "Headquarters", type: "text" },
      { key: "employees", label: "Employees", type: "number", min: 0 },
      { key: "founded", label: "Founded", type: "number", min: 1700, max: 2100 },
      { key: "ipoDate", label: "IPO Date", type: "date" },
      { key: "nextEarningsDate", label: "Next Earnings", type: "date" },
      { key: "marketCap", label: "Market Cap (USD)", type: "number", min: 0 },
      { key: "sharesOutstanding", label: "Shares Outstanding", type: "number", min: 0 },
      { key: "pe", label: "P/E Ratio", type: "number", step: 0.1 },
      { key: "eps", label: "EPS", type: "number", step: 0.01 },
      { key: "beta", label: "Beta", type: "number", step: 0.01 },
      { key: "dividendYield", label: "Dividend Yield %", type: "number", step: 0.01, min: 0 },
      { key: "website", label: "Website", type: "url" },
      { key: "logo", label: "Logo URL", type: "url" },
      { key: "tags", label: "Tags", type: "tags", help: "Comma-separated themes" },
      { key: "description", label: "Description", type: "textarea", span: 2 },
    ],
    [exchangeOptions]
  );

  const handleBulkUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "text/csv,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        let payload: Array<Record<string, unknown>> = [];
        if (file.name.toLowerCase().endsWith(".json")) {
          const parsed = JSON.parse(text);
          payload = Array.isArray(parsed) ? parsed : Array.isArray(parsed.stocks) ? parsed.stocks : [];
        } else {
          // very small CSV parser (no quoted commas)
          const lines = text.split(/\r?\n/).filter(Boolean);
          if (lines.length < 2) return;
          const header = lines[0].split(",").map((h) => h.trim());
          payload = lines.slice(1).map((row) => {
            const cells = row.split(",");
            return header.reduce((acc, key, i) => {
              acc[key] = cells[i]?.trim() ?? "";
              return acc;
            }, {} as Record<string, unknown>);
          });
        }
        const mapped = payload
          .filter((p) => p.ticker || p.symbol)
          .map((p) => ({
            ticker: String(p.ticker ?? p.symbol ?? "").toUpperCase(),
            name: String(p.name ?? ""),
            exchange: String(p.exchange ?? "NASDAQ"),
            sector: String(p.sector ?? "Technology"),
            industry: String(p.industry ?? "Other"),
            status: (String(p.status ?? "active") as AdminStock["status"]),
            ceo: String(p.ceo ?? ""),
            headquarters: String(p.headquarters ?? ""),
            employees: Number(p.employees ?? 0),
            founded: p.founded ? Number(p.founded) : null,
            website: String(p.website ?? ""),
            logo: String(p.logo ?? ""),
            description: String(p.description ?? ""),
            marketCap: Number(p.marketCap ?? 0),
            sharesOutstanding: Number(p.sharesOutstanding ?? 0),
            pe: Number(p.pe ?? 0),
            eps: Number(p.eps ?? 0),
            beta: Number(p.beta ?? 1),
            dividendYield: Number(p.dividendYield ?? 0),
            ipoDate: String(p.ipoDate ?? ""),
            nextEarningsDate: String(p.nextEarningsDate ?? ""),
            earnings: [],
            dividends: [],
            tags: typeof p.tags === "string" ? p.tags.split(";").map((t) => t.trim()) : Array.isArray(p.tags) ? p.tags as string[] : [],
          }));
        addMany(mapped);
        window.alert(`Imported ${mapped.length} stocks.`);
      } catch (e) {
        window.alert(`Import failed: ${e instanceof Error ? e.message : "Unknown error"}`);
      }
    };
    input.click();
  };

  return (
    <AdminCrudPage<AdminStock>
      title="Stocks"
      subtitle="Listed companies, sectors, financials, earnings, dividends, and IPO management"
      useStore={useStockAdminStore}
      columns={columns}
      formFields={formFields}
      filters={filters}
      searchKeys={["ticker", "name", "sector", "industry", "ceo", "headquarters"]}
      defaultEntry={{
        ticker: "",
        name: "",
        exchange: exchangeOptions[0]?.value ?? "NASDAQ",
        sector: "Technology",
        industry: "",
        status: "active",
        ceo: "",
        headquarters: "",
        employees: 0,
        founded: null,
        website: "",
        logo: "",
        description: "",
        marketCap: 0,
        sharesOutstanding: 0,
        pe: 0,
        eps: 0,
        beta: 1,
        dividendYield: 0,
        ipoDate: "",
        nextEarningsDate: "",
        earnings: [],
        dividends: [],
        tags: [],
      }}
      analytics={(rows) => {
        const totalCap = rows.reduce((s, r) => s + r.marketCap, 0);
        const active = rows.filter((r) => r.status === "active").length;
        const ipoPending = rows.filter((r) => r.status === "ipo_pending").length;
        const avgPE =
          rows.filter((r) => r.pe > 0).reduce((s, r) => s + r.pe, 0) /
          Math.max(1, rows.filter((r) => r.pe > 0).length);
        const divPayers = rows.filter((r) => r.dividendYield > 0).length;
        return [
          { label: "Total Listings", value: rows.length },
          { label: "Active", value: active, tone: "positive" },
          { label: "IPO Pending", value: ipoPending, tone: "warn" },
          { label: "Aggregate Cap", value: `$${(totalCap / 1e12).toFixed(2)}T` },
          { label: "Dividend Payers", value: `${divPayers}/${rows.length}` },
          { label: "Avg P/E", value: avgPE.toFixed(1) },
        ];
      }}
      extraBulkActions={[
        {
          label: "Mark Active",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "active" })),
        },
        {
          label: "Suspend",
          destructive: true,
          confirm: "Suspend trading for selected stocks?",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "suspended" })),
        },
        {
          label: "📤 Bulk Upload",
          onRun: () => handleBulkUpload(),
        },
      ]}
      exportName="stocks"
      validate={(entry) => {
        const errs: Partial<Record<keyof AdminStock, string>> = {};
        const tick = entry.ticker.trim().toUpperCase();
        if (!/^[A-Z0-9.-]{1,8}$/.test(tick))
          errs.ticker = "Ticker must be 1–8 uppercase letters/digits";
        if (items.some((i) => i.ticker.toUpperCase() === tick && i.id !== entry.id))
          errs.ticker = "Ticker already exists";
        if (!entry.name.trim()) errs.name = "Company name required";
        return errs;
      }}
    />
  );
}
