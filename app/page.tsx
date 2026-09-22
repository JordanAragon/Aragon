import AboutSection from './components/about-section';
import AgendaSection from './components/agenda-section';
import CursorOrbit from './components/cursor-orbit';
import Hero from './components/hero';
import LabSection from './components/lab-section';
import Preloader from './components/preloader';
import { Footer, MethodSection, ProblemSection } from './components/static-sections';
import ScrollProgress from './components/scroll-progress';
import SelectedWork from './components/selected-work';
import SiteHeader from './components/site-header';
import SystemSection from './components/system-section';
import WhatWeBuild from './components/what-we-build';

export default function Home() {
  return (
    <>
      <Preloader />
      <main className="site-root">
        <CursorOrbit />
        <ScrollProgress />
        <div className="noise" aria-hidden="true" />
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <SiteHeader />
        <div id="contenido">
          <Hero />
          <ProblemSection />
          <SystemSection />
          <WhatWeBuild />
          <SelectedWork />
          <MethodSection />
          <AboutSection />
          <LabSection />
          <AgendaSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
