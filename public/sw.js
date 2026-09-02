// Caché para que la página abra al instante sin llenar el teléfono.
// Regla: se guarda lo pequeño y repetido (shell, assets con hash, fuentes,
// portadas). Lo pesado del juego (música y sonidos, ~16 MB) se deja al caché
// normal del navegador, que ya lo sirve con max-age largo.

const VERSION = 'v2';
const SHELL = `shell-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;

// Máximo de entradas del caché de ejecución; por encima se tiran las viejas.
const RUNTIME_MAX = 60;

const CACHEABLE = [/\/assets\//, /fonts\.gstatic\.com/, /fonts\.googleapis\.com/, /anilist\.co/, /skillicons\.dev/, /iconify\.design/, /ltrbxd\.com/];
// Nada de esto entra al caché: pesa mucho o cambia siempre.
const NEVER = [/\/sonic\/data\/(music|samples)\//, /\/api\//, /\/peer/, /\/speer/];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(['/', '/index.html'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => ![SHELL, RUNTIME].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (NEVER.some((rx) => rx.test(req.url))) return;
  if (req.mode === 'navigate') return e.respondWith(networkFirst(req));
  if (CACHEABLE.some((rx) => rx.test(req.url))) return e.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(RUNTIME);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') {
    await cache.put(req, res.clone());
    trim(cache);
  }
  return res;
}

async function networkFirst(req) {
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(req);
    cache.put('/index.html', res.clone());
    return res;
  } catch {
    return (await cache.match('/index.html')) || Response.error();
  }
}

/** Deja el caché en su tamaño máximo, quitando lo más antiguo. */
async function trim(cache) {
  const keys = await cache.keys();
  const extra = keys.length - RUNTIME_MAX;
  for (let i = 0; i < extra; i++) await cache.delete(keys[i]);
}
