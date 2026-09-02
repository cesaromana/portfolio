// iOS 13+ exige pedir permiso de sensores desde un gesto del usuario y sobre
// HTTPS. Android y escritorio no piden nada. Un solo lugar para las dos ramas.

export type SensorPermission = 'unknown' | 'granted' | 'denied' | 'unsupported';

type Gated = { requestPermission?: () => Promise<'granted' | 'denied'> };

export function needsPrompt() {
  if (typeof DeviceOrientationEvent === 'undefined') return false;
  return typeof (DeviceOrientationEvent as unknown as Gated).requestPermission === 'function';
}

export async function askOrientation(): Promise<SensorPermission> {
  if (typeof DeviceOrientationEvent === 'undefined') return 'unsupported';
  const gated = DeviceOrientationEvent as unknown as Gated;
  if (typeof gated.requestPermission !== 'function') return 'granted';
  try {
    return await gated.requestPermission();
  } catch {
    return 'denied';
  }
}
