import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import i18n, { type SupportedLang } from "../config";
import { applyDocumentLocale } from "../utils/rtl";

export type LanguageCode = SupportedLang;

// Permissive t() type: accepts any string key, returns the translation string
// (falls back to the key itself if not found in any namespace, never undefined)
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
] as const;

export function useI18n(): {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: TFn;
} {
  const { t: rawT, i18n: i18nInstance } = useTranslation(NAMESPACE_ORDER);
  const language = i18nInstance.resolvedLanguage as LanguageCode;

  const setLanguage = useCallback((nextLanguage: LanguageCode) => {
    i18n.changeLanguage(nextLanguage);
    applyDocumentLocale(nextLanguage);
  }, []);

  // Cast to permissive type so call sites don't need to be updated when keys are added.
  // Wrap with String() to guarantee a string return even when i18next returns the key.
  const t = ((key: string, options?: Record<string, unknown>) => {
    const result = rawT(key, options as never) as unknown;
    return result === undefined || result === null || result === "" ? key : String(result);
  }) as TFn;

  return { language, setLanguage, t };
}
