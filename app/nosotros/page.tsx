import type { Metadata } from 'next';
import Link from 'next/link';
import PageIntro, { CtaBand } from '../components/ui/page-intro';
import NextChapter from '../components/ui/next-chapter';
import { ArrowRight, ArrowUpRight } from '../components/ui/icons';
import { principles } from '../data/process';
import { services } from '../data/services';
import { site } from '../data/site';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Aragon es un estudio de software en Cali fundado por Jordan Aragon. Un equipo pequeño a propósito: quien diseña tu sistema lo construye y lo mantiene.',
  alternates: { canonical: '/nosotros' },
};

const facts = [
  { k: 'Base', v: site.location },
  { k: 'Fundador', v: site.founder },
  { k: 'Horario', v: 'Hora de Colombia (UTC−5)' },
  { k: 'Clientes', v: 'Colombia y remoto' },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        figure="nosotros"
        label="nosotros"
        title="Un estudio pequeño a propósito."
        lead="Quien diseña tu sistema es quien lo construye y lo mantiene. Sin capas de intermediarios entre lo que pides y lo que se entrega."
      />

      <section className="about-story paper" data-tone="paper" aria-labelledby="historia-title">
        <div className="shell about-story-grid">
          <div>
            <p className="section-label">la historia</p>
            <h2 id="historia-title">De arreglar computadores a construir sistemas que corren solos.</h2>
          </div>
          <div className="prose">
            <p>
              Aragon es el estudio de software de {site.founder}, desarrollador en Cali, Colombia. Empezó arreglando computadores y redes, y esa curiosidad por entender cómo funcionan las cosas lo llevó a construirlas: primero sus propios proyectos y su propio servidor, después webs, agentes de IA y automatizaciones para negocios reales.
            </p>
            <p>
              El nombre Aragon reúne ese trabajo: AiDEN, un sistema de gestión para viveros con el vivero entero en 3D; Aragon-Server, el servidor donde probamos todo antes de llevarlo a un cliente; y los proyectos que construimos para otros.
            </p>
            <p>
              Trabajamos con pocos proyectos a la vez para poder responder por cada uno.
            </p>
            <a className="text-link" href={site.portfolioUrl} target="_blank" rel="noopener noreferrer">
              Portafolio de {site.founder} <ArrowUpRight className="arrow" />
            </a>
          </div>
        </div>
        <div className="shell">
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="night principles-section" data-tone="night" aria-labelledby="valores-title">
        <div className="shell">
          <p className="section-label">en qué creemos</p>
          <div className="split-head">
            <h2 id="valores-title">Cuatro reglas para cada proyecto.</h2>
            <p>Son la razón por la que a veces te recomendamos construir menos de lo que pediste.</p>
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

      <section className="about-services paper" data-tone="paper" aria-labelledby="hacemos-title">
        <div className="shell">
          <p className="section-label">qué hacemos</p>
          <h2 id="hacemos-title">Lo que construimos.</h2>
          <ul className="about-service-list">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`}>
                  <span className="mono">{s.verb.toLowerCase()}</span>
                  <span className="about-service-name">{s.name}</span>
                  <span className="about-service-promise">{s.promise}</span>
                  <ArrowRight className="arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand title="¿Hablamos de tu proyecto?" />
      <NextChapter from="/nosotros" />
    </>
  );
}
