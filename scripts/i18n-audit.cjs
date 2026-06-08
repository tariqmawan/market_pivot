const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "..");
const LOCALES_DIR = path.join(ROOT, "src", "client", "i18n", "locales");
const SRC_DIR = path.join(ROOT, "src", "client");
const REPORT = path.join(ROOT, "I18N_FORENSIC_REPORT.md");
const FIX = process.argv.includes("--fix");

const localeCodes = fs.readdirSync(LOCALES_DIR)
  .filter((entry) => fs.statSync(path.join(LOCALES_DIR, entry)).isDirectory())
  .sort();

const jsonFiles = (lang) => fs.readdirSync(path.join(LOCALES_DIR, lang))
  .filter((file) => file.endsWith(".json"))
  .sort();

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function flatten(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, next, out);
    else out[next] = value;
  }
  return out;
}

function setPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cursor = obj;
  while (parts.length > 1) {
    const part = parts.shift();
    cursor[part] = cursor[part] && typeof cursor[part] === "object" ? cursor[part] : {};
    cursor = cursor[part];
  }
  cursor[parts[0]] = value;
}

function placeholders(value) {
  if (typeof value !== "string") return [];
  return [...value.matchAll(/\{\{\s*([\w.-]+)\s*\}\}/g)].map((m) => m[1]).sort();
}

