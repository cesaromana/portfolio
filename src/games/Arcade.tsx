import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PointerLoop } from '../control/pointer-loop';
import { useTilt } from '../hooks/useTilt';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import ArcadeStage from './ArcadeStage';
import { entryOf } from './catalog';
import type { GameId, Hud } from './game';
import GameMenu from './GameMenu';
import { tilt } from '../motion/tilt';
import { useGameInput } from './useGameInput';

type Props = { remote: PointerLoop | null; isTouch: boolean };

const EMPTY: Hud = { score: 0, extra: '', isOver: false };

/** Sala de juegos. En teléfono la partida ocupa la pantalla completa. */
export default function Arcade({ remote, isTouch }: Props) {
  const { t } = useLang();
  const canvas = useRef<HTMLCanvasElement>(null);
  const bus = useGameInput(remote);
  const { permission, enable, needsPrompt } = useTilt();
  const [id, setId] = useState<GameId | null>(null);
  const [round, setRound] = useState(0);
  const [hud, setHud] = useState<Hud>(EMPTY);

  const entry = id ? entryOf(id) : null;
  const game = useMemo(() => entry?.make() ?? null, [entry, round]);
  const isTilting = isTouch && !remote && permission === 'granted';
  const isFull = isTouch && id !== null;

  useEffect(() => {
    if (!isFull) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isFull]);

  const onHud = useCallback(
    (h: Hud) => setHud((old) => (old.score === h.score && old.extra === h.extra && old.isOver === h.isOver ? old : h)),
    [],
  );

  const pick = useCallback(
    async (next: GameId) => {
      if (isTouch && !remote && needsPrompt && permission !== 'granted') await enable();
      tilt.recenter();
      setHud(EMPTY);
      setRound((r) => r + 1);
      setId(next);
    },
    [enable, isTouch, needsPrompt, permission, remote],
  );

  const again = useCallback(() => {
    tilt.recenter();
    setHud(EMPTY);
    setRound((r) => r + 1);
  }, []);

  const back = useCallback(() => setId(null), []);

  if (!game || !entry) {
    return (
      <div className="arcade">
        <GameMenu onPick={pick} useTilt={isTilting} />
        {isTouch && permission === 'denied' && <p className="arcade__warn mono mono--sm">{t(S.arcade.noSensor)}</p>}
      </div>
    );
  }

  const stage = (
    <ArcadeStage
      game={game}
      bus={bus}
      canvasRef={canvas}
      round={round}
      hud={hud}
      onHud={onHud}
      onBack={back}
      onAgain={again}
      isTouch={isTouch}
      title={t(entry.title)}
      hint={t(isTilting ? entry.tiltHow : entry.how)}
    />
  );

  return (
    <div className="arcade is-playing">
      {isTouch && <GameMenu onPick={pick} useTilt={isTilting} />}
      {isTouch ? createPortal(stage, document.body) : stage}
    </div>
  );
}
