import { useEffect } from 'react';

/**
 * Regla de avance de la página. Escribe `--scroll` (0 a 1) en el documento y
 * el CSS pinta la barra: sin re-render y sin tocar el desplazamiento nativo.
 */
export default function Progress() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const max = root.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty('--scroll', String(Math.max(0, Math.min(1, value))));
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
  }, []);

  return <div className="progress" aria-hidden="true" />;
}
