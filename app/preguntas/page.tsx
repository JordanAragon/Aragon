import type { Metadata } from 'next';
import PageIntro, { CtaBand } from '../components/ui/page-intro';
import { faqs } from '../data/faq';
import FaqExplorer from './faq-explorer';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Costos, tiempos, propiedad del código, mantenimiento, agentes de IA y datos: las preguntas que casi todos hacen antes de empezar un proyecto con Aragon.',
  alternates: { canonical: '/preguntas' },
};

const structured = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function FaqPage() {
  return (
    <>
      <PageIntro label="preguntas" title="Preguntas frecuentes." lead="Si tu pregunta no está aquí, escríbela tal cual en el contacto. Respondemos en lenguaje claro." />
      <section className="paper faq-page" data-tone="paper" aria-label="Preguntas">
        <div className="shell">
          <FaqExplorer />
        </div>
      </section>
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
    </>
  );
}
