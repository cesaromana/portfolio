import { ageFrom, heroBalloon, profile } from '../data/profile';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import KineticLines from './KineticLines';

/** Nombre letra por letra: cada glifo se desregistra solo al pasar el mouse. */
function Glyphs({ word }: { word: string }) {
  return (
    <span className="glyphs">
      {Array.from(word).map((ch, i) => (
        <span key={i} className="glyph" style={{ ['--i' as string]: i }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { t } = useLang();
  const age = ageFrom(profile.born);
  return (
    <section id="inicio" className="hero page" data-section>
      <KineticLines />
      <h1 className="hero__name" aria-label={profile.name.join(' ')}>
        <Glyphs word={profile.name[0]} />
        <Glyphs word={profile.name[1]} />
      </h1>

      <aside className="hero__balloon balloon">
        {heroBalloon.map((line) => (
          <p key={line.es}>{t(line)}</p>
        ))}
      </aside>

      <div className="hero__foot mono">
        <span>
          {t(profile.city)} · {age} {t(S.hero.years)} · {t(S.hero.foot1)}
        </span>
        <span>{t(S.hero.foot2)}</span>
      </div>
    </section>
  );
}
