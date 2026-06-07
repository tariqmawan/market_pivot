type TranslateFn = (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;

import enCommon from "./locales/en/common.json";
import enPages from "./locales/en/pages.json";
import { isBrokenTranslation } from "./utils/quality";

const KNOWN_NAMESPACES = new Set([
  "common",
  "markets",
  "forex",
  "crypto",
  "dashboard",
  "nav",
  "footer",
  "auth",
  "admin",
  "pages",
]);

const flattenSource = (
  node: unknown,
  namespace: string,
  path: string[] = [],
  out: Map<string, string> = new Map()
) => {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    for (const [key, value] of Object.entries(node)) {
      flattenSource(value, namespace, [...path, key], out);
    }
  } else if (typeof node === "string" && !out.has(node)) {
    out.set(node, `${namespace}:${path.join(".")}`);
  }
  return out;
};

const SOURCE_TEXT_KEYS = new Map<string, string>([
  ...flattenSource(enCommon, "common"),
  ...flattenSource(enPages, "pages"),
]);

const isUsableTranslation = (value: string, candidate: string) => {
  const namespaceStripped = candidate.includes(":") ? candidate.split(":").slice(1).join(":") : candidate;
  const dotNamespaceStripped = candidate.includes(".") ? candidate.split(".").slice(1).join(".") : candidate;

  return (
    value.length > 0 &&
    value !== candidate &&
    value !== namespaceStripped &&
    value !== dotNamespaceStripped &&
    value !== "[object Object]" &&
    !value.startsWith("key '") &&
    !value.includes("returned an object instead of string") &&
    !isBrokenTranslation(value)
  );
};

const expandCandidates = (key: string): string[] => {
  if (!key) return [];

  const candidates = new Set<string>();
  const addKeyAndName = (candidate: string) => {
    if (!candidate.endsWith(".name")) candidates.add(`${candidate}.name`);
    candidates.add(candidate);
  };

  if (key.includes(":")) {
    addKeyAndName(key);
    return [...candidates];
  }

  const [namespace, ...restParts] = key.split(".");
  if (KNOWN_NAMESPACES.has(namespace) && restParts.length > 0) {
    addKeyAndName(`${namespace}:${restParts.join(".")}`);
  }

  addKeyAndName(key);
  return [...candidates];
};

export const translateStatic = (
  t: TranslateFn,
  key: string | undefined,
  fallback: string
): string => {
  if (!key) return fallback;

  for (const candidate of expandCandidates(key)) {
    const translated = t(candidate, "");
    if (isUsableTranslation(translated, candidate) && translated !== key) {
      return translated;
    }
  }

  return fallback;
};

export const translateSourceText = (
  t: TranslateFn,
  fallback: string
): string => {
  const key = SOURCE_TEXT_KEYS.get(fallback);
  return key ? t(key, fallback) : fallback;
};
