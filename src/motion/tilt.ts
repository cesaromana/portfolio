import { askOrientation, needsPrompt, type SensorPermission } from './permission';

export type Vec = { x: number; y: number };
type Listener = (v: Vec) => void;

// Grados de inclinación que recorren todo el rango. Una muñeca cómoda no pasa de ~22°.
const RANGE_DEG = 22;
// La lectura cruda tiembla; se suaviza hacia el objetivo en cada evento.
const SMOOTH = 0.18;

/**
 * Fuente única de inclinación del teléfono. Un solo listener para toda la
 * página: el hero, el muro de herramientas y los juegos leen de aquí.
 */
class TiltSource {
  value: Vec = { x: 0, y: 0 };
  permission: SensorPermission = needsPrompt() ? 'unknown' : 'granted';
  isLive = false;
  private base: Vec | null = null;
  private raw: Vec = { x: 0, y: 0 };
  private listeners = new Set<Listener>();
  private bound = false;

  get needsPrompt() {
    return needsPrompt();
  }

  async enable(): Promise<SensorPermission> {
    this.permission = await askOrientation();
    if (this.permission === 'granted') this.listen();
    return this.permission;
  }

  /** Arranca sin preguntar donde no hace falta permiso (Android, escritorio). */
  tryQuietly() {
    if (this.bound || needsPrompt()) return;
    this.listen();
  }

  /** La postura actual pasa a ser el centro. */
  recenter() {
    this.base = { ...this.raw };
    this.value = { x: 0, y: 0 };
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private listen() {
    if (this.bound) return;
    this.bound = true;
    window.addEventListener('deviceorientation', this.onOrient);
  }

  private onOrient = (e: DeviceOrientationEvent) => {
    if (e.beta === null && e.gamma === null) return;
    this.isLive = true;
    this.raw = rotate({ x: e.gamma ?? 0, y: e.beta ?? 0 });
    if (!this.base) this.base = { ...this.raw };
    const target = {
      x: clamp((this.raw.x - this.base.x) / RANGE_DEG),
      y: clamp((this.raw.y - this.base.y) / RANGE_DEG),
    };
    this.value = {
      x: this.value.x + (target.x - this.value.x) * SMOOTH,
      y: this.value.y + (target.y - this.value.y) * SMOOTH,
    };
    this.listeners.forEach((fn) => fn(this.value));
  };
}

/** En horizontal los ejes del teléfono giran con la pantalla. */
function rotate(v: Vec): Vec {
  const angle = (typeof screen !== 'undefined' && screen.orientation?.angle) || 0;
  if (angle === 90) return { x: -v.y, y: v.x };
  if (angle === 270 || angle === -90) return { x: v.y, y: -v.x };
  if (angle === 180) return { x: -v.x, y: -v.y };
  return v;
}

function clamp(n: number) {
  return Math.max(-1, Math.min(1, n));
}

export const tilt = new TiltSource();
