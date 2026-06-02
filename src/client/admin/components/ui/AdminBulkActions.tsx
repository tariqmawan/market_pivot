import React from "react";

export interface BulkAction {
  label: string;
  onRun: (ids: string[]) => void;
  destructive?: boolean;
  confirm?: string;
}

export interface AdminBulkActionsProps {
  selection: string[];
  total: number;
  actions: BulkAction[];
  onClear: () => void;
}

export default function AdminBulkActions({
  selection,
  total,
  actions,
  onClear,
}: AdminBulkActionsProps) {
  if (selection.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: "rgba(209,170,114,0.12)",
        border: "1px solid rgba(209,170,114,0.28)",
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <strong style={{ color: "#f0c060", fontSize: 13, fontWeight: 900 }}>
        {selection.length} of {total} selected
      </strong>
      <span
        style={{ height: 18, width: 1, background: "rgba(255,255,255,0.18)" }}
      />
      {actions.map((a, i) => (
        <button
          key={i}
          type="button"
          className="mp-admin-action-btn"
          style={
            a.destructive
              ? {
                  background: "rgba(239,68,68,0.18)",
                  color: "#ff9090",
                  border: "1px solid rgba(239,68,68,0.32)",
                }
              : undefined
          }
          onClick={() => {
            if (a.confirm && !window.confirm(a.confirm)) return;
            a.onRun(selection);
          }}
        >
          {a.label}
        </button>
      ))}
      <button
        type="button"
        className="mp-admin-link-btn"
        style={{ marginLeft: "auto" }}
        onClick={onClear}
      >
        Clear selection
      </button>
    </div>
  );
}
