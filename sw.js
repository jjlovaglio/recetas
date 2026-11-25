// Cache para que la app abra sin señal adentro del súper.
// Al cambiar index.html, subir la versión para que el teléfono baje la nueva.
const V = "recetas-v1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Red primero (para recibir cambios), cache si no hay señal.
// cache:"no-cache" porque GitHub Pages manda max-age=600.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request, { cache:"no-cache" }).then(r => {
    const copy = r.clone(); caches.open(V).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
});
