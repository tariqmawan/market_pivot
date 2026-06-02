import React from "react";

/**
 * Reusable loading / spinner used by Suspense and any page-level fetch.
 * Centralizes the gold-accent spinner style so any page can pull it in.
 */
export default function PageLoader({
  label,
  fullscreen = true,
  height = "60vh",
}: {
  label?: string;
  fullscreen?: boolean;
  height?: number | string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        minHeight: fullscreen ? height : undefined,
        padding: fullscreen ? undefined : "1.5rem",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 40,
          height: 40,
          border: "3px solid rgba(248,250,252,0.12)",
          borderTopColor: "#C9A87B",
          borderRadius: "50%",
          animation: "mp-spin 0.7s linear infinite",
        }}
      />
      {label && (
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(248,250,252,0.6)",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </span>
      )}
      <style>{`@keyframes mp-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
