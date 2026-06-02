import React from "react";

/**
 * Empty-state primitive — shown when a list / table has zero items.
 * Keeps the layout calm and signposts the next action.
 */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondary?: React.ReactNode;
  compact?: boolean;
}

export default function EmptyState({
  icon = "📋",
  title,
  description,
  actionLabel,
  onAction,
  secondary,
  compact,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: compact ? "1.5rem" : "3rem 1.5rem",
        textAlign: "center",
        border: "1px dashed rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 12,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: compact ? 28 : 36,
          opacity: 0.7,
        }}
      >
        {icon}
      </div>
      <strong style={{ fontSize: 15, color: "#f8fafc" }}>{title}</strong>
      {description && (
        <span style={{ fontSize: 13, color: "rgba(248,250,252,0.6)", maxWidth: 420 }}>
          {description}
        </span>
      )}
      {(actionLabel && onAction) || secondary ? (
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              style={{
                padding: "8px 16px",
                background: "linear-gradient(135deg,#d9b16d,#a27841)",
                color: "#0f172a",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 900,
                fontSize: 13,
              }}
            >
              {actionLabel}
            </button>
          )}
          {secondary}
        </div>
      ) : null}
    </div>
  );
}
