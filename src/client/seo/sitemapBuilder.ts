/**
 * Sitemap builder.
 *
 * Generates a sitemap index + per-section sitemaps at build time. The script
 * (`scripts/generate-sitemap.ts`) imports `buildSitemap()` and writes the
 * resulting XML to `public/`. Pages can also import `buildSitemap()` at
 * runtime to serve `/sitemap.xml` from a serverless function if desired.
 *
 * The catalog of URLs is data-driven — extend the arrays below (or pass
 * them in) to add new content.
 */

import exchangesData from "../../data/exchanges.json";
import currenciesData from "../../data/currencies.json";
import cryptoData from "../../data/cryptocurrencies.json";
import regionsData from "../../data/regions.json";
import sectorsData from "../../data/sectors.json";

const BASE_URL = "https://marketspivot.com";

export type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapEntry {
  loc: string;
  changefreq?: ChangeFreq;
  priority?: number;
  lastmod?: string;
}

const today = (): string => new Date().toISOString().slice(0, 10);

const url = (path: string): string => (path.startsWith("http") ? path : `${BASE_URL}${path}`);

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* ── Catalog ─────────────────────────────────────────────────────────────── */

const STATIC_PAGES: SitemapEntry[] = [
  { loc: url("/"), changefreq: "daily", priority: 1.0 },
  { loc: url("/markets"), changefreq: "daily", priority: 0.9 },
  { loc: url("/dashboard"), changefreq: "daily", priority: 0.9 },
  { loc: url("/stocks"), changefreq: "daily", priority: 0.9 },
  { loc: url("/crypto"), changefreq: "hourly", priority: 0.9 },
  { loc: url("/forex"), changefreq: "hourly", priority: 0.9 },
  { loc: url("/currencies"), changefreq: "hourly", priority: 0.9 },
  { loc: url("/commodities"), changefreq: "daily", priority: 0.8 },
  { loc: url("/regions"), changefreq: "weekly", priority: 0.8 },
  { loc: url("/sectors"), changefreq: "weekly", priority: 0.8 },
  { loc: url("/indices"), changefreq: "daily", priority: 0.8 },
  { loc: url("/etfs"), changefreq: "daily", priority: 0.7 },
  { loc: url("/bonds-yields"), changefreq: "daily", priority: 0.7 },
  { loc: url("/screener"), changefreq: "weekly", priority: 0.8 },
  { loc: url("/economic-calendar"), changefreq: "daily", priority: 0.8 },
  { loc: url("/news"), changefreq: "hourly", priority: 0.8 },
  { loc: url("/pricing"), changefreq: "monthly", priority: 0.7 },
  { loc: url("/about"), changefreq: "monthly", priority: 0.6 },
  { loc: url("/privacy"), changefreq: "yearly", priority: 0.4 },
  { loc: url("/terms"), changefreq: "yearly", priority: 0.4 },
  { loc: url("/billing-policy"), changefreq: "monthly", priority: 0.4 },
];

const STOCK_PAGES: SitemapEntry[] = (exchangesData.exchanges as Array<{ id: string; mainIndex?: string }>).map(
  (exchange) => ({
    loc: url(`/stocks/${exchange.id}`),
    changefreq: "daily",
    priority: 0.7,
  })
);

const FOREX_PAGES: SitemapEntry[] = (currenciesData.currencies as Array<{ code: string }>).map((c) => ({
  loc: url(`/currencies/${c.code}`),
  changefreq: "hourly",
  priority: 0.7,
}));

const CRYPTO_PAGES: SitemapEntry[] = (cryptoData.cryptocurrencies as Array<{ id: string; symbol: string }>).map(
  (c) => ({
    loc: url(`/crypto/${c.id}`),
    changefreq: "hourly",
    priority: 0.7,
  })
);

const REGION_PAGES: SitemapEntry[] = (regionsData.regions as Array<{ id: string; countries?: string[] }>).map(
  (r) => ({
    loc: url(`/regions/${r.id}`),
    changefreq: "weekly",
    priority: 0.6,
  })
);

const SECTOR_PAGES: SitemapEntry[] = (sectorsData.sectors as Array<{ id: string }>).map((s) => ({
  loc: url(`/sectors/${s.id}`),
  changefreq: "weekly",
  priority: 0.6,
}));

