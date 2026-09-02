import { useEffect } from 'react';

/**
 * Entrada de viñetas por barrido lateral. Marca `.is-in` cuando el elemento
 * entra al viewport; el stagger sale del atributo data-stagger (ms).
 */
export function useReveal(root: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const scope = root.current ?? document;
    const items = Array.from(scope.querySelectorAll<HTMLElement>('.reveal'));
    if (items.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.style.setProperty('--stagger', `${el.dataset.stagger ?? 0}ms`);
          el.classList.add('is-in');
          io.unobserve(el);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
