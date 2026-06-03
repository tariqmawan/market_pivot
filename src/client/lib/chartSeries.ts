// Generate a deterministic-ish but realistic price series based on a seed value.
// Produces an array of values that follow a small random walk around the base.

export interface SeriesOptions {
  base: number;
  points: number;
  volatility?: number; // 0-1, default 0.012
  drift?: number; // per-step bias (positive = uptrend)
  seed?: number;
  min?: number;
  max?: number;
}

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
};

export function generatePriceSeries(opts: SeriesOptions): number[] {
  const {
    base,
    points,
    volatility = 0.012,
    drift = 0,
    seed = Date.now(),
    min,
    max,
  } = opts;

  const rand = mulberry32(seed);
  const series: number[] = [];
  let value = base;

  for (let i = 0; i < points; i++) {
    const change = (rand() - 0.5) * base * volatility * 2 + base * drift;
    value = Math.max(0.01, value + change);
    if (typeof min === "number" && value < min) value = min;
    if (typeof max === "number" && value > max) value = max;
    series.push(Number(value.toFixed(2)));
  }

  return series;
}

export function generateSeriesForSymbol(symbol: string, base: number, timeframe: "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"): number[] {
  const tfMap: Record<string, { points: number; vol: number; drift: number }> = {
    "1D": { points: 24, vol: 0.005, drift: 0.0001 },
    "1W": { points: 35, vol: 0.008, drift: 0.00015 },
    "1M": { points: 30, vol: 0.012, drift: 0.0002 },
    "3M": { points: 65, vol: 0.014, drift: 0.0003 },
    "1Y": { points: 52, vol: 0.018, drift: 0.0005 },
    "5Y": { points: 60, vol: 0.03, drift: 0.001 },
  };
  const cfg = tfMap[timeframe] ?? tfMap["1M"];
  return generatePriceSeries({
    base,
    points: cfg.points,
    volatility: cfg.vol,
    drift: cfg.drift,
    seed: hashString(`${symbol}-${timeframe}`),
  });
}

export function formatVolume(v: number): string {
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(2)}K`;
  return v.toLocaleString();
}

export function formatMoney(v: number): string {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(2)}K`;
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function formatSignedPercent(value: number, digits = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function formatSignedNumber(value: number, digits = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;
}
