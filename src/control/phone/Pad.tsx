import { useRef } from 'react';
import type { ButtonName, PhoneMsg } from '../protocol';

// Un centímetro de dedo mueve más que un centímetro de página: si no, no se llega.
const SCROLL_GAIN = 2.6;
const HAPTIC_MS = 12;

type Props = { section: string; send: (m: PhoneMsg) => void };

/** Mando: arriba se desliza la página con el dedo, abajo los botones A y B. */
export default function Pad({ section, send }: Props) {
  const lastY = useRef<number | null>(null);

  const down = (e: React.PointerEvent) => {
    lastY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (lastY.current === null) return;
    const dy = lastY.current - e.clientY;
    lastY.current = e.clientY;
    if (dy !== 0) send({ t: 'scroll', dy: dy * SCROLL_GAIN });
  };

  const up = () => {
    lastY.current = null;
  };

  const press = (name: ButtonName, isDown: boolean) => {
    if (isDown) navigator.vibrate?.(HAPTIC_MS);
    send({ t: 'button', name, down: isDown });
  };

  return (
    <div className="phone__main phone__pad-wrap">
      <div
        className="phone__swipe mono"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <span className="phone__swipeRail" aria-hidden="true" />
        <span>{section}</span>
      </div>
      <div className="phone__buttons">
        {(['a', 'b'] as ButtonName[]).map((name) => (
          <button
            key={name}
            className={`phone__btn phone__btn--${name}`}
            onPointerDown={() => press(name, true)}
            onPointerUp={() => press(name, false)}
            onPointerCancel={() => press(name, false)}
            onPointerLeave={() => press(name, false)}
            onContextMenu={(e) => e.preventDefault()}
            aria-label={name.toUpperCase()}
          >
            {name.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
