import Cursor from './Cursor';
import { useAmbient } from './hooks/useAmbient';
import { useIsDesktop } from './hooks/useIsDesktop';
import { useNight } from './hooks/useNight';
import Ink from './motion/Ink';
import Progress from './motion/Progress';
import About from './sections/About';
import Colophon from './sections/Colophon';
import Experience from './sections/Experience';
import Hero from './sections/Hero';
import Play from './sections/Play';
import Projects from './sections/Projects';
import Stack from './sections/Stack';
import Topbar from './sections/Topbar';

export default function Site() {
  const { night, toggle } = useNight();
  const { isOn, toggle: toggleSound } = useAmbient();
  const isDesktop = useIsDesktop();
  return (
    <>
      <Progress />
      <Topbar isNight={night} onToggleNight={toggle} isSound={isOn} onToggleSound={toggleSound} />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Play />
        <Stack />
        <About />
      </main>
      <Colophon />
      {isDesktop ? <Cursor /> : <Ink />}
    </>
  );
}
