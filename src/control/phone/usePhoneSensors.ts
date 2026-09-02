import { useCallback, useEffect, useRef, useState } from 'react';
import type { PhoneMsg } from '../protocol';

const SEND_HZ = 30;

type Permission = 'unknown' | 'granted' | 'denied' | 'unsupported';

type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

/** Pide permiso (iOS lo exige desde un gesto) y transmite la orientación a ~30 Hz. */
export function usePhoneSensors(send: (m: PhoneMsg) => void, isActive: boolean) {
  const [permission, setPermission] = useState<Permission>('unknown');
  const last = useRef(0);

  const request = useCallback(async () => {
    const ctor = DeviceOrientationEvent as OrientationCtor;
    if (typeof DeviceOrientationEvent === 'undefined') return setPermission('unsupported');
    if (typeof ctor.requestPermission !== 'function') return setPermission('granted');
    try {
      setPermission(await ctor.requestPermission());
    } catch {
      setPermission('denied');
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted' || !isActive) return;
    const onOrient = (e: DeviceOrientationEvent) => {
      const now = performance.now();
      if (now - last.current < 1000 / SEND_HZ) return;
      last.current = now;
      send({ t: 'orient', a: e.alpha ?? 0, b: e.beta ?? 0, g: e.gamma ?? 0 });
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, [permission, isActive, send]);

  return { permission, request };
}
