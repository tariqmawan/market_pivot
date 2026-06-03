/**
 * Boot the AI subsystem. Import this once near the application root.
 *
 * Currently registers the deterministic mock provider. When a real provider
 * is wired in (e.g. server-side Claude API proxy), call
 * `setActiveProvider(realProvider)` from the same bootstrap file.
 */

import { setActiveProvider } from "./aiTypes";
import { mockAiProvider } from "./mockAiProvider";

let booted = false;

export const bootAI = (): void => {
  if (booted) return;
  setActiveProvider(mockAiProvider);
  booted = true;
};
