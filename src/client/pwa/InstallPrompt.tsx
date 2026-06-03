import React, { useEffect, useState } from "react";
import { consumeInstallPrompt, isInstallPromptAvailable } from "./pwaManager";

/**
 * Renders a non-intrusive banner that surfaces the browser's install prompt.
 * Listens for the `beforeinstallprompt` event captured by pwaManager.
 * Auto-hides once the user accepts or dismisses.
 */
export const InstallPrompt: React.FC = () => {
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
    <div className="mp-install-prompt" role="region" aria-label="Install MarketsPivot">
      <div>
        <strong>Install MarketsPivot</strong>
        <p>Get one-tap access to live markets, even offline.</p>
      </div>
      <div className="mp-install-prompt-actions">
        <button type="button" onClick={handleInstall} className="primary-action">
          Install
        </button>
        <button type="button" onClick={handleDismiss} className="secondary-action" aria-label="Dismiss install prompt">
          Not now
        </button>
      </div>
    </div>
  );
};
