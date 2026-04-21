import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import HorizontalBars from './components/HorizontalBars.jsx';
import SplineScene from './components/SplineScene.jsx';
import Services from './components/Services.jsx';
import Education from './components/Education.jsx';
import Stats from './components/Stats.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="relative min-h-screen bg-paper text-ink transition-colors duration-300 dark:bg-ink dark:text-paper">
      <Header />
      <main>
        <Hero />
        <About />
        <HorizontalBars />
        <SplineScene />
        <Services />
        <Education />
        <Stats />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
