import React, { useEffect } from "react";

const BASE_URL = "https://marketspivot.com";
const DEFAULT_IMAGE = `${BASE_URL}/logos/marketpivot.jpeg`;
const SITE_NAME = "MarketsPivot";

export interface SeoHeadProps {
  title: string;
  description: string;
  /** Absolute or path-relative URL. */
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  noindex?: boolean;
  /** Optional hreflang alternates (e.g. for localized content). */
  alternates?: { lang: string; href: string }[];
  /** One or more JSON-LD schema objects. */
  jsonLd?: Array<Record<string, unknown> | null | undefined>;
}

const setMeta = (name: string, content: string, attr: "name" | "property" = "name"): void => {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setLink = (rel: string, href: string, attrs: Record<string, string> = {}): void => {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
};

const removeNodes = (selector: string): void => {
  if (typeof document === "undefined") return;
  document.head.querySelectorAll(selector).forEach((node) => node.remove());
};

/**
 * Renders SEO meta tags, canonical link, OpenGraph, Twitter card, and
 * JSON-LD structured data. Mounted at the top of any page component.
 *
 * All tags are written imperatively (not via JSX) so the document <head>
 * is the single source of truth, and route transitions don't leave stale
 * tags behind.
 *
 * @example
 *   <SeoHead
 *     title="Stocks"
 *     description="Track 60+ global exchanges and real-time index data."
 *     canonical="/stocks"
 *     jsonLd={[buildBreadcrumbSchema([{name:'Home',url:'/'},{name:'Stocks',url:'/stocks'}])]}
 *   />
 */
export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noindex = false,
  alternates,
  jsonLd,
}) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    // Core meta
    setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("theme-color", "#C9A87B");
    setMeta("application-name", SITE_NAME);
    setMeta("apple-mobile-web-app-title", SITE_NAME);

    // OpenGraph
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:url", (canonical?.startsWith("http") ? canonical : `${BASE_URL}${canonical ?? ""}`), "property");
    setMeta("og:locale", "en_US", "property");

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
    setMeta("twitter:site", "@marketspivot");

    // Canonical
    if (canonical) {
      setLink("canonical", canonical.startsWith("http") ? canonical : `${BASE_URL}${canonical}`);
    }

    // Hreflang alternates
    removeNodes('link[rel="alternate"][hreflang]');
    if (alternates) {
      alternates.forEach(({ lang, href }) => {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.setAttribute("hreflang", lang);
        link.href = href.startsWith("http") ? href : `${BASE_URL}${href}`;
        document.head.appendChild(link);
      });
    }

    // JSON-LD — wipe and re-emit on every render to keep schema current.
    removeNodes('script[type="application/ld+json"][data-mp-seo]');
    (jsonLd ?? [])
      .filter((node): node is Record<string, unknown> => Boolean(node))
      .forEach((node) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.mpSeo = "true";
        script.text = JSON.stringify(node);
        document.head.appendChild(script);
      });

    return () => {
      // On unmount, remove only the JSON-LD we added (other tags are page-stable).
      removeNodes('script[type="application/ld+json"][data-mp-seo]');
    };
  }, [title, description, canonical, ogImage, ogType, noindex, alternates, jsonLd]);

  return null;
};

export { BASE_URL, DEFAULT_IMAGE, SITE_NAME };
