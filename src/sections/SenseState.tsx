import { BLOCKS } from '../control/calibration';
import { SECTIONS, type HintKey, type Phase } from '../control/protocol';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

type Props = { phase: Phase; progress: number; hint: HintKey; section: string; error: string | null };

export default function SenseState({ phase, progress, hint, section, error }: Props) {
  const { t } = useLang();
  const sectionLabel = SECTIONS.find((s) => s.id === section)?.label ?? section;
  return (
    <div className="sense__state" aria-live="polite">
      <div className="row">
        <span className="k">{t(S.play.state)}</span>
        <span className={`v ${phase === 'ready' ? 'blue' : phase === 'lost' ? 'red' : ''}`}>{t(S.play.phases[phase])}</span>
      </div>
      <div className="row">
        <span className="k">{t(S.play.calib)}</span>
        <span className="v">
          <span className="blocks" aria-label={`${progress} / ${BLOCKS}`}>
            {Array.from({ length: BLOCKS }, (_, i) => (
              <i key={i} className={i < progress ? 'on' : ''} />
            ))}
          </span>
        </span>
      </div>
      <div className="row">
        <span className="k">{t(S.play.section)}</span>
        <span className="v">{sectionLabel}</span>
      </div>
      <div className="row">
        <span className="k">{t(S.play.hint)}</span>
        <span className={`v ${hint === 'shaken' ? 'red' : ''}`}>{t(S.play.hints[hint])}</span>
      </div>
      {error && (
        <div className="row">
          <span className="k">{t(S.play.error)}</span>
          <span className="v red">{error}</span>
        </div>
      )}
    </div>
  );
}
