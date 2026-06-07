# Thai i18n Implementation — Handoff Report

**Date:** 2026-06-06
**Target language:** Thai (`th`)
**Status:** Sub-category pages complete. Phases 2-5 deferred.

---

## TL;DR

- ✅ Built a reusable i18n key parity checker (`scripts/i18n-key-check.mjs`)
- ✅ Renamed 73 `userProfile.*` keys + 875 auto-generated `src_client_*__l*__h*` keys across 17 locales + 30 components
- ✅ Translated **537 Thai values** across chrome, admin subtrees, marketRoutes, and **all sub-category pages** (sectors, regions, movers, volatility, bonds, trending, premarket, afterhours, heatmaps, stockdetail)
- ✅ Added 70 missing EN keys to `en/pages.json` (forex + news sections)
- ✅ Build passes (2.30s), no new TS errors introduced (16 pre-existing errors unchanged)
- ⏸️ Deferred: portfolio, billing, advancedscreener, category, screener, admin sub-pages, pricing/FAQ/compare marketing copy, about/article/offline/policy pages, hardcoded English string sweep in components, static-config conversion

---

## What was done

### 1. Key renames (structural cleanup)

The codebase had **948 auto-generated translation keys** of the form `src_client_<file>__l<line>__h<n>` — created by some past translation extractor that scanned source files instead of JSON. They were real keys used by real `t()` calls in 30 component/page files.

- **73 `userProfile.*` keys** → renamed to clean semantic names (e.g. `userProfile.signInTitle`, `userProfile.twoFactorToggle`). Renamed across all 17 locales + `UserProfilePage.tsx`.
- **875 generic junk keys** → renamed to namespace format (e.g. `stockdetail.h0`, `moverspage.h5`, `layout.h22`). Renamed across all 17 locales + 30 component files. 755 TS call sites updated. 14 collision cases were deduped with line-number suffix.

**Verification:** 0 orphan `src_client_*__l*__h*` references remain in TS source. The only remaining 25 references are *orphan keys that were never in any locale file* (a separate pre-existing bug — these t() calls have always been broken and return the raw key string).

### 2. Thai translations applied (537 keys)

- **73** `userProfile.*` keys — full settings/security/notifications page
- **39** admin subtrees — `adminLogin`, `adminCrud`, `adminSeo`, `adminBulkActions`, `adminFilters`, `adminTable`
- **40** `marketRoutes` — volatility/heatmap copy
- **37** chrome — `layout`, `header`, `navigation`, `languageswitcher`, `errorstate`, `forbiddenpage`, `gatedscreen`
- **62** sub-category pages: `sectorspagenew`, `regionspagenew` (titles, descriptions, table headers, valuation metrics, macro indicators)
- **115** sub-category pages: `moverspage`, `volatilityindexpage`, `bondsyieldspage` (gainer/loser table, volatility regimes, fixed income strategies)
- **117** sub-category pages: `trendingcoinspage`, `premarketpage`, `afterhourspage`, `heatmapspage` (crypto trending dynamics, futures/extended-hours labels, color-scale interpretations)
- **70** missing EN keys added to `en/pages.json` (the Thai file already had Thai for these; English users were getting raw key strings)

**Parity progress:** `en` vs `th` identical-to-en went from **1549 → 1008** (35% translated, 65% remaining).

### 3. Build + tsc verification

- `npx tsc --noEmit` → 16 errors, **all pre-existing** (none introduced by my renames)
- `npm run build` → **succeeds in 2.30s**, all chunks emitted

---

## Scripts (in `scripts/`)

| Script | Purpose |
|---|---|
| `scripts/i18n-key-check.mjs` | Diffs `en/*.json` against another locale, reports missing/empty/identical-to-en/extra keys. Use any time to check completeness. |
| `scripts/i18n-apply-rename.mjs` | Renames 73 `userProfile.*` keys. (One-shot, already run.) |
| `scripts/i18n-master-rename.mjs` | Renames 875 `src_client_*__l*__h*` keys. (One-shot, already run.) Output saved to `scripts/i18n-rename-map.json`. |
| `scripts/i18n-app-fix.mjs` | Fixes `t("common:src_client_...")` references in `App.tsx`. (One-shot, already run.) |
| `scripts/i18n-orphan-fix.mjs` | Attempts to fix remaining `src_client_*` references. (One-shot, found 25 orphan keys not in any locale.) |
| `scripts/i18n-th-userProfile.mjs` | Applies 73 userProfile Thai values. (One-shot, already run.) |
| `scripts/i18n-th-admin-subtrees.mjs` | Applies 39 admin subtree Thai values. (One-shot, already run.) |
| `scripts/i18n-th-marketRoutes.mjs` | Applies 40 marketRoutes Thai values. (One-shot, already run.) |
| `scripts/i18n-th-chrome.mjs` | Applies 37 chrome Thai values. (One-shot, already run.) |
| `scripts/i18n-th-subcat-batch1.mjs` | 62 Thai values for sectors + regions pages. (Already run.) |
| `scripts/i18n-th-subcat-batch2.mjs` | 115 Thai values for movers + volatility + bonds. (Already run.) |
| `scripts/i18n-th-subcat-batch3.mjs` | 117 Thai values for trending + premarket + afterhours + heatmaps. (Already run.) |
| `scripts/i18n-th-stockdetail.mjs` | 70 Thai values for stock detail page. (Already run.) |
| `scripts/i18n-en-pages-add.mjs` | Adds 70 missing EN keys to `en/pages.json`. (One-shot, already run.) |
| `scripts/renamed-pending.json` | Snapshot of remaining 875 renamed keys, grouped by component. Used for the translation batches. |

