// ── SERVICE WORKER ─────────────────────────────────────
const CACHE = 'wastewroth-v1';
const ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './js/db.js',
  './js/auth.js',
  './js/data.js',
  './js/camera.js',
  './js/ai.js',
  './js/charts.js',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS.filter(a => !a.startsWith('http'))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first for API calls, cache-first for assets
  if (e.request.url.includes('api.anthropic.com') || e.request.url.includes('fonts.g')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return response;
    }))
  );
});
