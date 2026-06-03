/**
 * MarketsPivot Service Worker.
 *
 * Caching strategy:
 *   • App shell (HTML, JS, CSS, fonts)  → stale-while-revalidate
 *   • Images / static                    → cache-first
 *   • API requests (localhost:3000/api/) → network-first with cache fallback
 *   • Navigations                         → network-first, falls back to /offline
 *
 * Versioned cache names — bumping CACHE_VERSION forces a clean upgrade.
 */

const CACHE_VERSION = "v1";
const STATIC_CACHE = `mp-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `mp-runtime-${CACHE_VERSION}`;
const API_CACHE = `mp-api-${CACHE_VERSION}`;

const APP_SHELL = ["/", "/offline", "/manifest.webmanifest", "/favicon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE, API_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

const isAppShell = (url) =>
  url.origin === self.location.origin &&
  (url.pathname === "/" ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp"));

const isImage = (url) =>
  /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(url.pathname);

const isApi = (url) => url.pathname.startsWith("/api/");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // ── API: network-first, cache fallback ────────────────────────────────
  if (isApi(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || new Response("Offline", { status: 503 })))
    );
    return;
  }

  // ── Images: cache-first ───────────────────────────────────────────────
  if (isImage(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          return response;
        }).catch(() => caches.match("/favicon.png"));
      })
    );
    return;
  }

  // ── App shell: stale-while-revalidate ─────────────────────────────────
  if (isAppShell(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // ── Navigations: network-first, offline fallback ──────────────────────
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/offline")))
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
