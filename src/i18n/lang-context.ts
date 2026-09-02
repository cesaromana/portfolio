import { createContext } from 'react';

export type Lang = 'es' | 'en';
export type Bi = { es: string; en: string };

export type LangValue = {
  lang: Lang;
  toggle: () => void;
  t: (bi: Bi) => string;
};

export const LangContext = createContext<LangValue>({
  lang: 'en',
  toggle: () => undefined,
  t: (bi) => bi.en,
});

export const bi = (es: string, en: string): Bi => ({ es, en });
