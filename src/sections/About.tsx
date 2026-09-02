import { useRef } from 'react';
import { aboutText } from '../data/profile';
import { useReveal } from '../hooks/useReveal';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import Anime from './Anime';
import Films from './Films';
import Manga from './Manga';
import Music from './Music';
import Oikawa from './Oikawa';
import Series from './Series';
import Sonic from './Sonic';

/** Doble página: filas de distinto peso, no dos columnas rígidas. */
export default function About() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLang();
  useReveal(root);

  return (
    <section id="sobre-mi" className="section page" ref={root} data-section>
      <div className="section__head">
        <h2>{t(S.about.title)}</h2>
        <span className="mono">{t(S.about.sub)}</span>
      </div>

      <div className="spread">
        <div className="spread__row reveal">
          <div className="balloon balloon--wide">
            {aboutText.map((p, i) => (
              <p key={p.es} style={{ marginTop: i ? 12 : 0 }}>
                {t(p)}
              </p>
            ))}
          </div>
        </div>

        <div className="spread__row reveal">
          <Films />
        </div>

        <div className="spread__row spread__row--split">
          <div className="reveal">
            <Sonic />
          </div>
          <div className="reveal" data-stagger="60">
            <Music />
          </div>
        </div>

        <div className="spread__row spread__row--split spread__row--even">
          <div className="reveal">
            <Manga />
          </div>
          <div className="reveal" data-stagger="60">
            <Anime />
          </div>
        </div>

        <div className="spread__row reveal">
          <Series />
        </div>
      </div>

      <Oikawa />
    </section>
  );
}
