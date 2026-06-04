import React, { useState } from "react";
import {
  HiBell,
  HiArchiveBox,
  HiTrash,
  HiCheckCircle,
  HiChartBar,
  HiEye,
  HiBookmark,
  HiCog6Tooth,
  HiArrowTrendingUp,
  HiInboxArrowDown,
} from "react-icons/hi2";
import { SeoHead } from "../seo";
import { useNotifications } from "./useNotifications";
import type { NotificationCategory, NotificationSeverity } from "./notificationTypes";
import "./NotificationsPage.css";

/* ── helpers ── */
const formatRelative = (iso: string): string => {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

const CATEGORY_LABEL: Record<NotificationCategory, string> = {
  watchlist: "Watchlist",
  portfolio: "Portfolio",
  market: "Market",
  system: "System",
};

const CategoryIcon: React.FC<{ category: NotificationCategory }> = ({ category }) => {
  const icons: Record<NotificationCategory, React.ReactElement> = {
    market:    <HiChartBar />,
    watchlist: <HiEye />,
    portfolio: <HiArrowTrendingUp />,
    system:    <HiCog6Tooth />,
  };
  return (
    <span className={`notif-icon cat-${category}`}>
      {icons[category]}
    </span>
  );
};

type FilterKey = NotificationCategory | "all" | "archived";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "market",    label: "Market" },
  { key: "watchlist", label: "Watchlist" },
  { key: "portfolio", label: "Portfolio" },
  { key: "system",    label: "System" },
  { key: "archived",  label: "Archived" },
];

