// El cambio de tema como una mancha de tinta que se extiende desde el propio
// interruptor, en vez de un corte seco. Se apoya en las transiciones de vista
// del navegador: donde no existen, o donde piden menos movimiento, el cambio
// se aplica igual, sólo que sin animación.

type Start = (cb: () => void) => { finished: Promise<unknown> };
type WithTransition = Document & { startViewTransition?: Start };

export type Origin = { x: number; y: number };

/** Radio hasta la esquina más lejana: la mancha tiene que cubrir la pantalla. */
function reachFrom({ x, y }: Origin) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
}

export function flipTheme(apply: () => void, origin?: Origin) {
  const doc = document as WithTransition;
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!doc.startViewTransition || isReduced) return apply();

  const root = document.documentElement;
  const from = origin ?? { x: window.innerWidth / 2, y: 0 };
  root.style.setProperty('--flip-x', `${from.x}px`);
  root.style.setProperty('--flip-y', `${from.y}px`);
  root.style.setProperty('--flip-r', `${reachFrom(from)}px`);
  root.classList.add('is-flipping');

  const view = doc.startViewTransition(apply);
  void view.finished.finally(() => root.classList.remove('is-flipping'));
}
