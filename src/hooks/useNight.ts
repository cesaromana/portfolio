import { useCallback, useEffect, useRef, useState } from 'react';
import { flipTheme, type Origin } from '../motion/theme-flip';

const KEY = 'tinta-nocturna';

/** Lo que pide el aparato mientras nadie haya tocado el interruptor. */
function systemPrefersNight() {
  return !window.matchMedia('(prefers-color-scheme: light)').matches;
}

/**
 * Pinta el tema tocando las clases y nada más. La del <html> pinta el fondo
 * antes del primer repintado; si no se mantiene en sincronía, al pasar a papel
 * queda fondo oscuro con tinta clara.
 */
function paint(night: boolean) {
  document.body.classList.toggle('night', night);
  document.documentElement.classList.toggle('night-boot', night);
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

  // El valor vive también en una referencia porque el estado de React llega
  // tarde a propósito: dos toques seguidos leerían el mismo.
  const current = useRef(night);

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
      current.current = !mq.matches;
      setNight(current.current);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    paint(night);
  }, [night]);

  // El interruptor pinta a mano y avisa a React después, cuando la mancha ya
  // terminó. Antes se forzaba el repintado de React dentro de la transición y
  // en el teléfono eso bloqueaba el hilo un tercio de segundo: la animación
  // arrancaba, se trancaba, y el color aparecía de golpe al final.
  const toggle = useCallback((origin?: Origin) => {
    const next = !current.current;
    current.current = next;
    try {
      // Sólo el interruptor deja huella: una visita que no toca nada sigue
      // obedeciendo al aparato la próxima vez.
      localStorage.setItem(KEY, next ? '1' : '0');
    } catch {
      /* sin storage, sin drama */
    }
    void flipTheme(() => paint(next), next, origin).then(() => setNight(next));
  }, []);

  return { night, toggle };
}