/* ══════════════════════════════════
   Page
══════════════════════════════════ */
const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    archive,
    archiveAll,
    remove,
    push,
  } = useNotifications();

  const [filter, setFilter] = useState<FilterKey>("all");

  /* simulator state */
  const [simTitle,    setSimTitle]    = useState("");
  const [simBody,     setSimBody]     = useState("");
  const [simCategory, setSimCategory] = useState<NotificationCategory>("market");
  const [simSeverity, setSimSeverity] = useState<NotificationSeverity>("info");

  /* derived counts per filter */
  const countFor = (key: FilterKey): number => {
    if (key === "archived") return notifications.filter((n) => n.archived).length;
    if (key === "all")      return notifications.filter((n) => !n.archived).length;
    return notifications.filter((n) => !n.archived && n.category === key).length;
  };

  const visible =
    filter === "archived"
      ? notifications.filter((n) => n.archived)
      : notifications.filter(
          (n) => !n.archived && (filter === "all" || n.category === filter)
        );

  const activeCount   = notifications.filter((n) => !n.archived).length;
  const archivedCount = notifications.filter((n) =>  n.archived).length;

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTitle.trim() || !simBody.trim()) return;
    push({ category: simCategory, severity: simSeverity, title: simTitle, body: simBody });
    setSimTitle("");
    setSimBody("");
  };

  return (
    <>
      <SeoHead
        title="Notifications — MarketsPivot"
        description="Manage watchlist, portfolio, and market alerts in one central notification feed."
        canonical="/notifications"
      />

      <div className="page notifications-page">

        {/* ── Hero ── */}
        <section className="notifications-hero">
          <div className="notifications-hero-copy">
            <p className="eyebrow">Notification Center</p>
            <h1>Stay in the loop</h1>
            <p>
              {unreadCount > 0
                ? `You have ${unreadCount} unread ${unreadCount === 1 ? "alert" : "alerts"}. Archive, mark as read, or filter by category.`
                : "You're all caught up. No unread alerts right now."}
            </p>
          </div>
          <div className="notifications-metric-strip">
            <div className="notifications-metric-tile is-unread">
              <span>Unread</span>
              <strong>{unreadCount}</strong>
            </div>
            <div className="notifications-metric-tile">
              <span>Active</span>
              <strong>{activeCount}</strong>
            </div>
            <div className="notifications-metric-tile">
              <span>Archived</span>
              <strong>{archivedCount}</strong>
            </div>
          </div>
        </section>

        {/* ── Toolbar ── */}
        <div className="notifications-toolbar">
          {FILTERS.map(({ key, label }) => {
            const count = countFor(key);
            return (
              <button
                key={key}
                type="button"
                className={`notifications-filter-btn${filter === key ? " active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
                {count > 0 && (
                  <span className="notifications-filter-badge">{count}</span>
                )}
              </button>
            );
          })}

          <span className="notifications-toolbar-spacer" />

          <div className="notifications-action-group">
            <button
              type="button"
              className="notif-action-btn"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <HiCheckCircle style={{ width: 15, height: 15 }} />
              Mark all read
            </button>
            <button
              type="button"
              className="notif-action-btn"
              onClick={archiveAll}
              disabled={activeCount === 0}
            >
              <HiArchiveBox style={{ width: 15, height: 15 }} />
              Archive all
            </button>
          </div>
        </div>

        {/* ── List ── */}
        <div className="notifications-list">
          {visible.length === 0 ? (
            <div className="notif-empty">
              <div className="notif-empty-icon">
                <HiBell />
              </div>
              <h3>Nothing here yet</h3>
              <p>
                {filter === "archived"
                  ? "You have no archived notifications."
                  : "No notifications in this category right now."}
              </p>
            </div>
          ) : (
            visible.map((note) => (
              <article
                key={note.id}
                className={[
                  "notif-card",
                  note.read     ? "is-read"    : "",
                  note.archived ? "is-archived" : "",
                  `severity-${note.severity}`,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <CategoryIcon category={note.category} />

                <div className="notif-content">
                  <div className="notif-meta">
                    <span className={`notif-category-label cat-${note.category}`}>
                      {CATEGORY_LABEL[note.category]}
                    </span>
                    <span className="notif-time">{formatRelative(note.createdAt)}</span>
                    {!note.read && <span className="notif-unread-dot" />}
                    <span className={`notif-severity-badge severity-${note.severity}`}>
                      {note.severity}
                    </span>
                  </div>

                  <p className="notif-title">{note.title}</p>
                  <p className="notif-body">{note.body}</p>

                  {note.symbol && (
                    <span className="notif-symbol-chip">
                      <HiArrowTrendingUp style={{ width: 11, height: 11 }} />
                      {note.symbol}
                    </span>
                  )}
                </div>

                <div className="notif-row-actions">
                  {!note.read && (
                    <button
                      type="button"
                      className="notif-icon-btn"
                      title="Mark as read"
                      onClick={() => markRead(note.id)}
                    >
                      <HiCheckCircle />
                    </button>
                  )}
                  <button
                    type="button"
                    className="notif-icon-btn"
                    title={note.archived ? "Restore" : "Archive"}
                    onClick={() => archive(note.id)}
                  >
                    {note.archived ? <HiInboxArrowDown /> : <HiBookmark />}
                  </button>
                  <button
                    type="button"
                    className="notif-icon-btn delete"
                    title="Delete"
                    onClick={() => remove(note.id)}
                  >
                    <HiTrash />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* ── Simulator ── */}
        <section className="notifications-simulator">
          <h2>Simulate an alert</h2>
          <p>Test how the notification feed surfaces new events. (Frontend-only demo.)</p>
          <form onSubmit={handleSimulate} className="notif-sim-grid">
            <div className="notif-sim-field">
              <label htmlFor="sim-category">Category</label>
              <select
                id="sim-category"
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value as NotificationCategory)}
              >
                <option value="market">Market</option>
                <option value="watchlist">Watchlist</option>
                <option value="portfolio">Portfolio</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="notif-sim-field">
              <label htmlFor="sim-severity">Severity</label>
              <select
                id="sim-severity"
                value={simSeverity}
                onChange={(e) => setSimSeverity(e.target.value as NotificationSeverity)}
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="notif-sim-field full">
              <label htmlFor="sim-title">Title</label>
              <input
                id="sim-title"
                type="text"
                placeholder="e.g. AAPL crossed $200"
                value={simTitle}
                onChange={(e) => setSimTitle(e.target.value)}
              />
            </div>

            <div className="notif-sim-field full">
              <label htmlFor="sim-body">Body</label>
              <input
                id="sim-body"
                type="text"
                placeholder="Notification detail message..."
                value={simBody}
                onChange={(e) => setSimBody(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="notif-sim-submit"
              disabled={!simTitle.trim() || !simBody.trim()}
            >
              Send test notification
            </button>
          </form>
        </section>

      </div>
    </>
  );
};

export default NotificationsPage;
