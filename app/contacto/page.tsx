import type { Metadata } from 'next';
import ContactBlock from '../components/contact/contact-block';
import FaqList from '../components/ui/faq-list';
import { faqs } from '../data/faq';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Agenda una llamada de 30 minutos o déjanos tu caso por escrito. Te respondemos con preguntas concretas o una propuesta de llamada.',
  alternates: { canonical: '/contacto' },
};

export default function ContactPage() {
  const start = faqs.filter((f) => f.topic === 'Empezar');
  return (
    <>
      <section className="contact-section contact-page night" data-tone="night" aria-labelledby="contacto-page-title">
        <div className="shell">
          <ContactBlock headingId="contacto-page-title" level={1} />
        </div>
      </section>
      <section className="faq-section paper" data-tone="paper" aria-labelledby="contacto-faq">
        <div className="shell faq-grid">
          <div>
            <p className="section-label">antes de escribir</p>
            <h2 id="contacto-faq">Para empezar.</h2>
          </div>
          <FaqList items={start} idPrefix="contacto-" />
        </div>
      </section>
    </>
  );
}
