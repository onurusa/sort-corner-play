const CACHE = 'sort-corner';
const BUILD = ["./", "index.html", "play.047ca18482a9.html", "index.52df6996a274.pck", "engine.205b017ab813.js", "engine.205b017ab813.wasm", "engine.205b017ab813.audio.worklet.js", "engine.205b017ab813.audio.position.worklet.js"];
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BUILD)));
});
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const hashed = /\.[0-9a-f]{12}[.]/.test(req.url);
  const save = (res) => {
    if (res.ok && res.status === 200) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return res;
  };
  const cached = () => caches.match(req, { ignoreSearch: !hashed });
  if (hashed) {
    e.respondWith(cached().then((hit) => hit || fetch(req).then(save)));
  } else {
    e.respondWith(fetch(req).then(save).catch(() => cached().then((hit) => hit || Response.error())));
  }
});
