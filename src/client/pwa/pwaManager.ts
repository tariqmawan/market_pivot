/**
 * PWA utilities — service worker registration, install prompt capture,
 * and online/offline detection.
 *
 * The install prompt is a one-shot browser event — we capture it here so the
 * UI can show a custom "Install MarketsPivot" CTA in <InstallPrompt />.
 */

export type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const captureInstallPrompt = (event: BeforeInstallPromptEvent): void => {
  event.preventDefault();
  deferredPrompt = event;
  window.dispatchEvent(new CustomEvent("mp:pwa-installable"));
};

export const consumeInstallPrompt = async (): Promise<"accepted" | "dismissed" | null> => {
  if (!deferredPrompt) return null;
  const prompt = deferredPrompt;
  deferredPrompt = null;
  await prompt.prompt();
  const choice = await prompt.userChoice;
  window.dispatchEvent(new CustomEvent("mp:pwa-install-resolved", { detail: choice }));
  return choice.outcome;
};

export const isInstallPromptAvailable = (): boolean => deferredPrompt !== null;

export const registerServiceWorker = (swPath = "/sw.js"): void => {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return; // don't conflict with Vite HMR

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(swPath, { scope: "/" })
      .then((reg) => {
        // eslint-disable-next-line no-console
        console.info("[PWA] Service worker registered:", reg.scope);
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent("mp:pwa-update-available"));
            }
          });
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn("[PWA] Service worker registration failed:", err);
      });
  });

  window.addEventListener("beforeinstallprompt", ((event: Event) => {
    captureInstallPrompt(event as BeforeInstallPromptEvent);
  }) as EventListener);
};

/** Listen for the app coming back online. */
export const onNetworkChange = (handler: (online: boolean) => void): (() => void) => {
  if (typeof window === "undefined") return () => undefined;
  const listener = () => handler(navigator.onLine);
  window.addEventListener("online", listener);
  window.addEventListener("offline", listener);
  return () => {
    window.removeEventListener("online", listener);
    window.removeEventListener("offline", listener);
  };
};

export const isOnline = (): boolean =>
  typeof navigator !== "undefined" ? navigator.onLine : true;
