'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { work } from '../data/work';
import TextScrollTitle from './skiper/text-scroll-title';

export default function SelectedWork() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const scroll = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(scroll, { stiffness: 80, damping: 28, mass: 0.3 });

  return (
    <section id="trabajo" ref={ref} className="v8-work section-shell" aria-labelledby="work-title">
      <div className="page-shell">
        <div className="v8-section-heading">
          <div>
            <span className="section-number">05</span>
            <span className="section-label">SELECTED WORK</span>
          </div>
          <TextScrollTitle id="work-title" segments={['Lo que ya existe.', { text: 'No sólo lo que imaginamos.', className: 'title-muted' }]} />
        </div>

        <div className="v8-work-proof">
          <span>REAL PROJECTS / BUILT SYSTEMS</span>
          <p>La exploración tiene su lugar. La evidencia también.</p>
        </div>

        <div className="v8-work-list">
          {work.map((item, index) => (
            <article className="v8-work-item" key={item.slug}>
              <div className="v8-work-index">
                <span>{item.number}</span>
                <small>{item.status}</small>
              </div>

              <div className="v8-work-visual">
                <div className="v8-work-visual-grid" aria-hidden="true" />
                {index === 0 ? (
                  <div className="v8-work-screen v8-work-screen-aiden" aria-hidden="true">
                    <span>AiDEN</span>
                    <b>OPERACIÓN / VIVERO</b>
                    <div><i /><i /><i /></div>
                  </div>
                ) : (
                  <div className="v8-work-screen v8-work-screen-server" aria-hidden="true">
                    <span>ARAGON SERVER</span>
                    <b>SELF-HOSTED / PRIVATE</b>
                    <div><i /><i /><i /><i /></div>
                  </div>
                )}
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
                  <Link href={`/work/${item.slug}`}>Ver el caso <span>↗</span></Link>
                  {item.href && <a href={item.href} target="_blank" rel="noopener noreferrer">Repositorio ↗</a>}
                </div>
              </div>
            </article>
          ))}
        </div>

        <motion.div className="v8-work-progress" style={{ scaleX: progress, transformOrigin: 'left' }} />
      </div>
    </section>
  );
}
