import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import HorizontalBars from '../components/HorizontalBars.jsx';
import SplineScene from '../components/SplineScene.jsx';
import Services from '../components/Services.jsx';
import Education from '../components/Education.jsx';
import Stats from '../components/Stats.jsx';
import Contact from '../components/Contact.jsx';

/**
 * Главная страница — все секции лендинга.
 * Выделено в отдельный компонент для удобства роутинга (react-router).
 */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <HorizontalBars />
      <SplineScene />
      <Services />
      <Education />
      <Stats />
      <Contact />
    </>
  );
}
