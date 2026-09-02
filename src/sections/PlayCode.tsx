import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { reachableOrigin, secureOrigin } from '../control/lan';
import { controlUrl } from '../control/protocol';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import SenseState from './SenseState';
import type { SenseState as State } from '../control/session';

type Props = { isArmed: boolean; state: State };

/** El código para emparejar el teléfono, con la dirección que el teléfono sí alcanza. */
export default function PlayCode({ isArmed, state }: Props) {
  const { t } = useLang();
  const [origin, setOrigin] = useState<string | null>(null);
  const [https, setHttps] = useState<string | null>(null);

  useEffect(() => {
    reachableOrigin().then(setOrigin);
    secureOrigin().then(setHttps);
  }, []);

  const url = state.peerId && origin ? controlUrl(state.peerId, origin) : null;
  const isWaiting = isArmed && state.phase === 'waiting';

  return (
    <div className="sense__side">
      {isWaiting && url && (
        <div className="sense__qr">
          <QRCodeSVG value={url} size={220} bgColor="#efe9dd" fgColor="#131110" level="M" />
        </div>
      )}
      {isWaiting && !url && !state.error && <p className="mono">{t(S.play.generating)}</p>}
      {isArmed && <SenseState {...state} />}
      {isWaiting && url && (
        <p className="sense__url mono">
          {t(S.play.orOpen)} <code>{url}</code> {t(S.play.onPhone)}
        </p>
      )}
      {isArmed && https && (
        <div className="sense__warn mono mono--sm">
          <p>{t(S.play.insecure)}</p>
          <a className="btn" href={https}>
            {t(S.play.openSecure)}
          </a>
        </div>
      )}
      {!isArmed && (
        <div className="sense__qr sense__qr--off mono">
          <span>{t(S.play.offBox)}</span>
        </div>
      )}
    </div>
  );
}
