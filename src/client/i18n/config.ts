import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ── Static imports for instant first-paint (no flicker) ──────────────────────
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enNav from "./locales/en/nav.json";
import enMarkets from "./locales/en/markets.json";
import enForex from "./locales/en/forex.json";
import enCrypto from "./locales/en/crypto.json";
import enDashboard from "./locales/en/dashboard.json";
import enFooter from "./locales/en/footer.json";
import enAdmin from "./locales/en/admin.json";

import arCommon from "./locales/ar/common.json";
import arAuth from "./locales/ar/auth.json";
import arNav from "./locales/ar/nav.json";
import arMarkets from "./locales/ar/markets.json";
import arForex from "./locales/ar/forex.json";
import arCrypto from "./locales/ar/crypto.json";
import arDashboard from "./locales/ar/dashboard.json";
import arFooter from "./locales/ar/footer.json";
import arAdmin from "./locales/ar/admin.json";

import zhCommon from "./locales/zh/common.json";
import zhAuth from "./locales/zh/auth.json";
import zhNav from "./locales/zh/nav.json";
import zhMarkets from "./locales/zh/markets.json";
import zhForex from "./locales/zh/forex.json";
import zhCrypto from "./locales/zh/crypto.json";
import zhDashboard from "./locales/zh/dashboard.json";
import zhFooter from "./locales/zh/footer.json";
import zhAdmin from "./locales/zh/admin.json";

import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frNav from "./locales/fr/nav.json";
import frMarkets from "./locales/fr/markets.json";
import frForex from "./locales/fr/forex.json";
import frCrypto from "./locales/fr/crypto.json";
import frDashboard from "./locales/fr/dashboard.json";
import frFooter from "./locales/fr/footer.json";
import frAdmin from "./locales/fr/admin.json";

import ptCommon from "./locales/pt/common.json";
import ptAuth from "./locales/pt/auth.json";
import ptNav from "./locales/pt/nav.json";
import ptMarkets from "./locales/pt/markets.json";
import ptForex from "./locales/pt/forex.json";
import ptCrypto from "./locales/pt/crypto.json";
import ptDashboard from "./locales/pt/dashboard.json";
import ptFooter from "./locales/pt/footer.json";
import ptAdmin from "./locales/pt/admin.json";

import ruCommon from "./locales/ru/common.json";
import ruAuth from "./locales/ru/auth.json";
import ruNav from "./locales/ru/nav.json";
import ruMarkets from "./locales/ru/markets.json";
import ruForex from "./locales/ru/forex.json";
import ruCrypto from "./locales/ru/crypto.json";
import ruDashboard from "./locales/ru/dashboard.json";
import ruFooter from "./locales/ru/footer.json";
import ruAdmin from "./locales/ru/admin.json";

import jaCommon from "./locales/ja/common.json";
import jaAuth from "./locales/ja/auth.json";
import jaNav from "./locales/ja/nav.json";
import jaMarkets from "./locales/ja/markets.json";
import jaForex from "./locales/ja/forex.json";
import jaCrypto from "./locales/ja/crypto.json";
import jaDashboard from "./locales/ja/dashboard.json";
import jaFooter from "./locales/ja/footer.json";
import jaAdmin from "./locales/ja/admin.json";

import koCommon from "./locales/ko/common.json";
import koAuth from "./locales/ko/auth.json";
import koNav from "./locales/ko/nav.json";
import koMarkets from "./locales/ko/markets.json";
import koForex from "./locales/ko/forex.json";
import koCrypto from "./locales/ko/crypto.json";
import koDashboard from "./locales/ko/dashboard.json";
import koFooter from "./locales/ko/footer.json";
import koAdmin from "./locales/ko/admin.json";

import esCommon from "./locales/es/common.json";
import esAuth from "./locales/es/auth.json";
import esNav from "./locales/es/nav.json";
import esMarkets from "./locales/es/markets.json";
import esForex from "./locales/es/forex.json";
import esCrypto from "./locales/es/crypto.json";
import esDashboard from "./locales/es/dashboard.json";
import esFooter from "./locales/es/footer.json";
import esAdmin from "./locales/es/admin.json";

