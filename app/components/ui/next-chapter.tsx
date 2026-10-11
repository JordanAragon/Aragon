import Link from 'next/link';
import { chapters } from '../../data/site';
import { ArrowRight } from './icons';

/*
  Final de cada página: el capítulo siguiente de la historia. Quien navega solo
  desde la barra recorre lo mismo que quien hace scroll en el inicio, y la regla
  de piezas dice en qué parte del recorrido está.
*/
export default function NextChapter({ from }: { from: (typeof chapters)[number]['href'] }) {
  const index = chapters.findIndex((c) => c.href === from);
  const next = chapters[index + 1];
  if (index < 0 || !next) return null;
  return (
    <section className="next-chapter night" data-tone="night" aria-label="Siguiente capítulo">
      <div className="shell">
        <ol className="nc-rail" aria-label={`Capítulo ${index + 1} de ${chapters.length}`}>
          {chapters.map((c, i) => (
            <li key={c.href} data-state={i < index + 1 ? 'done' : i === index + 1 ? 'next' : 'later'}>
              <Link href={c.href} aria-current={i === index ? 'step' : undefined} title={c.label}>
                <span className="sr-only">{c.label}</span>
              </Link>
            </li>
          ))}
        </ol>
        <Link href={next.href} className="nc-link">
          <span className="nc-meta mono">
            siguiente · <span className="tabular">{String(index + 2).padStart(2, '0')}</span>/<span className="tabular">{String(chapters.length).padStart(2, '0')}</span> ·{' '}
            {next.label.toLowerCase()}
          </span>
          <span className="nc-title">{next.title}</span>
          <span className="nc-teaser">{next.teaser}</span>
          <span className="nc-arrow" aria-hidden="true">
            <ArrowRight />
          </span>
        </Link>
      </div>
    </section>
  );
}
