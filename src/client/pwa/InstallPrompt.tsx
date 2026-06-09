import React, { useEffect, useState } from "react";
import { consumeInstallPrompt, isInstallPromptAvailable } from "./pwaManager";
import { useI18n } from "../i18n";

/**
 * Renders a non-intrusive banner that surfaces the browser's install prompt.
 * Listens for the `beforeinstallprompt` event captured by pwaManager.
 * Auto-hides once the user accepts or dismisses.
 */
export const InstallPrompt: React.FC = () => {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("mp-pwa-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    const onAvailable = () => isInstallPromptAvailable() && setVisible(true);
    window.addEventListener("mp:pwa-installable", onAvailable);
    if (isInstallPromptAvailable()) onAvailable();
    return () => window.removeEventListener("mp:pwa-installable", onAvailable);
  }, []);

  if (dismissed || !visible) return null;

  const handleInstall = async () => {
    await consumeInstallPrompt();
    setVisible(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("mp-pwa-dismissed", "1");
    setDismissed(true);
    setVisible(false);
  };

  return (
    <div className="mp-install-prompt" role="region" aria-label={t("pwa.installAria")}>
      <div>
        <strong>{t("pwa.installTitle")}</strong>
        <p>{t("pwa.installDesc")}</p>
      </div>
      <div className="mp-install-prompt-actions">
        <button type="button" onClick={handleInstall} className="primary-action">
          {t("pwa.install")}
        </button>
        <button type="button" onClick={handleDismiss} className="secondary-action" aria-label={t("pwa.dismiss")}>
          {t("pwa.notNow")}
        </button>
      </div>
    </div>
  );
};
