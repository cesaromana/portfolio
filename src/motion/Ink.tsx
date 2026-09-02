import { useEffect } from 'react';

const LIFE_MS = 520;
// Superficies de juego: ahí el toque es del juego, no de la página.
const SKIP = 'canvas, .arcade__stage, .gameboy, .thumbs';

/**
 * Respuesta al toque: donde cae el dedo se imprime un cuadro de tinta que se
 * abre y desaparece. Es la contraparte táctil del cursor del escritorio.
 */
export default function Ink() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      if ((e.target as Element | null)?.closest?.(SKIP)) return;
      const dot = document.createElement('span');
      dot.className = 'ink-splat';
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      document.body.appendChild(dot);
      window.setTimeout(() => dot.remove(), LIFE_MS);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  return null;
}
