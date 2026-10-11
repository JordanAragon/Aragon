import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ServiceDemo from '../../components/demos/service-demo';
import FaqList from '../../components/ui/faq-list';
import PageIntro, { CtaBand } from '../../components/ui/page-intro';
import ProcessTimeline from '../../components/ui/process-timeline';
import { ArrowRight } from '../../components/ui/icons';
import { getService, services } from '../../data/services';
import { siteUrl } from '../../data/site';
import { work } from '../../data/work';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: `${service.promise} ${service.summary}`,
    alternates: { canonical: `/servicios/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === service.slug);
  const next = services[(index + 1) % services.length];
  const related = work.filter((w) => w.service === service.name);
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.summary,
    provider: { '@type': 'ProfessionalService', name: 'Aragon', url: siteUrl },
    areaServed: 'CO',
    url: `${siteUrl}/servicios/${service.slug}`,
  };

  return (
    <>
      <PageIntro label={service.short.toLowerCase()} crumbs={[{ label: 'Servicios', href: '/servicios' }]} title={service.name} lead={service.promise}>
        <Link href="/contacto" className="btn btn-primary btn-lg">
          Hablar de mi caso <ArrowRight className="arrow" />
        </Link>
        <a href="#demo" className="btn btn-ghost btn-lg">
          Ver la demo
        </a>
      </PageIntro>

      <section className="service-demo-section night" data-tone="night" id="demo" aria-labelledby="demo-title">
        <div className="shell service-demo-grid">
          <div>
            <p className="section-label">en la práctica</p>
            <h2 id="demo-title">{service.summary}</h2>
            <p className="service-outcome">
              <span className="mono">recibes</span>
              {service.outcome}
            </p>
          </div>
          <ServiceDemo slug={service.slug} />
        </div>
      </section>

      <section className="service-detail paper" data-tone="paper" aria-labelledby="signs-title">
        <div className="shell">
          <div className="detail-block">
            <div>
              <p className="section-label">te sirve si</p>
              <h2 id="signs-title">Señales de que lo necesitas.</h2>
            </div>
            <ul className="signs-list">
              {service.signs.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>
          </div>

          <div className="detail-block">
            <div>
              <p className="section-label">qué construimos</p>
              <h2>Algunos ejemplos.</h2>
            </div>
            <ul className="examples">
              {service.examples.map((ex) => (
                <li key={ex.title}>
                  <h3>{ex.title}</h3>
                  <p>{ex.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-block">
            <div>
              <p className="section-label">qué incluye</p>
              <h2>Lo que recibes, por escrito.</h2>
            </div>
            <div>
              <ul className="includes-list">
                {service.includes.map((inc) => (
                  <li key={inc}>{inc}</li>
                ))}
              </ul>
              <p className="stack-line">
                <span className="mono">herramientas</span>
                {service.stack.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="process paper" data-tone="paper" aria-labelledby="svc-process-title">
        <div className="shell">
          <p className="section-label">cómo lo hacemos</p>
          <div className="split-head">
            <h2 id="svc-process-title">El mismo proceso para cada proyecto.</h2>
            <div>
              <p>Diagnóstico, prototipo, construcción por entregas y producción con acompañamiento.</p>
              <Link href="/como-trabajamos" className="text-link">
                Ver el proceso completo <ArrowRight className="arrow" />
              </Link>
            </div>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      <section className="service-faq night" data-tone="night" aria-labelledby="svc-faq-title">
        <div className="shell faq-grid">
          <div>
            <p className="section-label">preguntas</p>
            <h2 id="svc-faq-title">Sobre {service.short.toLowerCase()}.</h2>
            <Link href="/preguntas" className="text-link">
              Todas las preguntas <ArrowRight className="arrow" />
            </Link>
          </div>
          <FaqList items={service.faq.map((f, i) => ({ id: `${service.slug}-${i}`, q: f.q, a: f.a }))} />
        </div>
        {related.length > 0 && (
          <div className="shell related">
            <p className="section-label">trabajo relacionado</p>
            <ul className="related-list">
              {related.map((w) => (
                <li key={w.slug}>
                  <Link href={`/trabajo/${w.slug}`}>
                    <span className="related-title">{w.title}</span>
                    <span className="related-summary">{w.summary}</span>
                    <ArrowRight className="arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="shell next-link">
          <Link href={`/servicios/${next.slug}`}>
            <span className="mono">siguiente servicio</span>
            <span>{next.name}</span>
            <ArrowRight className="arrow" />
          </Link>
        </div>
      </section>

      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
    </>
  );
}
