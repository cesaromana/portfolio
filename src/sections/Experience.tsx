import { useRef } from 'react';
import { jobs } from '../data/experience';
import { useReveal } from '../hooks/useReveal';
import { useSpotlight } from '../hooks/useSpotlight';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLang();
  useReveal(root);
  useSpotlight(root, '.job');

  return (
    <section id="experiencia" className="section page" ref={root} data-section>
      <div className="section__head">
        <h2>{t(S.work.title)}</h2>
        <span className="mono">{t(S.work.sub)}</span>
      </div>
      <ol className="jobs">
        {jobs.map((job, i) => (
          <li key={job.company} className={`job reveal${job.kind === 'study' ? ' job--study' : ''}`} data-stagger={i * 60}>
            <div className="job__when mono">
              {job.kind === 'study' && <span className="job__kind">{t(S.work.studies)}</span>}
              <span>{t(job.period)}</span>
              <span>{t(job.where)}</span>
            </div>
            <div className="job__what">
              <h3>{job.company}</h3>
              <p className="job__role">{t(job.role)}</p>
              <p>{t(job.summary)}</p>
              <span className="mono mono--sm job__stack">{job.stack.join(' · ')}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
