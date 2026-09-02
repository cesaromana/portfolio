import { useEffect, useRef } from 'react';
import type { PointerLoop, PointerState } from './pointer-loop';

const TARGETS = 'a, button, [data-target]';

type Props = { loop: PointerLoop };

/** Retícula del teléfono: sigue el puntero, marca objetivos y hace clic al presionar. */
export default function Reticle({ loop }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const hovered = useRef<Element | null>(null);
  const wasPressed = useRef(false);

  useEffect(() => {
    const paint = (p: PointerState) => {
      const node = el.current;
      if (!node) return;
      node.style.transform = `translate(${p.x}px, ${p.y}px)${p.pressed ? ' scale(0.7)' : ''}`;
      const under = document.elementFromPoint(p.x, p.y)?.closest(TARGETS) ?? null;
      swapHover(hovered, under);
      if (p.pressed && !wasPressed.current) fire(under);
      wasPressed.current = p.pressed;
    };
    const off = loop.subscribe(paint);
    return () => {
      off();
      swapHover(hovered, null);
    };
  }, [loop]);

  return <div ref={el} className="reticle" aria-hidden="true" />;
}

function swapHover(ref: React.MutableRefObject<Element | null>, next: Element | null) {
  if (ref.current === next) return;
  ref.current?.classList.remove('corner-mark');
  next?.classList.add('corner-mark');
  ref.current = next;
}

function fire(target: Element | null) {
  if (!(target instanceof HTMLElement)) return;
  target.focus({ preventScroll: true });
  target.click();
}
