import { useEffect } from 'react';

// Banda central de la pantalla: lo que entra ahí queda "en foco".
const BAND = '-42% 0px -42% 0px';

/**
 * En pantallas táctiles no hay hover, así que el foco lo da el scroll: el
 * elemento que cruza el centro de la pantalla recibe `.is-focus`.
 */
export function useSpotlight(root: React.RefObject<HTMLElement | null>, selector: string) {
  useEffect(() => {
    if (window.matchMedia('(hover: hover)').matches) return;
    const scope = root.current;
    if (!scope) return;

    const items = Array.from(scope.querySelectorAll<HTMLElement>(selector));
    if (items.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-focus', e.isIntersecting)),
      { rootMargin: BAND, threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root, selector]);
}
