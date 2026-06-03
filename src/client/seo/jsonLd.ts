/**
 * JSON-LD structured data builders.
 *
 * Each function returns a plain object matching schema.org. Render them via
 * `<SeoHead jsonLd={[buildProductSchema(...)]} />` to emit one or more
 * `<script type="application/ld+json">` blocks.
 *
 * Spec: https://schema.org
 */

const SITE_NAME = "MarketsPivot";
const BASE_URL = "https://marketspivot.com";

/** WebSite schema with optional SearchAction. */
export const buildWebSiteSchema = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/screener?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

/** Organization schema for the home page. */
export const buildOrganizationSchema = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/logos/marketpivot.jpeg`,
  description: "Bloomberg-style financial market intelligence platform.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@marketspivot.example",
    contactType: "customer support",
  },
  sameAs: [
    "https://twitter.com/marketspivot",
    "https://linkedin.com/company/marketspivot",
  ],
});

/** BreadcrumbList schema for multi-level navigation trails. */
export interface BreadcrumbItem {
  name: string;
  /** Absolute or path-relative URL. */
  url: string;
}

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
  })),
});

/** FinancialProduct schema for individual assets (stocks, crypto, currencies). */
export interface FinancialProductInput {
  name: string;
  /** e.g. "AAPL", "BTC", "USD". */
  identifier: string;
  /** e.g. "Equity", "Cryptocurrency", "Currency". */
  category: "Equity" | "Cryptocurrency" | "Currency" | "Commodity" | "Bond";
  description: string;
  url: string;
  /** Optional price snapshot. */
  price?: { value: number; currency: string };
}

export const buildFinancialProductSchema = (input: FinancialProductInput): Record<string, unknown> => {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: input.name,
    identifier: input.identifier,
    category: input.category,
    description: input.description,
    url: input.url.startsWith("http") ? input.url : `${BASE_URL}${input.url}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: BASE_URL },
  };
  if (input.price) {
    base.offers = {
      "@type": "Offer",
      price: input.price.value,
      priceCurrency: input.price.currency,
      availability: "https://schema.org/InStock",
    };
  }
  return base;
};

/** Article schema for news/blog content. */
export interface ArticleInput {
  headline: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  authorName?: string;
}

export const buildArticleSchema = (input: ArticleInput): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: input.headline,
  description: input.description,
  url: input.url.startsWith("http") ? input.url : `${BASE_URL}${input.url}`,
  image: input.imageUrl ?? `${BASE_URL}/logos/marketpivot.jpeg`,
  datePublished: input.datePublished,
  author: {
    "@type": "Organization",
    name: input.authorName ?? SITE_NAME,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: { "@type": "ImageObject", url: `${BASE_URL}/logos/marketpivot.jpeg` },
  },
});

/** Product schema for pricing/plans. */
export interface ProductOfferInput {
  name: string;
  description: string;
  price: number;
  priceCurrency: string;
  url: string;
}

export const buildProductOfferSchema = (input: ProductOfferInput): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: input.name,
  description: input.description,
  brand: { "@type": "Brand", name: SITE_NAME },
  offers: {
    "@type": "Offer",
    price: input.price,
    priceCurrency: input.priceCurrency,
    url: input.url.startsWith("http") ? input.url : `${BASE_URL}${input.url}`,
    availability: "https://schema.org/InStock",
  },
});
