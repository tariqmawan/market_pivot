const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LOCALE_ROOT = path.join(ROOT, "src", "client", "i18n", "locales");
const NAMESPACES = ["common", "auth", "nav", "markets", "forex", "crypto", "dashboard", "footer", "admin", "pages"];

const cache = new Map();

const shouldSkipValue = (value) => {
  if (typeof value !== "string") return true;
  if (!/[A-Za-z]/.test(value)) return true;
  if (/^https?:\/\//i.test(value)) return true;
  if (/^\/[A-Za-z0-9/_-]+$/.test(value)) return true;
  if (/^[A-Z0-9%$€£¥().,/:+\-\s]+$/.test(value)) return true;
  return false;
};

const protectPlaceholders = (value) => {
  const placeholders = [];
  const protectedValue = value.replace(/\{\{[^}]+\}\}/g, (match) => {
    const token = `MPPLACEHOLDER${placeholders.length}`;
    placeholders.push([token, match]);
    return token;
  });
  return { protectedValue, placeholders };
};

const restorePlaceholders = (value, placeholders) => {
  let restored = value;
  for (const [token, original] of placeholders) {
    restored = restored.replace(new RegExp(token, "g"), original);
    restored = restored.replace(new RegExp(token.toLowerCase(), "g"), original);
  }
  return restored;
};

async function translate(value) {
  if (cache.has(value)) return cache.get(value);

  const { protectedValue, placeholders } = protectPlaceholders(value);
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q="
    + encodeURIComponent(protectedValue);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`translate failed ${response.status} for ${value}`);
  const payload = await response.json();
  const translated = Array.isArray(payload?.[0])
    ? payload[0].map((part) => part?.[0] ?? "").join("")
    : value;
  const finalValue = restorePlaceholders(translated, placeholders).trim() || value;
  cache.set(value, finalValue);
  return finalValue;
}

const walkUpdate = async (enNode, koNode, counters) => {
  for (const [key, enValue] of Object.entries(enNode)) {
    if (enValue && typeof enValue === "object" && !Array.isArray(enValue)) {
      if (!koNode[key] || typeof koNode[key] !== "object" || Array.isArray(koNode[key])) {
        koNode[key] = {};
      }
      await walkUpdate(enValue, koNode[key], counters);
      continue;
    }

    if (!(key in koNode)) {
      koNode[key] = enValue;
      counters.added += 1;
    }

    if (koNode[key] === enValue && !shouldSkipValue(enValue)) {
      koNode[key] = await translate(enValue);
      counters.translated += 1;
    }
  }
};

async function main() {
  const counters = { added: 0, translated: 0 };
  for (const namespace of NAMESPACES) {
    const enPath = path.join(LOCALE_ROOT, "en", `${namespace}.json`);
    const koPath = path.join(LOCALE_ROOT, "ko", `${namespace}.json`);
    const enJson = JSON.parse(fs.readFileSync(enPath, "utf8"));
    const koJson = JSON.parse(fs.readFileSync(koPath, "utf8"));
    await walkUpdate(enJson, koJson, counters);
    fs.writeFileSync(koPath, `${JSON.stringify(koJson, null, 2)}\n`, "utf8");
  }
  console.log(`Korean locale completion done. added=${counters.added} translated=${counters.translated} cache=${cache.size}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
