import { useRef, useState } from 'react';
import { animes } from '../data/media';
import { useSpotlight } from '../hooks/useSpotlight';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import Cover from './Cover';

/** Anime y series: las portadas se voltean al pasar el mouse o al tocarlas. */
export default function Anime() {
  const { t } = useLang();
  const rack = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  useSpotlight(rack, '.flip');

  return (
    <div className="sub">
      <div className="sub__title">
        <h3>{t(S.about.anime)}</h3>
        <span className="mono">{t(S.about.animeSub)}</span>
      </div>

      <div className="flips" ref={rack}>
        {animes.map((a) => (
          <button
            key={a.title}
            type="button"
            className={`flip${open === a.title ? ' is-open' : ''}`}
            style={{ ['--tilt' as string]: `${a.tilt}deg` }}
            onClick={() => setOpen((cur) => (cur === a.title ? null : a.title))}
            aria-label={a.title}
          >
            <span className="flip__inner">
              <span className="flip__face flip__front">
                <Cover item={a} />
              </span>
              <span className="flip__face flip__back">
                <b>{a.title}</b>
                <span className="mono mono--sm">{a.since}</span>
                <em>{a.note ? t(a.note) : ''}</em>
              </span>
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
