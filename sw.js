// Offline support for the installed app. Every request goes to the network
// first, so players always get the newest version when online; the saved copy
// is only used when the network is unavailable.
const CACHE = 'gcb-v1';

self.addEventListener('install', (event) => {
  // Save the page plus every local file it links to, so the first launch
  // after installing also works offline.
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const res = await fetch('./', { cache: 'no-cache' });
    const html = await res.clone().text();
    await cache.put('./', res);
    const files = [...html.matchAll(/(?:src|href)="([^"#?]+)"/g)].map((m) => m[1]).filter((u) => !/^(https?:|data:|mailto:)/.test(u));
    await Promise.all([...new Set([...files, 'manifest.webmanifest'])].map((u) => cache.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const fonts = url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !fonts) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // The page itself is stored under one key whatever its query string.
    const key = req.mode === 'navigate' ? './' : req;
    try {
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') cache.put(key, res.clone());
      return res;
    } catch (e) {
      const hit = await cache.match(key, { ignoreSearch: req.mode === 'navigate' });
      if (hit) return hit;
      throw e;
    }
  })());
});
