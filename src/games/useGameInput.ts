import { useEffect, useRef } from 'react';
import type { PointerLoop } from '../control/pointer-loop';
import { InputBus } from './input';
import { bindKeys, bindRemote, bindTilt } from './sources';

/**
 * Bus de entrada estable con las fuentes que no dependen del lienzo: el
 * teléfono como mando, el giroscopio propio y el teclado. El dedo y el mouse
 * los engancha el lienzo cuando existe.
 */
export function useGameInput(remote: PointerLoop | null) {
  const bus = useRef(new InputBus());

  useEffect(() => (remote ? bindRemote(remote, bus.current) : undefined), [remote]);

  useEffect(() => (remote ? undefined : bindTilt(bus.current)), [remote]);

  useEffect(() => bindKeys(bus.current), []);

  return bus.current;
}
