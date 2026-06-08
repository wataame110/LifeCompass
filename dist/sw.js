const CACHE_NAME = 'lc-v1';

self.addEventListener('install', (e: ExtendableEvent) => {
  (e as any).waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(['/', '/index.html', '/manifest.json', '/compass.svg']))
  );
});

self.addEventListener('fetch', (e: FetchEvent) => {
  (e as any).respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});

export {};
