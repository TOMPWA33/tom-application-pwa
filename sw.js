// Service Worker pour Simple PWA
const CACHE_NAME = 'simple-app-v1.0.0';
const STATIC_CACHE = 'simple-app-static-v1';
const DYNAMIC_CACHE = 'simple-app-dynamic-v1';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
    './',
    './index.html',
    './page2.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// Ressources à mettre en cache à la demande
const CACHE_PATTERNS = [
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    /\.(?:css|js)$/,
    /\.(?:html)$/
];

// === Installation ===
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Mise en cache des ressources statiques');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Installation terminée');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Erreur installation:', error);
            })
    );
});

// === Activation ===
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activation');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Suppression ancien cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Activation terminée');
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('❌ Erreur activation:', error);
            })
    );
});

// === Intercepter les requêtes ===
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorer les requêtes non-HTTP
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Ignorer les requêtes vers d'autres domaines (analytics, etc.)
    if (url.origin !== location.origin) {
        return;
    }
    
    // Stratégie différente selon le type de ressource
    if (request.destination === 'document') {
        // Pages HTML: Network First (toujours essayer le réseau)
        event.respondWith(handleDocumentRequest(request));
    } else if (CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        // Assets statiques: Cache First
        event.respondWith(handleAssetRequest(request));
    } else {
        // Autres requêtes: Network First
        event.respondWith(handleNetworkFirstRequest(request));
    }
});

// === Stratégie Network First pour les documents ===
async function handleDocumentRequest(request) {
    try {
        // Essayer le réseau d'abord
        const networkResponse = await fetch(request);
        
        // Si succès, mettre en cache et retourner
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('📄 Document mis en cache:', request.url);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('🌐 Réseau indisponible, utilisation du cache:', request.url);
        
        // Chercher dans le cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Page de fallback si pas en cache
        return await caches.match('./index.html') || new Response(
            createOfflinePage(),
            { 
                headers: { 'Content-Type': 'text/html' },
                status: 200 
            }
        );
    }
}

// === Stratégie Cache First pour les assets ===
async function handleAssetRequest(request) {
    // Chercher d'abord dans le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        console.log('📦 Asset servi depuis le cache:', request.url);
        return cachedResponse;
    }
    
    try {
        // Si pas en cache, aller sur le réseau
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Mettre en cache pour les prochaines fois
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('📥 Asset mis en cache:', request.url);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('❌ Asset non disponible:', request.url);
        
        // Retourner une image placeholder pour les images
        if (request.destination === 'image') {
            return new Response(
                createPlaceholderImage(),
                { headers: { 'Content-Type': 'image/svg+xml' } }
            );
        }
        
        // Retourner une erreur générique pour les autres assets
        return new Response('Asset non disponible', { status: 404 });
    }
}

// === Stratégie Network First générique ===
async function handleNetworkFirstRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Mettre en cache si succès
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        // Fallback vers le cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Fallback cache pour:', request.url);
            return cachedResponse;
        }
        
        throw error;
    }
}

// === Page hors ligne ===
function createOfflinePage() {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hors ligne - Simple App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #EDEDED 0%, #DBDBDB 100%);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #222;
        }
        .offline-container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            margin: 20px;
        }
        .offline-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        .offline-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #F2A021;
        }
        .offline-message {
            margin-bottom: 25px;
            line-height: 1.6;
            color: #444;
        }
        .retry-btn {
            background-color: #2EAB9B;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .retry-btn:hover {
            background-color: #259085;
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📡</div>
        <h1 class="offline-title">Mode Hors Ligne</h1>
        <p class="offline-message">
            Vous êtes actuellement hors ligne. Cette page sera disponible dès que votre connexion sera rétablie.
        </p>
        <button class="retry-btn" onclick="window.location.reload()">
            Réessayer
        </button>
    </div>
</body>
</html>
    `;
}

// === Image placeholder ===
function createPlaceholderImage() {
    return `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#EDEDED" stroke="#DBDBDB" stroke-width="2"/>
    <text x="100" y="100" font-family="Arial, sans-serif" font-size="14" 
          text-anchor="middle" dominant-baseline="middle" fill="#888">
        Image non disponible
    </text>
    <circle cx="100" cy="80" r="15" fill="#F2A021" opacity="0.7"/>
    <rect x="85" y="120" width="30" height="4" fill="#2EAB9B" opacity="0.7"/>
</svg>
    `;
}

// === Gestion des messages ===
self.addEventListener('message', (event) => {
    const { data } = event;
    
    switch (data.type) {
        case 'SKIP_WAITING':
            console.log('⏩ Activation forcée du nouveau Service Worker');
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAR_CACHE':
            clearOldCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        default:
            console.log('📨 Message reçu:', data);
    }
});

// === Nettoyage du cache ===
async function clearOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        name !== STATIC_CACHE && name !== DYNAMIC_CACHE
    );
    
    return Promise.all(
        oldCaches.map(cacheName => {
            console.log('🗑️ Suppression cache:', cacheName);
            return caches.delete(cacheName);
        })
    );
}

// === Gestion des notifications push (optionnel) ===
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'Nouvelle notification',
        icon: './icons/icon-192x192.png',
        badge: './icons/icon-192x192.png',
        tag: data.tag || 'simple-app',
        renotify: true,
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: 'Ouvrir'
            },
            {
                action: 'close',
                title: 'Fermer'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Simple App', options)
    );
});

// === Gestion des clics sur notifications ===
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// === Logs de démarrage ===
console.log('🎯 Service Worker chargé - Version:', CACHE_NAME);
console.log('📦 Ressources statiques à mettre en cache:', STATIC_ASSETS.length);
console.log('🔄 Patterns de cache dynamique:', CACHE_PATTERNS.length);