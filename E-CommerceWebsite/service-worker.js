// service-worker.js

const CACHE_NAME = 'ecommerce-pwa-cache-v1';
const urlsToCache = [
  '/index.html',
  '/slider.html',
  '/content.js',
  '/content.html',
  '/Manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
  console.log("Fetch Successful");
});

self.addEventListener('sync', event => {
 console.log("Sync Successful");
});


self.addEventListener('push', event => {
  if (self.Notification.permission === 'granted') {
    const payload = event.data ? event.data.text() : 'Default message';
    event.waitUntil(
      self.registration.showNotification('Title', {
        body: payload,
      })
    );
    console.log("Push Successful");
  } else {
    console.warn('Notification permission has not been granted.');
  }
});

