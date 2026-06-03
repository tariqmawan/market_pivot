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
import enPages from "./locales/en/pages.json";

import arCommon from "./locales/ar/common.json";
import arAuth from "./locales/ar/auth.json";
import arNav from "./locales/ar/nav.json";
import arMarkets from "./locales/ar/markets.json";
import arForex from "./locales/ar/forex.json";
import arCrypto from "./locales/ar/crypto.json";
import arDashboard from "./locales/ar/dashboard.json";
import arFooter from "./locales/ar/footer.json";
import arAdmin from "./locales/ar/admin.json";
import arPages from "./locales/ar/pages.json";

import zhCommon from "./locales/zh/common.json";
import zhAuth from "./locales/zh/auth.json";
import zhNav from "./locales/zh/nav.json";
import zhMarkets from "./locales/zh/markets.json";
import zhForex from "./locales/zh/forex.json";
import zhCrypto from "./locales/zh/crypto.json";
import zhDashboard from "./locales/zh/dashboard.json";
import zhFooter from "./locales/zh/footer.json";
import zhAdmin from "./locales/zh/admin.json";
import zhPages from "./locales/zh/pages.json";

import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frNav from "./locales/fr/nav.json";
import frMarkets from "./locales/fr/markets.json";
import frForex from "./locales/fr/forex.json";
import frCrypto from "./locales/fr/crypto.json";
import frDashboard from "./locales/fr/dashboard.json";
import frFooter from "./locales/fr/footer.json";
import frAdmin from "./locales/fr/admin.json";
import frPages from "./locales/fr/pages.json";

import ptCommon from "./locales/pt/common.json";
import ptAuth from "./locales/pt/auth.json";
import ptNav from "./locales/pt/nav.json";
import ptMarkets from "./locales/pt/markets.json";
import ptForex from "./locales/pt/forex.json";
import ptCrypto from "./locales/pt/crypto.json";
import ptDashboard from "./locales/pt/dashboard.json";
import ptFooter from "./locales/pt/footer.json";
import ptAdmin from "./locales/pt/admin.json";
import ptPages from "./locales/pt/pages.json";

import ruCommon from "./locales/ru/common.json";
import ruAuth from "./locales/ru/auth.json";
import ruNav from "./locales/ru/nav.json";
import ruMarkets from "./locales/ru/markets.json";
import ruForex from "./locales/ru/forex.json";
import ruCrypto from "./locales/ru/crypto.json";
import ruDashboard from "./locales/ru/dashboard.json";
import ruFooter from "./locales/ru/footer.json";
import ruAdmin from "./locales/ru/admin.json";
import ruPages from "./locales/ru/pages.json";

import jaCommon from "./locales/ja/common.json";
import jaAuth from "./locales/ja/auth.json";
import jaNav from "./locales/ja/nav.json";
import jaMarkets from "./locales/ja/markets.json";
import jaForex from "./locales/ja/forex.json";
import jaCrypto from "./locales/ja/crypto.json";
import jaDashboard from "./locales/ja/dashboard.json";
import jaFooter from "./locales/ja/footer.json";
import jaAdmin from "./locales/ja/admin.json";
import jaPages from "./locales/ja/pages.json";

import koCommon from "./locales/ko/common.json";
import koAuth from "./locales/ko/auth.json";
import koNav from "./locales/ko/nav.json";
import koMarkets from "./locales/ko/markets.json";
import koForex from "./locales/ko/forex.json";
import koCrypto from "./locales/ko/crypto.json";
import koDashboard from "./locales/ko/dashboard.json";
import koFooter from "./locales/ko/footer.json";
import koAdmin from "./locales/ko/admin.json";
import koPages from "./locales/ko/pages.json";

import esCommon from "./locales/es/common.json";
import esAuth from "./locales/es/auth.json";
import esNav from "./locales/es/nav.json";
import esMarkets from "./locales/es/markets.json";
import esForex from "./locales/es/forex.json";
import esCrypto from "./locales/es/crypto.json";
import esDashboard from "./locales/es/dashboard.json";
import esFooter from "./locales/es/footer.json";
import esAdmin from "./locales/es/admin.json";
import esPages from "./locales/es/pages.json";

import hiCommon from "./locales/hi/common.json";
import hiAuth from "./locales/hi/auth.json";
import hiNav from "./locales/hi/nav.json";
import hiMarkets from "./locales/hi/markets.json";
import hiForex from "./locales/hi/forex.json";
import hiCrypto from "./locales/hi/crypto.json";
import hiDashboard from "./locales/hi/dashboard.json";
import hiFooter from "./locales/hi/footer.json";
import hiAdmin from "./locales/hi/admin.json";
import hiPages from "./locales/hi/pages.json";

