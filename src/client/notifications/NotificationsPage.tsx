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
import { useI18n } from "../i18n";
import type { NotificationCategory, NotificationSeverity } from "./notificationTypes";
import "./NotificationsPage.css";

const formatRelative = (iso: string, t: (key: string, params?: Record<string, string | number>) => string): string => {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 1) return t("notifications.justNow");
  if (mins < 60) return t("notifications.minutesAgo", { count: mins });
  const hours = Math.round(mins / 60);
  if (hours < 24) return t("notifications.hoursAgo", { count: hours });
  return t("notifications.daysAgo", { count: Math.round(hours / 24) });
};

const CATEGORY_LABEL: Record<NotificationCategory, string> = {
  watchlist: "notifications.watchlist",
  portfolio: "notifications.portfolio",
  market: "notifications.market",
  system: "notifications.system",
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

const FILTERS: { key: FilterKey; labelKey: string }[] = [
  { key: "all",       labelKey: "notifications.all" },
  { key: "market",    labelKey: "notifications.market" },
  { key: "watchlist", labelKey: "notifications.watchlist" },
  { key: "portfolio", labelKey: "notifications.portfolio" },
  { key: "system",    labelKey: "notifications.system" },
  { key: "archived",  labelKey: "notifications.archived" },
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

  const { t } = useI18n();
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
        title={t("notifications.seoTitle")}
        description={t("notifications.seoDesc")}
        canonical="/notifications"
      />

      <div className="page notifications-page">

        {/* ── Hero ── */}
        <section className="notifications-hero">
          <div className="notifications-hero-copy">
            <p className="eyebrow">{t("notifications.pageTitle")}</p>
            <h1>{t("notifications.pageHeading")}</h1>
            <p>
              {unreadCount > 0
                ? t("notifications.unreadSummary", { count: unreadCount })
                : t("notifications.allCaughtUp")}
            </p>
          </div>
          <div className="notifications-metric-strip">
            <div className="notifications-metric-tile is-unread">
              <span>{t("notifications.unreadLabel")}</span>
              <strong>{unreadCount}</strong>
            </div>
            <div className="notifications-metric-tile">
              <span>{t("notifications.activeLabel")}</span>
              <strong>{activeCount}</strong>
            </div>
            <div className="notifications-metric-tile">
              <span>{t("notifications.archivedLabel")}</span>
              <strong>{archivedCount}</strong>
            </div>
          </div>
        </section>

        {/* ── Toolbar ── */}
        <div className="notifications-toolbar">
          {FILTERS.map(({ key, labelKey }) => {
            const count = countFor(key);
            return (
              <button
                key={key}
                type="button"
                className={`notifications-filter-btn${filter === key ? " active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {t(labelKey)}
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
              {t("notifications.markAllRead")}
            </button>
            <button
              type="button"
              className="notif-action-btn"
              onClick={archiveAll}
              disabled={activeCount === 0}
            >
              <HiArchiveBox style={{ width: 15, height: 15 }} />
              {t("notifications.archiveAll")}
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
              <h3>{t("notifications.emptyTitle")}</h3>
              <p>
                {filter === "archived"
                  ? t("notifications.emptyArchived")
                  : t("notifications.emptyCategory")}
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
                      {t(CATEGORY_LABEL[note.category])}
                    </span>
                    <span className="notif-time">{formatRelative(note.createdAt, t)}</span>
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
                      title={t("notifications.markAsRead")}
                      onClick={() => markRead(note.id)}
                    >
                      <HiCheckCircle />
                    </button>
                  )}
                  <button
                    type="button"
                    className="notif-icon-btn"
                    title={note.archived ? t("notifications.restore") : t("notifications.archive")}
                    onClick={() => archive(note.id)}
                  >
                    {note.archived ? <HiInboxArrowDown /> : <HiBookmark />}
                  </button>
                  <button
                    type="button"
                    className="notif-icon-btn delete"
                    title={t("delete")}
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
          <h2>{t("notifications.simTitle")}</h2>
          <p>{t("notifications.simDesc")}</p>
          <form onSubmit={handleSimulate} className="notif-sim-grid">
            <div className="notif-sim-field">
              <label htmlFor="sim-category">{t("notifications.simCategory")}</label>
              <select
                id="sim-category"
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value as NotificationCategory)}
              >
                <option value="market">{t("notifications.market")}</option>
                <option value="watchlist">{t("notifications.watchlist")}</option>
                <option value="portfolio">{t("notifications.portfolio")}</option>
                <option value="system">{t("notifications.system")}</option>
              </select>
            </div>

            <div className="notif-sim-field">
              <label htmlFor="sim-severity">{t("notifications.simSeverity")}</label>
              <select
                id="sim-severity"
                value={simSeverity}
                onChange={(e) => setSimSeverity(e.target.value as NotificationSeverity)}
              >
                <option value="info">{t("notifications.simInfo")}</option>
                <option value="success">{t("notifications.simSuccess")}</option>
                <option value="warning">{t("notifications.simWarning")}</option>
                <option value="critical">{t("notifications.simCritical")}</option>
              </select>
            </div>

            <div className="notif-sim-field full">
              <label htmlFor="sim-title">{t("notifications.simTitleLabel")}</label>
              <input
                id="sim-title"
                type="text"
                placeholder={t("notifications.simTitlePlaceholder")}
                value={simTitle}
                onChange={(e) => setSimTitle(e.target.value)}
              />
            </div>

            <div className="notif-sim-field full">
              <label htmlFor="sim-body">{t("notifications.simBodyLabel")}</label>
              <input
                id="sim-body"
                type="text"
                placeholder={t("notifications.simBodyPlaceholder")}
                value={simBody}
                onChange={(e) => setSimBody(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="notif-sim-submit"
              disabled={!simTitle.trim() || !simBody.trim()}
            >
              {t("notifications.simSubmit")}
            </button>
          </form>
        </section>

      </div>
    </>
  );
};

export default NotificationsPage;
