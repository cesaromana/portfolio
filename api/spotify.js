// "Sonando ahora" real desde Spotify. Necesita en Vercel:
// SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET y SPOTIFY_REFRESH_TOKEN
// (Authorization Code una sola vez con scope user-read-currently-playing).
// Sin esas variables responde 404 y la página usa el embed público.

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const CACHE_SECONDS = 30;

export default async function handler(req, res) {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) return res.status(404).json({ error: 'Spotify no configurado' });

  const token = await accessToken(id, secret, refresh);
  const now = await fetch(NOW_URL, { headers: { authorization: `Bearer ${token}` } });
  res.setHeader('cache-control', `s-maxage=${CACHE_SECONDS}`);
  if (now.status === 204 || now.status > 299) return res.status(200).json({ isPlaying: false });

  const body = await now.json();
  const item = body.item;
  return res.status(200).json({
    isPlaying: body.is_playing,
    title: item?.name,
    artist: item?.artists?.map((a) => a.name).join(', '),
    album: item?.album?.name,
    cover: item?.album?.images?.[0]?.url,
    url: item?.external_urls?.spotify,
    trackId: item?.id,
  });
}

async function accessToken(id, secret, refresh) {
  const basic = Buffer.from(`${id}:${secret}`).toString('base64');
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { authorization: `Basic ${basic}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  });
  if (!r.ok) throw new Error(`Spotify token ${r.status}`);
  const json = await r.json();
  return json.access_token;
}
