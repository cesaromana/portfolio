// Física mínima para el muro de herramientas: cuerpos circulares con
// gravedad suave, rebote contra los bordes, separación entre ellos y un
// empuje desde el mouse. Sin librerías.

export type Body = { x: number; y: number; vx: number; vy: number; r: number; held: boolean };

const GRAVITY = 260;
const DAMP = 0.992;
const BOUNCE = 0.55;
const MOUSE_R = 150;
const MOUSE_F = 900;
const MAX_DT = 1 / 30;

export class Wall {
  bodies: Body[] = [];
  /** Dirección de la gravedad. En teléfono la manda la inclinación. */
  gravity = { x: 0, y: 1 };
  w = 0;
  h = 0;
  mouse = { x: -1000, y: -1000, on: false };

  constructor(sizes: number[]) {
    this.bodies = sizes.map((s) => ({ x: 0, y: 0, vx: 0, vy: 0, r: s / 2, held: false }));
  }

  resize(w: number, h: number) {
    const isFirst = this.w === 0;
    this.w = w;
    this.h = h;
    if (!isFirst) return;
    this.bodies.forEach((b, i) => {
      b.x = ((i * 137) % Math.max(1, w - b.r * 2)) + b.r;
      b.y = -b.r - (i % 5) * 120 - Math.random() * 200;
    });
  }

  step(dt: number) {
    const d = Math.min(MAX_DT, dt);
    for (const b of this.bodies) {
      if (b.held) continue;
      b.vx += GRAVITY * this.gravity.x * d;
      b.vy += GRAVITY * this.gravity.y * d;
      this.push(b, d);
      b.vx *= DAMP;
      b.vy *= DAMP;
      b.x += b.vx * d;
      b.y += b.vy * d;
      this.walls(b);
    }
    for (let i = 0; i < 2; i++) this.separate();
  }

  private push(b: Body, d: number) {
    if (!this.mouse.on) return;
    const dx = b.x - this.mouse.x;
    const dy = b.y - this.mouse.y;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist > MOUSE_R + b.r) return;
    const k = (1 - dist / (MOUSE_R + b.r)) * MOUSE_F * d;
    b.vx += (dx / dist) * k;
    b.vy += (dy / dist) * k;
  }

  private walls(b: Body) {
    if (b.x < b.r) {
      b.x = b.r;
      b.vx = Math.abs(b.vx) * BOUNCE;
    }
    if (b.x > this.w - b.r) {
      b.x = this.w - b.r;
      b.vx = -Math.abs(b.vx) * BOUNCE;
    }
    if (b.y > this.h - b.r) {
      b.y = this.h - b.r;
      b.vy = -Math.abs(b.vy) * BOUNCE;
    }
  }

  private separate() {
    const list = this.bodies;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const min = a.r + b.r + 4;
        if (dist >= min) continue;
        const nx = dx / dist;
        const ny = dy / dist;
        const over = (min - dist) / 2;
        if (!a.held) {
          a.x -= nx * over;
          a.y -= ny * over;
          a.vx -= nx * over * 6;
          a.vy -= ny * over * 6;
        }
        if (!b.held) {
          b.x += nx * over;
          b.y += ny * over;
          b.vx += nx * over * 6;
          b.vy += ny * over * 6;
        }
      }
    }
  }
}
