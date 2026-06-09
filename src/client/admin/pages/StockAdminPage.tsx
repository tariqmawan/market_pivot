import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import { useStockAdminStore, type AdminStock } from "../stores/stockStore";
import { useExchangeAdminStore } from "../stores/exchangeStore";
import { useI18n } from "../../i18n";



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

export default function StockAdminPage() {
  const { t } = useI18n();
  const items = useStockAdminStore((s) => s.items);
  const update = useStockAdminStore((s) => s.update);
  const addMany = useStockAdminStore((s) => s.addMany);
  const exchanges = useExchangeAdminStore((s) => s.items);

  const columns: AdminColumn<AdminStock>[] = React.useMemo(
    () => [
      { key: "ticker", label: t("adminStockColTicker"), width: "90px" },
      { key: "name", label: t("adminStockColCompany") },
      { key: "exchange", label: t("adminStockColExchange"), width: "110px" },
      { key: "sector", label: t("adminStockColSector"), width: "150px" },
      { key: "industry", label: t("adminStockColIndustry") },
      {
        key: "marketCap",
        label: t("adminStockColMarketCap"),
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
        label: t("adminStockColPe"),
        align: "right",
        render: (r) => r.pe.toFixed(1),
        value: (r) => r.pe,
      },
      {
        key: "dividendYield",
        label: t("adminStockColYield"),
        align: "right",
        render: (r) => `${r.dividendYield.toFixed(2)}%`,
        value: (r) => r.dividendYield,
      },
      {
        key: "status",
        label: t("adminStockColStatus"),
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
            {t(`adminStockStatus.${r.status}`)}
          </span>
        ),
      },
    ],
    [t]
  );

  const statusOptions = React.useMemo(
    () => [
      { value: "active", label: t("adminStockStatusActive") },
      { value: "ipo_pending", label: t("adminStockStatusIpoPending") },
      { value: "delisted", label: t("adminStockStatusDelisted") },
      { value: "suspended", label: t("adminStockStatusSuspended") },
    ],
    [t]
  );

  const exchangeOptions = React.useMemo(
    () => exchanges.map((e) => ({ value: e.code, label: `${e.code} — ${e.name}` })),
    [exchanges]
  );

  const filters: AdminFilterDef[] = React.useMemo(
    () => [
      { key: "exchange", label: t("adminStockFilterExchange"), type: "select", options: exchangeOptions },
      { key: "sector", label: t("adminStockFilterSector"), type: "select", options: SECTOR_OPTIONS },
      { key: "status", label: t("adminStockFilterStatus"), type: "select", options: statusOptions },
      { key: "industry", label: t("adminStockFilterIndustry"), type: "text", placeholder: t("adminStockFilterIndustryPlaceholder") },
    ],
    [t, exchangeOptions, statusOptions]
  );

  const formFields: FormFieldDef<AdminStock>[] = React.useMemo(
    () => [
      { key: "ticker", label: t("adminStockFormTicker"), type: "text", required: true, placeholder: "AAPL" },
      { key: "name", label: t("adminStockFormCompanyName"), type: "text", required: true, span: 2 },
      { key: "exchange", label: t("adminStockFormExchange"), type: "select", options: exchangeOptions, required: true },
      { key: "sector", label: t("adminStockFormSector"), type: "select", options: SECTOR_OPTIONS, required: true },
      { key: "industry", label: t("adminStockFormIndustry"), type: "text", required: true },
      { key: "status", label: t("adminStockFormStatus"), type: "select", options: statusOptions, required: true },
      { key: "ceo", label: t("adminStockFormCeo"), type: "text" },
      { key: "headquarters", label: t("adminStockFormHeadquarters"), type: "text" },
      { key: "employees", label: t("adminStockFormEmployees"), type: "number", min: 0 },
      { key: "founded", label: t("adminStockFormFounded"), type: "number", min: 1700, max: 2100 },
      { key: "ipoDate", label: t("adminStockFormIpoDate"), type: "date" },
      { key: "nextEarningsDate", label: t("adminStockFormNextEarnings"), type: "date" },
      { key: "marketCap", label: t("adminStockFormMarketCap"), type: "number", min: 0 },
      { key: "sharesOutstanding", label: t("adminStockFormSharesOutstanding"), type: "number", min: 0 },
      { key: "pe", label: t("adminStockFormPeRatio"), type: "number", step: 0.1 },
      { key: "eps", label: t("adminStockFormEps"), type: "number", step: 0.01 },
      { key: "beta", label: t("adminStockFormBeta"), type: "number", step: 0.01 },
      { key: "dividendYield", label: t("adminStockFormDividendYield"), type: "number", step: 0.01, min: 0 },
      { key: "website", label: t("adminStockFormWebsite"), type: "url" },
      { key: "logo", label: t("adminStockFormLogoUrl"), type: "url" },
      { key: "tags", label: t("adminStockFormTags"), type: "tags", help: t("adminStockFormTagsHelp") },
      { key: "description", label: t("adminStockFormDescription"), type: "textarea", span: 2 },
    ],
    [t, exchangeOptions, statusOptions]
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
        window.alert(t("adminStockImported", { count: mapped.length }));
      } catch (e) {
        window.alert(t("adminStockImportFailed", { message: e instanceof Error ? e.message : t("adminStockUnknownError") }));
      }
    };
    input.click();
  };

  return (
    <AdminCrudPage<AdminStock>
      title={t("admin/stockadminpage.h0")}
      subtitle={t("adminStockSubtitle")}
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
          { label: t("adminStockAnalyticsTotalListings"), value: rows.length },
          { label: t("adminStockAnalyticsActive"), value: active, tone: "positive" },
          { label: t("adminStockAnalyticsIpoPending"), value: ipoPending, tone: "warn" },
          { label: t("adminStockAnalyticsAggregateCap"), value: `$${(totalCap / 1e12).toFixed(2)}T` },
          { label: t("adminStockAnalyticsDividendPayers"), value: `${divPayers}/${rows.length}` },
          { label: t("adminStockAnalyticsAvgPe"), value: avgPE.toFixed(1) },
        ];
      }}
      extraBulkActions={[
        {
          label: t("adminStockBulkMarkActive"),
          onRun: (ids) => ids.forEach((id) => update(id, { status: "active" })),
        },
        {
          label: t("adminStockBulkSuspend"),
          destructive: true,
          confirm: t("adminStockBulkSuspendConfirm"),
          onRun: (ids) => ids.forEach((id) => update(id, { status: "suspended" })),
        },
        {
          label: t("adminStockBulkUpload"),
          onRun: () => handleBulkUpload(),
        },
      ]}
      exportName="stocks"
      validate={(entry) => {
        const errs: Partial<Record<keyof AdminStock, string>> = {};
        const tick = entry.ticker.trim().toUpperCase();
        if (!/^[A-Z0-9.-]{1,8}$/.test(tick))
          errs.ticker = t("adminStockValidateTickerFormat");
        if (items.some((i) => i.ticker.toUpperCase() === tick && i.id !== entry.id))
          errs.ticker = t("adminStockValidateTickerExists");
        if (!entry.name.trim()) errs.name = t("adminStockValidateNameRequired");
        return errs;
      }}
    />
  );
}
