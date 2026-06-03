import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";

export interface SeoMetaEntry extends CrudEntity {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: "summary" | "summary_large_image" | "app" | "player";
  twitterSite: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  schema: string; // JSON-LD as raw text
  notes: string;
}

export interface SeoRedirect extends CrudEntity {
  from: string;
  to: string;
  code: 301 | 302 | 307 | 308;
  active: boolean;
  hits: number;
}

export interface SeoSitemapEntry extends CrudEntity {
  path: string;
  priority: number; // 0.0 — 1.0
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  lastmod: string;
  active: boolean;
}

const seedMeta: SeoMetaEntry[] = [
  {
    id: "seo-home",
    path: "/",
    title: "MarketsPivot — Global Market Intelligence",
    description:
      "Real-time stocks, forex, crypto, commodities, and macro intelligence in one terminal.",
    keywords: ["stocks", "forex", "crypto", "commodities", "macro", "intelligence"],
    canonical: "https://marketspivot.com/",
    ogTitle: "MarketsPivot — Global Market Intelligence",
    ogDescription: "Real-time global markets terminal.",
    ogImage: "/og/home.png",
    twitterCard: "summary_large_image",
    twitterSite: "@marketspivot",
    robotsIndex: true,
    robotsFollow: true,
    schema: '{"@context":"https://schema.org","@type":"WebSite","name":"MarketsPivot"}',
    notes: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "seo-stocks",
    path: "/stocks",
    title: "Stocks — Global Exchanges & Market Movers",
    description:
      "Browse global exchanges, top gainers, losers, and market movers across asset classes.",
    keywords: ["stocks", "exchanges", "market movers", "gainers", "losers"],
    canonical: "https://marketspivot.com/stocks",
    ogTitle: "Stocks — MarketsPivot",
    ogDescription: "Global equities, exchanges, and movers.",
    ogImage: "/og/stocks.png",
    twitterCard: "summary_large_image",
    twitterSite: "@marketspivot",
    robotsIndex: true,
    robotsFollow: true,
    schema: "",
    notes: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "seo-crypto",
    path: "/crypto",
    title: "Crypto — Live Coins, Markets & Categories",
    description:
      "Live cryptocurrency prices, categories, trending coins, and on-chain context.",
    keywords: ["cryptocurrency", "bitcoin", "ethereum", "defi", "stablecoins"],
    canonical: "https://marketspivot.com/crypto",
    ogTitle: "Crypto — MarketsPivot",
    ogDescription: "Live cryptocurrency markets.",
    ogImage: "/og/crypto.png",
    twitterCard: "summary_large_image",
    twitterSite: "@marketspivot",
    robotsIndex: true,
    robotsFollow: true,
    schema: "",
    notes: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "seo-forex",
    path: "/forex",
    title: "Forex — Global FX Intelligence",
    description:
      "Currency strength, major and exotic pairs, central bank policy, and economic calendar.",
    keywords: ["forex", "currencies", "fx", "central banks"],
    canonical: "https://marketspivot.com/forex",
    ogTitle: "Forex — MarketsPivot",
    ogDescription: "Global FX intelligence terminal.",
    ogImage: "/og/forex.png",
    twitterCard: "summary_large_image",
    twitterSite: "@marketspivot",
    robotsIndex: true,
    robotsFollow: true,
    schema: "",
    notes: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const seedRedirects: SeoRedirect[] = [
  { id: "red-1", from: "/coverage", to: "/markets", code: 301, active: true, hits: 0, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "red-2", from: "/old-pricing", to: "/pricing", code: 301, active: true, hits: 0, createdAt: Date.now(), updatedAt: Date.now() },
];

const seedSitemap: SeoSitemapEntry[] = [
  { id: "sm-1", path: "/", priority: 1.0, changefreq: "daily", lastmod: new Date().toISOString().split("T")[0], active: true, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "sm-2", path: "/stocks", priority: 0.9, changefreq: "hourly", lastmod: new Date().toISOString().split("T")[0], active: true, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "sm-3", path: "/crypto", priority: 0.9, changefreq: "hourly", lastmod: new Date().toISOString().split("T")[0], active: true, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "sm-4", path: "/forex", priority: 0.9, changefreq: "hourly", lastmod: new Date().toISOString().split("T")[0], active: true, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "sm-5", path: "/commodities", priority: 0.8, changefreq: "daily", lastmod: new Date().toISOString().split("T")[0], active: true, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "sm-6", path: "/regions", priority: 0.8, changefreq: "daily", lastmod: new Date().toISOString().split("T")[0], active: true, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "sm-7", path: "/about", priority: 0.4, changefreq: "monthly", lastmod: new Date().toISOString().split("T")[0], active: true, createdAt: Date.now(), updatedAt: Date.now() },
];

export const useSeoMetaAdminStore = createCrudStore<SeoMetaEntry>({
  name: "mp-admin-seo-meta",
  idPrefix: "seo",
  seed: seedMeta,
});

export const useSeoRedirectAdminStore = createCrudStore<SeoRedirect>({
  name: "mp-admin-seo-redirects",
  idPrefix: "red",
  seed: seedRedirects,
});

export const useSeoSitemapAdminStore = createCrudStore<SeoSitemapEntry>({
  name: "mp-admin-seo-sitemap",
  idPrefix: "sm",
  seed: seedSitemap,
});
