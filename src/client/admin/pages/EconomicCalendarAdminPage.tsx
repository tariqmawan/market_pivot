import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import { useI18n } from "../../i18n";
import {
  useEconomicEventAdminStore,
  type AdminEconomicEvent,
  type EventImpact,
} from "../stores/economicCalendarStore";


const IMPACT_OPTIONS: { value: EventImpact; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "released", label: "Released" },
  { value: "postponed", label: "Postponed" },
  { value: "cancelled", label: "Cancelled" },
];

const REGION_OPTIONS = [
  "North America",
  "Latin America",
  "Europe",
  "Asia",
  "Asia Pacific",
  "Middle East",
  "Africa",
  "Oceania",
  "Global",
].map((r) => ({ value: r, label: r }));

const CATEGORY_OPTIONS = [
  "Inflation",
  "Central Bank",
  "Labor",
  "GDP",
  "PMI",
  "Trade",
  "Housing",
  "Retail",
  "Consumer",
  "Speech",
  "Bond Auction",
].map((c) => ({ value: c, label: c }));

const columns: AdminColumn<AdminEconomicEvent>[] = [
  {
    key: "scheduledFor",
    label: "Date/Time",
    width: "150px",
    render: (r) => new Date(r.scheduledFor).toLocaleString(),
    value: (r) => new Date(r.scheduledFor).getTime(),
  },
  {
    key: "impact",
    label: "Impact",
    width: "90px",
    render: (r) => (
      <span
        style={{
          padding: "3px 8px",
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          background:
            r.impact === "high"
              ? "rgba(239,68,68,0.18)"
              : r.impact === "medium"
              ? "rgba(251,191,36,0.18)"
              : "rgba(16,185,129,0.12)",
          color:
            r.impact === "high" ? "#ff9090" : r.impact === "medium" ? "#fbbf24" : "#6ee7b7",
        }}
      >
        {r.impact}
      </span>
    ),
  },
  { key: "currency", label: "FX", width: "70px" },
  { key: "country", label: "Country", width: "150px" },
  { key: "title", label: "Event" },
  { key: "category", label: "Category", width: "120px" },
  {
    key: "consensus",
    label: "Cons.",
    align: "right",
    width: "90px",
    render: (r) => r.consensus || "—",
  },
  {
    key: "previous",
    label: "Prev.",
    align: "right",
    width: "90px",
    render: (r) => r.previous || "—",
  },
  {
    key: "actual",
    label: "Actual",
    align: "right",
    width: "90px",
    render: (r) => {
      if (!r.actual) return "—";
      const prev = Number(String(r.previous).replace(/[^\d.-]/g, ""));
      const act = Number(String(r.actual).replace(/[^\d.-]/g, ""));
      const beat = !Number.isNaN(prev) && !Number.isNaN(act) && act > prev;
      return (
        <strong style={{ color: beat ? "#6ee7b7" : "#ff9090" }}>{r.actual}</strong>
      );
    },
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
            r.status === "released"
              ? "rgba(16,185,129,0.15)"
              : r.status === "scheduled"
              ? "rgba(209,170,114,0.15)"
              : r.status === "postponed"
              ? "rgba(251,191,36,0.15)"
              : "rgba(239,68,68,0.18)",
          color:
            r.status === "released"
              ? "#6ee7b7"
              : r.status === "scheduled"
              ? "#f0c060"
              : r.status === "postponed"
              ? "#fbbf24"
              : "#ff9090",
        }}
      >
        {r.status}
      </span>
    ),
  },
];

const filters: AdminFilterDef[] = [
  { key: "impact", label: "Impact", type: "select", options: IMPACT_OPTIONS },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
  { key: "region", label: "Region", type: "select", options: REGION_OPTIONS },
  { key: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS },
  { key: "currency", label: "Currency", type: "text", placeholder: "USD" },
];

const formFields: FormFieldDef<AdminEconomicEvent>[] = [
  { key: "title", label: "Event Title", type: "text", required: true, span: 2 },
  { key: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS, required: true },
  { key: "impact", label: "Impact", type: "select", options: IMPACT_OPTIONS, required: true },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true },
  { key: "scheduledFor", label: "Scheduled For", type: "datetime-local", required: true },
  { key: "country", label: "Country", type: "text", required: true },
  { key: "countryCode", label: "Country Code", type: "text", placeholder: "US" },
  { key: "region", label: "Region", type: "select", options: REGION_OPTIONS, required: true },
  { key: "currency", label: "Currency", type: "text", required: true, placeholder: "USD" },
  { key: "unit", label: "Unit", type: "text", placeholder: "%, Jobs, Index" },
  { key: "consensus", label: "Consensus", type: "text" },
  { key: "previous", label: "Previous", type: "text" },
  { key: "actual", label: "Actual", type: "text" },
  { key: "source", label: "Source", type: "text", placeholder: "BLS / ECB / NBS" },
  { key: "notes", label: "Notes", type: "textarea", span: 2 },
];

