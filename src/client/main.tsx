import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { bootAI } from "./ai";
import { registerServiceWorker } from "./pwa";
import i18n, { SUPPORTED_LANGUAGES, type SupportedLang } from "./i18n/config";
import { applyDocumentLocale } from "./i18n/utils/rtl";

// Apply document locale BEFORE first React render to avoid any flash of wrong script/dir/font.
// i18next's LanguageDetector has already resolved the initial language by this point because
// the config.ts side-effect (i18n.init) runs on import.
const initialLang: SupportedLang =
  (SUPPORTED_LANGUAGES.find((l) => l.code === i18n.resolvedLanguage)?.code as SupportedLang) ??
  (SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language)?.code as SupportedLang) ??
  "en";
applyDocumentLocale(initialLang);

// Boot subsystems that don't need React.
bootAI();
if (typeof window !== "undefined") {
  // Defer SW registration until after the first paint.
  const ric = window.requestIdleCallback;
  if (typeof ric === "function") {
    ric(() => registerServiceWorker());
  } else {
    setTimeout(registerServiceWorker, 1500);
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
