import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import i18n, { type SupportedLang } from "../config";
import { applyDocumentLocale } from "../utils/rtl";

export type LanguageCode = SupportedLang;

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
  t: TFunction;
} {
  const { t, i18n: i18nInstance } = useTranslation(NAMESPACE_ORDER);
  const language = i18nInstance.resolvedLanguage as LanguageCode;

  const setLanguage = useCallback((nextLanguage: LanguageCode) => {
    i18n.changeLanguage(nextLanguage);
    applyDocumentLocale(nextLanguage);
  }, []);

  return { language, setLanguage, t };
}
