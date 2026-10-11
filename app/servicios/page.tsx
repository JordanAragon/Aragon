import type { Metadata } from 'next';
import Link from 'next/link';
import PageIntro, { CtaBand } from '../components/ui/page-intro';
import { ArrowRight } from '../components/ui/icons';
import { services } from '../data/services';

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Apps web a medida, automatización de procesos, agentes de IA e infraestructura. Qué hacemos, para quién y qué recibes en cada caso.',
  alternates: { canonical: '/servicios' },
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        label="servicios"
        title="Cuatro servicios, un mismo objetivo: que tu operación funcione en orden."
        lead="Casi siempre se combinan: una app para ordenar la información, automatizaciones para moverla, un agente para responder y la infraestructura que lo sostiene. Empezamos por lo que más te duele hoy."
      />
      <section className="services-index paper" data-tone="paper" aria-label="Servicios">
        <div className="shell">
          <ol className="service-rows">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`} className="service-row">
                  <span className="service-row-index mono">{s.index}</span>
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
    </>
  );
}
