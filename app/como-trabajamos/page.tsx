import type { Metadata } from 'next';
import FaqList from '../components/ui/faq-list';
import PageIntro, { CtaBand } from '../components/ui/page-intro';
import NextChapter from '../components/ui/next-chapter';
import ProcessTimeline from '../components/ui/process-timeline';
import { faqs } from '../data/faq';
import { principles } from '../data/process';

export const metadata: Metadata = {
  title: 'Cómo trabajamos',
  description: 'Diagnóstico, prototipo, construcción por entregas y producción. Qué pones tú y qué recibes en cada fase de un proyecto con Aragon.',
  alternates: { canonical: '/como-trabajamos' },
};

export default function HowWeWorkPage() {
  const related = faqs.filter((f) => f.topic === 'Costos y tiempos' || f.topic === 'Durante el proyecto');
  return (
    <>
      <PageIntro
        figure="proceso"
        label="cómo trabajamos"
        title="Ves algo funcionando antes de comprometer el proyecto completo."
        lead="Cada fase termina con algo concreto que recibes. Así las decisiones se toman sobre algo que se puede tocar, no sobre un documento."
      />
      <section className="process paper" data-tone="paper" aria-labelledby="fases-title">
        <div className="shell">
          <p className="section-label">las fases</p>
          <h2 id="fases-title" className="sr-only">
            Las fases
          </h2>
          <ProcessTimeline detailed />
        </div>
      </section>

      <section className="night principles-section" data-tone="night" aria-labelledby="principios-title">
        <div className="shell">
          <p className="section-label">cómo decidimos</p>
          <div className="split-head">
            <h2 id="principios-title">Cuatro reglas que no negociamos.</h2>
            <p>Son las que explican por qué a veces te recomendamos construir menos.</p>
          </div>
          <ul className="principles principles-wide">
            {principles.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faq-section paper" data-tone="paper" aria-labelledby="proceso-faq">
        <div className="shell faq-grid">
          <div>
            <p className="section-label">preguntas</p>
            <h2 id="proceso-faq">Costos, tiempos y cambios.</h2>
          </div>
          <FaqList items={related} idPrefix="proceso-" />
        </div>
      </section>
      <CtaBand />
      <NextChapter from="/como-trabajamos" />
    </>
  );
}
