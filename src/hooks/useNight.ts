import { useCallback, useEffect, useState } from 'react';

const KEY = 'tinta-nocturna';

/** Tinta nocturna: invierte papel y tinta. No es "dark mode": no agrega brillos. */
export function useNight() {
  const [night, setNight] = useState<boolean>(() => {
    try {
      return localStorage.getItem(KEY) !== '0';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.body.classList.toggle('night', night);
    // La clase del <html> pinta el fondo antes del primer repintado; si no se
    // mantiene en sincronía, al pasar a papel queda fondo oscuro con tinta clara.
    document.documentElement.classList.toggle('night-boot', night);
    try {
      localStorage.setItem(KEY, night ? '1' : '0');
    } catch {
      /* sin storage, sin drama */
    }
  }, [night]);

  const toggle = useCallback(() => setNight((n) => !n), []);
  return { night, toggle };
}
