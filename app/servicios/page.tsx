import type { Metadata } from 'next';
import Link from 'next/link';
import PageIntro, { CtaBand } from '../components/ui/page-intro';
import NextChapter from '../components/ui/next-chapter';
import ServiceGlyph from '../components/ui/service-glyph';
import OrderStory from '../components/home/order-story';
import { ArrowRight } from '../components/ui/icons';
import { services } from '../data/services';

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Desarrollo agéntico con agentes de IA para WhatsApp, automatización de procesos y software a la medida sobre infraestructura web de alta velocidad. Qué hacemos, para quién y qué recibes en cada caso.',
  alternates: { canonical: '/servicios' },
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        figure="servicios"
        label="servicios"
        title="Tres servicios, un mismo objetivo: que el trabajo manual se haga solo."
        lead="Casi siempre se combinan: un agente que atiende tu WhatsApp, automatizaciones que mueven la información y un software a la medida que la ordena. Aprobado el alcance, ves un prototipo funcionando en 48 horas."
      />
      {/* El mismo recorrido del inicio: quien llega por la barra ve cada servicio explicado con las piezas. */}
      <OrderStory />
      <section className="services-index paper" data-tone="paper" aria-label="Servicios" data-glyphs="on">
        <div className="shell">
          <ol className="service-rows">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`} className="service-row">
                  <span className="service-row-index mono">
                    <ServiceGlyph forma={s.forma} />
                    {s.index}
                  </span>
                  <span className="service-row-main">
                    <span className="service-row-verb mono">{s.verb.toLowerCase()}</span>
                    <span className="service-row-name">{s.name}</span>
                    <span className="service-row-promise">{s.promise}</span>
                  </span>
                  <span className="service-row-signs">
                    <span className="mono">te sirve si…</span>
                    <ul>
                      {s.signs.slice(0, 2).map((sign) => (
                        <li key={sign}>{sign}</li>
                      ))}
                    </ul>
                  </span>
                  <ArrowRight className="service-row-arrow" />
                </Link>
              </li>
            ))}
          </ol>
          <div className="services-combo">
            <h2>¿No sabes cuál necesitas?</h2>
            <p>Es lo normal. En la primera llamada revisamos tu proceso y te decimos por dónde conviene empezar; muchas veces la respuesta es más pequeña de lo que esperas.</p>
            <Link href="/contacto" className="btn btn-primary">
              Agendar una llamada <ArrowRight className="arrow" />
            </Link>
          </div>
        </div>
      </section>
      <CtaBand />
      <NextChapter from="/servicios" />
    </>
  );
}
