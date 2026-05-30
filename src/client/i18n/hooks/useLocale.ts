import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import i18n, { type SupportedLang } from "../config";
import { applyDocumentLocale } from "../utils/rtl";
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatDate,
  formatCompactMoney,
  formatSignedPercent,
} from "../utils/format";

export function useLocale() {
  const { t, i18n: i18nInstance } = useTranslation();
  const lang = i18nInstance.language as SupportedLang;

  const setLanguage = useCallback((code: SupportedLang) => {
    i18n.changeLanguage(code);
    applyDocumentLocale(code);
  }, []);

  return {
    t,
    lang,
    setLanguage,
    isRtl: document.documentElement.dir === "rtl",
    fmt: {
      number:  (v: number) => formatNumber(v, lang),
      currency:(v: number, cur?: string) => formatCurrency(v, lang, cur),
      percent: (v: number) => formatPercent(v, lang),
      date:    (d: Date | string) => formatDate(d, lang),
      money:   (v: number) => formatCompactMoney(v, lang),
      signed:  (v: number) => formatSignedPercent(v, lang),
    },
  };
}
