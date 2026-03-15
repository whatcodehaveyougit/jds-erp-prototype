const CACHE_NAME = 'jds-plant-hub-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/icon-192.svg', '/icon-512.svg'];

function normalizeAssetPath(path) {
  if (!path) {
    return null;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return null;
  }

  return path.startsWith('/') ? path : `/${path}`;
}

async function getPrecacheAssets() {
  try {
    const response = await fetch('/asset-manifest.json', { cache: 'no-store' });
    if (!response.ok) {
      return APP_SHELL;
    }

    const manifest = await response.json();
    const manifestFiles = Object.values(manifest.files || {})
      .map(normalizeAssetPath)
      .filter(Boolean);

    return [...new Set([...APP_SHELL, ...manifestFiles])];
  } catch {
    return APP_SHELL;
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const assets = await getPrecacheAssets();
      await cache.addAll(assets);
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      if (request.mode === 'navigate') {
        try {
          const networkResponse = await fetch(request);
          return networkResponse;
        } catch {
          const cachedShell = await cache.match('/index.html');
          return cachedShell || Response.error();
        }
      }

      const cachedResponse = await cache.match(request, { ignoreSearch: true });
      if (cachedResponse) {
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return Response.error();
      }
    })(),
  );
});
