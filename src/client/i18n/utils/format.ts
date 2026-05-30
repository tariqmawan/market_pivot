/**
 * Smart locale-aware formatting using the Intl API.
 * All formatters are memoized per locale for performance.
 */

const numberFormatters = new Map<string, Intl.NumberFormat>();
const currencyFormatters = new Map<string, Intl.NumberFormat>();
const percentFormatters = new Map<string, Intl.NumberFormat>();
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function getNumberFormatter(locale: string): Intl.NumberFormat {
  if (!numberFormatters.has(locale)) {
    numberFormatters.set(locale, new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }));
  }
  return numberFormatters.get(locale)!;
}

function getCurrencyFormatter(locale: string, currency = "USD"): Intl.NumberFormat {
  const key = `${locale}-${currency}`;
  if (!currencyFormatters.has(key)) {
    currencyFormatters.set(key, new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }));
  }
  return currencyFormatters.get(key)!;
}

function getPercentFormatter(locale: string): Intl.NumberFormat {
  if (!percentFormatters.has(locale)) {
    percentFormatters.set(locale, new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }
  return percentFormatters.get(locale)!;
}

function getDateFormatter(locale: string): Intl.DateTimeFormat {
  if (!dateFormatters.has(locale)) {
    dateFormatters.set(locale, new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }));
  }
  return dateFormatters.get(locale)!;
}

export function formatNumber(value: number, locale: string): string {
  return getNumberFormatter(locale).format(value);
}

export function formatCurrency(value: number, locale: string, currency = "USD"): string {
  return getCurrencyFormatter(locale, currency).format(value);
}

export function formatPercent(value: number, locale: string): string {
  // value is already a percentage (e.g. 2.5 means 2.5%), divide by 100 for Intl
  return getPercentFormatter(locale).format(value / 100);
}

export function formatDate(date: Date | string, locale: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return getDateFormatter(locale).format(d);
}

export function formatCompactMoney(value: number, locale: string): string {
  if (value >= 1e12) return `$${getNumberFormatter(locale).format(value / 1e12)}T`;
  if (value >= 1e9)  return `$${getNumberFormatter(locale).format(value / 1e9)}B`;
  if (value >= 1e6)  return `$${getNumberFormatter(locale).format(value / 1e6)}M`;
  return formatCurrency(value, locale);
}

export function formatSignedPercent(value: number, locale: string): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${getNumberFormatter(locale).format(value)}%`;
}
