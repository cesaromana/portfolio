import { useEffect, useRef, useState } from 'react';
import { readPalette, type Game, type Hud } from './game';
import type { InputBus } from './input';
import type { PointerLoop } from '../control/pointer-loop';
import { bindPointer, bindRemote } from './sources';

type Props = {
  game: Game;
  bus: InputBus;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onHud: (h: Hud) => void;
  round: number;
  remote: PointerLoop | null;
};

const MAX_DT = 1 / 20;
const HUD_EVERY = 6;
const MAX_DPR = 2;

/**
 * Lienzo de juego. El tamaño vive en una referencia, no en el estado: en el
 * teléfono la barra del navegador aparece y desaparece constantemente, y si
 * cada cambio de alto reiniciara la partida el juego se rompería solo.
 */
export default function GameCanvas({ game, bus, canvasRef, onHud, round, remote }: Props) {
  const size = useRef({ w: 0, h: 0 });
  const [isSized, setSized] = useState(false);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === 0 || h === 0) return;
      size.current = { w, h };
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      const ctx = el.getContext('2d');
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      setSized(true);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    const offPointer = remote ? bindRemote(remote, bus, el) : bindPointer(el, bus);
    return () => {
      ro.disconnect();
      offPointer();
    };
  }, [canvasRef, bus, remote]);

  useEffect(() => {
    const el = canvasRef.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx || !isSized) return;

    game.reset(size.current.w, size.current.h);
    const palette = readPalette(el);
    let last = performance.now();
    let raf = 0;
    let tick = 0;
    const loop = (now: number) => {
      const dt = Math.min(MAX_DT, (now - last) / 1000);
      last = now;
      const { w, h } = size.current;
      bus.pollGamepad();
      game.update(dt, bus.frame(), w, h);
      game.draw(ctx, w, h, palette);
      if ((tick = (tick + 1) % HUD_EVERY) === 0) onHud(game.hud());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [game, round, bus, onHud, isSized, canvasRef]);

  return <canvas ref={canvasRef} className="arcade__canvas" />;
}
