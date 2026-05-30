// Bootstrap i18n — must be imported before any component that uses translations
import "./config";

export { default as i18n } from "./config";
export { RTL_LANGUAGES, SUPPORTED_LANGUAGES, NAMESPACES } from "./config";
export type { SupportedLang, Namespace } from "./config";
export { applyDocumentLocale, isRtlLang } from "./utils/rtl";
export { formatNumber, formatCurrency, formatPercent, formatDate, formatCompactMoney, formatSignedPercent } from "./utils/format";
export { useLocale } from "./hooks/useLocale";
export { useI18n } from "./hooks/useI18n";
export type { LanguageCode } from "./hooks/useI18n";
