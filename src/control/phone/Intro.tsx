import { S } from '../../i18n/strings';
import { useLang } from '../../i18n/useLang';

type Props = { status: string; onStart: () => void; isDenied: boolean };

export default function Intro({ status, onStart, isDenied }: Props) {
  const { t } = useLang();
  const isConnecting = status === 'connecting' || status === 'idle';
  const link = isConnecting ? t(S.phone.searching) : status === 'open' ? t(S.phone.found) : t(S.phone.offline);
  return (
    <div className="phone__main">
      <div>
        <h1>
          {t(S.phone.title1)} <em>{t(S.phone.title2)}</em>
        </h1>
        <p>{isDenied ? t(S.phone.denied) : t(S.phone.ask)}</p>
        <p className="mono" style={{ marginTop: 24 }}>
          {link}
        </p>
        <button className="btn btn--red" style={{ marginTop: 24 }} onClick={onStart} disabled={status !== 'open'}>
          {t(S.phone.enable)}
        </button>
      </div>
    </div>
  );
}
