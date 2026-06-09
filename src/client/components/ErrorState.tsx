import React from "react";
import { useI18n } from "../i18n";


/**
 * Inline error display — used by data fetches that fail soft, by error boundaries
 * wrapping subtrees, and by route-level 4xx / 5xx pages.
 */
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  inline?: boolean;
  /** Optional secondary action (e.g. navigate home) */
  secondaryAction?: { label: string; onClick: () => void };
}

export default function ErrorState({
  title,
  message,
  onRetry,
  retryLabel,
  inline,
  secondaryAction,
}: ErrorStateProps) {
  const { t } = useI18n();
  const resolvedTitle = title ?? t("error");
  const resolvedMessage = message ?? t("errorDefaultMessage");
  const resolvedRetryLabel = retryLabel ?? t("tryAgain");
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: inline ? "1.5rem" : "3rem 1.5rem",
        textAlign: "center",
        border: "1px solid rgba(239,68,68,0.18)",
        background: "rgba(239,68,68,0.06)",
        borderRadius: 12,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(239,68,68,0.18)",
          color: "#ff9090",
          fontSize: 22,
          fontWeight: 900,
        }}
      >
        !
      </div>
      <strong style={{ fontSize: 16, color: "#ff9090" }}>{resolvedTitle}</strong>
      <span style={{ fontSize: 13, color: "rgba(248,250,252,0.7)", maxWidth: 420 }}>
        {resolvedMessage}
      </span>
      {(onRetry || secondaryAction) && (
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                padding: "8px 16px",
                background: "rgba(248,250,252,0.06)",
                color: "#f8fafc",
                border: "1px solid rgba(248,250,252,0.18)",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              {resolvedRetryLabel}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              style={{
                padding: "8px 16px",
                background: "transparent",
                color: "rgba(248,250,252,0.75)",
                border: "1px solid rgba(248,250,252,0.18)",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
