/** Coerce API/DB values (string decimals, null) to a finite number. */
export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function formatPrice(
  value: unknown,
  decimals = 2,
  fallback = "—"
): string {
  const n = toNumber(value, NaN);
  if (!Number.isFinite(n)) return fallback;
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatUsd(value: unknown, decimals = 2): string {
  const formatted = formatPrice(value, decimals);
  return formatted === "—" ? formatted : `$${formatted}`;
}

export function formatCompactUsd(value: unknown): string {
  const n = toNumber(value, NaN);
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return formatUsd(n);
}

export function formatPercent(value: unknown, decimals = 2): string {
  const n = toNumber(value, NaN);
  if (!Number.isFinite(n)) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(decimals)}%`;
}

export function formatSupply(value: unknown): string {
  const n = toNumber(value, NaN);
  if (!Number.isFinite(n)) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  return n.toLocaleString();
}
