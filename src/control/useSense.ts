import { useEffect, useRef, useState } from 'react';
import { SenseSession, type SenseState } from './session';

const INITIAL: SenseState = { peerId: null, phase: 'waiting', progress: 0, hint: 'wait', section: 'inicio', error: null };

/** Abre la sesión del sentido arácnido solo cuando se pide (isArmed). */
export function useSense(isArmed: boolean) {
  const [state, setState] = useState<SenseState>(INITIAL);
  const session = useRef<SenseSession | null>(null);

  useEffect(() => {
    if (!isArmed) return;
    const s = new SenseSession(setState);
    session.current = s;
    return () => {
      s.destroy();
      session.current = null;
      setState(INITIAL);
    };
  }, [isArmed]);

  return { state, session: session.current };
}
