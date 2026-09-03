import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const LERP = 0.42;
const TARGETS = 'a, button, [data-target]';

/**
 * Cursor propio: un cuadrado que sigue al mouse con retardo y crece sobre los
 * enlaces. Se invierte contra lo que tenga debajo, así que se cuelga del body
 * y no de #root: dentro de #root la mezcla sólo ve lo que se pinta ahí, y el
 * fondo de la página se pinta por fuera. Ahí el cuadrado quedaba blanco sobre
 * el papel, que es justo cuando hace falta que se vea.
 */
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = { x: -100, y: -100, tx: -100, ty: -100, raf: 0 };

    const onMove = (e: MouseEvent) => {
      state.tx = e.clientX;
      state.ty = e.clientY;
      node.classList.toggle('is-over', Boolean((e.target as Element | null)?.closest?.(TARGETS)));
    };
    const onDown = () => node.classList.add('is-down');
    const onUp = () => node.classList.remove('is-down');
    const draw = () => {
      const k = isReduced ? 1 : LERP;
      state.x += (state.tx - state.x) * k;
      state.y += (state.ty - state.y) * k;
      node.style.transform = `translate(${state.x}px, ${state.y}px)`;
      state.raf = requestAnimationFrame(draw);
    };

    document.body.classList.add('has-cursor');
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    state.raf = requestAnimationFrame(draw);
    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(state.raf);
    };
  }, []);

  return createPortal(<div ref={el} className="cursor" aria-hidden="true" />, document.body);
}
