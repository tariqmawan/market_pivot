import React from "react";
import { useI18n } from "../../../i18n";



export interface AdminSelectOption {
  value: string;
  label: string;
}

export interface AdminFilterDef {
  key: string;
  label: string;
  type: "select" | "text" | "number";
  options?: AdminSelectOption[];
  placeholder?: string;
}

export interface AdminFiltersProps {
  filters: AdminFilterDef[];
  value: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset?: () => void;
}

export default function AdminFilters({
  filters,
  value,
  onChange,
  onReset,
}: AdminFiltersProps) {
  const { t } = useI18n();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "flex-end",
        padding: "14px 16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        marginBottom: 4,
      }}
    >
      {filters.map((f) => (
        <label key={f.key} style={{ display: "grid", gap: 5, minWidth: 160 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "rgba(248,250,252,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {f.label}
          </span>
          {f.type === "select" ? (
            <select
              className="mp-admin-search"
              value={value[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
            >
              <option value="">{t("src_client_admin_components_ui_adminfilters__l58__h0")}</option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="mp-admin-search"
              type={f.type === "number" ? "number" : "text"}
              value={value[f.key] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => onChange(f.key, e.target.value)}
            />
          )}
        </label>
      ))}
      {onReset && (
        <div style={{ display: "grid", gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "transparent", letterSpacing: "0.06em" }}>‎</span>
          <button
            type="button"
            className="mp-admin-link-btn"
            onClick={onReset}
          >
            ↺ Reset
          </button>
        </div>
      )}
    </div>
  );
}
