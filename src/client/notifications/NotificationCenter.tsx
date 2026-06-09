import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "./useNotifications";
import { useI18n } from "../i18n";
import type { AppNotification, NotificationCategory, NotificationSeverity } from "./notificationTypes";

const categoryLabel: Record<NotificationCategory, string> = {
  watchlist: "notifications.watchlist",
  portfolio: "notifications.portfolio",
  market: "notifications.market",
  system: "notifications.system",
};

const severityIcon: Record<NotificationSeverity, string> = {
  info: "ℹ",
  success: "✓",
  warning: "!",
  critical: "✕",
};

const formatRelative = (iso: string, t: (key: string, params?: Record<string, string | number>) => string): string => {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return t("notifications.justNow");
  if (minutes < 60) return t("notifications.minutesAgo", { count: minutes });
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t("notifications.hoursAgo", { count: hours });
  const days = Math.round(hours / 24);
  return t("notifications.daysAgo", { count: days });
};

const NotificationRow: React.FC<{
  note: AppNotification;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onRemove: (id: string) => void;
}> = ({ note, onMarkRead, onArchive, onRemove }) => {
  const { t } = useI18n();
  const body = (
    <div className={`mp-notification-row mp-notification-row--${note.severity} ${note.read ? "is-read" : ""}`}>
      <span className="mp-notification-icon" aria-hidden="true">{severityIcon[note.severity]}</span>
      <div className="mp-notification-body">
        <div className="mp-notification-meta">
          <span className="mp-notification-cat">{t(categoryLabel[note.category])}</span>
          {note.symbol && <span className="mp-notification-symbol">{note.symbol}</span>}
          <time dateTime={note.createdAt}>{formatRelative(note.createdAt, t)}</time>
        </div>
        <strong>{note.title}</strong>
        <p>{note.body}</p>
      </div>
      <div className="mp-notification-actions">
        {!note.read && (
          <button type="button" onClick={() => onMarkRead(note.id)} aria-label={t("notifications.markAsRead")}>
            {t("notifications.markRead")}
          </button>
        )}
        <button type="button" onClick={() => onArchive(note.id)} aria-label={t("notifications.archive")}>
          {t("notifications.archive")}
        </button>
        <button type="button" onClick={() => onRemove(note.id)} aria-label={t("delete")} className="mp-notification-remove">
          ✕
        </button>
      </div>
    </div>
  );
  return note.href ? (
    <Link to={note.href} onClick={() => onMarkRead(note.id)} className="mp-notification-link">
      {body}
    </Link>
  ) : (
    body
  );
};

export interface NotificationCenterProps {
  /** Where to render the trigger — defaults to inline bell. */
  variant?: "bell" | "panel";
}

/**
 * Renders a bell icon with unread count. Click opens a panel showing all
 * notifications grouped by category, with mark-read / archive / delete
 * actions. Self-contained — mounts anywhere in the layout.
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = ({ variant = "bell" }) => {
  const { notifications, unreadCount, markRead, archive, archiveAll, markAllRead, remove } = useNotifications();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationCategory | "all">("all");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const visible = notifications.filter((n) => !n.archived && (filter === "all" || n.category === filter));

  return (
    <div className="mp-notification-center" ref={containerRef}>
      <button
        type="button"
        className="mp-notification-trigger"
        aria-label={t("notifications.labelWithCount", { count: unreadCount })}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && <span className="mp-notification-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="mp-notification-panel" role="dialog" aria-label={t("notifications.title")}>
          <header>
            <h3>{t("notifications.title")}</h3>
            <div className="mp-notification-toolbar">
              <button type="button" onClick={markAllRead} disabled={unreadCount === 0}>
                {t("notifications.markAllRead")}
              </button>
              <button type="button" onClick={archiveAll} disabled={notifications.length === 0}>
                {t("notifications.archiveAll")}
              </button>
            </div>
          </header>

          <div className="mp-notification-filters" role="tablist">
            {(["all", "market", "watchlist", "portfolio", "system"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={filter === key ? "is-active" : ""}
              >
                {key === "all" ? t("notifications.all") : t(categoryLabel[key])}
              </button>
            ))}
          </div>

          <div className="mp-notification-list">
            {visible.length === 0 ? (
              <p className="mp-notification-empty">{t("notifications.allCaughtUp")}</p>
            ) : (
              visible.map((note) => (
                <NotificationRow
                  key={note.id}
                  note={note}
                  onMarkRead={markRead}
                  onArchive={archive}
                  onRemove={remove}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
