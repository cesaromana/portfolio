import { useRef } from 'react';
import { useProgress } from '../hooks/useProgress';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

/**
 * La cita cierra la doble página a pantalla completa: las palabras se encienden
 * una a una mientras subes, y el bloque se apaga al salir.
 */
export default function Oikawa() {
  const { t } = useLang();
  const root = useRef<HTMLDivElement>(null);
  useProgress(root);
  const words = t(S.about.oikawa).split(' ');

  return (
    <div className="oikawa" ref={root}>
      <blockquote className="oikawa__line" style={{ ['--n' as string]: words.length }}>
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="oikawa__word" style={{ ['--i' as string]: i }}>
            {w}
          </span>
        ))}
      </blockquote>
      <p className="oikawa__jp">「才能は開花させるもの センスは磨くもの」</p>
      <p className="oikawa__who mono">Tooru Oikawa · Haikyu!!</p>
    </div>
  );
}
