/**
 * Build-time sitemap generator.
 *
 * Reads JSON data, calls into `client/seo/sitemapBuilder.ts`, and writes
 * sitemap files to `public/`. Run with:
 *   npx ts-node --transpile-only scripts/generateSitemap.ts
 *
 * Or wire it into `package.json`:
 *   "prebuild:client": "ts-node --transpile-only scripts/generateSitemap.ts"
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  buildSitemap,
  buildSitemapIndex,
  buildSectionSitemap,
  sitemapEntryCount,
  SITEMAP_SECTIONS,
} from "../src/client/seo/sitemapBuilder";

const PUBLIC_DIR = resolve(__dirname, "..", "public");

const ensurePublicDir = (): void => {
  if (!existsSync(PUBLIC_DIR)) {
    mkdirSync(PUBLIC_DIR, { recursive: true });
  }
};

const write = (file: string, contents: string): void => {
  const fullPath = join(PUBLIC_DIR, file);
  writeFileSync(fullPath, contents, "utf8");
  // eslint-disable-next-line no-console
  console.log(`  wrote ${file} (${contents.length.toLocaleString()} bytes)`);
};

const main = (): void => {
  ensurePublicDir();

  // Master sitemap (combined — keeps legacy /sitemap.xml working).
  write("sitemap.xml", buildSitemap());

  // Per-section sitemaps.
  for (const section of SITEMAP_SECTIONS) {
    write(`sitemap-${section.id}.xml`, buildSectionSitemap(section.id));
  }

  // Index file pointing at the per-section sitemaps.
  const sectionFiles = SITEMAP_SECTIONS.map((s) => `sitemap-${s.id}.xml`);
  write("sitemap-index.xml", buildSitemapIndex(sectionFiles));

  // eslint-disable-next-line no-console
  console.log(`\n  ${sitemapEntryCount()} URLs across ${SITEMAP_SECTIONS.length} sections`);
};

main();
