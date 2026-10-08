
'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import { work } from '../data/work';
import TextScrollTitle from './skiper/text-scroll-title';
import WorkEvidence from './work-evidence';

export default function SelectedWork() {
  const ref = useRef<HTMLElement>(null);
  const scroll = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(scroll, { stiffness: 80, damping: 28, mass: 0.3 });

  return (
    <section id="trabajo" ref={ref} className="v8-work section-shell" aria-labelledby="work-title">
      <div className="page-shell">
        <div className="v8-section-heading">
          <div>
            <span className="section-number">05</span>
            <span className="section-label">TRABAJO SELECCIONADO</span>
          </div>
          <TextScrollTitle
            id="work-title"
            segments={['Lo que ya existe.', { text: 'No sólo lo que imaginamos.', className: 'title-muted' }]}
          />
        </div>

        <div className="v8-work-proof">
          <span>PROYECTOS REALES / SISTEMAS CONSTRUIDOS</span>
          <p>La parte experimental vive en Exploraciones. Aquí sólo entra trabajo que puede describirse con hechos.</p>
        </div>

        <div className="v8-work-list">
          {work.map((item) => (
            <article className="v8-work-item" key={item.slug}>
              <div className="v8-work-index">
                <span>{item.number}</span>
                <small>{item.status}</small>
              </div>

              <div className="v8-work-copy">
                <span>{item.type}</span>
                <h3>{item.title}</h3>
                <strong>{item.context}</strong>
                <p>{item.description}</p>

                <div className="v8-work-meta">
                  {item.stack.map((technology) => <span key={technology}>{technology}</span>)}
                </div>

                <ul>
                  {item.proof.map((fact) => <li key={fact}>{fact}</li>)}
                </ul>

                <div className="v8-work-actions">
                  <Link href={'/work/' + item.slug}>Ver el caso <span>↗</span></Link>
                  {item.href && (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      Repositorio ↗
                    </a>
                  )}
                </div>
              </div>

              <div className="v8-work-visual">
                <WorkEvidence slug={item.slug} />
              </div>
            </article>
          ))}
        </div>

        <motion.div className="v8-work-progress" style={{ scaleX: progress, transformOrigin: 'left' }} />
      </div>
    </section>
  );
}
