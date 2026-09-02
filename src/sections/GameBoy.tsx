import { useRef, useState } from 'react';
import { fitFrame } from './fit-frame';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

type Props = { src: string; onClose: () => void };

// Open Sonic lee e.keyCode: flechas 37-40, espacio 32 (salto), enter 13.
const KEYS = { left: 37, up: 38, right: 39, down: 40, a: 32, start: 13 } as const;
type KeyName = keyof typeof KEYS;

const HAPTIC_MS = 8;

/**
 * Consola portátil a pantalla completa. El modo girado pone el juego a lo
 * largo del teléfono, que es donde de verdad se ve grande.
 */
export default function GameBoy({ src, onClose }: Props) {
  const { t } = useLang();
  const frame = useRef<HTMLIFrameElement>(null);
  const [isRotated, setRotated] = useState(false);

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
    <div className={`gameboy${isRotated ? ' gameboy--rotated' : ''}`} role="dialog" aria-label="Open Sonic">
      <div className="gameboy__screen gb-in" style={{ animationDelay: '120ms' }}>
        <iframe ref={frame} title="Open Sonic" src={src} allow="gamepad" onLoad={() => fitFrame(frame.current)} />
      </div>

      <div className="gameboy__pad">
        <div className="dpad">
          <button className="dpad__btn dpad__up gb-in" style={{ animationDelay: '300ms' }} {...hold('up')} aria-label="↑">
            ▲
          </button>
          <button className="dpad__btn dpad__left gb-in" style={{ animationDelay: '390ms' }} {...hold('left')} aria-label="←">
            ◀
          </button>
          <button className="dpad__btn dpad__right gb-in" style={{ animationDelay: '480ms' }} {...hold('right')} aria-label="→">
            ▶
          </button>
          <button className="dpad__btn dpad__down gb-in" style={{ animationDelay: '570ms' }} {...hold('down')} aria-label="↓">
            ▼
          </button>
        </div>
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
        <button className="btn" onClick={() => setRotated((r) => !r)}>
          {isRotated ? t(S.about.sonicUpright) : t(S.about.sonicRotate)}
        </button>
        <button className="btn btn--red" onClick={onClose}>
          {t(S.arcade.back)}
        </button>
      </div>
    </div>
  );
}
