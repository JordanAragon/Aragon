'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import { work } from '../data/work';
import TextScrollTitle from './skiper/text-scroll-title';
import WorkProofVisual from './work-proof-visual';

export default function SelectedWork() {
  const ref = useRef<HTMLElement>(null);
  const scroll = useScroll({ target: ref, offset: ['start end', 'end start'] }).scrollYProgress;
  const progress = useSpring(scroll, { stiffness: 75, damping: 28, mass: 0.3 });

  return (
    <section id="trabajo" ref={ref} className="work section-shell" aria-labelledby="work-title">
      <div className="page-shell">
        <div className="section-heading">
          <div>
            <span className="section-number">05</span>
            <span className="section-label">SELECTED WORK</span>
          </div>
          <TextScrollTitle id="work-title" segments={['Lo que ya existe.', { text: 'No sólo lo que imaginamos.', className: 'title-muted' }]} />
        </div>

        <div className="work-intro">
          <span>BUILT / OPERATED</span>
          <p>Dos sistemas reales. Documentados como trabajo construido, no como promesas.</p>
        </div>

        <div className="work-list">
          {work.map((item) => (
            <article className="work-item" key={item.slug}>
              <div className="work-index">
                <span>{item.number}</span>
                <small>{item.status}</small>
              </div>

              <WorkProofVisual slug={item.slug} />

              <div className="work-copy">
                <span>{item.type}</span>
                <h3>{item.title}</h3>
                <strong>{item.context}</strong>
                <p>{item.description}</p>
                <div className="work-meta">
                  {item.stack.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
                <ul>
                  {item.proof.map((fact) => <li key={fact}>{fact}</li>)}
                </ul>
                <div className="work-actions">
                  <Link href={'/work/' + item.slug} className="under-link">Ver el caso <span>↗</span></Link>
                  {item.href && <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-link-dark">Repositorio ↗</a>}
                </div>
              </div>
            </article>
          ))}
        </div>

        <motion.div className="work-progress" style={{ scaleX: progress, transformOrigin: 'left' }} aria-hidden="true" />
      </div>
    </section>
  );
}
