const CACHE_NAME = 'pwa-cache-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/js/app.js',
  '/js/script.js',
  '/css/style.css',
  '/css/normalize.css',
  '/css/responsive.css',
  '/css/utility.css',
  '/font/fonts.css',
  '/images/header-bg.webp',
  '/images/services-bg.webp',
  '/default.html',
];

// Install event - caching static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  console.log('Service Worker installed');
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  console.log('Service Worker activated');
});

// Fetch event - serving cached assets or adding to dynamic cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((fetchResponse) => {
            return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
          .catch(() => caches.match('/default.html')) // Fallback for offline
      );
    })
  );
});
