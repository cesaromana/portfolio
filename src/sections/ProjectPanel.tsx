import type { Project } from '../data/projects';
import PanelArt from './PanelArt';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

type Props = { project: Project; index: number; onOpen: (p: Project) => void };

export default function ProjectPanel({ project, index, onOpen }: Props) {
  const { t } = useLang();
  const name = typeof project.title === 'string' ? project.title : t(project.title);
  return (
    <button
      type="button"
      className={`panel panel--misreg reveal p-${project.id}`}
      data-stagger={index * 40}
      onClick={() => onOpen(project)}
      aria-label={`${t(S.projects.open)} ${name}`}
    >
      <span className="panel__num mono">{project.num}</span>
      <PanelArt hue={project.hue} seed={index} />
      <div className="panel__cap">
        <h3>{name}</h3>
        <p>{t(project.line)}</p>
        <span className="stack mono mono--sm">{project.stack.slice(0, 4).join(' · ')}</span>
      </div>
    </button>
  );
}
