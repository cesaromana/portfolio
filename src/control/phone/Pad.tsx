import { useRef } from 'react';
import type { ButtonName, PhoneMsg } from '../protocol';

const HAPTIC_MS = 12;

type Props = { section: string; send: (m: PhoneMsg) => void };

/**
 * Mando: arriba se arrastra la página, abajo los botones A y B.
 *
 * El desplazamiento se acumula y se manda una vez por fotograma. Enviar cada
 * evento del dedo suelto satura el canal y se siente a tirones.
 */
export default function Pad({ section, send }: Props) {
  const lastY = useRef<number | null>(null);
  const zone = useRef<HTMLDivElement>(null);

  const down = (e: React.PointerEvent) => {
    lastY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (lastY.current === null) return;
    // Se manda la fracción recorrida, no los píxeles: la pantalla decide cuánta
    // página es eso. Los eventos ya vienen al ritmo del dedo, así que se envían
    // tal cual; agruparlos aquí dependía de que el teléfono siguiera pintando.
    const height = zone.current?.clientHeight || 1;
    const dy = (lastY.current - e.clientY) / height;
    lastY.current = e.clientY;
    if (dy !== 0) send({ t: 'scroll', dy });
  };

  const up = () => {
    if (lastY.current === null) return;
    lastY.current = null;
    send({ t: 'scroll', dy: 0, end: true });
  };

  const press = (name: ButtonName, isDown: boolean) => {
    if (isDown) navigator.vibrate?.(HAPTIC_MS);
    send({ t: 'button', name, down: isDown });
  };

  return (
    <div className="phone__main phone__pad-wrap">
      <div
        ref={zone}
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
