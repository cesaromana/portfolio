// Entrada unificada para los juegos: puntero normalizado (0..1), inclinación
// cruda (-1..1) y botones A/B. Fuentes: el teléfono como mando (WebRTC), el
// giroscopio del propio teléfono, el dedo, el mouse y un gamepad.

export type GameInput = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  a: boolean;
  b: boolean;
  aHit: boolean;
  bHit: boolean;
  hasTilt: boolean;
};

const STICK_DEAD = 0.15;
const STICK_SPEED = 0.03;

export class InputBus {
  x = 0.5;
  y = 0.5;
  tx = 0;
  ty = 0;
  kx = 0;
  ky = 0;
  hasKeys = false;
  a = false;
  b = false;
  hasTilt = false;
  private aWas = false;
  private bWas = false;

  point(nx: number, ny: number) {
    this.x = clamp01(nx);
    this.y = clamp01(ny);
  }

  /** Inclinación cruda del teléfono. No toca el puntero: cada juego decide
   *  si apunta con el dedo o inclinando. */
  tilt(vx: number, vy: number) {
    this.hasTilt = true;
    this.tx = vx;
    this.ty = vy;
  }

  button(name: 'a' | 'b', isDown: boolean) {
    if (name === 'a') this.a = isDown;
    else this.b = isDown;
  }

  /** Primer gamepad conectado: stick izquierdo mueve, botones 0/1 son A/B. */
  pollGamepad() {
    const pad = navigator.getGamepads?.()[0];
    if (!pad) return;
    const [sx, sy] = pad.axes;
    if (Math.abs(sx) > STICK_DEAD) this.x = clamp01(this.x + sx * STICK_SPEED);
    if (Math.abs(sy) > STICK_DEAD) this.y = clamp01(this.y + sy * STICK_SPEED);
    if (pad.buttons[0]) this.a = pad.buttons[0].pressed;
    if (pad.buttons[1]) this.b = pad.buttons[1].pressed;
  }

  /** Teclado: mientras haya teclas pulsadas mandan ellas. */
  keys(kx: number, ky: number) {
    this.kx = kx;
    this.ky = ky;
    this.hasKeys = kx !== 0 || ky !== 0;
  }

  /** Instantánea con flancos de subida (aHit/bHit valen true un solo frame). */
  frame(): GameInput {
    const useKeys = this.hasKeys;
    const snap = {
      x: useKeys ? clamp01(0.5 + this.kx / 2) : this.x,
      y: useKeys ? clamp01(0.5 + this.ky / 2) : this.y,
      tx: useKeys ? this.kx : this.tx,
      ty: useKeys ? this.ky : this.ty,
      a: this.a,
      b: this.b,
      aHit: this.a && !this.aWas,
      bHit: this.b && !this.bWas,
      hasTilt: this.hasTilt || useKeys,
    };
    this.aWas = this.a;
    this.bWas = this.b;
    return snap;
  }
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
