import { useRef } from 'react';
import { useDragScroll } from '../hooks/useDragScroll';
import { useEdges } from '../hooks/useEdges';
import { useSpotlight } from '../hooks/useSpotlight';
import { useFilms } from '../hooks/useFilms';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

export default function Films() {
  const { films, source } = useFilms();
  const { t } = useLang();
  const strip = useRef<HTMLDivElement>(null);
  const { prev, next, move } = useEdges(strip);
  useDragScroll(strip);
  useSpotlight(strip, '.film');
  return (
    <div className="sub">
      <div className="sub__title">
        <h3>{t(S.about.films)}</h3>
        <span className="mono">{source === 'letterboxd' ? t(S.about.filmsLb) : t(S.about.filmsLocal)}</span>
        <div className="rail">
          <button className="rail__btn" onClick={() => move(-1)} disabled={!prev} aria-label={t(S.about.prev)}>
            ←
          </button>
          <button className="rail__btn" onClick={() => move(1)} disabled={!next} aria-label={t(S.about.next)}>
            →
          </button>
        </div>
      </div>
      <div className="films" ref={strip}>
        {films.map((f) => (
          <a
            key={f.title + f.year}
            className="film"
            href={f.url ?? '#'}
            target={f.url ? '_blank' : undefined}
            rel="noreferrer"
            draggable={false}
          >
            <div className="film__poster">
              {f.poster ? (
                <img src={f.poster} alt={f.title} loading="lazy" draggable={false} />
              ) : (
                <span className="film__title">{f.title}</span>
              )}
            </div>
            <div className="film__meta mono mono--sm">
              <span>{f.year ?? ''}</span>
              <span className="film__stars">{stars(f.rating)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function stars(rating?: number) {
  if (!rating) return '';
  return '★'.repeat(Math.floor(rating)) + (rating % 1 ? '½' : '');
}
