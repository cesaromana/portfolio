// Mensajes entre el teléfono (mando) y la PC (pantalla). Van por un
// DataChannel de WebRTC; PeerJS solo pone la señalización.

export type Orient = { a: number; b: number; g: number };
export type ButtonName = 'a' | 'b';

export type PhoneMsg =
  | { t: 'hello'; ua: string }
  | ({ t: 'orient' } & Orient)
  | { t: 'press'; down: boolean }
  | { t: 'button'; name: ButtonName; down: boolean }
  | { t: 'scroll'; dy: number; end?: boolean }
  | { t: 'recalibrate' };

export type Phase = 'waiting' | 'calibrating' | 'ready' | 'lost';
export type HintKey = 'wait' | 'still' | 'shaken' | 'ready' | 'lost';

export type DesktopMsg =
  | { t: 'state'; phase: Phase; progress: number; blocks: number; section: string; hint: HintKey }
  | { t: 'haptic'; ms: number };

export const CONTROL_PATH = '/control';

export function controlUrl(peerId: string, origin = window.location.origin) {
  return `${origin}${CONTROL_PATH}?id=${encodeURIComponent(peerId)}`;
}

export function peerIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('id');
}

/** Diferencia angular con envoltura (-180, 180]. */
export function angleDelta(a: number, b: number) {
  let d = a - b;
  while (d > 180) d -= 360;
  while (d <= -180) d += 360;
  return d;
}

export const SECTIONS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'experiencia', label: 'Expediente' },
  { id: 'juega', label: 'Juega' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'contacto', label: 'Contacto' },
] as const;
