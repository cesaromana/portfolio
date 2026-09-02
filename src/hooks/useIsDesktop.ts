import { useEffect, useState } from 'react';

// Puntero fino y pantalla ancha: ahí tiene sentido el modo mando y el cursor propio.
const QUERY = '(pointer: fine) and (min-width: 900px)';

export function useIsDesktop() {
  const [isDesktop, setDesktop] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}
