import { useRef } from 'react';
import { series } from '../data/media';
import { useSpotlight } from '../hooks/useSpotlight';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

/** Series sin portada: puro listado tipográfico, a todo lo ancho. */
export default function Series() {
  const { t } = useLang();
  const root = useRef<HTMLDivElement>(null);
  useSpotlight(root, '.series li');

  return (
    <div className="sub" ref={root}>
      <div className="sub__title">
        <h3>{t(S.about.series)}</h3>
        <span className="mono">{t(S.about.seriesSub)}</span>
      </div>
      <ul className="series">
        {series.map((s) => (
          <li key={s.title}>
            <b>{s.title}</b>
            <span className="mono mono--sm">{s.years}</span>
            <em>{t(s.note)}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
