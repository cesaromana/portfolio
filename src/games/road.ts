import { rand, type Game, type Hud, type Palette } from './game';
import type { GameInput } from './input';

type Car = { lane: number; y: number; hue: 'red' | 'blue' };

const LANES = 3;
const BASE_SPEED = 320;
const BOOST = 1.7;
const SPAWN_S = 1.1;
const LIVES = 3;
const CAR_W = 44;
const CAR_H = 76;
const LANE_LERP = 12;

/** Carretera: eres el carro de abajo, esquiva los que vienen. Apunta para cambiar de carril, A acelera. */
export class RoadGame implements Game {
  private cars: Car[] = [];
  private lane = 1;
  private laneX = 1;
  private score = 0;
  private lives = LIVES;
  private dist = 0;
  private spawn = 0;
  private stripe = 0;
  private isOver = false;
  private hurt = 0;

  reset() {
    this.cars = [];
    this.lane = 1;
    this.laneX = 1;
    this.score = 0;
    this.lives = LIVES;
    this.dist = 0;
    this.spawn = 0;
    this.isOver = false;
    this.hurt = 0;
  }

  update(dt: number, input: GameInput, w: number, h: number) {
    if (this.isOver) return;
    const steer = input.hasTilt ? (input.tx + 1) / 2 : input.x;
    this.lane = Math.min(LANES - 1, Math.max(0, Math.floor(steer * LANES)));
    this.laneX += (this.lane - this.laneX) * Math.min(1, LANE_LERP * dt);
    const speed = BASE_SPEED * (input.a ? BOOST : 1) * (1 + this.dist / 20000);
    this.dist += speed * dt;
    this.stripe = (this.stripe + speed * dt) % 80;
    this.score = Math.floor(this.dist / 50);
    this.hurt = Math.max(0, this.hurt - dt);
    this.spawn -= dt * (input.a ? BOOST : 1);
    if (this.spawn <= 0) {
      this.spawn = SPAWN_S;
      this.cars.push({ lane: Math.floor(rand(0, LANES)), y: -CAR_H, hue: Math.random() < 0.5 ? 'red' : 'blue' });
    }
    const laneW = w / LANES;
    const myY = h - CAR_H - 24;
    for (const c of this.cars) {
      c.y += speed * dt;
      const isSameLane = Math.abs(c.lane - this.laneX) < 0.6;
      if (isSameLane && c.y + CAR_H > myY && c.y < myY + CAR_H && this.hurt === 0) {
        this.lives -= 1;
        this.hurt = 1.2;
        if (this.lives <= 0) this.isOver = true;
      }
    }
    this.cars = this.cars.filter((c) => c.y < h + CAR_H);
    void laneW;
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
    ctx.clearRect(0, 0, w, h);
    const laneW = w / LANES;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 3;
    ctx.setLineDash([40, 40]);
    ctx.lineDashOffset = -this.stripe;
    for (let i = 1; i < LANES; i++) {
      ctx.beginPath();
      ctx.moveTo(laneW * i, 0);
      ctx.lineTo(laneW * i, h);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const c of this.cars) drawCar(ctx, laneW * (c.lane + 0.5), c.y, p[c.hue], p.ink);
    const blink = this.hurt > 0 && Math.floor(this.hurt * 10) % 2 === 0;
    if (!blink) drawCar(ctx, laneW * (this.laneX + 0.5), h - CAR_H - 24, p.marker, p.ink, true);
  }

  hud(): Hud {
    return { score: this.score, extra: '♥'.repeat(this.lives), isOver: this.isOver };
  }
}

function drawCar(ctx: CanvasRenderingContext2D, cx: number, y: number, fill: string, ink: string, isMine = false) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.fillRect(cx - CAR_W / 2, y, CAR_W, CAR_H);
  ctx.strokeRect(cx - CAR_W / 2, y, CAR_W, CAR_H);
  ctx.fillStyle = ink;
  const winY = isMine ? y + 12 : y + CAR_H - 28;
  ctx.fillRect(cx - CAR_W / 2 + 8, winY, CAR_W - 16, 16);
}
