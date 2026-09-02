import { useCallback, useEffect, useState } from 'react';
import { tilt } from '../motion/tilt';
import type { SensorPermission } from '../motion/permission';

/**
 * Acceso a la inclinación del teléfono. No re-renderiza con cada lectura:
 * quien necesite el valor continuo se suscribe a `source`.
 */
export function useTilt() {
  const [permission, setPermission] = useState<SensorPermission>(tilt.permission);

  useEffect(() => {
    tilt.tryQuietly();
  }, []);

  const enable = useCallback(async () => {
    setPermission(await tilt.enable());
  }, []);

  return { permission, enable, source: tilt, needsPrompt: tilt.needsPrompt };
}
