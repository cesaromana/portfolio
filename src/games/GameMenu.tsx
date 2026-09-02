import { useRef } from 'react';
import { useSpotlight } from '../hooks/useSpotlight';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import { catalog } from './catalog';
import type { GameId } from './game';

type Props = { onPick: (id: GameId) => void; useTilt: boolean };

export default function GameMenu({ onPick, useTilt }: Props) {
  const { t } = useLang();
  const root = useRef<HTMLDivElement>(null);
  useSpotlight(root, '.arcade__choice');

  return (
    <div className="arcade__menu" ref={root}>
      <p className="mono">{t(S.arcade.pick)}</p>
      <div className="arcade__choices">
        {catalog.map((e) => (
          <button key={e.id} className="panel panel--misreg arcade__choice" data-target onClick={() => onPick(e.id)}>
            <span className="panel__num mono">{e.mark}</span>
            <h3>{t(e.title)}</h3>
            <p>{t(useTilt ? e.tiltHow : e.how)}</p>
            <span className="arcade__go mono mono--sm">{t(S.arcade.start)} →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
