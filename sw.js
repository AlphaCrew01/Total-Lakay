// sw.js - Service Worker pour Total Lakay
// Version: 2026-06-03-v1 (Avec versioning & cache-busting)

const VERSION = '2026-06-03-v1';
const CACHE_NAME = `total-lakay-${VERSION}`;
const RUNTIME_CACHE = `total-lakay-runtime-${VERSION}`;
const ASSET_CACHE = `total-lakay-assets-${VERSION}`;

const urlsToCache = [
  './',
  'index.html?v=' + VERSION,
  'app.js?v=' + VERSION,
  'style.css?v=' + VERSION,
  'logo.jpeg',
  'manifest.json?v=' + VERSION
];

// URLs qui ne doivent JAMAIS être cachées (toujours réseau)
const NETWORK_ONLY = [
  'firestore',
  'googleapis',
  'firebase',
  'moncash',
  'api.mymemory'
];

// Installation du Service Worker avec skip waiting
self.addEventListener('install', event => {
  console.log(`🔧 Service Worker: Installation v${VERSION}`);
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('📦 Mise en cache des ressources');
          return cache.addAll(urlsToCache);
        }),
      caches.open(ASSET_CACHE)
    ])
    .then(() => {
      console.log('✅ Cache installation complétée');
      return self.skipWaiting();
    })
  );
});

// Activation et nettoyage AGRESSIF des anciens caches
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Activé (nettoyage en cours)');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        const oldCaches = cacheNames.filter(cache => {
          // Supprimer TOUS les anciens caches
          return !cache.includes(VERSION);
        });
        
        console.log(`🗑️ Suppression de ${oldCaches.length} ancien(s) cache(s)`);
        return Promise.all(
          oldCaches.map(cache => {
            console.log('  - Suppression:', cache);
            return caches.delete(cache);
          })
        );
      })
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll())
      .then(clients => {
        // Notifier tous les clients qu'une mise à jour est disponible
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATE_AVAILABLE',
            version: VERSION
          });
        });
      })
  );
});

// Stratégie intelligente: Network-First pour HTML/JS/CSS, Cache-First pour assets
self.addEventListener('fetch', event => {
  const url = event.request.url;
  const method = event.request.method;
  
  // Ignorer les requêtes non-GET
  if (method !== 'GET') return;
  
  // Ne PAS intercepter les requêtes API/Firebase
  if (NETWORK_ONLY.some(pattern => url.includes(pattern))) {
    return;
  }
  
  // Déterminer si c'est un document HTML, script, ou style
  const isDocument = event.request.mode === 'navigate';
  const isScript = url.includes('.js');
  const isStyle = url.includes('.css');
  
  // Pour HTML/JS/CSS: Network-First (réseau en priorité, sinon cache)
  if (isDocument || isScript || isStyle) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Valider la réponse
          if (!response || response.status !== 200 || response.type === 'error') {
            return caches.match(event.request);
          }
          
          // Cloner et mettre en cache
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          // Erreur réseau: utiliser le cache
          return caches.match(event.request)
            .then(response => response || new Response('Hors ligne', { status: 503 }));
        })
    );
  } else {
    // Pour les images/assets: Cache-First
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) return response;
          
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200) return response;
              
              const responseToCache = response.clone();
              caches.open(ASSET_CACHE)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // Image par défaut en cas d'erreur
              if (url.includes('.svg') || url.includes('placeholder')) {
                return new Response('<svg></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
              }
              return new Response('Ressource indisponible', { status: 404 });
            });
        })
    );
  }
});

// Message handler: Permettre au client de forcer la mise à jour
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SW_SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Tâche périodique: Vérifier les mises à jour (background sync)
self.addEventListener('sync', event => {
  if (event.tag === 'check-for-updates') {
    event.waitUntil(
      fetch('manifest.json?t=' + Date.now())
        .then(response => response.json())
        .then(manifest => {
          console.log('✅ Vérification mise à jour:', manifest.version || VERSION);
        })
    );
  }
});
