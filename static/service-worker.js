const CACHE = 'smritisaathi-shell-v5-room-camera-20260914';
const SHELL = ['/', '/index.html', '/app.jsx', '/manifest.json'];
self.addEventListener('install', event => { console.log('SmritiSaathi service worker installing', CACHE); event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { console.log('SmritiSaathi service worker active', CACHE); event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('smritisaathi-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    if (new URL(event.request.url).origin === location.origin) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => caches.match('/index.html'))));
});
// The page owns authenticated replay (so it can attach the current JWT). This tag wakes it on reconnect.
self.addEventListener('sync', event => { if (event.tag === 'smritisaathi-sync') event.waitUntil(self.clients.matchAll({includeUncontrolled:true}).then(cs => cs.forEach(c => c.postMessage({type:'FLUSH_SYNC_QUEUE'})))); });
