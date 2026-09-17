import AgendaSection from './components/agenda-section';
import Hero from './components/hero';
import SiteHeader from './components/site-header';
import ScrollProgress from './components/scroll-progress';
import WorkStory from './components/work-story';
import Preloader from './components/preloader';
import { CapabilitiesSection, ContextSection, Footer, MethodSection, ProblemSection } from './components/static-sections';

export default function Home() {
  return (
    <>
      <Preloader />
      <main className="site-root">
        <ScrollProgress />
        <div className="noise" aria-hidden="true" />
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <SiteHeader />
        <div id="contenido">
          <Hero />
          <ProblemSection />
          <CapabilitiesSection />
          <WorkStory />
          <ContextSection />
          <MethodSection />
          <AgendaSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
