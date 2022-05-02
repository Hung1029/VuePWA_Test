// 當service worker在「安裝階段」時會觸發此事件
self.addEventListener('install', function (event) {
    self.skipWaiting();

    var offlinePage = new Request('index.html');
    var assest = ['/', './index.html', './assets/index.e4120de0.js', './favicon.ico', './manifest.json', './assets/index.66b1004a.css', './assets/vendor.1a8644e1.js', './pwa-192x192.png', './pwa-512x512.png']
    event.waitUntil(
        fetch(assest).then(function (response) {
            return caches.open('static').then(function (cache) {
                cache.addAll(assest)
                // return cache.put(assest, response);
            });
        }));
});
// 當頁面載入其他檔案資源時，觸發此事件
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                //抓不到會拿到 null
                if (response) {
                    return response;
                } else {
                    return fetch(event.request);
                }
            })
    );
});

self.addEventListener('refreshOffline', function (response) {
    return caches.open('static').then(function (cache) {
        return cache.put(offlinePage, response);
    });
});

// self.addEventListener('push', function (event) {
//     var data = event.data.json(); var opts = {
//         body: data.body,
//         icon: data.icon,
//         data: {
//             url: data.url
//         }
//     };
//     event.waitUntil(self.registration.showNotification(data.title, opts));
// });

// self.addEventListener('notificationclick', function (event) {
//     var data = event.notification.data; event.notification.close(); event.waitUntil(
//         clients.openWindow(data.url)
//     );
// });