import { useRef, useState } from 'react';
import { jobs } from '../data/experience';
import { useReveal } from '../hooks/useReveal';
import { useSpotlight } from '../hooks/useSpotlight';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';
import JobRow from './JobRow';

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  useReveal(root);
  useSpotlight(root, '.jobs > li');

  return (
    <section id="experiencia" className="section page" ref={root} data-section>
      <div className="section__head">
        <h2>{t(S.work.title)}</h2>
        <span className="mono">{t(S.work.sub)}</span>
      </div>
      <ol className="jobs">
        {jobs.map((job, i) => (
          <JobRow
            key={job.company}
            job={job}
            index={i}
            isOpen={open === i}
            onToggle={() => setOpen((cur) => (cur === i ? null : i))}
          />
        ))}
      </ol>
    </section>
  );
}
