import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import type { InputBus } from './input';

const HAPTIC_MS = 10;

type Props = { bus: InputBus; hint: string };

/** Botones A y B para el pulgar. Solo en pantallas táctiles. */
export default function Buttons({ bus, hint }: Props) {
  const { t } = useLang();

  const hold = (name: 'a' | 'b') => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      bus.button(name, true);
      navigator.vibrate?.(HAPTIC_MS);
    },
    onPointerUp: () => bus.button(name, false),
    onPointerCancel: () => bus.button(name, false),
    onPointerLeave: () => bus.button(name, false),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  return (
    <div className="thumbs">
      <p className="thumbs__hint mono mono--sm">{hint}</p>
      <div className="thumbs__row">
        <button className="thumbs__btn thumbs__btn--b" {...hold('b')} aria-label="B">
          B
        </button>
        <button className="thumbs__btn thumbs__btn--a" {...hold('a')} aria-label="A">
          A
        </button>
      </div>
      <p className="thumbs__note mono mono--sm">{t(S.arcade.thumbNote)}</p>
    </div>
  );
}
