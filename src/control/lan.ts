type Lan = { hosts: string[]; port: number; httpsPort: number; secure: boolean };

let cache: Lan | null = null;

function isLoopback(host: string) {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

/**
 * Origen al que el teléfono sí puede llegar. Si la página está abierta en
 * localhost, el QR con esa dirección apuntaría al propio teléfono, así que se
 * pregunta al servidor por su IP en la red local.
 */
export async function reachableOrigin(): Promise<string> {
  const here = window.location;
  if (!isLoopback(here.hostname)) return here.origin;
  try {
    cache = cache ?? ((await (await fetch('/api/lan')).json()) as Lan);
    const host = cache.hosts[0];
    if (!host) return here.origin;
    const isHttps = here.protocol === 'https:';
    return isHttps ? `https://${host}:${cache.httpsPort}` : `http://${host}:${cache.port}`;
  } catch {
    return here.origin;
  }
}

/** URL segura equivalente, para avisar cuando el giroscopio no va a funcionar. */
export async function secureOrigin(): Promise<string | null> {
  const here = window.location;
  if (here.protocol === 'https:') return null;
  try {
    cache = cache ?? ((await (await fetch('/api/lan')).json()) as Lan);
    const host = isLoopback(here.hostname) ? cache.hosts[0] : here.hostname;
    return host ? `https://${host}:${cache.httpsPort}` : null;
  } catch {
    return null;
  }
}
