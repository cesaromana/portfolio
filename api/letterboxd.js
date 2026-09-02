// Proxy del RSS público de Letterboxd. LETTERBOXD_USER en .env cambia el usuario.
// Letterboxd no manda cabeceras CORS, así que el navegador no puede leerlo directo.

const DEFAULT_USER = 'csarr911';
const MAX_ITEMS = 12;
const CACHE_SECONDS = 3600;

// Caché en memoria: el servidor propio no tiene CDN delante, así que se guarda aquí una hora.
const memo = { at: 0, user: '', films: [] };

export default async function handler(req, res) {
  const user = process.env.LETTERBOXD_USER || DEFAULT_USER;
  const isFresh = memo.user === user && Date.now() - memo.at < CACHE_SECONDS * 1000;
  if (isFresh) {
    res.setHeader('cache-control', `public, max-age=${CACHE_SECONDS}`);
    return res.status(200).json(memo.films);
  }

  const upstream = await fetch(`https://letterboxd.com/${encodeURIComponent(user)}/rss/`, {
    headers: { 'user-agent': 'cesaromana-portfolio/1.0' },
  });
  if (!upstream.ok) return res.status(502).json({ error: `Letterboxd respondió ${upstream.status}` });

  const xml = await upstream.text();
  const films = parse(xml).slice(0, MAX_ITEMS);
  Object.assign(memo, { at: Date.now(), user, films });
  res.setHeader('cache-control', `public, max-age=${CACHE_SECONDS}, stale-while-revalidate`);
  return res.status(200).json(films);
}

function parse(xml) {
  const items = xml.split('<item>').slice(1);
  return items.map(itemToFilm).filter((f) => f.title);
}

function itemToFilm(item) {
  const tag = (name) => {
    const m = item.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`));
    return m ? m[1].trim() : undefined;
  };
  const rating = tag('letterboxd:memberRating');
  const poster = (tag('description') ?? '').match(/<img[^>]+src="([^"]+)"/)?.[1];
  return {
    title: tag('letterboxd:filmTitle'),
    year: tag('letterboxd:filmYear'),
    rating: rating ? Number(rating) : undefined,
    poster,
    url: tag('link'),
  };
}
