import { useEffect } from 'react';

/**
 * Escribe en el elemento la variable `--p` (0 a 1) según su avance por la
 * pantalla. No re-renderiza: la animación vive en CSS.
 */
export function useProgress(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = window.innerHeight + r.height;
      const p = span > 0 ? 1 - (r.bottom / span) : 0;
      el.style.setProperty('--p', String(Math.max(0, Math.min(1, p))));
    };
    const schedule = () => {
      if (raf === 0) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref]);
}
