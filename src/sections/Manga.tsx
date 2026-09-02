import { useRef } from 'react';
import { mangas } from '../data/media';
import { useSpotlight } from '../hooks/useSpotlight';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import Cover from './Cover';

export default function Manga() {
  const { t } = useLang();
  const shelf = useRef<HTMLDivElement>(null);
  useSpotlight(shelf, '.cover');

  return (
    <div className="sub">
      <div className="sub__title">
        <h3>{t(S.about.manga)}</h3>
        <span className="mono">{t(S.about.mangaSub)}</span>
      </div>
      <div className="shelf" ref={shelf}>
        {mangas.map((m) => (
          <figure key={m.title} className="cover" style={{ ['--tilt' as string]: `${m.tilt}deg` }}>
            <Cover item={m} />
            <figcaption className="cover__tag mono mono--sm">{m.since}</figcaption>
            <span className="cover__name">{m.title}</span>
          </figure>
        ))}
      </div>
      <p className="sub__note">{t(S.about.mangaNote)}</p>
    </div>
  );
}
