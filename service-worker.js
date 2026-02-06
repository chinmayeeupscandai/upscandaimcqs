const CACHE_NAME = "upsc-ai-v3"; // Incremented version

const FILES_TO_CACHE = [
  "./",
  "index.html",
  "manifest.json",
  "logo-192.png",
  "logo-512.png"
];

// Install - Caches the essential files
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Using cache.addAll with individual error catching for safety
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate - Cleans up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch - Strategy: Cache First, then Network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Optional: return a fallback page if network fails
      });
    })
  );
});
