import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { audioFocus } from '../audio/focus';
import { sonicUrl } from '../data/media';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import { fitFrame } from './fit-frame';
import GameBoy from './GameBoy';

export default function Sonic() {
  const { t } = useLang();
  const isDesktop = useIsDesktop();
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    audioFocus.claim('sonic');
    return () => audioFocus.release('sonic');
  }, [isPlaying]);

  return (
    <div className="sub">
      <div className="sub__title">
        <h3>{t(S.about.sonic)}</h3>
        <span className="mono">{t(S.about.sonicSub)}</span>
      </div>
      {!isPlaying && (
        <div className="sonic">
          <div className="sonic__speed" aria-hidden="true" />
          <div className="sonic__idle">
            <h4>{t(S.about.sonicIdle)}</h4>
            <button className="btn" data-target onClick={() => setPlaying(true)}>
              {t(S.about.sonicPlay)}
            </button>
            <p className="mono mono--sm" style={{ marginTop: 14, color: '#b8afa0' }}>
              {isDesktop ? t(S.about.sonicKeys) : '↑ ↓ ← → · A'}
            </p>
          </div>
        </div>
      )}
      {isPlaying && isDesktop && (
        <div className="sonic">
          <iframe
            title="Open Sonic"
            src={sonicUrl}
            allow="fullscreen; gamepad"
            onLoad={(e) => fitFrame(e.currentTarget)}
          />
        </div>
      )}
      {isPlaying && !isDesktop && createPortal(<GameBoy src={sonicUrl} onClose={() => setPlaying(false)} />, document.body)}
      <p className="sub__note">{t(S.about.sonicNote)}</p>
    </div>
  );
}
