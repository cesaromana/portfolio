// Open Sonic dibuja en un canvas con su propio CSS (`width:100%; max-height:100vh`),
// que deja franjas negras dentro del marco. Como el juego se sirve desde este
// mismo origen, se le puede inyectar una hoja para que llene la caja.

const STYLE_ID = 'fit-canvas';

const CSS = `
  html, body { height: 100%; margin: 0; background: #000; overflow: hidden; }
  body { display: grid; place-items: center; }
  canvas {
    width: 100% !important;
    height: 100% !important;
    max-height: none !important;
    object-fit: contain;
    display: block;
    image-rendering: pixelated;
  }
`;

/** Hace que el juego llene el marco. Silencioso si el iframe no es accesible. */
export function fitFrame(frame: HTMLIFrameElement | null) {
  const doc = frame?.contentDocument;
  if (!doc || doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  doc.head?.appendChild(style);
}
