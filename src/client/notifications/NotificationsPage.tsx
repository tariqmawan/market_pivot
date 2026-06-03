import React, { useState } from "react";
import { SeoHead } from "../seo";
import { useNotifications } from "./useNotifications";
import type { NotificationCategory } from "./notificationTypes";

const categoryLabel: Record<NotificationCategory, string> = {
  watchlist: "Watchlist",
  portfolio: "Portfolio",
  market: "Market",
  system: "System",
};

const formatRelative = (iso: string): string => {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markRead, markAllRead, archive, archiveAll, remove, push } = useNotifications();
  const [filter, setFilter] = useState<NotificationCategory | "all" | "archived">("all");
  const [demoTitle, setDemoTitle] = useState("");
  const [demoBody, setDemoBody] = useState("");

  const visible =
    filter === "archived"
      ? notifications.filter((n) => n.archived)
      : notifications.filter((n) => !n.archived && (filter === "all" || n.category === filter));

  const handleSimulate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!demoTitle.trim() || !demoBody.trim()) return;
    push({
      category: "market",
      severity: "info",
      title: demoTitle,
      body: demoBody,
    });
    setDemoTitle("");
    setDemoBody("");
  };

  return (
    <>
      <SeoHead
        title="Notifications"
        description="Manage watchlist, portfolio, and market alerts — your central notification feed."
        canonical="/notifications"
      />
      <div className="page notifications-page">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">Notification Center</p>
            <h1>Stay in the loop</h1>
            <p>
              You have {unreadCount} unread {unreadCount === 1 ? "alert" : "alerts"}. Archive, mark as
              read, or filter by category to focus on what matters.
            </p>
          </div>
          <div className="metric-strip">
            <div className="metric-tile">
              <span>Unread</span>
              <strong>{unreadCount}</strong>
            </div>
            <div className="metric-tile">
              <span>Active</span>
              <strong>{notifications.filter((n) => !n.archived).length}</strong>
            </div>
            <div className="metric-tile">
              <span>Archived</span>
              <strong>{notifications.filter((n) => n.archived).length}</strong>
            </div>
          </div>
        </section>

        <section className="notifications-toolbar">
          {(["all", "market", "watchlist", "portfolio", "system", "archived"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={filter === key ? "primary-action-sm" : "secondary-action-sm"}
            >
              {key === "all" ? "All" : key === "archived" ? "Archived" : categoryLabel[key]}
            </button>
          ))}
          <div className="notifications-toolbar-actions">
            <button type="button" className="secondary-action" onClick={markAllRead} disabled={unreadCount === 0}>
              Mark all read
            </button>
            <button type="button" className="secondary-action" onClick={archiveAll} disabled={notifications.length === 0}>
              Archive all
            </button>
          </div>
        </section>

        <section className="notifications-list">
          {visible.length === 0 ? (
            <p className="mp-notification-empty">Nothing to show here yet.</p>
          ) : (
            visible.map((note) => (
              <article
                key={note.id}
                className={`notifications-row ${note.read ? "is-read" : ""} severity-${note.severity}`}
              >
                <div>
                  <p className="eyebrow">
                    {categoryLabel[note.category]} · {formatRelative(note.createdAt)}
                  </p>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </div>
                <div className="notifications-row-actions">
                  {!note.read && (
                    <button type="button" onClick={() => markRead(note.id)}>
                      Mark read
                    </button>
                  )}
                  <button type="button" onClick={() => archive(note.id)}>
                    {note.archived ? "Restore" : "Archive"}
                  </button>
                  <button type="button" onClick={() => remove(note.id)} aria-label="Delete">
                    ✕
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <section className="notifications-simulator">
          <h2>Simulate an alert</h2>
          <p>Test how the notification feed surfaces new events. (Frontend-only.)</p>
          <form onSubmit={handleSimulate}>
            <input
              type="text"
              placeholder="Title"
              value={demoTitle}
              onChange={(event) => setDemoTitle(event.target.value)}
            />
            <input
              type="text"
              placeholder="Body"
              value={demoBody}
              onChange={(event) => setDemoBody(event.target.value)}
            />
            <button type="submit" className="primary-action">Send test notification</button>
          </form>
        </section>
      </div>
    </>
  );
};

export default NotificationsPage;
