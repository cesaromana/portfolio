import { useCallback, useEffect, useRef, useState } from 'react';
import Peer, { type DataConnection } from 'peerjs';
import { peerOptions } from '../peer-config';
import type { DesktopMsg, PhoneMsg } from '../protocol';

export type LinkStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

/** Lado teléfono: conecta al Peer de la PC y expone send + último estado recibido. */
export function usePhoneLink(hostId: string | null) {
  const [status, setStatus] = useState<LinkStatus>('idle');
  const [remote, setRemote] = useState<Extract<DesktopMsg, { t: 'state' }> | null>(null);
  const conn = useRef<DataConnection | null>(null);

  useEffect(() => {
    if (!hostId) return;
    setStatus('connecting');
    const peer = new Peer(peerOptions());
    peer.on('open', () => {
      const c = peer.connect(hostId, { serialization: 'json' });
      conn.current = c;
      c.on('open', () => {
        setStatus('open');
        c.send({ t: 'hello', ua: navigator.userAgent } satisfies PhoneMsg);
      });
      c.on('data', (d) => receive(d as DesktopMsg, setRemote));
      c.on('close', () => setStatus('closed'));
      c.on('error', () => setStatus('error'));
    });
    peer.on('error', () => setStatus('error'));
    return () => peer.destroy();
  }, [hostId]);

  const send = useCallback((m: PhoneMsg) => {
    if (conn.current?.open) conn.current.send(m);
  }, []);

  return { status, remote, send };
}

function receive(m: DesktopMsg, setRemote: (s: Extract<DesktopMsg, { t: 'state' }>) => void) {
  if (m.t === 'haptic') {
    navigator.vibrate?.(m.ms);
    return;
  }
  setRemote(m);
}
