import { profile } from '../data/profile';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

export default function Colophon() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer id="contacto" className="colophon page" data-section>
      <div className="colophon__grid">
        <div className="colophon__links">
          <a className="ink-link" href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="ink-link" href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="ink-link" href={profile.links.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>

        <dl className="reach">
          <dt className="mono mono--sm">{t(S.foot.mail)}</dt>
          <dd>
            <a className="ink-link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </dd>
          <dt className="mono mono--sm">{t(S.foot.phone)}</dt>
          <dd>
            <a className="ink-link" href={`tel:${profile.phone.dial}`}>
              {profile.phone.pretty}
            </a>
          </dd>
        </dl>
      </div>

      <div className="colophon__meta mono mono--sm">
        <span>{t(S.foot.cat)}</span>
        <span>{t(S.foot.made)}</span>
        <span>
          {t(profile.city)} · {year}
        </span>
      </div>
    </footer>
  );
}
