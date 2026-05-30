// Disable i18next strict key typing — keys are checked at runtime, not compile-time.
// This prevents TS errors when using translation keys that exist in locale files
// but aren't in the generated key union (e.g. namespace-prefixed keys, dynamic keys).
import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: Record<string, Record<string, string>>;
  }
}
