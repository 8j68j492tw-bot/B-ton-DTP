const CACHE_NAME = "fiches-beton-v2";
const APP_SHELL = [
  "./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png",
  "./fiches/sikacrete-08-scc.pdf",
  "./fiches/sikacrete-211-flow-plus.pdf",
  "./fiches/sikagrout-212.pdf",
  "./fiches/sikagrout-212-hp.pdf",
  "./fiches/sikagrout-212-sr.pdf",
  "./fiches/sikagrout-112.pdf",
  "./fiches/sikagrout-300-pt.pdf",
  "./fiches/sikagrout-arctic-100.pdf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  // Ne jamais intercepter les appels à l'API Anthropic : ils doivent
  // toujours atteindre le réseau en direct.
  if (url.includes("api.anthropic.com")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (event.request.method === "GET" && response && response.status === 200 && url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