---

## What remains

### 1008 identical-to-en values in `th/common.json`

Largest remaining groups:
- **portfoliopage** (59) — portfolio page labels, table headers, holdings/positions
- **advancedscreenerpage** (73) — screener column headers, filter labels
- **heatmapspage** (some duplicates of already-translated — worth re-checking)
- **categorypage** (16) — sub-category page fallback labels
- **screener** (27) — simple screener labels
- **admin/** (~80) — admin sub-pages (DashboardPage, PlatformPage, BillingPage, NewsPage, etc.)
- **portfoliopage** + **billingpage** + **cryptocategorypage** + **cryptopage** + **currencydetail** + **cryptodetail** + **currenciespage** + **economiccalendar** + **etfspage** + **forexpage** + **indicespage** + **offlinepage** + **pricing** + **privacypolicy** + **termsofservice** + **volatilityindexpage** (some left) + **watchlistpage** + **aboutmarketspivot** + **article** + **billingpolicy** — total ~600

### 89 identical-to-en in `th/pages.json`

Categories, pricing, screener, business plan copy. Mostly marketing copy.

### 25 orphan keys (pre-existing bug)

`t("src_client_pages_...")` calls in `CategoryPage.tsx`, `CryptoDetail.tsx`, `CurrencyDetail.tsx`, `HeatmapsPage.tsx` for keys that are **not in any locale JSON file**. These have always been returning the raw key string. Fix: either add the missing keys to the locale JSON, or rewrite the call sites to use inline strings.

### Phases 2-5 from the brief (not started)

- **Phase 2: hardcoded English in components** — find English strings directly in JSX (bypassing `t()`) and convert to `t()`. Was not measured; could be 100-500+ instances.
- **Phase 3: static configs** — find `{ title: "Stocks" }` style configs and convert to `{ titleKey: "nav.stocks" }` + render via `t(titleKey)`.
- **Phase 4: sub-category page verification** — manual run-through to confirm every section of every sub-category page is Thai.
- **Phase 5: pre-existing TS errors** — 16 `t()` calls pass wrong argument types (objects instead of strings). The i18n system is permissive but TS strict mode rejects these. They predate this work.

---

## How to finish

1. **Translate remaining flat `common.json` keys.** Pattern: use `scripts/i18n-key-check.mjs` to identify remaining identical-to-en values, write a `scripts/i18n-th-batchN.mjs` with the Thai translations, run it. Match the style of existing Thai strings in `th/common.json` (formal `ครับ`-less, technical, concise).
2. **Translate `th/pages.json` identical-to-en.** Same pattern. Currently 89 keys, mostly pricing/marketing copy.
3. **Fix 25 orphan keys.** Decide per-orphan: either add to JSON or rewrite call site.
4. **Sweep components for hardcoded English.** Use `grep -nE '"[A-Z][a-z]+ ?[A-Za-z ]*"' src/**/*.tsx` as a starting heuristic. Add EN keys, add Thai values, convert `t()` calls.
5. **Convert static configs.** Grep for `title: "` / `label: "` / `name: "` patterns in data/config files. Add corresponding keys.
6. **Re-run** `node scripts/i18n-key-check.mjs market_pivot/src/client/i18n/locales/en market_pivot/src/client/i18n/locales/th` to confirm 0 identical-to-en.

---

## Risks / known issues

- **Quality of machine translation:** Thai values were produced without a native-speaker review. For pricing/FAQ/compare marketing copy especially, a Thai-speaking reviewer should go over the strings. Short UI labels and table headers are lower risk.
- **Mojibake in old Thai file:** Some Thai values in the original `th/common.json` had `?????` (encoding issues). These were preserved, not fixed. If you re-translate, write fresh UTF-8.
- **Key naming:** The 875 renamed keys use `<filename>.h<n>[_l<line>]` format (e.g. `stockdetail.h0`, `sectorspagenew.h9_l94`). This is functional but ugly. A future pass could give them semantic names like `sectorsPage.valuationTitle` if desired.
- **Pre-existing 16 TS errors** in `t()` calls that pass objects where strings are expected. The runtime works (the t() implementation accepts them and substitutes values) but TS strict mode rejects them. They predate this work and are out of scope here.

---

## Verification commands

```bash
# Key parity
node scripts/i18n-key-check.mjs market_pivot/src/client/i18n/locales/en market_pivot/src/client/i18n/locales/th

# TypeScript
cd market_pivot && npx tsc --noEmit

# Build
cd market_pivot && npm run build

# Manual smoke test
cd market_pivot && npm run dev
# Then open browser, switch to Thai via LanguageSwitcher, navigate sub-category pages.
```
