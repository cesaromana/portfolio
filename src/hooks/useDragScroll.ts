import { useEffect } from 'react';

const DRAG_PX = 4;

/**
 * Tira horizontal: se arrastra con el puntero. La rueda vertical se deja en paz
 * a propósito — secuestrarla pelea con el scroll de la página; para moverse de
 * lado están el arrastre, el gesto horizontal del trackpad y Shift + rueda.
 */
export function useDragScroll(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const state = { id: -1, startX: 0, startLeft: 0, moved: false };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // el dedo ya desplaza solo
      state.id = e.pointerId;
      state.moved = false;
      state.startX = e.clientX;
      state.startLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-dragging');
    };
    const onMove = (e: PointerEvent) => {
      if (state.id !== e.pointerId) return;
      const dx = e.clientX - state.startX;
      if (Math.abs(dx) > DRAG_PX) state.moved = true;
      el.scrollLeft = state.startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (state.id !== e.pointerId) return;
      state.id = -1;
      el.releasePointerCapture?.(e.pointerId);
      el.classList.remove('is-dragging');
    };
    const onClick = (e: MouseEvent) => {
      if (state.moved) e.preventDefault();
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClick, true);
    };
  }, [ref]);
}
