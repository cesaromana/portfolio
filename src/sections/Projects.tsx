import { useCallback, useRef, useState } from 'react';
import { projects, type Project } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import { useSpotlight } from '../hooks/useSpotlight';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import ProjectExpand from './ProjectExpand';
import ProjectPanel from './ProjectPanel';

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLang();
  const [open, setOpen] = useState<Project | null>(null);
  useReveal(root);
  useSpotlight(root, '.strip .panel');
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="proyectos" className="section page" ref={root} data-section>
      <div className="section__head">
        <h2>{t(S.projects.title)}</h2>
        <span className="mono">{t(S.projects.sub)}</span>
      </div>
      <div className="strip">
        {projects.map((p, i) => (
          <ProjectPanel key={p.id} project={p} index={i} onOpen={setOpen} />
        ))}
      </div>
      {open && <ProjectExpand project={open} onClose={close} />}
    </section>
  );
}
