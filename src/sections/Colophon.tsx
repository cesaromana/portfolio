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
            <a className="ink-link reach__wa" href={profile.phone.whatsapp} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.65-1.23-1.46-1.38-1.71-.14-.24-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.65 4.2 3.71.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z"
                />
              </svg>
              {profile.phone.pretty}
            </a>
            <span className="reach__hint mono mono--sm">{t(S.foot.phoneHint)} →</span>
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
