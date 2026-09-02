import { useEffect, useRef } from 'react';

// Radio en el que el pulgar todavía manda; más allá se recorta.
const TRAVEL = 0.42;

type Props = { onMove: (x: number, y: number) => void };

/**
 * Joystick analógico para el pulgar: la base se queda quieta y la seta sigue
 * al dedo. Devuelve un vector de -1 a 1; quien lo use decide qué significa.
 */
export default function Stick({ onMove }: Props) {
  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLSpanElement>(null);
  const pointer = useRef(-1);

  const place = (x: number, y: number) => {
    const el = knob.current;
    if (!el) return;
    const size = (base.current?.clientWidth ?? 0) * TRAVEL;
    el.style.transform = `translate(${x * size}px, ${y * size}px)`;
    onMove(x, y);
  };

  useEffect(() => () => onMove(0, 0), [onMove]);

  const track = (e: React.PointerEvent) => {
    const box = base.current?.getBoundingClientRect();
    if (!box) return;
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const radius = box.width / 2;
    let x = (e.clientX - cx) / radius;
    let y = (e.clientY - cy) / radius;
    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }
    place(x, y);
  };

  const grab = (e: React.PointerEvent) => {
    pointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    base.current?.classList.add('is-held');
    track(e);
  };

  const drag = (e: React.PointerEvent) => {
    if (pointer.current !== e.pointerId) return;
    track(e);
  };

  const drop = (e: React.PointerEvent) => {
    if (pointer.current !== e.pointerId) return;
    pointer.current = -1;
    base.current?.classList.remove('is-held');
    place(0, 0);
  };

  return (
    <div
      ref={base}
      className="stick"
      onPointerDown={grab}
      onPointerMove={drag}
      onPointerUp={drop}
      onPointerCancel={drop}
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Joystick"
    >
      <span ref={knob} className="stick__knob" />
    </div>
  );
}
