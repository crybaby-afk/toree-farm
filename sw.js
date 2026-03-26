const CACHE_NAME = 'toree-farm-v1.0.0';
const STATIC_CACHE = 'toree-static-v1.0.0';
const DYNAMIC_CACHE = 'toree-dynamic-v1.0.0';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo.png',
  '/images/favicon.ico',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache static assets:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from network and cache
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response.ok) return response;

            // Clone the response for caching
            const responseClone = response.clone();

            // Cache the response
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseClone);
              });

            return response;
          })
          .catch(error => {
            console.log('Service Worker: Fetch failed, serving offline page');
            // If fetch fails and it's a page request, serve offline page
            if (event.request.destination === 'document') {
              return caches.match('/offline.html') || new Response('Offline - Please check your connection', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            }
          });
      })
  );
});

// Background sync for cart orders
self.addEventListener('sync', event => {
  if (event.tag === 'background-order-sync') {
    event.waitUntil(syncPendingOrders());
  }
});

// Push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/icons/icon-192x192.png',
      badge: '/images/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('Notification click received.');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

// Helper function for syncing pending orders
async function syncPendingOrders() {
  try {
    // Get pending orders from IndexedDB or localStorage
    const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');

    if (pendingOrders.length === 0) return;

    // Send orders to server
    for (const order of pendingOrders) {
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
      });
    }

    // Clear pending orders
    localStorage.removeItem('pendingOrders');
    console.log('Service Worker: Synced pending orders');
  } catch (error) {
    console.error('Service Worker: Failed to sync orders:', error);
  }
}