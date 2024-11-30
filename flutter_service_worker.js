'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "62bb94095b0ec522240abb8a938a1b06",
"assets/AssetManifest.bin.json": "3aab239ef40e672b049bb7378247ad77",
"assets/AssetManifest.json": "5ce6792314973d60226b8e8cc4979ea4",
"assets/assets/fonts/SFProDisplay-Regular.ttf": "d09549c1ab4a5947a007561521e45da3",
"assets/assets/icons/arrow-right-circle.svg": "1fbadc5ff0e805d918a27e48cb174046",
"assets/assets/icons/bell.svg": "f9747e8fa0bfbccd0f62803e17707d8c",
"assets/assets/icons/bell_darkmode.svg": "0412ea1129e7fee3c5e86454366e5a7a",
"assets/assets/icons/bell_white.svg": "22ba1859d82d12163a9f2a3c6e6528d6",
"assets/assets/icons/calendar.svg": "3391dd8137436a413bf49c57c60dc67e",
"assets/assets/icons/calendar_white.svg": "525bb17912bbf29867c9ea8d861f0aca",
"assets/assets/icons/map-pin.svg": "5383e623ee2b8903703608d0a2ef7373",
"assets/assets/icons/map.svg": "a810e8ba9afbeb1266c69e0cbdb22fd4",
"assets/assets/icons/map_white.svg": "077425c3dcd6686c4a728554a0497d23",
"assets/assets/icons/plus.svg": "ba6e2f2e8a501dd677e480ba1bce882d",
"assets/assets/icons/plus_sidemenu.svg": "2e8a440fd5e763aec722cdcb3bf447da",
"assets/assets/icons/search.svg": "a2b4aa2f767fcca0e426453cf9c88251",
"assets/assets/icons/sliders.svg": "67db782c4c97e4017b8e1949a4bf6cdb",
"assets/assets/icons/star.svg": "217a7954c6f8505530e5b701fea23c4b",
"assets/assets/icons/star_white.svg": "7a9f79904fdb5917c98644595d880171",
"assets/assets/icons/user.svg": "df35f4de93ca0764fad4fd19dfa3dd25",
"assets/assets/icons/users.svg": "7e578b69495c9bdc8834b989e009258b",
"assets/assets/icons/users_white.svg": "3fc7038e956dce5cf666863e25332fd5",
"assets/assets/images/logo.png": "831c3e70416ad2d84b0e0716bd85df6a",
"assets/assets/images/profile.png": "37672e4ab87930dcbac14c237a691c7c",
"assets/assets/images/Profiles.png": "84fa197c8e5bb5201cec558f11fa016e",
"assets/assets/images/Rectangle%252032.png": "c9df61e36e264432cf7044f8b1743d3e",
"assets/FontManifest.json": "cb363f1a194d641a045047a542b98240",
"assets/fonts/MaterialIcons-Regular.otf": "427fb191122b6425b02ca602773b190d",
"assets/NOTICES": "16e193e46ce721acb125f615394e8bc4",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "9c6dbc99ceff296f183c2b440531b97a",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "9ac2e8da1ca52a355c506ee56104c278",
"/": "9ac2e8da1ca52a355c506ee56104c278",
"main.dart.js": "a68a82aefdbe565ae02ccee81b6cbddf",
"manifest.json": "2a1e162656faced3d9c40f23d9de2c3b",
"version.json": "1e44237845b201b86c2841ece9a12afb"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
