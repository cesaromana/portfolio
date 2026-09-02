import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LangContext, type Bi, type Lang } from './lang-context';

const KEY = 'idioma';
const SWAP_MS = 220;

function readLang(): Lang {
  try {
    return localStorage.getItem(KEY) === 'es' ? 'es' : 'en';
  } catch {
    return 'en';
  }
}

/** Inglés por defecto; un clic cambia a español. El cambio hace un fundido corto. */
export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* sin storage */
    }
  }, [lang]);

  const toggle = useCallback(() => {
    document.body.classList.add('is-swapping');
    window.setTimeout(() => {
      setLang((l) => (l === 'es' ? 'en' : 'es'));
      window.setTimeout(() => document.body.classList.remove('is-swapping'), SWAP_MS);
    }, SWAP_MS);
  }, []);

  const value = useMemo(() => ({ lang, toggle, t: (b: Bi) => b[lang] }), [lang, toggle]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
