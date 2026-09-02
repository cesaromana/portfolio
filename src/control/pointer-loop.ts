import { screenCenter, type Point } from './pointer-map';

export type PointerState = Point & { pressed: boolean; a: boolean; b: boolean };
type Listener = (p: PointerState) => void;

const LERP = 0.15;

/** Suavizado exponencial del puntero, a cadencia de requestAnimationFrame. Lleva también A/B. */
export class PointerLoop {
  target: Point = screenCenter();
  pressed = false;
  a = false;
  b = false;
  active = false;
  private current: Point = screenCenter();
  private listeners = new Set<Listener>();
  private raf = 0;
  private readonly isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  start() {
    const step = () => {
      if (this.active) this.advance();
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  center() {
    this.target = screenCenter();
    this.current = screenCenter();
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private advance() {
    const k = this.isReduced ? 1 : LERP;
    this.current.x += (this.target.x - this.current.x) * k;
    this.current.y += (this.target.y - this.current.y) * k;
    const snapshot = { x: this.current.x, y: this.current.y, pressed: this.pressed, a: this.a, b: this.b };
    this.listeners.forEach((fn) => fn(snapshot));
  }
}
