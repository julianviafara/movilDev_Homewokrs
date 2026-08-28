const CACHE_NAME = "joker-app-cache-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.jpg",
];

//USED AI TO HELP ME CREATING THIS 

// ----- INSTALL: precache the app shell -----
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting(); // activate the new SW as soon as it's installed
});

// ----- ACTIVATE: clean up old caches -----
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // take control of open tabs immediately
});

// ----- Helpers: one function per strategy -----

// Cache-first: check cache, only hit network if missing. Best for
// static assets that don't change often (app shell, images, fonts).
function cacheFirst(request) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;

    return fetch(request).then((response) => {
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
      return response;
    });
  });
}

// Network-first: try the network for the freshest version, fall back
// to cache if offline. Best for navigations / HTML.
function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
      return response;
    })
    .catch(() => caches.match(request));
}

// Stale-while-revalidate: return cache immediately (if there is one)
// while fetching an updated version in the background for next time.
function staleWhileRevalidate(request) {
  return caches.open(CACHE_NAME).then((cache) =>
    cache.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached); // if network fails, we still have cached (or undefined)

      return cached || fetchPromise;
    })
  );
}

// ----- FETCH: decide which strategy per request -----
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return; // don't touch POST/PUT/etc.

  const url = new URL(request.url);

  // 1) Navigation requests (e.g. loading index.html / route changes)
  //    -> network-first, so users get the latest deploy when online.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  // 2) Static assets built by Vite (hashed JS/CSS) and images
  //    -> cache-first, since they're immutable once built.
  const isStaticAsset =
    url.pathname.startsWith("/assets/") ||
    /\.(js|css|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 3) Everything else same-origin (e.g. manifest, future API calls)
  //    -> stale-while-revalidate.
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 4) Cross-origin requests: just let the network handle it.
});