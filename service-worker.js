/* ==========================================
   CareMate AI - service-worker.js
   Offline Support for PWA
========================================== */

const CACHE_NAME = "caremate-ai-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

/* ========= INSTALL ========= */

self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then((cache) => {

                console.log("Caching app files...");

                return cache.addAll(FILES_TO_CACHE);

            })

    );

    self.skipWaiting();

});


/* ========= ACTIVATE ========= */

self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys()
            .then((cacheNames) => {

                return Promise.all(

                    cacheNames.map((cache) => {

                        if (cache !== CACHE_NAME) {

                            console.log(
                                "Deleting old cache:",
                                cache
                            );

                            return caches.delete(cache);

                        }

                    })

                );

            })

    );

    self.clients.claim();

});


/* ========= FETCH ========= */

self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request)
            .then((cachedResponse) => {

                if (cachedResponse) {

                    return cachedResponse;

                }

                return fetch(event.request)
                    .then((networkResponse) => {

                        return caches.open(CACHE_NAME)
                            .then((cache) => {

                                cache.put(
                                    event.request,
                                    networkResponse.clone()
                                );

                                return networkResponse;

                            });

                    })
                    .catch(() => {

                        /* Offline fallback */

                        if (
                            event.request.mode === "navigate"
                        ) {

                            return caches.match(
                                "./index.html"
                            );

                        }

                    });

            })

    );

});
