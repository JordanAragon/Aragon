'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import CanvasCrowdExact from './skiper/canvas-crowd-exact';

const SPRITE = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png';

export default function SystemSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const raw = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(raw, { stiffness: 75, damping: 28, mass: 0.28 });

  const beatOne = useTransform(progress, [0, 0.18, 0.30], [1, 1, 0]);
  const beatTwo = useTransform(progress, [0.24, 0.39, 0.52], [0, 1, 0]);
  const beatThree = useTransform(progress, [0.46, 0.61, 0.74], [0, 1, 0]);
  const beatFour = useTransform(progress, [0.69, 0.84, 1], [0, 1, 1]);

  const beats = [
    ['01 / PROBLEM', 'Más herramientas no siempre crean más claridad.', 'Cuando cada pieza resuelve sólo una parte, la operación empieza a fragmentarse.', beatOne],
    ['02 / ACTIVITY', 'Todo empieza a moverse por su lado.', 'Personas, procesos, productos y datos acumulan actividad sin compartir necesariamente una dirección.', beatTwo],
    ['03 / DIRECTION', 'El trabajo está en conectar las piezas.', 'Diseño, producto y tecnología dejan de ser capas separadas cuando responden al mismo problema.', beatThree],
    ['04 / SYSTEM', 'Aragon construye sistemas donde las piezas trabajan juntas.', 'La interfaz importa. La arquitectura también. La suma es lo que hace que una solución pueda crecer.', beatFour],
  ] as const;

  return (
    <section id="sistema" ref={ref} className="v8-system section-shell" aria-labelledby="system-title">
      <div className="v8-system-sticky">
        <div className="v8-system-meta page-shell">
          <div><span className="section-number">03</span><span className="section-label">THE SYSTEM</span></div>
          <span>ACTIVITY → DIRECTION</span>
        </div>

        <div className="v8-system-copy page-shell">
          {beats.map(([label, title, copy, style], index) => (
            <motion.article
              key={label}
              style={{ opacity: reduced ? (index === 3 ? 1 : 0) : style }}
              className={'v8-system-beat ' + (index % 2 ? 'is-right' : 'is-left')}
            >
              <span>{label}</span>
              <h2 id={index === 0 ? 'system-title' : undefined}>{title}</h2>
              <p>{copy}</p>
            </motion.article>
          ))}
        </div>

        <div className="v8-system-floor" aria-hidden="true">
          <CanvasCrowdExact src={SPRITE} rows={15} cols={7} density={0.68} />
        </div>

        <div className="v8-system-footer page-shell" aria-hidden="true">
          <span>ACTIVITY</span><i /><span>DIRECTION</span><i /><span>SYSTEM</span>
        </div>
      </div>
    </section>
  );
}
