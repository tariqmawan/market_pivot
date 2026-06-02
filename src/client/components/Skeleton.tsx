import React from "react";

/**
 * Block-level skeleton primitives — match the column / card sizes of real content
 * so the layout doesn't shift when data arrives.
 */
export const SkeletonBlock: React.FC<{
  width?: number | string;
  height?: number | string;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ width = "100%", height = 16, radius = 6, className, style }) => (
  <span
    aria-hidden="true"
    className={className}
    style={{
      display: "inline-block",
      width,
      height,
      borderRadius: radius,
      background:
        "linear-gradient(90deg, rgba(248,250,252,0.06) 0%, rgba(248,250,252,0.14) 50%, rgba(248,250,252,0.06) 100%)",
      backgroundSize: "200% 100%",
      animation: "mp-skeleton 1.4s ease-in-out infinite",
      ...style,
    }}
  />
);

export const SkeletonText: React.FC<{ lines?: number; widths?: (number | string)[] }> = ({
  lines = 3,
  widths,
}) => (
  <div style={{ display: "grid", gap: 8 }}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        width={widths?.[i] ?? `${85 - i * 8}%`}
        height={12}
      />
    ))}
  </div>
);

export const SkeletonRow: React.FC<{ columns: number }> = ({ columns }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 12,
      padding: "10px 12px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    {Array.from({ length: columns }).map((_, i) => (
      <SkeletonBlock key={i} height={14} width={i === 0 ? "60%" : "85%"} />
    ))}
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 6,
  columns = 5,
}) => (
  <div
    aria-hidden="true"
    style={{
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 12,
        padding: "12px",
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonBlock key={i} height={12} width="55%" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} columns={columns} />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ height?: number }> = ({ height = 140 }) => (
  <div
    aria-hidden="true"
    style={{
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10,
      padding: 16,
      display: "grid",
      gap: 10,
      minHeight: height,
      background: "rgba(255,255,255,0.02)",
    }}
  >
    <SkeletonBlock height={12} width="45%" />
    <SkeletonBlock height={22} width="70%" />
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonCardGrid: React.FC<{ count?: number; columns?: number }> = ({
  count = 6,
  columns = 3,
}) => (
  <div
    aria-hidden="true"
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: 14,
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/** Single source for the shimmer keyframes — mount once in the app shell. */
export const SkeletonStyles: React.FC = () => (
  <style>{`@keyframes mp-skeleton{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
);
