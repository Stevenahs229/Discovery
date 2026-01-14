const CACHE_NAME = 'twoinone-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/app/App.tsx',
  '/src/styles/index.css',
  '/src/styles/tailwind.css',
  '/src/styles/theme.css',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des fichiers');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('[Service Worker] Erreur de cache:', error);
      })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache: Network First avec fallback sur cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes vers Supabase (toujours en ligne)
  if (event.request.url.includes('supabase.co')) {
    return fetch(event.request);
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la requête réussit, mettre en cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec, utiliser le cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si pas de cache, retourner page offline
            return caches.match('/index.html');
          });
      })
  );
});

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Synchronisation en arrière-plan:', event.tag);
  if (event.tag === 'sync-presence') {
    event.waitUntil(syncPresenceData());
  }
});

async function syncPresenceData() {
  // Ici vous pouvez ajouter la logique de synchronisation
  console.log('[Service Worker] Synchronisation des données de présence');
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push reçu:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification TwoInOne',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'twoinone-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('TwoInOne', options)
  );
});

// Gestion du clic sur notification
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification cliquée:', event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
