import React from "react";
import type { AISummary } from "./aiTypes";

export interface AISummaryCardProps {
  summary: AISummary;
  /** Optional action — e.g. "Read full report" link. */
  onAction?: () => void;
  actionLabel?: string;
  /** Compact mode for inline usage in dashboards. */
  compact?: boolean;
}

/**
 * Renders a single AI summary with tone indicator, key bullets, and
 * provenance (model + generated-at). Designed to be embedded anywhere
 * a card-shaped component is appropriate.
 */
export const AISummaryCard: React.FC<AISummaryCardProps> = ({
  summary,
  onAction,
  actionLabel,
  compact = false,
}) => {
  return (
    <article className={`mp-ai-summary mp-ai-summary--${summary.tone} ${compact ? "is-compact" : ""}`}>
      <header>
        <div>
          <p className="eyebrow">AI Brief · {summary.kind}</p>
          <h3>{summary.subject}</h3>
        </div>
        <span className={`mp-ai-tone mp-ai-tone--${summary.tone}`} aria-label={`Tone: ${summary.tone}`}>
          {summary.tone}
        </span>
      </header>
      <p className="mp-ai-text">{summary.text}</p>
      {!compact && (
        <ul className="mp-ai-bullets">
          {summary.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
      <footer>
        <div className="mp-ai-tags">
          {summary.tags.map((tag) => (
            <span key={tag} className="mp-ai-tag">
              #{tag}
            </span>
          ))}
        </div>
        <div className="mp-ai-meta">
          {onAction && (
            <button type="button" className="primary-action-sm" onClick={onAction}>
              {actionLabel ?? "Read more"}
            </button>
          )}
          <span className="mp-ai-provenance">
            {summary.model} · {new Date(summary.generatedAt).toLocaleString()}
          </span>
        </div>
      </footer>
    </article>
  );
};
