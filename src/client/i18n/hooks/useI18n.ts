import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import i18n, { type SupportedLang } from "../config";
import { applyDocumentLocale } from "../utils/rtl";

export type LanguageCode = SupportedLang;

// Permissive t() type: accepts any string key, returns string | undefined
export type TFn = (key: string, options?: Record<string, unknown>) => string | undefined;

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

  // Cast to permissive type so call sites don't need to be updated when keys are added
  const t = rawT as unknown as TFn;

  return { language, setLanguage, t };
}
