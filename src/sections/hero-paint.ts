const LINES = 26;
// Separación de la trama, en píxeles de CSS.
const DOT_STEP = 18;
const DOT_MAX = 3.2;

/**
 * Pinta el fondo del hero: una trama de puntos que crece hacia el foco y las
 * líneas cinéticas que se abren desde él. `focus` va de 0 a 1 en horizontal.
 */
export function paintHero(ctx: CanvasRenderingContext2D, w: number, h: number, focus: number, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  ctx.clearRect(0, 0, w, h);
  const ink = getComputedStyle(document.body).getPropertyValue('--ink').trim() || '#1d1a15';
  const originX = focus * w;
  const originY = h * 0.62;

  halftone(ctx, w, h, originX, originY, ink, dpr);
  speedLines(ctx, w, h, originX, ink, dpr);
}

function halftone(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, oy: number, ink: string, dpr: number) {
  const step = DOT_STEP * dpr;
  const reach = Math.hypot(w, h) * 0.55;
  ctx.fillStyle = ink;
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const near = 1 - Math.min(1, Math.hypot(x - ox, y - oy) / reach);
      if (near <= 0.02) continue;
      const size = near * near * DOT_MAX * dpr;
      ctx.globalAlpha = 0.05 + near * 0.16;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

function speedLines(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, ink: string, dpr: number) {
  ctx.strokeStyle = ink;
  ctx.lineWidth = dpr;
  for (let i = 0; i < LINES; i++) {
    const y = (h / LINES) * (i + 0.5);
    const spread = Math.abs(i / LINES - 0.5) * 2;
    const len = w * (0.12 + spread * 0.55);
    ctx.globalAlpha = 0.06 + spread * 0.08;
    ctx.beginPath();
    ctx.moveTo(ox - len, y);
    ctx.lineTo(ox + len, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
