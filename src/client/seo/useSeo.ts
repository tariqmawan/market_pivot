import { useEffect } from "react";
import { BASE_URL, DEFAULT_IMAGE, SITE_NAME } from "./SeoHead";

export interface UseSeoOptions {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  noindex?: boolean;
}

/**
 * Imperative hook equivalent of <SeoHead />. Use in components that prefer
 * hooks (e.g. inside custom hooks) over JSX. Most pages should mount
 * <SeoHead /> directly.
 */
export function useSeo({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noindex = false,
}: UseSeoOptions): void {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name"): void => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string): void => {
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:url", canonical?.startsWith("http") ? canonical : `${BASE_URL}${canonical ?? ""}`, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    if (canonical) {
      setLink("canonical", canonical.startsWith("http") ? canonical : `${BASE_URL}${canonical}`);
    }
  }, [title, description, canonical, ogImage, ogType, noindex]);
}
