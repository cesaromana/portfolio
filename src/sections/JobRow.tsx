import type { Job } from '../data/experience';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

type Props = { job: Job; index: number; isOpen: boolean; onToggle: () => void };

/**
 * Una entrada del expediente, desplegable.
 *
 * La clase de aparición vive en el <li>, que React nunca reescribe: si se
 * pusiera en el mismo elemento cuyo className cambia al abrir, React lo
 * sobrescribiría y la entrada se quedaría invisible.
 */
export default function JobRow({ job, index, isOpen, onToggle }: Props) {
  const { t } = useLang();
  const id = `job-${index}`;

  return (
    <li className="reveal" data-stagger={index * 60}>
      <article className={`job${job.kind === 'study' ? ' job--study' : ''}${isOpen ? ' is-open' : ''}`}>
        <div className="job__when mono">
          {job.kind === 'study' && <span className="job__kind">{t(S.work.studies)}</span>}
          <span>{t(job.period)}</span>
          <span>{t(job.where)}</span>
        </div>

        <div className="job__what">
          <button className="job__head" onClick={onToggle} aria-expanded={isOpen} aria-controls={id}>
            <h3>{job.company}</h3>
            <span className="job__sign" aria-hidden="true" />
          </button>
          <p className="job__role">{t(job.role)}</p>
          <p>{t(job.summary)}</p>

          <div className="job__fold" id={id}>
            <div className="job__foldInner">
              <h4 className="mono job__subtitle">{t(S.work.what)}</h4>
              <ul className="job__list">
                {job.details.map((d) => (
                  <li key={d.es}>{t(d)}</li>
                ))}
              </ul>
            </div>
          </div>

          <span className="mono mono--sm job__stack">{job.stack.join(' · ')}</span>
        </div>
      </article>
    </li>
  );
}