const COMMODITY_PAGES: SitemapEntry[] = [
  { loc: url("/commodities/energy"), changefreq: "daily", priority: 0.7 },
  { loc: url("/commodities/metals"), changefreq: "daily", priority: 0.7 },
  { loc: url("/commodities/agriculture"), changefreq: "daily", priority: 0.7 },
  { loc: url("/commodities/industrial"), changefreq: "daily", priority: 0.7 },
];

const NEWS_PAGES: SitemapEntry[] = [
  { loc: url("/news"), changefreq: "hourly", priority: 0.8 },
  { loc: url("/news/regions"), changefreq: "hourly", priority: 0.6 },
  { loc: url("/news/sectors"), changefreq: "hourly", priority: 0.6 },
  { loc: url("/news/crypto"), changefreq: "hourly", priority: 0.6 },
  { loc: url("/news/alerts"), changefreq: "hourly", priority: 0.6 },
];

export const SITEMAP_SECTIONS: { id: string; entries: SitemapEntry[] }[] = [
  { id: "static", entries: STATIC_PAGES },
  { id: "stocks", entries: STOCK_PAGES },
  { id: "forex", entries: [...FOREX_PAGES, ...COMMODITY_PAGES.filter((p) => p.loc.includes("forex"))] },
  { id: "crypto", entries: CRYPTO_PAGES },
  { id: "regions", entries: REGION_PAGES },
  { id: "sectors", entries: SECTOR_PAGES },
  { id: "commodities", entries: COMMODITY_PAGES },
  { id: "news", entries: NEWS_PAGES },
];

/* ── XML serialization ──────────────────────────────────────────────────── */

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const renderEntry = (entry: SitemapEntry): string => {
  const parts: string[] = [`  <url>`, `    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority !== undefined) parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  parts.push(`  </url>`);
  return parts.join("\n");
};

/**
 * Build a complete sitemap XML document. Pass `{ includeLastmod: true }`
 * to stamp each entry with today's date — useful for the build script.
 */
export function buildSitemap(options: { lastmod?: string } = {}): string {
  const stamp = options.lastmod ?? today();
  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];
  for (const section of SITEMAP_SECTIONS) {
    for (const entry of section.entries) {
      lines.push(renderEntry({ ...entry, lastmod: stamp }));
    }
  }
  lines.push(`</urlset>`);
  return lines.join("\n") + "\n";
}

/** Build a sitemap index referencing per-section sitemap files. */
export function buildSitemapIndex(files: string[] = [
  "sitemap-static.xml",
  "sitemap-stocks.xml",
  "sitemap-forex.xml",
  "sitemap-crypto.xml",
  "sitemap-regions.xml",
  "sitemap-sectors.xml",
  "sitemap-commodities.xml",
  "sitemap-news.xml",
]): string {
  const stamp = today();
  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];
  for (const file of files) {
    lines.push(
      `  <sitemap>`,
      `    <loc>${escapeXml(`${BASE_URL}/${file}`)}</loc>`,
      `    <lastmod>${stamp}</lastmod>`,
      `  </sitemap>`
    );
  }
  lines.push(`</sitemapindex>`);
  return lines.join("\n") + "\n";
}

/** Build a single section's sitemap (used for sub-sitemaps). */
export function buildSectionSitemap(sectionId: string, options: { lastmod?: string } = {}): string {
  const section = SITEMAP_SECTIONS.find((s) => s.id === sectionId);
  if (!section) {
    throw new Error(`Unknown sitemap section: ${sectionId}`);
  }
  const stamp = options.lastmod ?? today();
  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];
  for (const entry of section.entries) {
    lines.push(renderEntry({ ...entry, lastmod: stamp }));
  }
  lines.push(`</urlset>`);
  return lines.join("\n") + "\n";
}

/** Total count of URLs across all sections — handy for diagnostics. */
export function sitemapEntryCount(): number {
  return SITEMAP_SECTIONS.reduce((sum, s) => sum + s.entries.length, 0);
}

// Touch slugify so it isn't tree-shaken away if used externally in future.
void slugify;
