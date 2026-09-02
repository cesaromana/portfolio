import { useEffect, useState } from 'react';
import { readPalette, type Game, type Hud } from './game';
import type { InputBus } from './input';
import { bindPointer } from './sources';

type Props = {
  game: Game;
  bus: InputBus;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onHud: (h: Hud) => void;
  round: number;
};

const MAX_DT = 1 / 20;
const HUD_EVERY = 6;

/** Lienzo de juego: bucle rAF, tamaño según el contenedor, entrada desde el bus. */
export default function GameCanvas({ game, bus, canvasRef, onHud, round }: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    const offPointer = bindPointer(el, bus);
    return () => {
      ro.disconnect();
      offPointer();
    };
  }, [canvasRef, bus]);

  useEffect(() => {
    const el = canvasRef.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx || size.w === 0) return;
    const dpr = window.devicePixelRatio || 1;
    el.width = size.w * dpr;
    el.height = size.h * dpr;
    game.reset(size.w, size.h);
    const palette = readPalette(el);
    let last = performance.now();
    let raf = 0;
    let tick = 0;
    const loop = (now: number) => {
      const dt = Math.min(MAX_DT, (now - last) / 1000);
      last = now;
      bus.pollGamepad();
      game.update(dt, bus.frame(), size.w, size.h);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      game.draw(ctx, size.w, size.h, palette);
      if ((tick = (tick + 1) % HUD_EVERY) === 0) onHud(game.hud());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [game, size, bus, onHud, round, canvasRef]);

  return <canvas ref={canvasRef} className="arcade__canvas" />;
}
