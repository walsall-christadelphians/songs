const CACHE = 'hymnbook-v52';
// Recordings live in their own cache so app updates don't throw away downloaded audio
const AUDIO = 'hymnbook-audio';
// Sheet music saved by "Save for offline" (or when first viewed) also survives app updates
const MEDIA = 'hymnbook-media';
const CORE = ['./', 'index.html', 'songs.json', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-180.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== AUDIO && k !== MEDIA).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Audio players ask for byte ranges, so keep the whole file in the cache and answer ranges from it
async function audioResponse(req) {
  const cache = await caches.open(AUDIO);
  let res = await cache.match(req.url);
  if (!res) {
    res = await fetch(req.url);
    if (!res.ok) return res;
    await cache.put(req.url, res.clone());
  }
  const range = req.headers.get('range');
  if (!range) return res;
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  let start = m[1] ? +m[1] : 0;
  let end = m[2] ? Math.min(+m[2], size - 1) : size - 1;
  if (!m[1] && m[2]) { start = size - +m[2]; end = size - 1; }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg',
      'Accept-Ranges': 'bytes'
    }
  });
}

// Pages and song data: network first so updates show straight away, cache when offline.
// Recordings, sheet music and icons: cache first, saved the first time they are used.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.includes('/audio/')) { e.respondWith(audioResponse(req).catch(() => fetch(req))); return; }
  if (req.headers.has('range')) return;
  if (url.pathname.includes('/music/')) {
    e.respondWith(caches.match(req.url).then(hit => hit || fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(MEDIA).then(c => c.put(req.url, copy)); } return res; })));
    return;
  }
  const fresh = req.mode === 'navigate' || /\.(html|json|js|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');
  const save = res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };
  if (fresh) {
    e.respondWith(fetch(req.url, {cache: 'no-cache'}).then(save).catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match('index.html'))));
  } else {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(save)));
  }
});
