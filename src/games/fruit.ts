import { rand, type Game, type Hud, type Palette } from './game';
import type { GameInput } from './input';

type Fruit = { x: number; y: number; vx: number; vy: number; r: number; isBomb: boolean; cut: boolean; hue: 'red' | 'blue' | 'marker'; spin: number };
type Trail = { x: number; y: number; t: number };

const GRAVITY = 900;
const ROUND_S = 45;
const SPAWN_S = 0.75;
const SLICE_SPEED = 900; // px/s: por debajo, el puntero solo pasa, no corta
const TRAIL_S = 0.18;

/** Corta la fruta: mueve el puntero rápido a través de la fruta, evita las bombas. */
export class FruitGame implements Game {
  private fruits: Fruit[] = [];
  private trail: Trail[] = [];
  private score = 0;
  private time = ROUND_S;
  private spawn = 0;
  private lastX = 0;
  private lastY = 0;
  private clock = 0;
  private isOver = false;

  reset(w: number, h: number) {
    this.fruits = [];
    this.trail = [];
    this.score = 0;
    this.time = ROUND_S;
    this.spawn = 0;
    this.clock = 0;
    this.isOver = false;
    this.lastX = w / 2;
    this.lastY = h / 2;
  }

  update(dt: number, input: GameInput, w: number, h: number) {
    if (this.isOver) return;
    this.clock += dt;
    this.time -= dt;
    if (this.time <= 0) this.isOver = true;
    this.spawn -= dt;
    if (this.spawn <= 0) {
      this.spawn = SPAWN_S;
      this.throwFruit(w, h);
    }
    const px = input.x * w;
    const py = input.y * h;
    const speed = Math.hypot(px - this.lastX, py - this.lastY) / Math.max(dt, 1 / 240);
    this.trail.push({ x: px, y: py, t: this.clock });
    this.trail = this.trail.filter((p) => this.clock - p.t < TRAIL_S);
    if (speed > SLICE_SPEED) this.slice(this.lastX, this.lastY, px, py);
    this.lastX = px;
    this.lastY = py;
    for (const f of this.fruits) {
      f.vy += GRAVITY * dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.spin += dt * 3;
    }
    this.fruits = this.fruits.filter((f) => f.y < h + 80);
  }

  private throwFruit(w: number, h: number) {
    const isBomb = Math.random() < 0.18;
    const hues: Fruit['hue'][] = ['red', 'blue', 'marker'];
    this.fruits.push({
      x: rand(w * 0.15, w * 0.85),
      y: h + 40,
      vx: rand(-120, 120),
      vy: -rand(h * 1.25, h * 1.6),
      r: rand(22, 34),
      isBomb,
      cut: false,
      hue: hues[Math.floor(Math.random() * hues.length)],
      spin: rand(0, 6),
    });
  }

  private slice(x0: number, y0: number, x1: number, y1: number) {
    for (const f of this.fruits) {
      if (f.cut || !hitsSegment(f, x0, y0, x1, y1)) continue;
      f.cut = true;
      f.vy = -220;
      if (f.isBomb) {
        this.score = Math.max(0, this.score - 5);
        this.time = Math.max(0, this.time - 5);
      } else this.score += 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
    ctx.clearRect(0, 0, w, h);
    for (const f of this.fruits) drawFruit(ctx, f, p);
    if (this.trail.length > 1) {
      ctx.strokeStyle = p.red;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      this.trail.forEach((t, i) => (i ? ctx.lineTo(t.x, t.y) : ctx.moveTo(t.x, t.y)));
      ctx.stroke();
    }
  }

  hud(): Hud {
    return { score: this.score, extra: `${Math.ceil(this.time)}s`, isOver: this.isOver };
  }
}

function hitsSegment(f: Fruit, x0: number, y0: number, x1: number, y1: number) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((f.x - x0) * dx + (f.y - y0) * dy) / len2));
  const cx = x0 + dx * t;
  const cy = y0 + dy * t;
  return Math.hypot(f.x - cx, f.y - cy) < f.r + 6;
}

function drawFruit(ctx: CanvasRenderingContext2D, f: Fruit, p: Palette) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.spin);
  ctx.lineWidth = 3;
  ctx.strokeStyle = p.ink;
  ctx.fillStyle = f.isBomb ? p.ink : p[f.hue];
  if (f.cut) {
    ctx.beginPath();
    ctx.arc(-6, 0, f.r, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(6, 0, f.r, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, f.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (f.isBomb) {
      ctx.strokeStyle = p.red;
      ctx.beginPath();
      ctx.moveTo(0, -f.r);
      ctx.lineTo(8, -f.r - 12);
      ctx.stroke();
    }
  }
  ctx.restore();
}
