import React, { useEffect, useState } from "react";
import { onNetworkChange } from "./pwaManager";
import { useI18n } from "../i18n";

/**
 * Subtle status pill shown in the corner of the layout whenever the
 * browser reports `navigator.onLine === false`. Listens for online/offline
 * events and animates in/out smoothly.
 */
export const OfflineIndicator: React.FC = () => {
  const { t } = useI18n();
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => onNetworkChange(setOnline), []);

  if (online) return null;

  return (
    <div className="mp-offline-indicator" role="status" aria-live="polite">
      <span aria-hidden="true">●</span> {t("pwa.offline")}
    </div>
  );
};
