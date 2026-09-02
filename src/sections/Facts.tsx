import { ageFrom, profile } from '../data/profile';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

/** Ficha con los datos duros, al lado de la presentación. */
export default function Facts() {
  const { t } = useLang();
  const age = ageFrom(profile.born);

  const rows = [
    [t(S.facts.base), t(profile.city)],
    [t(S.facts.born), `${t(S.facts.bornOn)} · ${age} ${t(S.hero.years)}`],
    [t(S.facts.degree), t(S.facts.degreeValue)],
    [t(S.facts.now), t(S.facts.nowValue)],
    [t(S.facts.focus), t(S.facts.focusValue)],
    [t(S.facts.boss), profile.cat],
  ];

  return (
    <dl className="facts">
      {rows.map(([label, value]) => (
        <div className="facts__row" key={label}>
          <dt className="mono mono--sm">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
