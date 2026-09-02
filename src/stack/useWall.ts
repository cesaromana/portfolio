import { useEffect, useRef } from 'react';
import { tilt } from '../motion/tilt';
import { Wall } from './physics';

/** Corre la física del muro y coloca cada sticker (por índice) en su cuerpo. */
export function useWall(root: React.RefObject<HTMLDivElement | null>, sizes: number[]) {
  const wall = useRef(new Wall(sizes));

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const w = wall.current;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.sticker'));
    const ro = new ResizeObserver(() => w.resize(el.clientWidth, el.clientHeight));
    ro.observe(el);
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      w.step((now - last) / 1000);
      last = now;
      w.bodies.forEach((b, i) => {
        const s = items[i];
        if (s) s.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px) rotate(${b.vx * 0.04}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      w.mouse = { x: e.clientX - r.left, y: e.clientY - r.top, on: true };
    };
    const onLeave = () => {
      w.mouse.on = false;
    };
    // En teléfono la gravedad sigue la inclinación: los stickers ruedan solos.
    const offTilt = tilt.subscribe((v) => {
      w.gravity = { x: v.x * 1.1, y: 1 };
    });
    tilt.tryQuietly();
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      offTilt();
      ro.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [root]);

  return wall.current;
}
