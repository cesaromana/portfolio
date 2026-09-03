// El cambio de tema como una mancha de tinta que se extiende desde el propio
// interruptor, en vez de un corte seco.
//
// Hay dos maneras de hacerlo y cada una sirve para un sitio. En pantalla
// grande se usan las transiciones de vista del navegador, que revelan el
// contenido nuevo de verdad dentro del círculo. Eso cuesta dos fotos de la
// página entera: en escritorio no se nota y en teléfono son trescientos
// milisegundos de hilo bloqueado, o sea el trancón. Ahí se dibuja la mancha a
// mano: un círculo de un solo color que crece y luego se desvanece. Sólo mueve
// transformación y opacidad, que las resuelve el compositor sin pedirle nada
// al hilo principal.

type Start = (cb: () => void) => { finished: Promise<unknown> };
type WithTransition = Document & { startViewTransition?: Start };

export type Origin = { x: number; y: number };

const GROW_MS = 400;
const FADE_MS = 260;
// La curva de la página frena tardísimo: un círculo que además crece en área
// llegaba al borde en el primer tercio y el resto era espera. Ésta reparte el
// recorrido, que es lo que hace que se lea como un barrido.
const EASE = 'cubic-bezier(0.45, 0, 0.25, 1)';

/** Radio hasta la esquina más lejana: la mancha tiene que cubrir la pantalla. */
function reachFrom({ x, y }: Origin) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
}

function centerTop(): Origin {
  return { x: window.innerWidth / 2, y: 0 };
}

/** Dos fotogramas: lo justo para que el repintado del tema nuevo ya esté hecho. */
function nextPaint() {
  return new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done())));
}

/**
 * Aplica el cambio y devuelve una promesa que se cumple cuando la animación
 * terminó. Lo pesado se cuelga de ahí: mientras la mancha se abre, el hilo
 * principal tiene que estar libre.
 */
export function flipTheme(apply: () => void, toNight: boolean, origin?: Origin): Promise<void> {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply();
    return Promise.resolve();
  }
  const from = origin ?? centerTop();
  // Sin puntero fino hay teléfono, y ahí las fotos de la página salen caras.
  const isCoarse = window.matchMedia('(hover: none)').matches;
  const doc = document as WithTransition;
  if (isCoarse || !doc.startViewTransition) return blot(apply, toNight, from);
  return reveal(doc, apply, from);
}

/** Camino de escritorio: el navegador revela el contenido nuevo en el círculo. */
function reveal(doc: WithTransition, apply: () => void, from: Origin): Promise<void> {
  const root = document.documentElement;
  root.style.setProperty('--flip-x', `${from.x}px`);
  root.style.setProperty('--flip-y', `${from.y}px`);
  root.style.setProperty('--flip-r', `${reachFrom(from)}px`);
  root.classList.add('is-flipping');
  const done = () => root.classList.remove('is-flipping');
  return doc.startViewTransition!(apply).finished.then(done, done);
}

/** Camino de teléfono: un círculo de tinta que tapa, cambia debajo y se va. */
async function blot(apply: () => void, toNight: boolean, from: Origin): Promise<void> {
  const radius = reachFrom(from);
  const ink = document.createElement('div');
  ink.className = 'ink-blot';
  ink.style.left = `${from.x - radius}px`;
  ink.style.top = `${from.y - radius}px`;
  ink.style.width = `${radius * 2}px`;
  ink.style.height = `${radius * 2}px`;
  ink.style.background = incomingPaper(toNight);
  document.body.append(ink);

  const grow = ink.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
    duration: GROW_MS,
    easing: EASE,
    fill: 'forwards',
  });
  await grow.finished;

  // El tema cambia con la pantalla tapada: si repintarlo cuesta, no se ve.
  apply();
  await nextPaint();

  const fade = ink.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_MS, easing: 'ease-out', fill: 'forwards' });
  await fade.finished;
  ink.remove();
}

/** El fondo que va a entrar, leído de los mismos tokens que usa la página. */
function incomingPaper(toNight: boolean) {
  const root = getComputedStyle(document.documentElement);
  return root.getPropertyValue(toNight ? '--night' : '--paper').trim();
}
