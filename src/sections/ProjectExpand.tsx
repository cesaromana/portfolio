import { useEffect } from 'react';
import type { Project } from '../data/projects';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

type Props = { project: Project; onClose: () => void };

export default function ProjectExpand({ project, onClose }: Props) {
  const { t } = useLang();
  const name = typeof project.title === 'string' ? project.title : t(project.title);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="expand" role="dialog" aria-modal="true" aria-labelledby="expand-title">
      <div className="expand__veil" onClick={onClose} />
      <article className="panel">
        <button className="btn expand__close" onClick={onClose} aria-label={t(S.projects.close)}>
          {t(S.projects.close)}
        </button>
        <span className="mono">
          {t(S.projects.panel)} {project.num}
        </span>
        <h3 id="expand-title">{name}</h3>
        <div className="expand__body">
          <div className="expand__cols">
            <div>
              {project.story.map((p) => (
                <p key={p.es}>{t(p)}</p>
              ))}
              <h4 className="mono expand__sub">{t(S.projects.has)}</h4>
              <ul className="expand__features">
                {project.features.map((f) => (
                  <li key={f.es}>{t(f)}</li>
                ))}
              </ul>
            </div>
            <dl className="mono mono--sm">
              <dt>{t(S.projects.year)}</dt>
              <dd>{project.year}</dd>
              <dt>{t(S.projects.role)}</dt>
              <dd>{t(project.role)}</dd>
              <dt>{t(S.projects.stack)}</dt>
              <dd>{project.stack.join(' · ')}</dd>
            </dl>
          </div>
          <div className="expand__actions">
            {project.repo && (
              <a className="btn btn--ink" href={project.repo} target="_blank" rel="noreferrer">
                {t(S.projects.code)}
              </a>
            )}
            {project.live && (
              <a className="btn" href={project.live} target="_blank" rel="noreferrer">
                {t(S.projects.live)}
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
