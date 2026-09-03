import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { flipTheme, type Origin } from '../motion/theme-flip';

const KEY = 'tinta-nocturna';

/** Lo que pide el aparato mientras nadie haya tocado el interruptor. */
function systemPrefersNight() {
  return !window.matchMedia('(prefers-color-scheme: light)').matches;
}

/** Tinta nocturna: invierte papel y tinta. No es "dark mode": no agrega brillos. */
export function useNight() {
  const [night, setNight] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved !== null) return saved !== '0';
    } catch {
      /* sin storage, manda el aparato */
    }
    return systemPrefersNight();
  });

  // Mientras no haya elección propia, la página sigue al aparato en vivo: si
  // el teléfono cambia de tema al anochecer, la página cambia con él.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      try {
        if (localStorage.getItem(KEY) !== null) return;
      } catch {
        /* sin storage, se sigue igual */
      }
      setNight(!mq.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('night', night);
    // La clase del <html> pinta el fondo antes del primer repintado; si no se
    // mantiene en sincronía, al pasar a papel queda fondo oscuro con tinta clara.
    document.documentElement.classList.toggle('night-boot', night);
  }, [night]);

  // Sólo el interruptor deja huella: así una visita que no toca nada sigue
  // obedeciendo al aparato la próxima vez.
  //
  // flushSync obliga a que el repintado ocurra dentro de la transición: si se
  // dejara al ritmo normal de React, el navegador sacaría la foto del "antes"
  // y la del "después" con el mismo contenido y no habría nada que animar.
  const toggle = useCallback((origin?: Origin) => {
    flipTheme(() => {
      flushSync(() =>
        setNight((n) => {
          try {
            localStorage.setItem(KEY, n ? '0' : '1');
          } catch {
            /* sin storage, sin drama */
          }
          return !n;
        }),
      );
    }, origin);
  }, []);
  return { night, toggle };
}
