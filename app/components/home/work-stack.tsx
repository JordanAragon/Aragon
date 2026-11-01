import Link from 'next/link';
import { work } from '../../data/work';
import WorkShot from '../ui/work-shot';
import { ArrowUpRight } from '../ui/icons';

const LIVE = /^(en producción|operando)/i;

/*
  El trabajo en el inicio: una lámina grande por proyecto, con su captura real.
  Al bajar, cada lámina se queda fija arriba y la siguiente sube encima, como
  hojas que se apilan: se ve uno a la vez, a tamaño completo. En el teléfono
  van una debajo de otra.
*/
export default function WorkStack() {
  const total = String(work.length).padStart(2, '0');
  return (
    <ol className="work-stack">
      {work.map((item, i) => (
        <li key={item.slug} className="work-card" style={{ '--i': i } as React.CSSProperties}>
          <Link href={`/trabajo/${item.slug}`} className="work-card-link">
            <div className="work-card-info">
              <p className="work-card-head mono">
                <span className="tabular">
                  {String(i + 1).padStart(2, '0')} / {total}
                </span>
                <span>{item.kind}</span>
              </p>
              <h3 className="work-card-title">{item.title}</h3>
              <p className="work-card-summary">{item.summary}</p>
              <dl className="work-card-facts mono">
                <div>
                  <dt>estado</dt>
                  <dd className="work-row-status" data-live={LIVE.test(item.status)}>
                    {item.status}
                  </dd>
                </div>
                {item.service ? (
                  <div>
                    <dt>servicio</dt>
                    <dd>{item.service}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>con</dt>
                  <dd>{item.stack.join(' · ')}</dd>
                </div>
              </dl>
              <span className="work-card-cta">
                Ver el caso
                <span className="work-card-arrow" aria-hidden="true">
                  <ArrowUpRight className="arrow" />
                </span>
              </span>
            </div>
            <div className="work-card-shot">
              <span className="work-card-bar mono" aria-hidden="true">
                <span className="window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                {item.bar}
              </span>
              <WorkShot item={item} sizes="(max-width: 900px) 92vw, 760px" />
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
