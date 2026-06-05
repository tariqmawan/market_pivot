const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src", "client", "i18n", "locales");
const locales = fs.readdirSync(root).filter((name) => fs.statSync(path.join(root, name)).isDirectory());
const namespaces = ["common", "auth", "nav", "markets", "forex", "crypto", "dashboard", "footer", "admin", "pages"];

const badPattern = /Ã|Â|Ø|Ù|à¤|à¥|ðŸ|�|\uFFFD|[\u0000-\u001F]|Tr�duction|अनुवाद:/;

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const writeJson = (file, data) => {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
};

const getAtPath = (obj, parts) => {
  let cur = obj;
  for (const part of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[part];
  }
  return cur;
};

const decodeMojibake = (value) => {
  try {
    const decoded = Buffer.from(value, "latin1").toString("utf8");
    return decoded && decoded !== value ? decoded : value;
  } catch {
    return value;
  }
};

let repaired = 0;
let decoded = 0;
let fellBack = 0;

const repairValue = (value, englishValue) => {
  if (typeof value !== "string" || !badPattern.test(value)) return value;

  const candidate = decodeMojibake(value);
  if (candidate && !badPattern.test(candidate)) {
    decoded += 1;
    repaired += 1;
    return candidate;
  }

  if (typeof englishValue === "string") {
    fellBack += 1;
    repaired += 1;
    return englishValue;
  }

  return value;
};

const walk = (node, englishNode, trail = []) => {
  if (typeof node === "string") {
    return repairValue(node, englishNode);
  }
  if (Array.isArray(node)) {
    return node.map((item, index) => walk(item, Array.isArray(englishNode) ? englishNode[index] : undefined, [...trail, index]));
  }
  if (node && typeof node === "object") {
    for (const key of Object.keys(node)) {
      node[key] = walk(node[key], englishNode && typeof englishNode === "object" ? englishNode[key] : undefined, [...trail, key]);
    }
  }
  return node;
};

for (const locale of locales) {
  if (locale === "en") continue;

  for (const namespace of namespaces) {
    const file = path.join(root, locale, `${namespace}.json`);
    const enFile = path.join(root, "en", `${namespace}.json`);
    if (!fs.existsSync(file) || !fs.existsSync(enFile)) continue;

    const data = readJson(file);
    const english = readJson(enFile);
    walk(data, english);
    writeJson(file, data);
  }
}

console.log(`Repaired ${repaired} corrupted locale strings (${decoded} decoded, ${fellBack} fell back to English).`);
