import { useCallback, useEffect, useState } from 'react';

const SLACK = 4;

/** Sabe si una tira horizontal puede desplazarse a un lado u otro. */
export function useEdges(ref: React.RefObject<HTMLElement | null>) {
  const [edges, setEdges] = useState({ prev: false, next: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ prev: el.scrollLeft > SLACK, next: el.scrollLeft < max - SLACK });
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener('scroll', measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', measure);
    };
  }, [ref, measure]);

  const move = useCallback(
    (dir: -1 | 1) => {
      const el = ref.current;
      if (!el) return;
      el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
    },
    [ref],
  );

  return { ...edges, move };
}
