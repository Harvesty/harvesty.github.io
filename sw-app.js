var cacheName = 'Web-Digger-0-0-6';
var dataCacheName = 'Web-Digger-v2';

var filesToCache = [
  '/',
  '/index.html',
  '/page/addtest.html',
  '/js/db.js',
  '/js/main.js',
  '/js/prism.js',
  '/js/savetest.js',
  'https://unpkg.com/vue',
  'https://unpkg.com/github-api/dist/GitHub.bundle.min.js',
  '/css/page.css',
  '/css/mpage.css',
  '/css/prism.css',
  '/css/savetest.css',
  '/css/normalize.css',
  '/images/icons/lfs-48.png',
  '/images/icons/lfs-72.png',
  '/images/icons/lfs-96.png',
  '/images/icons/lfs-144.png',
  '/images/icons/lfs-192.png',
  '/images/icons/lfs-512.png',
  '/manifest.json'
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = '/data';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function (cache) {
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  }
});