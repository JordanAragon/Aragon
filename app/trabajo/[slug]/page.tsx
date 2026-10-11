import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageIntro, { CtaBand } from '../../components/ui/page-intro';
import NextChapter from '../../components/ui/next-chapter';
import WorkShot from '../../components/ui/work-shot';
import { ArrowRight, ArrowUpRight } from '../../components/ui/icons';
import { services } from '../../data/services';
import { getWorkItem, work } from '../../data/work';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) return {};
  return { title: item.title, description: item.summary, alternates: { canonical: `/trabajo/${item.slug}` } };
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) notFound();
  const index = work.findIndex((w) => w.slug === item.slug);
  const next = work[(index + 1) % work.length];
  const service = services.find((s) => s.name === item.service);

  return (
    <>
      <PageIntro label={item.title.toLowerCase()} crumbs={[{ label: 'Trabajo', href: '/trabajo' }]} title={item.title} lead={item.summary}>
        {item.href && (
          <a className="btn btn-primary" href={item.href} target="_blank" rel="noopener noreferrer">
            {item.hrefLabel ?? 'Abrir'} <ArrowUpRight className="arrow" />
          </a>
        )}
      </PageIntro>

      <section className="case night" data-tone="night" aria-label={`Caso ${item.title}`}>
        <div className="shell">
          <div className="case-visual registered">
            <div className="case-window">
              <div className="work-peek-bar" aria-hidden="true">
                <span className="window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="work-peek-titles">
                  <span>{item.bar}</span>
                </span>
              </div>
              <WorkShot item={item} sizes="(max-width: 1400px) 94vw, 1320px" priority />
            </div>
          </div>
          <dl className="case-meta">
            <div>
              <dt>Tipo</dt>
              <dd>{item.kind}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{item.status}</dd>
            </div>
            <div>
              <dt>Servicio</dt>
              <dd>{service ? <Link href={`/servicios/${service.slug}`}>{service.name}</Link> : item.service}</dd>
            </div>
            <div>
              <dt>Herramientas</dt>
              <dd>{item.stack.join(', ')}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="case-body paper" data-tone="paper" aria-label="Detalle del caso">
        <div className="shell">
          <div className="detail-block">
            <div>
              <p className="section-label">el problema</p>
            </div>
            <p className="case-problem">{item.problem}</p>
          </div>
          <div className="detail-block">
            <div>
              <p className="section-label">qué construimos</p>
            </div>
            <ul className="examples">
              {item.built.map((b) => (
                <li key={b.title}>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="detail-block">
            <div>
              <p className="section-label">decisiones</p>
            </div>
            <ul className="decisions">
              {item.decisions.map((d) => (
                <li key={d.title}>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="night next-case" data-tone="night">
        <div className="shell next-link">
          <Link href={`/trabajo/${next.slug}`}>
            <span className="mono">siguiente proyecto</span>
            <span>{next.title}</span>
            <ArrowRight className="arrow" />
          </Link>
        </div>
      </section>
      <CtaBand />
      <NextChapter from="/trabajo" />
    </>
  );
}
