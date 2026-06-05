import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { SUPPORTED_LANGUAGES, type SupportedLang } from "../config";
import { applyDocumentLocale } from "../utils/rtl";

export type LanguageCode = SupportedLang;

const STORAGE_KEY = "mp_language";
const EN_LANG: LanguageCode = "en";

/**
 * Strict validation: only accept codes that are in SUPPORTED_LANGUAGES.
 * Anything else falls back to "en" without throwing.
 */
function resolveValidLang(input: string | null | undefined): LanguageCode {
  if (!input) return EN_LANG;
  const lower = String(input).toLowerCase().split(/[-_]/)[0]; // strip region
  const match = SUPPORTED_LANGUAGES.find((l) => l.code === lower);
  return (match?.code as LanguageCode) ?? EN_LANG;
}

// Permissive t() type: accepts any string key, returns the translation string
// (falls back to EN, then to the key itself if not found anywhere, never undefined)
export type TFn = (key: string, options?: Record<string, unknown>) => string;

const NAMESPACE_ORDER = [
  "common",
  "markets",
  "forex",
  "crypto",
  "dashboard",
  "nav",
  "footer",
  "auth",
  "admin",
  "pages",
] as const;

export function useI18n(): {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: TFn;
  isReady: boolean;
} {
  const { t: rawT, i18n: i18nInstance } = useTranslation(NAMESPACE_ORDER);
  // resolvedLanguage can be undefined until i18next finishes init — coerce to valid lang.
  const language = resolveValidLang(i18nInstance.resolvedLanguage as string | undefined);

  // ── Locale readiness: true once the resolved language matches what we expect.
  //    Useful to gate the entire UI on hydration completion (avoids SSR/CSR mismatch).
  const [isReady, setIsReady] = useState<boolean>(i18nInstance.isInitialized);
  useEffect(() => {
    if (i18nInstance.isInitialized) {
      setIsReady(true);
      return;
    }
    const onInit = () => setIsReady(true);
    i18nInstance.on("initialized", onInit);
    return () => {
      i18nInstance.off("initialized", onInit);
    };
  }, [i18nInstance]);

  const setLanguage = useCallback((next: LanguageCode) => {
    const safe = resolveValidLang(next);
    // Persist to localStorage BEFORE changing so language detector picks it up on reload.
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, safe);
      }
    } catch {
      /* storage unavailable (private mode, SSR) — silently skip */
    }
    // Update <html lang> + dir + font synchronously to avoid any flash of the wrong script.
    applyDocumentLocale(safe);
    // Trigger i18next language change. If the code somehow isn't supported, i18next
    // will fall back to "en" thanks to fallbackLng in config.ts.
    if (i18nInstance.language !== safe) {
      void i18nInstance.changeLanguage(safe);
    }
  }, [i18nInstance]);

  // Strict, EN-only fallback. i18next is configured with fallbackLng: "en", so when a key
  // is missing in the current language it automatically returns the EN value. If the key is
  // missing in EN too, return the key itself so the UI shows *something* rather than undefined.
  const t = ((key: string, options?: Record<string, unknown>) => {
    let result: unknown = rawT(key, options as never);
    // i18next can return the key back when a translation is missing (default `returnEmptyString: false`).
    // Treat that as a miss and explicitly try EN.
    if (typeof result === "string" && result === key && i18nInstance.language !== EN_LANG) {
      const enResult: unknown = (i18nInstance.t as (k: string, o?: Record<string, unknown>) => unknown)(
        key,
        { ...options, lng: EN_LANG }
      );
      if (typeof enResult === "string" && enResult.length > 0 && enResult !== key) {
        result = enResult;
      }
    }
    if (result === undefined || result === null || result === "") return key;
    return String(result);
  }) as TFn;

  return { language, setLanguage, t, isReady };
}

// Re-export for components that want to gate render on init.
export function useLocaleReady(): boolean {
  const { isReady } = useI18n();
  return isReady;
}
