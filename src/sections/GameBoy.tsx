import { useCallback, useRef } from 'react';
import { fitFrame } from './fit-frame';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import Stick from './Stick';

type Props = { src: string; onClose: () => void };

// Open Sonic lee e.keyCode: flechas 37-40, espacio 32 (salto), enter 13.
const KEYS = { left: 37, up: 38, right: 39, down: 40, a: 32, start: 13 } as const;
type KeyName = keyof typeof KEYS;

const HAPTIC_MS = 8;
// A partir de aquí el joystick cuenta como dirección pulsada.
const DEAD = 0.34;

/**
 * Consola portátil a pantalla completa. El modo girado pone el juego a lo
 * largo del teléfono, que es donde de verdad se ve grande.
 */
export default function GameBoy({ src, onClose }: Props) {
  const { t } = useLang();
  const frame = useRef<HTMLIFrameElement>(null);

  const key = (name: KeyName, isDown: boolean) => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    const Ctor = (win as unknown as typeof globalThis).KeyboardEvent;
    const evt = new Ctor(isDown ? 'keydown' : 'keyup', { bubbles: true, cancelable: true });
    Object.defineProperty(evt, 'keyCode', { get: () => KEYS[name] });
    Object.defineProperty(evt, 'which', { get: () => KEYS[name] });
    win.dispatchEvent(evt);
    if (isDown) navigator.vibrate?.(HAPTIC_MS);
  };

  const held = useRef<Record<string, boolean>>({});

  const steer = useCallback((x: number, y: number) => {
    const wanted: Record<string, boolean> = {
      left: x < -DEAD,
      right: x > DEAD,
      up: y < -DEAD,
      down: y > DEAD,
    };
    for (const name of ['left', 'right', 'up', 'down'] as KeyName[]) {
      if (held.current[name] === wanted[name]) continue;
      held.current[name] = wanted[name];
      key(name, wanted[name]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hold = (name: KeyName) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      key(name, true);
    },
    onPointerUp: () => key(name, false),
    onPointerCancel: () => key(name, false),
    onPointerLeave: () => key(name, false),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  return (
    <div className="gameboy" role="dialog" aria-label="Open Sonic">
      <div className="gameboy__screen gb-in" style={{ animationDelay: '120ms' }}>
        <iframe ref={frame} title="Open Sonic" src={src} allow="gamepad" onLoad={() => fitFrame(frame.current)} />
      </div>

      <div className="gameboy__pad">
        <Stick onMove={steer} />
        <div className="gameboy__ab">
          <button className="gameboy__round gb-in" style={{ animationDelay: '680ms' }} {...hold('a')} aria-label="A">
            A
          </button>
          <button className="gameboy__pill gb-in" style={{ animationDelay: '790ms' }} {...hold('start')} aria-label="Start">
            START
          </button>
        </div>
      </div>

      <div className="gameboy__bar gb-in" style={{ animationDelay: '880ms' }}>
        <button className="btn btn--red" onClick={onClose}>
          {t(S.arcade.back)}
        </button>
      </div>
    </div>
  );
}
