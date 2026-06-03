import React from "react";

export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "url"
  | "email"
  | "date"
  | "time"
  | "datetime-local"
  | "color"
  | "tags";

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldDef<T = Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  help?: string;
  span?: 1 | 2 | 3;
  /** Custom validator returning an error message or null/undefined for valid */
  validate?: (value: unknown, all: T) => string | null | undefined;
}

export interface AdminFormBuilderProps<T extends Record<string, unknown>> {
  fields: FormFieldDef<T>[];
  value: Record<string, unknown>;
  errors?: Partial<Record<string, string>>;
  onChange: (key: keyof T & string, value: unknown) => void;
  columns?: 1 | 2 | 3;
}

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  color: "rgba(248,250,252,0.72)",
  fontSize: 12,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  background: "rgba(255,255,255,0.06)",
  color: "#f8fafc",
  fontSize: 14,
  fontWeight: 700,
  padding: "10px 12px",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
};

const errorStyle: React.CSSProperties = {
  color: "#f87171",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "none",
  letterSpacing: 0,
  marginTop: 2,
};

const helpStyle: React.CSSProperties = {
  color: "rgba(248,250,252,0.45)",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "none",
  letterSpacing: 0,
  marginTop: 2,
};

export default function AdminFormBuilder<T extends Record<string, unknown>>({
  fields,
  value,
  errors,
  onChange,
  columns = 2,
}: AdminFormBuilderProps<T>) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 14,
      }}
    >
      {fields.map((f) => {
        const v = value[f.key];
        const err = errors?.[f.key];
        const span = f.span ?? 1;
        const baseStyle = err
          ? { ...inputStyle, borderColor: "rgba(239,68,68,0.6)" }
          : inputStyle;

        let control: React.ReactNode;
        switch (f.type) {
          case "textarea":
            control = (
              <textarea
                value={String(v ?? "")}
                placeholder={f.placeholder}
                onChange={(e) => onChange(f.key, e.target.value)}
                rows={3}
                style={{ ...baseStyle, resize: "vertical", minHeight: 80 }}
              />
            );
            break;
          case "select":
            control = (
              <select
                value={String(v ?? "")}
                onChange={(e) => onChange(f.key, e.target.value)}
                style={baseStyle}
              >
                {!f.required && <option value="">—</option>}
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            );
            break;
          case "checkbox":
            return (
              <label
                key={f.key}
                style={{
                  ...labelStyle,
                  flexDirection: "row",
                  alignItems: "center",
                  gridColumn: `span ${span}`,
                  display: "flex",
                  gap: 10,
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(v)}
                  onChange={(e) => onChange(f.key, e.target.checked)}
                />
                <span>
                  {f.label}
                  {f.required && <span style={{ color: "#f87171" }}> *</span>}
                </span>
                {f.help && <span style={helpStyle}>{f.help}</span>}
              </label>
            );
          case "tags":
            control = (
              <input
                type="text"
                value={Array.isArray(v) ? (v as string[]).join(", ") : String(v ?? "")}
                placeholder={f.placeholder ?? "comma, separated, tags"}
                onChange={(e) =>
                  onChange(
                    f.key,
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                style={baseStyle}
              />
            );
            break;
          case "number":
            control = (
              <input
                type="number"
                value={v == null ? "" : String(v)}
                min={f.min}
                max={f.max}
                step={f.step ?? 1}
                placeholder={f.placeholder}
                onChange={(e) =>
                  onChange(
                    f.key,
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                style={baseStyle}
              />
            );
            break;
          default:
            control = (
              <input
                type={f.type}
                value={String(v ?? "")}
                placeholder={f.placeholder}
                onChange={(e) => onChange(f.key, e.target.value)}
                style={baseStyle}
              />
            );
        }

        return (
          <label
            key={f.key}
            style={{ ...labelStyle, gridColumn: `span ${span}` }}
          >
            <span>
              {f.label}
              {f.required && <span style={{ color: "#f87171" }}> *</span>}
            </span>
            {control}
            {err && <span style={errorStyle}>{err}</span>}
            {!err && f.help && <span style={helpStyle}>{f.help}</span>}
          </label>
        );
      })}
    </div>
  );
}
