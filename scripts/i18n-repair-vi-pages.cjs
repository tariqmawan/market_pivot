const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src", "client", "i18n", "locales");
const file = path.join(root, "vi", "pages.json");
const enFile = path.join(root, "en", "pages.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const english = JSON.parse(fs.readFileSync(enFile, "utf8"));

const explicitFallbacks = {
  "news.latestMarketNews": "Latest market news and headlines from MarketsPivot",
  "forex.globalFxIntelligence": "Global FX intelligence",
  "forex.fxSubtitle": "Currency strength, major and exotic pairs, central bank policy, economic calendar, regional flows, and historical charts in one terminal.",
  "forex.centralBanks": "Central banks",
  "forex.action": "Action",
  "forex.centralBankMacro": "Central bank and macro profile",
  "forex.majorPairsSubtitle": "High-liquidity pairs that lead global FX flows",
  "forex.crossPairsSubtitle": "Major cross pairs with regional and trade themes",
  "forex.centralBankTracker": "Central bank tracker",
  "forex.centralBankSubtitle": "Policy rates, next decisions, and inflation context",
  "forex.globalRateComparison": "Global rate comparison",
  "forex.centralBank": "Central bank",
  "forex.volatilitySubtitle": "Realized volatility and momentum across currencies",
  "forex.heatmapSubtitle": "Daily performance visualized for all major and emerging currencies",
};

const mojibakeFragments = ["Ã", "Â", "Ä", "Æ", "â", "áº", "á»", "ï¿½"];

function hasBadText(value) {
  return (
    mojibakeFragments.some((fragment) => value.includes(fragment)) ||
    [...value].some((char) => {
      const code = char.charCodeAt(0);
      return code === 0xfffd || code < 32;
    })
  );
}

function decode(value) {
  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
}

let repaired = 0;

function walk(node, enNode, trail = []) {
  if (typeof node === "string") {
    if (!hasBadText(node)) return node;
    const explicit = explicitFallbacks[trail.join(".")];
    if (explicit) {
      repaired += 1;
      return explicit;
    }
    const candidate = decode(node);
    if (candidate && !hasBadText(candidate)) {
      repaired += 1;
      return candidate;
    }
    if (typeof enNode === "string") {
      repaired += 1;
      return enNode;
    }
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((item, index) => walk(item, Array.isArray(enNode) ? enNode[index] : undefined, [...trail, index]));
  }
  if (node && typeof node === "object") {
    for (const key of Object.keys(node)) {
      node[key] = walk(node[key], enNode && typeof enNode === "object" ? enNode[key] : undefined, [...trail, key]);
    }
  }
  return node;
}

walk(data, english);
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Repaired ${repaired} Vietnamese page strings.`);