function sameArray(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

const mojibakePattern = /(?:Ã[\u0080-\u00bf]?|Â(?:[\u0080-\u009f]|€|™|œ|\u009d)|Ø[\u0080-\u00bf]?|Ù[\u0080-\u00bf]?|à¤|à¥|ðŸ|�|Tr�duction|अनुवाद:)/;
const questionDamagePattern = /\?{2,}/;
const inlineQuestionDamagePattern = /[\p{L}]\?[\p{L}]/gu;
const todoPattern = /TODO translation|translate me|missing translation/i;
const generatedKeyPattern = /^(codemod_|src_client_)/;

function isDamagedLocaleValue(value) {
  if (typeof value !== "string") return false;
  if (value.trim() === "" || mojibakePattern.test(value) || questionDamagePattern.test(value) || todoPattern.test(value)) {
    return true;
  }
  return [...value.matchAll(inlineQuestionDamagePattern)].length >= 2;
}

function listFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", "dist"].includes(entry.name)) listFiles(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function scanCodeFiles() {
  const findings = [];
  for (const file of listFiles(SRC_DIR)) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const text = fs.readFileSync(file, "utf8");
    const source = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      /\.(tsx|jsx)$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );
    const lineOf = (node) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
    const add = (node, type, value) => {
      const trimmed = String(value).replace(/\s+/g, " ").trim();
      if (!trimmed || !/[A-Za-z]/.test(trimmed)) return;
      if (/^(https?:|\/|#|[A-Z0-9_ .:/+-]{1,8})$/.test(trimmed)) return;
      if (/^[{}()[\],.;:?|&!<>=+\-*/%`'"]+$/.test(trimmed)) return;
      findings.push({ file: rel, line: lineOf(node), type, value: trimmed.slice(0, 140) });
    };
    const callName = (expr) => {
      if (ts.isIdentifier(expr)) return expr.text;
      if (ts.isPropertyAccessExpression(expr)) return `${callName(expr.expression)}.${expr.name.text}`;
      return "";
    };
    const visit = (node) => {
      if (ts.isJsxText(node)) {
        add(node, "jsx text", node.getText(source));
      } else if (ts.isJsxExpression(node) && node.expression && ts.isStringLiteralLike(node.expression)) {
        add(node, "jsx string expression", node.expression.text);
      } else if (ts.isJsxAttribute(node)) {
        const name = node.name.text;
        if (["placeholder", "aria-label", "title", "alt"].includes(name) && node.initializer) {
          if (ts.isStringLiteral(node.initializer)) add(node, `jsx ${name}`, node.initializer.text);
          if (
            ts.isJsxExpression(node.initializer) &&
            node.initializer.expression &&
            ts.isStringLiteralLike(node.initializer.expression)
          ) add(node, `jsx ${name}`, node.initializer.expression.text);
        }
      } else if (ts.isCallExpression(node)) {
        const name = callName(node.expression);
        const first = node.arguments[0];
        if (
          first &&
          ts.isStringLiteralLike(first) &&
          (/^(alert|confirm|prompt|setToast)$/.test(name) || /^toast\./.test(name))
        ) {
          add(node, `${name} literal`, first.text);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  return findings;
}

const enFiles = jsonFiles("en");
const localeRows = [];
const issues = [];
let missingLocaleKeys = 0;
let placeholderMismatches = 0;
let badLocaleValues = 0;
let generatedKeys = 0;

for (const fileName of enFiles) {
  const enPath = path.join(LOCALES_DIR, "en", fileName);
  const enObj = readJson(enPath);
  const enFlat = flatten(enObj);
  generatedKeys += Object.keys(enFlat).filter((key) => generatedKeyPattern.test(key)).length;

  for (const lang of localeCodes) {
    const localePath = path.join(LOCALES_DIR, lang, fileName);
    if (!fs.existsSync(localePath)) {
      issues.push(`Missing file: ${lang}/${fileName}`);
      missingLocaleKeys += Object.keys(enFlat).length;
      continue;
    }
    const localeObj = readJson(localePath);
    const localeFlat = flatten(localeObj);
    let changed = false;

    for (const [key, enValue] of Object.entries(enFlat)) {
      if (!(key in localeFlat)) {
        missingLocaleKeys += 1;
        issues.push(`Missing key: ${lang}/${fileName}:${key}`);
        if (FIX) {
          setPath(localeObj, key, enValue);
          changed = true;
        }
        continue;
      }
      const localValue = localeFlat[key];
      const enVars = placeholders(enValue);
      const localVars = placeholders(localValue);
      if (!sameArray(enVars, localVars)) {
        placeholderMismatches += 1;
        issues.push(`Placeholder mismatch: ${lang}/${fileName}:${key}`);
      }
      if (isDamagedLocaleValue(localValue)) {
        badLocaleValues += 1;
        issues.push(`Bad locale value: ${lang}/${fileName}:${key} = ${localValue.slice(0, 80)}`);
      }
    }

    if (changed) writeJson(localePath, localeObj);
  }
}

for (const lang of localeCodes) {
  let present = 0;
  for (const fileName of jsonFiles(lang)) {
    present += Object.keys(flatten(readJson(path.join(LOCALES_DIR, lang, fileName)))).length;
  }
  localeRows.push({ lang, present });
}

const hardcoded = scanCodeFiles();

const report = [
  "# I18N Forensic Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Locale Summary",
  "",
  "| Locale | Keys |",
  "| --- | ---: |",
  ...localeRows.map((row) => `| ${row.lang} | ${row.present} |`),
  "",
  "## Counts",
  "",
  `- missingLocaleKeys=${missingLocaleKeys}`,
  `- placeholderMismatches=${placeholderMismatches}`,
  `- badLocaleValues=${badLocaleValues}`,
  `- generatedKeys=${generatedKeys}`,
  `- hardcodedCandidates=${hardcoded.length}`,
  "",
  "## Hardcoded Candidates",
  "",
  ...hardcoded.slice(0, 500).map((f) => `- ${f.file}:${f.line} [${f.type}] ${f.value}`),
  "",
  "## Locale Issues",
  "",
  ...issues.slice(0, 1000).map((issue) => `- ${issue}`),
  "",
].join("\n");

fs.writeFileSync(REPORT, report, "utf8");
console.log(`I18N report written to ${path.relative(ROOT, REPORT)}`);
console.log(`hardcodedCandidates=${hardcoded.length} missingLocaleKeys=${missingLocaleKeys} placeholderMismatches=${placeholderMismatches} badLocaleValues=${badLocaleValues} generatedKeys=${generatedKeys}`);

if (missingLocaleKeys || placeholderMismatches) process.exitCode = 1;
