import { angleDelta, type Orient } from './protocol';

// ±18° de giro de muñeca recorren toda la pantalla.
const DEG_PER_SCREEN = 36;

export type Point = { x: number; y: number };

export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function screenCenter(): Point {
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

/** Orientación relativa a la línea base → punto en pantalla. */
export function orientToPoint(o: Orient, base: Orient): Point {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dx = -angleDelta(o.a, base.a) * (w / DEG_PER_SCREEN);
  const dy = -(o.b - base.b) * (h / DEG_PER_SCREEN);
  return { x: clamp(w / 2 + dx, 0, w - 1), y: clamp(h / 2 + dy, 0, h - 1) };
}
