import { useContext } from 'react';
import { LangContext } from './lang-context';

export function useLang() {
  return useContext(LangContext);
}
