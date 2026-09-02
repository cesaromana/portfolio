// Servidor propio: sirve el build, la señalización de PeerJS y las APIs.
//
// En producción hay un proxy con TLS real delante, así que basta un puerto
// HTTP. En la red local se puede levantar además un puerto HTTPS con
// certificado propio (HTTPS=1): sin HTTPS el teléfono no da el giroscopio.

import 'dotenv/config';
import { createServer } from 'node:http';
import { createServer as createSecureServer } from 'node:https';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import express from 'express';
import { ExpressPeerServer } from 'peer';
import letterboxd from '../api/letterboxd.js';
import spotify from '../api/spotify.js';
import { ensureCert } from './cert.js';
import { lanAddresses } from './lan.js';

const PORT = Number(process.env.PORT ?? 3000);
const HTTPS_PORT = Number(process.env.HTTPS_PORT ?? 3443);
const WANTS_HTTPS = process.env.HTTPS === '1';
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, '..', 'dist');

const app = express();
app.set('trust proxy', true);

const plain = createServer(app);
const secure = WANTS_HTTPS ? createSecureServer(await ensureCert(path.join(ROOT, '.cert')), app) : null;

// La señalización se ata al servidor que recibe la conexión, de ahí las dos rutas.
app.use('/peer', ExpressPeerServer(plain, { path: '/', proxied: true }));
if (secure) app.use('/speer', ExpressPeerServer(secure, { path: '/', proxied: true }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/lan', (_req, res) => {
  res.setHeader('cache-control', 'no-cache');
  res.json({ hosts: lanAddresses(), port: PORT, httpsPort: HTTPS_PORT, https: WANTS_HTTPS });
});
app.get('/api/letterboxd', wrap(letterboxd));
app.get('/api/spotify', wrap(spotify));

// Los assets con hash y el juego de Sonic no cambian: caché larga. El HTML siempre se revalida.
app.use('/assets', express.static(path.join(DIST, 'assets'), { immutable: true, maxAge: '1y' }));
app.use('/sonic', express.static(path.join(DIST, 'sonic'), { maxAge: '30d' }));
app.use(express.static(DIST, { maxAge: '1h', index: false, setHeaders: noCacheHtml }));
app.get('*path', (req, res) => {
  if (path.extname(req.path)) return res.status(404).end();
  res.setHeader('cache-control', 'no-cache');
  return res.sendFile(path.join(DIST, 'index.html'));
});

plain.listen(PORT, '0.0.0.0', () => announce('http', PORT));
secure?.listen(HTTPS_PORT, '0.0.0.0', () => announce('https', HTTPS_PORT));

function announce(scheme, port) {
  const hosts = ['localhost', ...lanAddresses()];
  const lines = hosts.map((h) => `  ${scheme}://${h}:${port}`).join('\n');
  process.stdout.write(`portfolio ${scheme} listo en\n${lines}\n`);
}

function noCacheHtml(res, file) {
  if (file.endsWith('.html') || file.endsWith('sw.js')) res.setHeader('cache-control', 'no-cache');
}

function wrap(handler) {
  return (req, res) =>
    Promise.resolve(handler(req, res)).catch((err) => {
      process.stderr.write(`${req.path}: ${err.message}\n`);
      if (!res.headersSent) res.status(502).json({ error: err.message });
    });
}
