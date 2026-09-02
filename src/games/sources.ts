import type { PointerLoop } from '../control/pointer-loop';
import { tilt } from '../motion/tilt';
import type { InputBus } from './input';

// Con dos dedos en pantalla, el segundo hace de botón B.
const SECOND_FINGER_IS_B = true;

/** El teléfono como mando de la PC: puntero absoluto sobre la ventana. */
export function bindRemote(loop: PointerLoop, bus: InputBus) {
  return loop.subscribe((p) => {
    bus.point(p.x / window.innerWidth, p.y / window.innerHeight);
    bus.button('a', p.pressed || p.a);
    bus.button('b', p.b);
  });
}

/** El giroscopio del propio teléfono mueve el puntero. */
export function bindTilt(bus: InputBus) {
  return tilt.subscribe((v) => bus.tilt(v.x, v.y));
}

/** Dedo o mouse sobre el lienzo. */
export function bindPointer(el: HTMLCanvasElement, bus: InputBus) {
  const at = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    bus.point((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };
  const isB = (e: PointerEvent) => e.pointerType === 'touch' && SECOND_FINGER_IS_B && !e.isPrimary;

  const move = (e: PointerEvent) => at(e);
  const down = (e: PointerEvent) => {
    at(e);
    bus.button(isB(e) ? 'b' : 'a', true);
  };
  const up = (e: PointerEvent) => bus.button(isB(e) ? 'b' : 'a', false);

  el.addEventListener('pointermove', move);
  el.addEventListener('pointerdown', down);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  return () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerdown', down);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
  };
}

const HELD = new Set<string>();
const AXIS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0], KeyA: [-1, 0],
  ArrowRight: [1, 0], KeyD: [1, 0],
  ArrowUp: [0, -1], KeyW: [0, -1],
  ArrowDown: [0, 1], KeyS: [0, 1],
};

/** Flechas o WASD mueven; espacio es A y Shift es B. */
export function bindKeys(bus: InputBus) {
  const apply = () => {
    let x = 0;
    let y = 0;
    for (const code of HELD) {
      const axis = AXIS[code];
      if (!axis) continue;
      x += axis[0];
      y += axis[1];
    }
    bus.keys(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
  };
  const button = (code: string) => (code === 'Space' ? 'a' : code === 'ShiftLeft' || code === 'ShiftRight' ? 'b' : null);

  const down = (e: KeyboardEvent) => {
    const name = button(e.code);
    if (name) {
      e.preventDefault();
      return bus.button(name, true);
    }
    if (!AXIS[e.code]) return;
    e.preventDefault();
    HELD.add(e.code);
    apply();
  };
  const up = (e: KeyboardEvent) => {
    const name = button(e.code);
    if (name) return bus.button(name, false);
    if (!AXIS[e.code]) return;
    HELD.delete(e.code);
    apply();
  };
  const blur = () => {
    HELD.clear();
    apply();
  };

  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  window.addEventListener('blur', blur);
  return () => {
    blur();
    window.removeEventListener('keydown', down);
    window.removeEventListener('keyup', up);
    window.removeEventListener('blur', blur);
  };
}
