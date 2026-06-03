import { useEffect, useState, useCallback } from "react";
import {
  notificationStore,
  type AppNotification,
  type NotificationCategory,
  type NotificationSeverity,
} from "./notificationTypes";

export interface UseNotificationsResult {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  archive: (id: string) => void;
  archiveAll: () => void;
  remove: (id: string) => void;
  push: (input: {
    category: NotificationCategory;
    severity: NotificationSeverity;
    title: string;
    body: string;
    href?: string;
    symbol?: string;
  }) => void;
}

/**
 * Subscribes to the notification store and re-renders on changes.
 * Returns derived state plus action helpers.
 */
export const useNotifications = (): UseNotificationsResult => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    notificationStore.list()
  );

  useEffect(() => {
    setNotifications(notificationStore.list());
    return notificationStore.subscribe(() => setNotifications(notificationStore.list()));
  }, []);

  const markRead = useCallback((id: string) => notificationStore.markRead(id), []);
  const markAllRead = useCallback(() => notificationStore.markAllRead(), []);
  const archive = useCallback((id: string) => notificationStore.archiveOne(id), []);
  const archiveAll = useCallback(() => notificationStore.archiveAll(), []);
  const remove = useCallback((id: string) => notificationStore.remove(id), []);
  const push = useCallback<UseNotificationsResult["push"]>(
    (input) => {
      notificationStore.push(input);
    },
    []
  );

  return {
    notifications,
    unreadCount: notificationStore.unreadCount(),
    markRead,
    markAllRead,
    archive,
    archiveAll,
    remove,
    push,
  };
};
