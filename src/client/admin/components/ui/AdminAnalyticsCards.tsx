import React from "react";

export interface AdminAnalyticsCard {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "positive" | "negative" | "neutral" | "warn";
}

export interface AdminAnalyticsCardsProps {
  cards: AdminAnalyticsCard[];
  columns?: 2 | 3 | 4 | 5 | 6;
}

const TONE_COLORS: Record<
  NonNullable<AdminAnalyticsCard["tone"]>,
  { fg: string; bg: string; border: string }
> = {
  positive: { fg: "#6ee7b7", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.22)" },
  negative: { fg: "#ff9090", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.22)" },
  warn:     { fg: "#fbbf24", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.22)" },
  neutral:  { fg: "#f0c060", bg: "rgba(209,170,114,0.10)", border: "rgba(209,170,114,0.22)" },
};

export default function AdminAnalyticsCards({
  cards,
  columns = 4,
}: AdminAnalyticsCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 12,
        marginBottom: 16,
      }}
    >
      {cards.map((c) => {
        const tone = TONE_COLORS[c.tone ?? "neutral"];
        return (
          <div
            key={c.label}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              background: tone.bg,
              border: `1px solid ${tone.border}`,
              display: "grid",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                color: "rgba(248,250,252,0.62)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {c.label}
            </span>
            <strong
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: tone.fg,
                lineHeight: 1.1,
              }}
            >
              {c.value}
            </strong>
            {c.sub && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(248,250,252,0.5)",
                }}
              >
                {c.sub}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
