const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LOCALES_DIR = path.join(ROOT, "src", "client", "i18n", "locales");
const REPORT = path.join(ROOT, "I18N_NATIVE_AUDIT.md");

const REQUIRED_LANGUAGES = ["es", "it", "pt", "ru", "zh", "ko", "tr", "nl", "pl", "vi", "id"];
const REQUIRED_WITH_BASE = ["en", ...REQUIRED_LANGUAGES];
const NAMESPACES = ["common", "auth", "nav", "markets", "forex", "crypto", "dashboard", "footer", "admin", "pages"];
const langArg = process.argv.find((arg) => arg.startsWith("--lang="));
const bareLangArg = process.argv.slice(2).find((arg) => /^[a-z]{2}$/.test(arg));
const ACTIVE_LANG = langArg ? langArg.slice("--lang=".length) : bareLangArg ?? null;

const mojibakePattern = /(?:\u00c3[\u0080-\u00bf]?|\u00c2(?:[\u0080-\u009f]|\u20ac|\u2122|\u0153|\u009d)|\ufffd|\u00ef\u00bf\u00bd|\u00f0\u0178|\u00e0\u00a4|\u00e0\u00a5|Tr\u00ef)/u;
const replacementQuestionPattern = /(?:[\p{L}]\?[\p{L}]|\?[\p{L}])/u;
const placeholderPattern = /\{\{\s*([\w.-]+)\s*\}\}/g;
const englishWordPattern = /[A-Za-z]{3,}/;
const technicalAllowlist = new Set([
  "API", "ETF", "ETFs", "FX", "IPO", "USD", "EUR", "JPY", "GBP", "CNY", "BTC", "ETH",
  "Layer-1", "DeFi", "TVL", "PWA", "SEO", "AI", "GPU", "GDP", "CPI", "FOMC"
]);
const localeAllowlist = {
  es: new Set(["Australia", "Chile", "Hong Kong", "Indonesia", "India", "Asia", "Bolsa de Comercio de Santiago", "NASDAQ", "YTD"]),
  vi: new Set([
    "Aave", "Apple Inc.", "B3 (Brasil Bolsa Balcão)", "Banco de México", "Bitcoin",
    "Bolsa de Comercio de Santiago", "Bonk", "Bursa Malaysia", "Cardano", "Deutsche Börse",
    "Dogecoin", "Ethereum", "Euronext", "Facebook", "Instagram", "LinkedIn", "Litecoin",
    "New York Stock Exchange", "Pepe Nation", "Riksbank", "Robots.txt", "S&P 500 / USD / New York",
    "ShibArmy", "Shiba Inu", "Solana", "Tether", "TikTok", "Toncoin", "Uniswap",
    "User-agent: *\nAllow: /", "Viking Army", "noindex", "s.changePercent",
    "support@marketspivot.example", "1 {{base}} = {{rate}} {{quote}}", "GDP q/q"
  ]),
};

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function flatten(value, prefix = "", out = {}) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out[prefix] = value;
  }
  return out;
}

function placeholders(value) {
  if (typeof value !== "string") return [];
  return [...value.matchAll(placeholderPattern)].map((match) => match[1]).sort();
}

function sameArray(a, b) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

function hasMojibake(value) {
  return typeof value === "string" && (mojibakePattern.test(value) || replacementQuestionPattern.test(value));
}

