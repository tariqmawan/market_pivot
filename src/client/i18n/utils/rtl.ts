import { RTL_LANGUAGES, type SupportedLang } from "../config";

const FONT_MAP: Record<string, string> = {
  en: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  ar: "Cairo, 'Noto Sans Arabic', system-ui, sans-serif",
  hi: "'Noto Sans Devanagari', system-ui, sans-serif",
  zh: "'Noto Sans SC', system-ui, sans-serif",
  ja: "'Noto Sans JP', system-ui, sans-serif",
  fr: "Inter, system-ui, sans-serif",
  pt: "Inter, system-ui, sans-serif",
  es: "Inter, system-ui, sans-serif",
  ru: "Inter, system-ui, sans-serif",
  ko: "Noto Sans KR, system-ui, sans-serif",
};

export function applyDocumentLocale(lang: SupportedLang): void {
  const isRtl = RTL_LANGUAGES.has(lang);
  const dir = isRtl ? "rtl" : "ltr";

  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
  document.documentElement.style.fontFamily = FONT_MAP[lang] ?? FONT_MAP.en;

  // Toggle CSS class for RTL-specific overrides
  document.documentElement.classList.toggle("rtl", isRtl);
  document.documentElement.classList.toggle("ltr", !isRtl);
  document.body.classList.toggle("rtl", isRtl);
  document.body.classList.toggle("ltr", !isRtl);
  document.body.dir = dir;
}

export function isRtlLang(lang: string): boolean {
  return RTL_LANGUAGES.has(lang);
}
