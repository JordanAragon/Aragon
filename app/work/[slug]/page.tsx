
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWorkItem, work } from '../../data/work';
import WorkEvidence from '../../components/work-evidence';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function WorkCase({ params }: Props) {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) notFound();

  return (
    <main className="v8-case">
      <header className="v8-case-header page-shell">
        <Link href="/#trabajo" className="v8-case-back">← Trabajo</Link>
        <span>ARAGON / TRABAJO SELECCIONADO</span>
      </header>

      <article className="page-shell v8-case-main">
        <div className="v8-case-kicker">
          <span>{item.number} / {item.status}</span>
          <span>{item.type}</span>
        </div>

        <h1>{item.title}</h1>
        <p className="v8-case-context">{item.context}</p>

        <div className="case-evidence-wrap">
          <WorkEvidence slug={item.slug} />
        </div>

        <section className="v8-case-block">
          <span>01 / CONTEXTO</span>
          <h2>Por qué existe.</h2>
          <p>{item.description}</p>
        </section>

        <section className="v8-case-block">
          <span>02 / SISTEMA</span>
          <h2>Qué se construyó.</h2>
          <ul className="v8-case-list">
            {item.proof.map((fact, index) => (
              <li key={fact}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {fact}
              </li>
            ))}
          </ul>
        </section>

        <section className="v8-case-block">
          <span>03 / STACK</span>
          <h2>Con qué se hizo.</h2>
          <div className="v8-case-stack">
            {item.stack.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
        </section>

        <section className="v8-case-block">
          <span>04 / ESTADO</span>
          <h2>{item.status.toLowerCase()}.</h2>
          <p>Este caso documenta trabajo construido u operado. No se presentan métricas comerciales que no puedan verificarse públicamente.</p>
        </section>

        <div className="v8-case-actions">
          {item.href && (
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              Abrir repositorio ↗
            </a>
          )}
          <Link href="/#contacto">Hablar sobre un proyecto ↗</Link>
        </div>
      </article>
    </main>
  );
}
