import Buttons from './Buttons';
import GameCanvas from './GameCanvas';
import type { Game, Hud } from './game';
import type { InputBus } from './input';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

type Props = {
  game: Game;
  bus: InputBus;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  round: number;
  hud: Hud;
  onHud: (h: Hud) => void;
  onBack: () => void;
  onAgain: () => void;
  isTouch: boolean;
  title: string;
  hint: string;
};

/** La partida en curso: marcador, lienzo y, en teléfono, los botones del pulgar. */
export default function ArcadeStage(props: Props) {
  const { game, bus, canvasRef, round, hud, onHud, onBack, onAgain, isTouch, title, hint } = props;
  const { t } = useLang();

  return (
    <div className={`arcade__stage panel${isTouch ? ' arcade__stage--full' : ''}`}>
      <div className="arcade__hud mono">
        <span className="arcade__name">{title}</span>
        <span>
          {t(S.arcade.score)} <b>{hud.score}</b>
        </span>
        <span className="arcade__extra">{hud.extra}</span>
        <button className="btn" data-target onClick={onBack}>
          {isTouch ? '×' : t(S.arcade.back)}
        </button>
      </div>

      <GameCanvas game={game} bus={bus} canvasRef={canvasRef} onHud={onHud} round={round} />

      {isTouch && <Buttons bus={bus} hint={hint} />}
      {!isTouch && <p className="arcade__touch mono mono--sm">{hint}</p>}

      {hud.isOver && (
        <div className="arcade__over">
          <h3>{t(S.arcade.over)}</h3>
          <p className="mono">
            {t(S.arcade.score)} {hud.score}
          </p>
          <div className="arcade__overActions">
            <button className="btn btn--red" data-target onClick={onAgain}>
              {t(S.arcade.again)}
            </button>
            <button className="btn" data-target onClick={onBack}>
              {t(S.arcade.back)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
