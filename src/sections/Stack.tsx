import { useEffect, useRef, useState } from 'react';
import { iconUrl, ODOO_ICON, tools } from '../data/stack';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import { useWall } from '../stack/useWall';

const ODOO = { id: 'odoo', name: 'Odoo', size: 96 };
const ALL = [...tools, { ...ODOO, group: tools[6].group }];
// En un teléfono los mismos tamaños se amontonan: se encogen para que se vean todos.
const NARROW = '(max-width: 720px)';
const SMALL_SCALE = 0.62;

/** Muro de herramientas: stickers con física. Empújalos con el mouse, arrástralos y suéltalos. */
export default function Stack() {
  const { t } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const [isNarrow, setNarrow] = useState(() => window.matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const scale = isNarrow ? SMALL_SCALE : 1;
  const wall = useWall(root, ALL.map((x) => Math.round(x.size * scale)));

  const grab = (i: number) => (e: React.PointerEvent<HTMLElement>) => {
    const body = wall.bodies[i];
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-held');
    body.held = true;
    let lastX = e.clientX;
    let lastY = e.clientY;
    const move = (ev: PointerEvent) => {
      const r = root.current?.getBoundingClientRect();
      if (!r) return;
      body.vx = (ev.clientX - lastX) * 30;
      body.vy = (ev.clientY - lastY) * 30;
      lastX = ev.clientX;
      lastY = ev.clientY;
      body.x = ev.clientX - r.left;
      body.y = ev.clientY - r.top;
    };
    const drop = () => {
      body.held = false;
      el.classList.remove('is-held');
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', drop);
      el.removeEventListener('pointercancel', drop);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', drop);
    el.addEventListener('pointercancel', drop);
  };

  return (
    <section id="herramientas" className="section page" data-section>
      <div className="section__head">
        <h2>{t(S.stack.title)}</h2>
        <span className="mono">{t(S.stack.sub)}</span>
      </div>
      <div className="wall panel" ref={root}>
        {ALL.map((tool, i) => (
          <figure
            key={tool.id}
            className="sticker"
            style={{ width: Math.round(tool.size * scale), height: Math.round(tool.size * scale) }}
            onPointerDown={grab(i)}
          >
            {'text' in tool && tool.text ? (
              <span className="sticker__word">{tool.name}</span>
            ) : (
              <img src={tool.id === 'odoo' ? ODOO_ICON : iconUrl(tool.id)} alt={tool.name} draggable={false} />
            )}
            <figcaption className="mono mono--sm">
              {tool.name} <i>{t(tool.group)}</i>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