export default function EconomicCalendarAdminPage() {
  const { t } = useI18n();
  const items = useEconomicEventAdminStore((s) => s.items);
  const update = useEconomicEventAdminStore((s) => s.update);
  const addMany = useEconomicEventAdminStore((s) => s.addMany);

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const rows = Array.isArray(parsed) ? parsed : parsed.events ?? [];
        const mapped = (rows as Array<Record<string, unknown>>).map((r) => ({
          title: String(r.title ?? ""),
          category: String(r.category ?? "Inflation"),
          country: String(r.country ?? ""),
          countryCode: String(r.countryCode ?? ""),
          region: String(r.region ?? "Global"),
          currency: String(r.currency ?? "USD"),
          impact: (String(r.impact ?? "medium") as AdminEconomicEvent["impact"]),
          status: (String(r.status ?? "scheduled") as AdminEconomicEvent["status"]),
          scheduledFor: String(r.scheduledFor ?? new Date().toISOString().slice(0, 16)),
          consensus: String(r.consensus ?? ""),
          previous: String(r.previous ?? ""),
          actual: String(r.actual ?? ""),
          unit: String(r.unit ?? ""),
          source: String(r.source ?? ""),
          notes: String(r.notes ?? ""),
        }));
        addMany(mapped);
        window.alert(`Imported ${mapped.length} events.`);
      } catch (e) {
        window.alert(`Import failed: ${e instanceof Error ? e.message : "Unknown error"}`);
      }
    };
    input.click();
  };

  return (
    <AdminCrudPage<AdminEconomicEvent>
      title={t("src_client_admin_pages_economiccalendaradminpage__l223__h0")}
      subtitle="Macro releases, central bank decisions, impact tagging, consensus/actual tracking"
      useStore={useEconomicEventAdminStore}
      columns={columns}
      formFields={formFields}
      filters={filters}
      searchKeys={["title", "country", "category", "currency", "notes"]}
      defaultEntry={{
        title: "",
        category: "Inflation",
        country: "",
        countryCode: "",
        region: "North America",
        currency: "USD",
        impact: "medium",
        status: "scheduled",
        scheduledFor: new Date().toISOString().slice(0, 16),
        consensus: "",
        previous: "",
        actual: "",
        unit: "",
        source: "",
        notes: "",
      }}
      analytics={(rows) => {
        const upcoming = rows.filter(
          (r) =>
            r.status === "scheduled" &&
            new Date(r.scheduledFor).getTime() > Date.now()
        ).length;
        const highImpact = rows.filter((r) => r.impact === "high").length;
        const released = rows.filter((r) => r.status === "released").length;
        const next7 = rows.filter((r) => {
          const ts = new Date(r.scheduledFor).getTime();
          return ts >= Date.now() && ts <= Date.now() + 7 * 86400000;
        }).length;
        return [
          { label: "Total Events", value: rows.length },
          { label: "Upcoming", value: upcoming, tone: "positive" },
          { label: "Next 7 days", value: next7, tone: next7 > 0 ? "warn" : "neutral" },
          { label: "High Impact", value: highImpact, tone: highImpact > 0 ? "warn" : "neutral" },
          { label: "Released", value: released },
        ];
      }}
      extraBulkActions={[
        {
          label: "Mark Released",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "released" })),
        },
        {
          label: "Postpone",
          destructive: true,
          confirm: "Mark selected events as postponed?",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "postponed" })),
        },
        { label: "📥 Import JSON", onRun: () => handleImport() },
      ]}
      exportName="economic-events"
      validate={(entry) => {
        const errs: Partial<Record<keyof AdminEconomicEvent, string>> = {};
        if (!entry.title.trim()) errs.title = t("src_client_admin_pages_economiccalendaradminpage__l283__h1");
        if (!entry.scheduledFor) errs.scheduledFor = "Schedule required";
        if (items.some((e) => e.title === entry.title && e.scheduledFor === entry.scheduledFor && e.id !== entry.id))
          errs.title = t("src_client_admin_pages_economiccalendaradminpage__l286__h2");
        return errs;
      }}
    />
  );
}