import hiCommon from "./locales/hi/common.json";
import hiAuth from "./locales/hi/auth.json";
import hiNav from "./locales/hi/nav.json";
import hiMarkets from "./locales/hi/markets.json";
import hiForex from "./locales/hi/forex.json";
import hiCrypto from "./locales/hi/crypto.json";
import hiDashboard from "./locales/hi/dashboard.json";
import hiFooter from "./locales/hi/footer.json";
import hiAdmin from "./locales/hi/admin.json";

export const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur"]);

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", subtitle: "English", flag: "🇺🇸" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", subtitle: "Arabic", flag: "🇸🇦" },
  { code: "zh", label: "Simplified Chinese", nativeLabel: "中文(简体)", subtitle: "Simplified Chinese", flag: "🇨🇳" },
  { code: "fr", label: "French", nativeLabel: "Français", subtitle: "French", flag: "🇫🇷" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", subtitle: "Portuguese", flag: "🇵🇹" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", subtitle: "Russian", flag: "🇷🇺" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", subtitle: "Japanese", flag: "🇯🇵" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", subtitle: "Korean", flag: "🇰🇷" },
  { code: "es", label: "Spanish", nativeLabel: "Español", subtitle: "Spanish", flag: "🇪🇸" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", subtitle: "Hindi", flag: "🇮🇳" },
] as const;

export type SupportedLang = typeof SUPPORTED_LANGUAGES[number]["code"];

export const NAMESPACES = [
  "common", "auth", "nav", "markets", "forex",
  "crypto", "dashboard", "footer", "admin",
] as const;

export type Namespace = typeof NAMESPACES[number];

// Cast resources to prevent react-i18next from generating overly-strict key types.
// Keys are validated at runtime via translations; strict compile-time key checking
// breaks when keys span multiple namespaces or are added incrementally.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const i18nResources: any = {
  en: { common: enCommon, auth: enAuth, nav: enNav, markets: enMarkets, forex: enForex, crypto: enCrypto, dashboard: enDashboard, footer: enFooter, admin: enAdmin },
  ar: { common: arCommon, auth: arAuth, nav: arNav, markets: arMarkets, forex: arForex, crypto: arCrypto, dashboard: arDashboard, footer: arFooter, admin: arAdmin },
  zh: { common: zhCommon, auth: zhAuth, nav: zhNav, markets: zhMarkets, forex: zhForex, crypto: zhCrypto, dashboard: zhDashboard, footer: zhFooter, admin: zhAdmin },
  fr: { common: frCommon, auth: frAuth, nav: frNav, markets: frMarkets, forex: frForex, crypto: frCrypto, dashboard: frDashboard, footer: frFooter, admin: frAdmin },
  pt: { common: ptCommon, auth: ptAuth, nav: ptNav, markets: ptMarkets, forex: ptForex, crypto: ptCrypto, dashboard: ptDashboard, footer: ptFooter, admin: ptAdmin },
  ru: { common: ruCommon, auth: ruAuth, nav: ruNav, markets: ruMarkets, forex: ruForex, crypto: ruCrypto, dashboard: ruDashboard, footer: ruFooter, admin: ruAdmin },
  ja: { common: jaCommon, auth: jaAuth, nav: jaNav, markets: jaMarkets, forex: jaForex, crypto: jaCrypto, dashboard: jaDashboard, footer: jaFooter, admin: jaAdmin },
  ko: { common: koCommon, auth: koAuth, nav: koNav, markets: koMarkets, forex: koForex, crypto: koCrypto, dashboard: koDashboard, footer: koFooter, admin: koAdmin },
  es: { common: esCommon, auth: esAuth, nav: esNav, markets: esMarkets, forex: esForex, crypto: esCrypto, dashboard: esDashboard, footer: esFooter, admin: esAdmin },
  hi: { common: hiCommon, auth: hiAuth, nav: hiNav, markets: hiMarkets, forex: hiForex, crypto: hiCrypto, dashboard: hiDashboard, footer: hiFooter, admin: hiAdmin },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: i18nResources,
    defaultNS: "common",
    fallbackNS: NAMESPACES.filter((namespace) => namespace !== "common"),
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "mp_language",
      caches: ["localStorage"],
    },
    react: { useSuspense: false },
  });

export default i18n;
