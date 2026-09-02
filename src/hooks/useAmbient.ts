import { useCallback, useEffect, useRef, useState } from 'react';
import { audioFocus } from '../audio/focus';
import { LofiLoop } from '../audio/lofi';

/** Música de fondo: apagada por defecto, se enciende con un gesto del visitante. */
export function useAmbient() {
  const loop = useRef<LofiLoop | null>(null);
  const [isOn, setOn] = useState(false);

  useEffect(() => {
    loop.current = new LofiLoop();
    const off = audioFocus.subscribe((isBusy) => loop.current?.duck(isBusy));
    return () => {
      off();
      loop.current?.stop();
    };
  }, []);

  const toggle = useCallback(async () => {
    const l = loop.current;
    if (!l) return;
    if (l.isOn) l.stop();
    else {
      // Encender a mano gana: se libera cualquier turno tomado antes.
      audioFocus.clear();
      await l.start();
    }
    setOn(l.isOn);
  }, []);

  return { isOn, toggle };
}
