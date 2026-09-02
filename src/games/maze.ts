import type { Game, Hud, Palette } from './game';
import type { GameInput } from './input';
import { carve, type Cell } from './maze-grid';

const ROUND_S = 60;
const GRAVITY = 1500; // px/s² a inclinación máxima
const FRICTION = 0.985;
const BOUNCE = 0.35;
// Tamaño de celda objetivo; las columnas y filas salen del lienzo.
const CELL = 74;
const MIN_COLS = 5;

/** Laberinto: inclina el teléfono y la bola rueda. Llega a la salida. */
export class MazeGame implements Game {
  private cells: Cell[] = [];
  private cols = 7;
  private rows = 9;
  private size = 40;
  private padX = 0;
  private padY = 0;
  private ball = { x: 0, y: 0, vx: 0, vy: 0 };
  private score = 0;
  private time = ROUND_S;
  private isOver = false;
  private flash = 0;

  reset(w: number, h: number) {
    this.score = 0;
    this.time = ROUND_S;
    this.isOver = false;
    this.build(w, h);
  }

  private build(w: number, h: number) {
    this.cols = Math.max(MIN_COLS, Math.round(w / CELL));
    this.size = Math.floor(w / this.cols);
    this.rows = Math.max(MIN_COLS, Math.floor(h / this.size));
    this.padX = (w - this.cols * this.size) / 2;
    this.padY = (h - this.rows * this.size) / 2;
    this.cells = carve(this.cols, this.rows);
    this.ball = { x: this.center(0), y: this.center(0), vx: 0, vy: 0 };
    this.flash = 0.4;
  }

  private center(i: number) {
    return this.size * (i + 0.5);
  }

  update(dt: number, input: GameInput, w: number, h: number) {
    if (this.isOver) return;
    this.time -= dt;
    this.flash = Math.max(0, this.flash - dt);
    if (this.time <= 0) {
      this.isOver = true;
      return;
    }
    const g = input.hasTilt ? { x: input.tx, y: input.ty } : pointerGravity(input);
    const b = this.ball;
    b.vx = (b.vx + g.x * GRAVITY * dt) * FRICTION;
    b.vy = (b.vy + g.y * GRAVITY * dt) * FRICTION;
    const max = this.size * 8;
    b.vx = Math.max(-max, Math.min(max, b.vx));
    b.vy = Math.max(-max, Math.min(max, b.vy));
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    this.collide();
    if (this.atGoal()) {
      this.score += 1;
      this.time = Math.min(ROUND_S, this.time + 8);
      this.build(w, h);
    }
  }

  private get radius() {
    return this.size * 0.28;
  }

  private collide() {
    const b = this.ball;
    const r = this.radius;
    const col = Math.max(0, Math.min(this.cols - 1, Math.floor(b.x / this.size)));
    const row = Math.max(0, Math.min(this.rows - 1, Math.floor(b.y / this.size)));
    const cell = this.cells[row * this.cols + col];
    const x0 = col * this.size;
    const y0 = row * this.size;
    if (cell.w && b.x - r < x0) {
      b.x = x0 + r;
      b.vx = -b.vx * BOUNCE;
    }
    if (cell.e && b.x + r > x0 + this.size) {
      b.x = x0 + this.size - r;
      b.vx = -b.vx * BOUNCE;
    }
    if (cell.n && b.y - r < y0) {
      b.y = y0 + r;
      b.vy = -b.vy * BOUNCE;
    }
    if (cell.s && b.y + r > y0 + this.size) {
      b.y = y0 + this.size - r;
      b.vy = -b.vy * BOUNCE;
    }
  }

  private atGoal() {
    const gx = this.center(this.cols - 1);
    const gy = this.center(this.rows - 1);
    return Math.hypot(this.ball.x - gx, this.ball.y - gy) < this.size * 0.4;
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(this.padX, this.padY);
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3;
    ctx.lineCap = 'square';
    ctx.beginPath();
    this.cells.forEach((c, i) => {
      const x = (i % this.cols) * this.size;
      const y = Math.floor(i / this.cols) * this.size;
      if (c.n) line(ctx, x, y, x + this.size, y);
      if (c.w) line(ctx, x, y, x, y + this.size);
      if (c.e) line(ctx, x + this.size, y, x + this.size, y + this.size);
      if (c.s) line(ctx, x, y + this.size, x + this.size, y + this.size);
    });
    ctx.stroke();

    const gx = this.center(this.cols - 1);
    const gy = this.center(this.rows - 1);
    ctx.fillStyle = p.marker;
    ctx.fillRect(gx - this.size * 0.3, gy - this.size * 0.3, this.size * 0.6, this.size * 0.6);
    ctx.strokeRect(gx - this.size * 0.3, gy - this.size * 0.3, this.size * 0.6, this.size * 0.6);

    ctx.fillStyle = this.flash > 0 ? p.blue : p.red;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  hud(): Hud {
    return { score: this.score, extra: `${Math.ceil(this.time)}s`, isOver: this.isOver };
  }
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

/** Sin giroscopio: el puntero indica hacia dónde "cae" la bola. */
function pointerGravity(input: GameInput) {
  return { x: (input.x - 0.5) * 2, y: (input.y - 0.5) * 2 };
}
