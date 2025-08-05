// Enhanced Service Worker for optimized caching, offline functionality and SEO performance
const CACHE_NAME = 'prepmate-v2'; // Incremented version
const STATIC_CACHE = 'prepmate-static-v2';
const DYNAMIC_CACHE = 'prepmate-dynamic-v2';
const API_CACHE = 'prepmate-api-v2';
const IMG_CACHE = 'prepmate-images-v2';

// Cache expiration times
const EXPIRATION = {
  staticAssets: 30 * 24 * 60 * 60, // 30 days
  dynamicAssets: 7 * 24 * 60 * 60, // 7 days
  apiData: 6 * 60 * 60 // 6 hours
};

// Critical assets to cache on install for offline functionality
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/images/prepmate-logo.png',
  '/images/prepmate-logo.svg',
  '/manifest.json',
  '/offline.html', // Dedicated offline page
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Extended static assets to cache on activation
const STATIC_ASSETS = [
  ...CRITICAL_ASSETS,
  '/images/icons/icon-72x72.svg',
  '/images/icons/icon-96x96.svg',
  '/images/icons/icon-128x128.svg',
  '/images/icons/icon-144x144.svg',
  '/images/icons/icon-152x152.svg',
  '/images/icons/icon-192x192.svg',
  '/images/icons/icon-384x384.svg',
  '/images/icons/icon-512x512.svg',
  '/images/hero-background.svg'
];

// API routes to cache with stale-while-revalidate strategy
const API_CACHE_PATTERNS = [
  /^https:\/\/prepmate-kvol\.onrender\.com\/api\/contests/,
  /^https:\/\/prepmate-kvol\.onrender\.com\/api\/courses/,
  /^https:\/\/prepmate-kvol\.onrender\.com\/api\/mentors/
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests that aren't to our API
  if (url.origin !== location.origin && !url.origin.includes('prepmate-kvol.onrender.com')) {
    return;
  }

  // Handle API requests
  if (url.origin.includes('prepmate-kvol.onrender.com')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle static assets
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Don't cache POST, PUT, DELETE requests
  if (request.method !== 'GET') {
    try {
      return await fetch(request);
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Network unavailable',
        message: 'Please check your internet connection'
      }), {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Check if this API should be cached
  const shouldCache = API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
  
  if (!shouldCache) {
    // For non-cacheable APIs, just try network
    try {
      return await fetch(request);
    } catch (error) {
      // Return a custom offline response for critical APIs
      return new Response(JSON.stringify({
        error: 'Network unavailable',
        message: 'Please check your internet connection'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Network-first strategy for cacheable APIs
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      // Cache successful responses only for GET requests
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache if network fails (only for GET requests)
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Return offline response
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful page loads
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cached version or offline page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return cached index.html for SPA routing
    const indexResponse = await caches.match('/index.html');
    if (indexResponse) {
      return indexResponse;
    }
    
    // Ultimate fallback - offline page
    return caches.match('/offline.html') || new Response(
      '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  // Only cache GET requests
  if (request.method !== 'GET') {
    return fetch(request);
  }

  // Cache-first strategy for static assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      // Cache static assets only for GET requests
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // For images, return a placeholder
    if (request.destination === 'image') {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dy="0.3em">Image unavailable</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Background sync for failed requests
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any queued requests when back online
  console.log('Service Worker: Background sync triggered');
  
  // You can implement request queuing here
  // For now, just log that we're back online
  
  // Notify all clients that we're back online
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'BACK_ONLINE' });
  });
}

// Push notification handling
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/prepmate-logo.png',
    badge: '/images/prepmate-badge.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: data.actions
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const { action, data } = event;
  let url = data?.url || '/';
  
  if (action === 'view') {
    url = data?.viewUrl || url;
  }
  
  event.waitUntil(
    clients.openWindow(url)
  );
});