import thCommon from "./locales/th/common.json";
import thAuth from "./locales/th/auth.json";
import thNav from "./locales/th/nav.json";
import thMarkets from "./locales/th/markets.json";
import thForex from "./locales/th/forex.json";
import thCrypto from "./locales/th/crypto.json";
import thDashboard from "./locales/th/dashboard.json";
import thFooter from "./locales/th/footer.json";
import thAdmin from "./locales/th/admin.json";
import thPages from "./locales/th/pages.json";

import viCommon from "./locales/vi/common.json";
import viAuth from "./locales/vi/auth.json";
import viNav from "./locales/vi/nav.json";
import viMarkets from "./locales/vi/markets.json";
import viForex from "./locales/vi/forex.json";
import viCrypto from "./locales/vi/crypto.json";
import viDashboard from "./locales/vi/dashboard.json";
import viFooter from "./locales/vi/footer.json";
import viAdmin from "./locales/vi/admin.json";
import viPages from "./locales/vi/pages.json";

import deCommon from "./locales/de/common.json";
import deAuth from "./locales/de/auth.json";
import deNav from "./locales/de/nav.json";
import deMarkets from "./locales/de/markets.json";
import deForex from "./locales/de/forex.json";
import deCrypto from "./locales/de/crypto.json";
import deDashboard from "./locales/de/dashboard.json";
import deFooter from "./locales/de/footer.json";
import deAdmin from "./locales/de/admin.json";
import dePages from "./locales/de/pages.json";

import plCommon from "./locales/pl/common.json";
import plAuth from "./locales/pl/auth.json";
import plNav from "./locales/pl/nav.json";
import plMarkets from "./locales/pl/markets.json";
import plForex from "./locales/pl/forex.json";
import plCrypto from "./locales/pl/crypto.json";
import plDashboard from "./locales/pl/dashboard.json";
import plFooter from "./locales/pl/footer.json";
import plAdmin from "./locales/pl/admin.json";
import plPages from "./locales/pl/pages.json";

import trCommon from "./locales/tr/common.json";
import trAuth from "./locales/tr/auth.json";
import trNav from "./locales/tr/nav.json";
import trMarkets from "./locales/tr/markets.json";
import trForex from "./locales/tr/forex.json";
import trCrypto from "./locales/tr/crypto.json";
import trDashboard from "./locales/tr/dashboard.json";
import trFooter from "./locales/tr/footer.json";
import trAdmin from "./locales/tr/admin.json";
import trPages from "./locales/tr/pages.json";

import idCommon from "./locales/id/common.json";
import idAuth from "./locales/id/auth.json";
import idNav from "./locales/id/nav.json";
import idMarkets from "./locales/id/markets.json";
import idForex from "./locales/id/forex.json";
import idCrypto from "./locales/id/crypto.json";
import idDashboard from "./locales/id/dashboard.json";
import idFooter from "./locales/id/footer.json";
import idAdmin from "./locales/id/admin.json";
import idPages from "./locales/id/pages.json";

import msCommon from "./locales/ms/common.json";
import msAuth from "./locales/ms/auth.json";
import msNav from "./locales/ms/nav.json";
import msMarkets from "./locales/ms/markets.json";
import msForex from "./locales/ms/forex.json";
import msCrypto from "./locales/ms/crypto.json";
import msDashboard from "./locales/ms/dashboard.json";
import msFooter from "./locales/ms/footer.json";
import msAdmin from "./locales/ms/admin.json";
import msPages from "./locales/ms/pages.json";

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
  { code: "th", label: "Thai", nativeLabel: "ไทย", subtitle: "Thai", flag: "🇹🇭" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", subtitle: "Vietnamese", flag: "🇻🇳" },
  { code: "de", label: "German", nativeLabel: "Deutsch", subtitle: "German", flag: "🇩🇪" },
  { code: "pl", label: "Polish", nativeLabel: "Polski", subtitle: "Polish", flag: "🇵🇱" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe", subtitle: "Turkish", flag: "🇹🇷" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", subtitle: "Indonesian", flag: "🇮🇩" },
  { code: "ms", label: "Malay", nativeLabel: "Bahasa Melayu", subtitle: "Malay", flag: "🇲🇾" },
] as const;

export type SupportedLang = typeof SUPPORTED_LANGUAGES[number]["code"];

export const NAMESPACES = [
  "common", "auth", "nav", "markets", "forex",
  "crypto", "dashboard", "footer", "admin", "pages",
] as const;

export type Namespace = typeof NAMESPACES[number];

