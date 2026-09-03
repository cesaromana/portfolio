import type { GameInput } from './input';

export type Hud = { score: number; extra: string; isOver: boolean };

export type Palette = { paper: string; ink: string; red: string; blue: string; marker: string; soft: string };

/** Contrato de cada juego: se le da tiempo y entrada, dibuja en el canvas. */
export interface Game {
  reset(w: number, h: number): void;
  update(dt: number, input: GameInput, w: number, h: number): void;
  draw(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette): void;
  hud(): Hud;
}

export type GameId = 'fruit' | 'road' | 'target' | 'maze';

export function readPalette(el: Element = document.body): Palette {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    paper: v('--paper', '#efe9dd'),
    ink: v('--ink', '#1d1a15'),
    red: v('--red', '#b8412e'),
    blue: v('--blue', '#2f4fa6'),
    marker: v('--marker', '#f0cf5c'),
    soft: v('--ink-soft', '#5a5347'),
  };
}

export function rand(lo: number, hi: number) {
  return lo + Math.random() * (hi - lo);
}
