import { useEffect, useRef } from 'react';
import { tilt } from '../motion/tilt';
import { paintHero } from './hero-paint';

const LERP = 0.08;
// Por debajo de esto el fondo ya está donde toca: no se repinta.
const EPSILON = 0.0012;
// Respiración lenta para que nunca quede completamente muerto.
const BREATH_SPEED = 0.00022;
const BREATH_AMP = 0.11;

/**
 * Fondo del hero: trama de puntos y líneas cinéticas alrededor de un foco. Lo
 * mueven el mouse, la inclinación del teléfono, el scroll y una respiración
 * lenta. Se detiene cuando el hero sale de pantalla.
 */
export default function KineticLines() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d', { alpha: true });
    if (!el || !ctx) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    // En teléfono se pinta a 30 fps y con menos resolución: se ve igual y cuesta la mitad.
    const minFrameMs = isCoarse ? 33 : 16;
    const maxDpr = isCoarse ? 1.5 : 2;
    const state = { aim: 0.5, current: 0.5, painted: -1, last: 0, raf: 0, visible: true };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      el.width = Math.round(el.offsetWidth * dpr);
      el.height = Math.round(el.offsetHeight * dpr);
      state.painted = -1;
    };
    const onMove = (e: MouseEvent) => {
      state.aim = e.clientX / window.innerWidth;
    };
    const onScroll = () => {
      const drift = window.scrollY / Math.max(1, window.innerHeight);
      state.aim = 0.5 + Math.sin(drift * Math.PI) * 0.35;
    };
    const draw = (now: number) => {
      state.raf = requestAnimationFrame(draw);
      if (!state.visible || now - state.last < minFrameMs) return;
      state.last = now;
      const breath = isReduced ? 0 : Math.sin(now * BREATH_SPEED) * BREATH_AMP;
      const target = Math.max(0, Math.min(1, state.aim + breath));
      state.current += (target - state.current) * (isReduced ? 1 : LERP);
      if (Math.abs(state.current - state.painted) <= EPSILON) return;
      paintHero(ctx, el.width, el.height, state.current, maxDpr);
      state.painted = state.current;
    };

    const io = new IntersectionObserver(([e]) => {
      state.visible = e.isIntersecting;
    });
    io.observe(el);
    const offTilt = tilt.subscribe((v) => {
      state.aim = 0.5 + v.x * 0.45;
    });

    resize();
    tilt.tryQuietly();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    state.raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(state.raf);
      io.disconnect();
      offTilt();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <canvas ref={canvas} className="hero__lines" aria-hidden="true" />;
}