// Cast resources to prevent react-i18next from generating overly-strict key types.
// Keys are validated at runtime via translations; strict compile-time key checking
// breaks when keys span multiple namespaces or are added incrementally.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const i18nResources: any = {
  en: { common: enCommon, auth: enAuth, nav: enNav, markets: enMarkets, forex: enForex, crypto: enCrypto, dashboard: enDashboard, footer: enFooter, admin: enAdmin, pages: enPages },
  ar: { common: arCommon, auth: arAuth, nav: arNav, markets: arMarkets, forex: arForex, crypto: arCrypto, dashboard: arDashboard, footer: arFooter, admin: arAdmin, pages: arPages },
  zh: { common: zhCommon, auth: zhAuth, nav: zhNav, markets: zhMarkets, forex: zhForex, crypto: zhCrypto, dashboard: zhDashboard, footer: zhFooter, admin: zhAdmin, pages: zhPages },
  fr: { common: frCommon, auth: frAuth, nav: frNav, markets: frMarkets, forex: frForex, crypto: frCrypto, dashboard: frDashboard, footer: frFooter, admin: frAdmin, pages: frPages },
  pt: { common: ptCommon, auth: ptAuth, nav: ptNav, markets: ptMarkets, forex: ptForex, crypto: ptCrypto, dashboard: ptDashboard, footer: ptFooter, admin: ptAdmin, pages: ptPages },
  ru: { common: ruCommon, auth: ruAuth, nav: ruNav, markets: ruMarkets, forex: ruForex, crypto: ruCrypto, dashboard: ruDashboard, footer: ruFooter, admin: ruAdmin, pages: ruPages },
  ja: { common: jaCommon, auth: jaAuth, nav: jaNav, markets: jaMarkets, forex: jaForex, crypto: jaCrypto, dashboard: jaDashboard, footer: jaFooter, admin: jaAdmin, pages: jaPages },
  ko: { common: koCommon, auth: koAuth, nav: koNav, markets: koMarkets, forex: koForex, crypto: koCrypto, dashboard: koDashboard, footer: koFooter, admin: koAdmin, pages: koPages },
  es: { common: esCommon, auth: esAuth, nav: esNav, markets: esMarkets, forex: esForex, crypto: esCrypto, dashboard: esDashboard, footer: esFooter, admin: esAdmin, pages: esPages },
  hi: { common: hiCommon, auth: hiAuth, nav: hiNav, markets: hiMarkets, forex: hiForex, crypto: hiCrypto, dashboard: hiDashboard, footer: hiFooter, admin: hiAdmin, pages: hiPages },
  th: { common: thCommon, auth: thAuth, nav: thNav, markets: thMarkets, forex: thForex, crypto: thCrypto, dashboard: thDashboard, footer: thFooter, admin: thAdmin, pages: thPages },
  vi: { common: viCommon, auth: viAuth, nav: viNav, markets: viMarkets, forex: viForex, crypto: viCrypto, dashboard: viDashboard, footer: viFooter, admin: viAdmin, pages: viPages },
  de: { common: deCommon, auth: deAuth, nav: deNav, markets: deMarkets, forex: deForex, crypto: deCrypto, dashboard: deDashboard, footer: deFooter, admin: deAdmin, pages: dePages },
  pl: { common: plCommon, auth: plAuth, nav: plNav, markets: plMarkets, forex: plForex, crypto: plCrypto, dashboard: plDashboard, footer: plFooter, admin: plAdmin, pages: plPages },
  tr: { common: trCommon, auth: trAuth, nav: trNav, markets: trMarkets, forex: trForex, crypto: trCrypto, dashboard: trDashboard, footer: trFooter, admin: trAdmin, pages: trPages },
  id: { common: idCommon, auth: idAuth, nav: idNav, markets: idMarkets, forex: idForex, crypto: idCrypto, dashboard: idDashboard, footer: idFooter, admin: idAdmin, pages: idPages },
  ms: { common: msCommon, auth: msAuth, nav: msNav, markets: msMarkets, forex: msForex, crypto: msCrypto, dashboard: msDashboard, footer: msFooter, admin: msAdmin, pages: msPages },
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
    // Strict behavior:
    // - load: "currentOnly" — never load regional variants (e.g. en-US, pt-BR) which
    //   would create mixed-script output when the user picks a base language.
    // - nonExplicitSupportedLngs: false — if user code isn't in supportedLngs, i18next
    //   falls back cleanly to fallbackLng (en) instead of attempting a fuzzy match.
    // - cleanCode: true — strip region tags (e.g. "en-US" → "en") so users on regional
    //   browsers still land on the correct supported language.
    // - returnEmptyString: false — when a key truly has no value, return the key (not "")
    //   so we can detect it in useI18n and explicitly try EN.
    load: "currentOnly",
    nonExplicitSupportedLngs: false,
    cleanCode: true,
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "mp_language",
      caches: ["localStorage"],
    },
    react: { useSuspense: false },
  });

export default i18n;
