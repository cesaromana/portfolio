import { useState } from 'react';
import Reticle from '../control/Reticle';
import { useSense } from '../control/useSense';
import Arcade from '../games/Arcade';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import PlayCode from './PlayCode';

/** Juega: el teléfono como mando en PC; en teléfono, pantalla y mando a la vez. */
export default function Play() {
  const { t } = useLang();
  const isDesktop = useIsDesktop();
  const [isArmed, setArmed] = useState(false);
  const { state, session } = useSense(isArmed && isDesktop);
  const isReady = state.phase === 'ready' && session !== null;

  return (
    <section id="juega" className="sense" data-section>
      <div className="sense__grid">
        <div className="sense__head">
          <h2>{t(S.play.title)}</h2>
          <p>{isDesktop ? t(S.play.intro) : t(S.play.mobileNote)}</p>
          {isDesktop && <p className="mono">{t(S.play.tech)}</p>}
          {isDesktop && (
            <div className="sense__actions">
              {!isArmed && (
                <button className="btn btn--red" onClick={() => setArmed(true)}>
                  {t(S.play.on)}
                </button>
              )}
              {isArmed && state.phase === 'ready' && (
                <button className="btn" onClick={() => session?.recalibrate()}>
                  {t(S.play.recal)}
                </button>
              )}
              {isArmed && (
                <button className="btn" onClick={() => setArmed(false)}>
                  {t(S.play.off)}
                </button>
              )}
            </div>
          )}
        </div>

        {isDesktop && <PlayCode isArmed={isArmed} state={state} />}
      </div>

      <Arcade remote={isReady && session ? session.pointer : null} isTouch={!isDesktop} />
      {isReady && session && <Reticle loop={session.pointer} />}
    </section>
  );
}
