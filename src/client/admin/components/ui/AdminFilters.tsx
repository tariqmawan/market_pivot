import React from "react";

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
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "flex-end",
        padding: "8px 0",
      }}
    >
      {filters.map((f) => (
        <label key={f.key} style={{ display: "grid", gap: 4, minWidth: 160 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: "rgba(248,250,252,0.62)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
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
              <option value="">All</option>
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
        <button
          type="button"
          className="mp-admin-link-btn"
          onClick={onReset}
          style={{ marginBottom: 2 }}
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
