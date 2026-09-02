import { useEffect, useRef, useState } from 'react';
import { audioFocus } from '../audio/focus';
import { tracks } from '../data/media';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

function searchUrl(title: string, artist: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`;
}

export default function Music() {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);
  // El reproductor de Spotify llega en blanco: se tapa hasta que carga.
  const [isReady, setReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const tr = tracks[current];
  const src = tr.id ? `https://open.spotify.com/embed/${tr.kind}/${tr.id}?utm_source=generator&theme=0` : null;

  const pick = (i: number) => {
    if (i === current) return;
    setReady(false);
    setCurrent(i);
  };

  // No hay forma de saber desde fuera si le dio a play, pero pulsar dentro del
  // reproductor le pasa el foco al iframe: eso basta para cederle el audio.
  useEffect(() => {
    const onBlur = () => {
      if (document.activeElement === frame.current) audioFocus.claim('spotify');
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, []);

  return (
    <div className="sub">
      <div className="sub__title">
        <h3>{t(S.about.music)}</h3>
        <span className="mono">{t(S.about.musicSub)}</span>
      </div>
      <div className="deck">
        <div className="deck__head mono mono--sm">
          <span className="deck__now">
            <i className="deck__dot" /> {t(S.about.playing)}
          </span>
          <span>{tr.artist}</span>
        </div>

        <div className="deck__frame">
          {src && (
            <>
              <div className={`deck__loading${isReady ? ' is-gone' : ''}`} aria-hidden="true">
                <span className="deck__sweep" />
                <span className="mono mono--sm">{tr.title}</span>
              </div>
              <iframe
                ref={frame}
                key={tr.id}
                className={isReady ? 'is-ready' : ''}
                title={`Spotify: ${tr.title}`}
                src={src}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                onLoad={() => setReady(true)}
              />
            </>
          )}
          {!src && (
            <a className="deck__missing" href={searchUrl(tr.title, tr.artist)} target="_blank" rel="noreferrer">
              <b>{tr.title}</b>
              <span className="mono mono--sm">{t(S.about.openSpotify)}</span>
            </a>
          )}
        </div>

        <ul className="deck__list">
          {tracks.map((x, i) => (
            <li key={x.title}>
              <button className="deck__track" aria-pressed={i === current} onClick={() => pick(i)}>
                <span className="mono mono--sm">{String(i + 1).padStart(2, '0')}</span>
                <span className="t">{x.title}</span>
                <span className="a mono mono--sm">{x.artist}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="sub__note">{t(S.about.musicNote)}</p>
    </div>
  );
}
