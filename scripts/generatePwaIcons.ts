/**
 * Generate PWA icon set from public/favicon.png.
 *
 * Browsers downscale larger images for the smaller slots, so we produce a
 * single 512x512 master and a 192x192 standard. The maskable variant uses
 * a slightly larger safe area. We rely on `sharp` for resizing; if it is not
 * installed we fall back to copying the favicon as-is.
 *
 * Run with:  npx tsx scripts/generatePwaIcons.ts
 */

import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const PUBLIC_DIR = resolve(__dirname, "..", "public");
const ICONS_DIR = join(PUBLIC_DIR, "icons");
const SOURCE = join(PUBLIC_DIR, "favicon.png");

const ensureDirs = (): void => {
  if (!existsSync(ICONS_DIR)) mkdirSync(ICONS_DIR, { recursive: true });
};

const main = async (): Promise<void> => {
  ensureDirs();

  let sharp: typeof import("sharp") | null = null;
  try {
    // Optional — only used if installed.
    sharp = (await import("sharp")).default as unknown as typeof import("sharp");
  } catch {
    sharp = null;
  }

  if (!sharp) {
    // No sharp — fall back to copying the favicon for every slot. Browsers
    // downscale on display, and the manifest still validates.
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    for (const size of sizes) {
      copyFileSync(SOURCE, join(ICONS_DIR, `icon-${size}.png`));
    }
    copyFileSync(SOURCE, join(ICONS_DIR, "icon-maskable-512.png"));
    // eslint-disable-next-line no-console
    console.log("  copied favicon to all icon slots (install `sharp` for true resizing)");
    return;
  }

  const source = sharp(SOURCE);
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  for (const size of sizes) {
    await source
      .clone()
      .resize(size, size, { fit: "contain", background: { r: 10, g: 15, b: 26, alpha: 1 } })
      .png()
      .toFile(join(ICONS_DIR, `icon-${size}.png`));
  }

  // Maskable: full bleed with extra padding inside the safe area.
  await sharp(SOURCE)
    .resize(384, 384, { fit: "contain", background: { r: 10, g: 15, b: 26, alpha: 1 } })
    .extend({ top: 64, bottom: 64, left: 64, right: 64, background: { r: 10, g: 15, b: 26, alpha: 1 } })
    .png()
    .toFile(join(ICONS_DIR, "icon-maskable-512.png"));

  // eslint-disable-next-line no-console
  console.log(`  generated ${sizes.length + 1} icons in public/icons/`);
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

// Silence unused-export warning when sharp path is taken.
void writeFileSync;
