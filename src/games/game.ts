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
    ink: v('--ink', '#16130f'),
    red: v('--red', '#e3462f'),
    blue: v('--blue', '#1b45c4'),
    marker: v('--marker', '#f5d547'),
    soft: v('--ink-soft', '#4a443b'),
  };
}

export function rand(lo: number, hi: number) {
  return lo + Math.random() * (hi - lo);
}
