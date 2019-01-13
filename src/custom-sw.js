
// See https://developers.google.com/web/tools/workbox/guides/configure-workbox
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('push', event => {
  const { title, text } = JSON.parse(event.data.text());
  self.registration.showNotification(title, {
    body: text,
    icon: 'http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png',
  })
})

// Cache 3rd party assets
workbox.routing.registerRoute(
  new RegExp('https:.*min\.(css|js)'),
  workbox.strategies.staleWhileRevalidate() // Use cache during request, cache updated on success
);

// Cache API calls
workbox.routing.registerRoute(
  new RegExp('http://.*:4567.*\.json'),
  workbox.strategies.networkFirst() // Use cache if request fails
);

// We need this in Webpack plugin (refer to swSrc option): https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// app-shell
workbox.routing.registerRoute("/", workbox.strategies.networkFirst());
