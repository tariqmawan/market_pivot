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
  if (/^[A-Z0-9%$\u20ac\u00a3\u00a5().,/:+\-\s]+$/.test(value)) return true;
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
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pl&dt=t&q="
    + encodeURIComponent(protectedValue);
  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(url);
    if (response.ok) break;
    if (attempt === 4) throw new Error(`translate failed ${response.status} for ${value}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 750));
  }
  const payload = await response.json();
  const translated = Array.isArray(payload?.[0])
    ? payload[0].map((part) => part?.[0] ?? "").join("")
    : value;
  const finalValue = restorePlaceholders(translated, placeholders).trim() || value;
  cache.set(value, finalValue);
  return finalValue;
}

const walkUpdate = async (enNode, plNode, counters) => {
  for (const [key, enValue] of Object.entries(enNode)) {
    if (enValue && typeof enValue === "object" && !Array.isArray(enValue)) {
      if (!plNode[key] || typeof plNode[key] !== "object" || Array.isArray(plNode[key])) {
        plNode[key] = {};
      }
      await walkUpdate(enValue, plNode[key], counters);
      continue;
    }

    if (!(key in plNode)) {
      plNode[key] = enValue;
      counters.added += 1;
    }

    if (plNode[key] === enValue && !shouldSkipValue(enValue)) {
      plNode[key] = await translate(enValue);
      counters.translated += 1;
    }
  }
};

async function main() {
  const counters = { added: 0, translated: 0 };
  for (const namespace of NAMESPACES) {
    const enPath = path.join(LOCALE_ROOT, "en", `${namespace}.json`);
    const plPath = path.join(LOCALE_ROOT, "pl", `${namespace}.json`);
    const enJson = JSON.parse(fs.readFileSync(enPath, "utf8"));
    const plJson = JSON.parse(fs.readFileSync(plPath, "utf8"));
    await walkUpdate(enJson, plJson, counters);
    fs.writeFileSync(plPath, `${JSON.stringify(plJson, null, 2)}\n`, "utf8");
  }
  console.log(`Polish locale completion done. added=${counters.added} translated=${counters.translated} cache=${cache.size}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
