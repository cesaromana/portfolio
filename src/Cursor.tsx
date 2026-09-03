import { useEffect, useRef } from 'react';

const LERP = 0.42;
const TARGETS = 'a, button, [data-target]';

/** Cursor propio: un cuadrado de tinta roja que sigue al mouse con retardo y crece sobre los enlaces. */
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

  return <div ref={el} className="cursor" aria-hidden="true" />;
}