function isLikelyUntranslated(lang, enValue, localValue) {
  if (typeof enValue !== "string" || typeof localValue !== "string") return false;
  const en = enValue.trim();
  const local = localValue.trim();
  if (!en || en !== local || !englishWordPattern.test(en)) return false;
  if (technicalAllowlist.has(en)) return false;
  if (localeAllowlist[lang]?.has(en)) return false;
  if (/^[A-Za-z]+\/[A-Za-z_]+$/.test(en)) return false;
  if (/^https?:\/\//i.test(en) || /^\/[\w/-]+$/.test(en)) return false;
  if (/^[A-Z0-9%$€£¥().,/:+\-\s]+$/.test(en)) return false;
  return true;
}

function findDuplicateKeys(jsonText) {
  const duplicates = [];
  const stack = [new Set()];
  let index = 0;

  const skipWhitespace = () => {
    while (/\s/.test(jsonText[index] || "")) index += 1;
  };

  const readString = () => {
    let result = "";
    index += 1;
    while (index < jsonText.length) {
      const char = jsonText[index];
      if (char === "\\") {
        result += char + (jsonText[index + 1] || "");
        index += 2;
        continue;
      }
      if (char === "\"") {
        index += 1;
        return result;
      }
      result += char;
      index += 1;
    }
    return result;
  };

  while (index < jsonText.length) {
    const char = jsonText[index];
    if (char === "{") {
      stack.push(new Set());
      index += 1;
      continue;
    }
    if (char === "}") {
      stack.pop();
      index += 1;
      continue;
    }
    if (char !== "\"") {
      index += 1;
      continue;
    }

    const start = index;
    const key = readString();
    skipWhitespace();
    if (jsonText[index] !== ":") continue;

    const current = stack[stack.length - 1];
    if (current.has(key)) duplicates.push({ key, offset: start });
    current.add(key);
  }

  return duplicates;
}

function compareLocale(lang, namespace, enFlat, rows, counters) {
  const file = path.join(LOCALES_DIR, lang, `${namespace}.json`);
  if (!fs.existsSync(file)) {
    counters.missingFiles += 1;
    rows.push(`- Missing file: ${lang}/${namespace}.json`);
    return;
  }

  const text = readText(file);
  for (const dup of findDuplicateKeys(text)) {
    counters.duplicateKeys += 1;
    rows.push(`- Duplicate key: ${lang}/${namespace}.json:${dup.key}`);
  }

  let local;
  try {
    local = JSON.parse(text);
  } catch (error) {
    counters.invalidJson += 1;
    rows.push(`- Invalid JSON: ${lang}/${namespace}.json - ${error.message}`);
    return;
  }

  const localFlat = flatten(local);

  for (const key of Object.keys(enFlat)) {
    if (!(key in localFlat)) {
      counters.missingKeys += 1;
      rows.push(`- Missing key: ${lang}/${namespace}.json:${key}`);
      continue;
    }

    const enValue = enFlat[key];
    const localValue = localFlat[key];
    if (Array.isArray(enValue) !== Array.isArray(localValue)) {
      counters.shapeMismatches += 1;
      rows.push(`- Shape mismatch: ${lang}/${namespace}.json:${key}`);
    }

    if (!sameArray(placeholders(enValue), placeholders(localValue))) {
      counters.placeholderMismatches += 1;
      rows.push(`- Placeholder mismatch: ${lang}/${namespace}.json:${key}`);
    }

    if (hasMojibake(localValue)) {
      counters.mojibake += 1;
      rows.push(`- Mojibake candidate: ${lang}/${namespace}.json:${key}`);
    }

    if (lang !== "en" && isLikelyUntranslated(lang, enValue, localValue)) {
      counters.englishLeaks += 1;
      rows.push(`- English fallback candidate: ${lang}/${namespace}.json:${key} = ${localValue}`);
    }
  }

  for (const key of Object.keys(localFlat)) {
    if (!(key in enFlat)) {
      counters.extraKeys += 1;
      rows.push(`- Extra key: ${lang}/${namespace}.json:${key}`);
    }
  }
}

const existingLocales = fs.readdirSync(LOCALES_DIR)
  .filter((entry) => fs.statSync(path.join(LOCALES_DIR, entry)).isDirectory())
  .sort();

const rows = [];
const counters = {
  missingLanguages: 0,
  extraLanguages: 0,
  missingFiles: 0,
  invalidJson: 0,
  duplicateKeys: 0,
  missingKeys: 0,
  extraKeys: 0,
  shapeMismatches: 0,
  placeholderMismatches: 0,
  mojibake: 0,
  englishLeaks: 0,
};

if (ACTIVE_LANG && !REQUIRED_LANGUAGES.includes(ACTIVE_LANG)) {
  counters.missingLanguages += 1;
  rows.push(`- Unsupported active locale: ${ACTIVE_LANG}`);
}

if (!ACTIVE_LANG) {
  for (const lang of REQUIRED_WITH_BASE) {
    if (!existingLocales.includes(lang)) {
      counters.missingLanguages += 1;
      rows.push(`- Missing required locale directory: ${lang}`);
    }
  }

  for (const lang of existingLocales) {
    if (!REQUIRED_WITH_BASE.includes(lang)) {
      counters.extraLanguages += 1;
      rows.push(`- Locale outside requested support matrix: ${lang}`);
    }
  }
}

const languagesToAudit = ACTIVE_LANG
  ? ["en", ACTIVE_LANG].filter((code) => existingLocales.includes(code))
  : REQUIRED_WITH_BASE.filter((code) => existingLocales.includes(code));

for (const namespace of NAMESPACES) {
  const enPath = path.join(LOCALES_DIR, "en", `${namespace}.json`);
  const enFlat = flatten(readJson(enPath));
  for (const lang of languagesToAudit) {
    compareLocale(lang, namespace, enFlat, rows, counters);
  }
}

const status = Object.entries(counters)
  .filter(([key]) => key !== "extraLanguages")
  .every(([, value]) => value === 0) ? "PASS" : "FAIL";

const report = [
  "# Native Localization Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Status: ${status}`,
  ACTIVE_LANG ? `Active language: ${ACTIVE_LANG}` : "Active language: all",
  "",
  "## Required Languages",
  "",
  REQUIRED_LANGUAGES.map((lang) => `- ${lang}`).join("\n"),
  "",
  "## Counts",
  "",
  ...Object.entries(counters).map(([key, value]) => `- ${key}=${value}`),
  "",
  "## Findings",
  "",
  ...(rows.length ? rows.slice(0, 1500) : ["- No findings."]),
  "",
].join("\n");

fs.writeFileSync(REPORT, report, "utf8");
console.log(`Native i18n report written to ${path.relative(ROOT, REPORT)}`);
console.log(Object.entries(counters).map(([key, value]) => `${key}=${value}`).join(" "));

if (status !== "PASS") process.exitCode = 1;
