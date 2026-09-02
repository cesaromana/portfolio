import { useState } from 'react';
import { S } from './strings';
import { useLang } from './useLang';

/** Interruptor de idioma: bloque de tinta que se desliza, sin tooltip del navegador. */
export default function LangSwitch() {
  const { lang, toggle, t } = useLang();
  const [isHot, setHot] = useState(false);

  return (
    <div className="lang" onPointerEnter={() => setHot(true)} onPointerLeave={() => setHot(false)}>
      <button
        className={`lang__btn lang__btn--${lang}`}
        onClick={toggle}
        aria-label={t(S.top.langTitle)}
        aria-pressed={lang === 'en'}
      >
        <span className="lang__slide" aria-hidden="true" />
        <span className={`lang__opt${lang === 'es' ? ' is-on' : ''}`}>ES</span>
        <span className={`lang__opt${lang === 'en' ? ' is-on' : ''}`}>EN</span>
      </button>
      <span className={`lang__tip mono mono--sm${isHot ? ' is-in' : ''}`} aria-hidden="true">
        {t(S.top.langTitle)}
      </span>
    </div>
  );
}
