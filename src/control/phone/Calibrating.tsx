import { S } from '../../i18n/strings';
import { useLang } from '../../i18n/useLang';
import type { HintKey } from '../protocol';

type Props = { progress: number; blocks: number; hint: HintKey };

export default function Calibrating({ progress, blocks, hint }: Props) {
  const { t } = useLang();
  const fill = blocks ? progress / blocks : 0;
  return (
    <div className="phone__main">
      <div>
        <div className="phone__ring" style={{ ['--fill' as string]: fill }}>
          <span>{Math.round(fill * 100)}%</span>
        </div>
        <h1>{t(S.phone.still)}</h1>
        <p>{t(S.play.hints[hint])}</p>
      </div>
    </div>
  );
}
