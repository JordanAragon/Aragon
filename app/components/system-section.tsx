'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import CanvasCrowdExact from './skiper/canvas-crowd-exact';

const SPRITE = '/images/peeps/aragon-crowd-sprite.svg';

export default function SystemSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const raw = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(raw, { stiffness: 72, damping: 28, mass: 0.3 });

  const beats = [
    ['01 / PROBLEM', 'Más herramientas no siempre crean más claridad.', 'Cuando cada pieza resuelve sólo una parte, la operación empieza a fragmentarse.'],
    ['02 / ACTIVITY', 'Todo empieza a moverse por su lado.', 'Personas, procesos, productos y datos acumulan actividad sin compartir necesariamente una dirección.'],
    ['03 / DIRECTION', 'El trabajo está en conectar las piezas.', 'Diseño, producto y tecnología dejan de ser capas separadas cuando responden al mismo problema.'],
    ['04 / SYSTEM', 'Aragon construye sistemas donde las piezas trabajan juntas.', 'La interfaz importa. La arquitectura también. La suma es lo que hace que una solución pueda crecer.'],
  ] as const;

  const opacity = beats.map((_, index) => useTransform(
    progress,
    [index / beats.length, (index + 0.12) / beats.length, (index + 0.31) / beats.length, (index + 0.47) / beats.length],
    [0, 1, 1, index === beats.length - 1 ? 1 : 0],
  ));

  return (
    <section id="sistema" ref={ref} className="system section-shell" aria-labelledby="system-title">
      <div className="system-sticky">
        <div className="system-meta page-shell">
          <div><span className="section-number">03</span><span className="section-label">THE SYSTEM</span></div>
          <span>ACTIVITY → DIRECTION</span>
        </div>

        <div className="system-copy page-shell">
          {beats.map(([label, title, copy], index) => (
            <motion.article
              key={label}
              style={{ opacity: reduced ? (index === 0 ? 1 : 0) : opacity[index] }}
              className={'system-beat ' + (index % 2 ? 'is-right' : 'is-left')}
              aria-hidden={!reduced && index !== 0 ? true : undefined}
            >
              <span>{label}</span>
              <h2 id={index === 0 ? 'system-title' : undefined}>{title}</h2>
              <p>{copy}</p>
            </motion.article>
          ))}
        </div>

        <div className="system-floor" aria-hidden="true">
          <CanvasCrowdExact src={SPRITE} rows={15} cols={7} density={0.68} />
        </div>

        <div className="system-footer page-shell" aria-hidden="true">
          <span>ACTIVITY</span><i /><span>DIRECTION</span><i /><span>SYSTEM</span>
        </div>
      </div>
    </section>
  );
}
