import LangSwitch from '../i18n/LangSwitch';
import { profile } from '../data/profile';
import { S } from '../i18n/strings';
import { useLang } from '../i18n/useLang';

type Props = {
  isNight: boolean;
  onToggleNight: () => void;
  isSound: boolean;
  onToggleSound: () => void;
};

export default function Topbar({ isNight, onToggleNight, isSound, onToggleSound }: Props) {
  const { t } = useLang();
  return (
    <header className="topbar mono">
      <a href="#inicio">{profile.handle}</a>
      <nav aria-label="Secciones">
        <a href="#proyectos">{t(S.nav.projects)}</a>
        <a href="#experiencia">{t(S.nav.work)}</a>
        <a href="#juega">{t(S.nav.play)}</a>
        <a href="#herramientas">{t(S.nav.stack)}</a>
        <a href="#sobre-mi">{t(S.nav.about)}</a>
        <a href="#contacto">{t(S.nav.contact)}</a>
      </nav>
      <div className="topbar__right">
        <LangSwitch />
        <button className={`sound-toggle${isSound ? ' is-on' : ''}`} onClick={onToggleSound} aria-pressed={isSound}>
          <i />
          <i />
          <i />
          <i />
          <span>{isSound ? t(S.top.sound) : t(S.top.silence)}</span>
        </button>
        <button
          className="night-toggle"
          onClick={onToggleNight}
          aria-pressed={isNight}
          aria-label={t(S.top.night)}
          data-tip={isNight ? t(S.top.night) : t(S.top.paper)}
        />
      </div>
    </header>
  );
}
