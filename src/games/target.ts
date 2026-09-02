import { rand, type Game, type Hud, type Palette } from './game';
import type { GameInput } from './input';

type Target = { x: number; y: number; r: number; life: number; vx: number };
type Shot = { x: number; y: number; t: number; hit: boolean };

const ROUND_S = 40;
const AMMO = 6;
const SPAWN_S = 0.9;
const TARGET_LIFE = 3.2;
const SHOT_S = 0.35;

/** Tiro al blanco: apunta, A dispara, B recarga. Los blancos se mueven y desaparecen. */
export class TargetGame implements Game {
  private targets: Target[] = [];
  private shots: Shot[] = [];
  private score = 0;
  private ammo = AMMO;
  private time = ROUND_S;
  private spawn = 0;
  private clock = 0;
  private isOver = false;
  private aim = { x: 0, y: 0 };
  private hasOwnAim = false;

  reset() {
    this.targets = [];
    this.shots = [];
    this.score = 0;
    this.ammo = AMMO;
    this.time = ROUND_S;
    this.spawn = 0;
    this.clock = 0;
    this.isOver = false;
  }

  update(dt: number, input: GameInput, w: number, h: number) {
    if (this.isOver) return;
    this.clock += dt;
    this.time -= dt;
    if (this.time <= 0) this.isOver = true;
    this.spawn -= dt;
    if (this.spawn <= 0) {
      this.spawn = SPAWN_S;
      this.targets.push({ x: rand(60, w - 60), y: rand(60, h - 60), r: rand(22, 40), life: TARGET_LIFE, vx: rand(-60, 60) });
    }
    for (const t of this.targets) {
      t.life -= dt;
      t.x += t.vx * dt;
      if (t.x < 40 || t.x > w - 40) t.vx *= -1;
    }
    this.targets = this.targets.filter((t) => t.life > 0);
    this.shots = this.shots.filter((s) => this.clock - s.t < SHOT_S);
    if (input.bHit) this.ammo = AMMO;
    const aim = aimOf(input);
    this.hasOwnAim = input.hasTilt;
    this.aim = { x: aim.x * w, y: aim.y * h };
    if (input.aHit && this.ammo > 0) this.fire(this.aim.x, this.aim.y);
  }

  private fire(x: number, y: number) {
    this.ammo -= 1;
    const idx = this.targets.findIndex((t) => Math.hypot(t.x - x, t.y - y) < t.r);
    const hit = idx >= 0;
    if (hit) {
      const t = this.targets[idx];
      this.score += t.r < 28 ? 3 : t.r < 34 ? 2 : 1;
      this.targets.splice(idx, 1);
    }
    this.shots.push({ x, y, t: this.clock, hit });
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
    ctx.clearRect(0, 0, w, h);
    for (const t of this.targets) {
      const k = Math.min(1, t.life / 0.5);
      ctx.globalAlpha = k;
      ctx.lineWidth = 3;
      ctx.strokeStyle = p.ink;
      for (let i = 3; i >= 1; i--) {
        ctx.fillStyle = i % 2 ? p.red : p.paper;
        ctx.beginPath();
        ctx.arc(t.x, t.y, (t.r * i) / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    for (const s of this.shots) {
      const age = (this.clock - s.t) / SHOT_S;
      ctx.strokeStyle = s.hit ? p.blue : p.ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 8 + age * 30, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (this.hasOwnAim) drawAim(ctx, this.aim.x, this.aim.y, p);
    ctx.fillStyle = p.ink;
    for (let i = 0; i < AMMO; i++) {
      ctx.globalAlpha = i < this.ammo ? 1 : 0.2;
      ctx.fillRect(16 + i * 16, h - 28, 10, 18);
    }
    ctx.globalAlpha = 1;
  }

  hud(): Hud {
    return { score: this.score, extra: `${Math.ceil(this.time)}s`, isOver: this.isOver };
  }
}

/** Con giroscopio se apunta inclinando; si no, con el dedo o el mouse. */
function aimOf(input: GameInput) {
  if (!input.hasTilt) return { x: input.x, y: input.y };
  return { x: 0.5 + input.tx * 0.5, y: 0.5 + input.ty * 0.5 };
}

function drawAim(ctx: CanvasRenderingContext2D, x: number, y: number, p: Palette) {
  ctx.strokeStyle = p.blue;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 14, y);
  ctx.lineTo(x + 14, y);
  ctx.moveTo(x, y - 14);
  ctx.lineTo(x, y + 14);
  ctx.stroke();
  ctx.strokeRect(x - 7, y - 7, 14, 14);
}
