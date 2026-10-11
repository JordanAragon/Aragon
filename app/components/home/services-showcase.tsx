'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ServiceDemo from '../demos/service-demo';
import { services } from '../../data/services';
import { ArrowRight } from '../ui/icons';

/*
  Los servicios, con una demo que funciona al lado: se explica qué se recibe y
  se ve funcionando. En escritorio la ventana queda fija mientras pasan los
  servicios; en el teléfono, cada servicio lleva su demo debajo.
*/
export default function ServicesShowcase() {
  const [active, setActive] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 980px)');
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.index));
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    itemsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="showcase night" data-tone="night" aria-labelledby="showcase-title" id="servicios">
      <div className="shell">
        <p className="section-label">servicios</p>
        <div className="showcase-head">
          <h2 id="showcase-title">Cuatro formas de poner tu operación en orden. Pruébalas aquí mismo.</h2>
          <Link href="/servicios" className="text-link">
            Ver todos los servicios <ArrowRight className="arrow" />
          </Link>
        </div>
        <div className="showcase-grid">
          <ol className="showcase-list">
            {services.map((s, i) => (
              <li
                key={s.slug}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                data-index={i}
                data-active={i === active}
                className="showcase-item"
              >
                <span className="showcase-index mono">{s.index}</span>
                <h3>{s.name}</h3>
                <p className="showcase-promise">{s.promise}</p>
                <p className="showcase-summary">{s.summary}</p>
                <ul className="showcase-includes">
                  {s.includes.slice(0, 4).map((inc) => (
                    <li key={inc}>{inc}</li>
                  ))}
                </ul>
                <Link href={`/servicios/${s.slug}`} className="btn btn-ghost btn-sm">
                  Ver {s.short.toLowerCase()} <ArrowRight className="arrow" />
                </Link>
                {narrow && (
                  <div className="showcase-inline-demo">
                    <ServiceDemo slug={s.slug} running={i === active} />
                  </div>
                )}
              </li>
            ))}
          </ol>
          <div className="showcase-stage" aria-label="Demo del servicio activo">
            <div className="showcase-sticky">
              <div className="showcase-tabs" role="tablist" aria-label="Servicio">
                {services.map((s, i) => (
                  <button
                    key={s.slug}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => {
                      itemsRef.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      setActive(i);
                    }}
                  >
                    {s.short}
                  </button>
                ))}
              </div>
              {!narrow && (
                <div className="showcase-demo" key={services[active].slug}>
                  <ServiceDemo slug={services[active].slug} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
