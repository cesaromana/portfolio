import { useEffect, useRef, useState } from 'react';
import { byGroup, groupNames, iconUrl, tools, type Group } from '../data/stack';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import { useWall } from '../stack/useWall';

// En un teléfono los mismos tamaños se amontonan: se encogen para que se vean todos.
const NARROW = '(max-width: 720px)';
const SMALL_SCALE = 0.62;
const GROUPS: Group[] = ['lang', 'frame', 'data', 'tool'];

/** Muro de herramientas con física, y debajo la lista ordenada por tipo. */
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
  const wall = useWall(root, tools.map((x) => Math.round(x.size * scale)));

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
        {tools.map((tool, i) => (
          <figure key={tool.id} className="sticker" style={{ width: Math.round(tool.size * scale), height: Math.round(tool.size * scale) }} onPointerDown={grab(i)}>
            {tool.text ? (
              <span className="sticker__word">{tool.name}</span>
            ) : (
              <img src={iconUrl(tool)} alt={tool.name} draggable={false} />
            )}
            <figcaption className="mono mono--sm">{tool.name}</figcaption>
          </figure>
        ))}
      </div>

      <dl className="kit">
        {GROUPS.map((group) => (
          <div className="kit__row" key={group}>
            <dt className="mono mono--sm">{t(groupNames[group])}</dt>
            <dd>{byGroup(group).map((tool) => tool.name).join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
