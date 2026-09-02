import { useEffect, useState } from 'react';
import { filmsFallback, type Film } from '../data/media';

type Source = 'letterboxd' | 'local';

/** Lee el diario de Letterboxd vía /api/letterboxd; si no hay, usa la lista local. */
export function useFilms() {
  const [films, setFilms] = useState<Film[]>(filmsFallback);
  const [source, setSource] = useState<Source>('local');

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/letterboxd', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((list: Film[]) => {
        if (!Array.isArray(list) || list.length === 0) return;
        setFilms(list);
        setSource('letterboxd');
      })
      .catch(() => setSource('local'));
    return () => ctrl.abort();
  }, []);

  return { films, source };
}
