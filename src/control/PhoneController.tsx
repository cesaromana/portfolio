import { useState } from 'react';
import LangSwitch from '../i18n/LangSwitch';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import Calibrating from './phone/Calibrating';
import Intro from './phone/Intro';
import Pad from './phone/Pad';
import { usePhoneLink } from './phone/usePhoneLink';
import { usePhoneSensors } from './phone/usePhoneSensors';
import { peerIdFromUrl, SECTIONS } from './protocol';

/** Página /control: el teléfono como mando. */
export default function PhoneController() {
  const { t } = useLang();
  const [hostId] = useState(peerIdFromUrl);
  const { status, remote, send } = usePhoneLink(hostId);
  const [isArmed, setArmed] = useState(false);
  const { permission, request } = usePhoneSensors(send, isArmed);

  const start = async () => {
    await request();
    setArmed(true);
    send({ t: 'recalibrate' });
  };

  const phase = remote?.phase ?? 'waiting';
  const label = SECTIONS.find((s) => s.id === remote?.section)?.label ?? '—';
  const isGranted = isArmed && permission === 'granted';
  const isReady = isGranted && phase === 'ready';
  const isCalibrating = isGranted && phase === 'calibrating';

  return (
    <main className="phone">
      <div className="phone__top">
        <span>
          {t(S.phone.state)} <b>{status === 'open' ? t(S.phone.phase[phase]) : t(S.phone.status[status])}</b>
        </span>
        <LangSwitch />
        <span>
          {t(S.phone.section)} <b>{label}</b>
        </span>
      </div>

      {!hostId && (
        <div className="phone__main">
          <p>{t(S.phone.noCode)}</p>
        </div>
      )}
      {hostId && !isCalibrating && !isReady && (
        <Intro status={status} onStart={start} isDenied={permission === 'denied' || permission === 'unsupported'} />
      )}
      {isCalibrating && <Calibrating progress={remote?.progress ?? 0} blocks={remote?.blocks ?? 0} hint={remote?.hint ?? 'still'} />}
      {isReady && <Pad section={label} send={send} />}

      <div className="phone__foot">
        <button className="btn" onClick={() => send({ t: 'recalibrate' })} disabled={!isArmed}>
          {t(S.phone.recal)}
        </button>
        <a className="btn" href="/">
          {t(S.phone.exit)}
        </a>
      </div>
      <div className="phone__landscape">{t(S.phone.landscape)}</div>
    </main>
  );
}
