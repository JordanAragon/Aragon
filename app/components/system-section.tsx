
'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import CanvasCrowdExact from './skiper/canvas-crowd-exact';

const SPRITE = '/images/peeps/aragon-crowd-sprite.svg';

const beats = [
  ['01 / PROBLEMA', 'Más herramientas no siempre crean más claridad.', 'Cuando cada pieza resuelve sólo una parte, la operación empieza a fragmentarse.'],
  ['02 / ACTIVIDAD', 'Todo empieza a moverse por su lado.', 'Personas, procesos, productos y datos acumulan actividad sin compartir necesariamente una dirección.'],
  ['03 / DIRECCIÓN', 'El trabajo está en conectar las piezas.', 'Diseño, producto y tecnología dejan de ser capas separadas cuando responden al mismo problema.'],
  ['04 / SISTEMA', 'Las piezas empiezan a trabajar juntas.', 'La interfaz importa. La arquitectura también. La suma es lo que permite que una solución evolucione.'],
] as const;

export default function SystemSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const raw = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(raw, { stiffness: 68, damping: 26, mass: 0.3 });

  const opacities = [
    useTransform(progress, [0, .12, .25], [1, 1, 0]),
    useTransform(progress, [.18, .31, .45], [0, 1, 0]),
    useTransform(progress, [.38, .52, .66], [0, 1, 0]),
    useTransform(progress, [.58, .73, 1], [0, 1, 1]),
  ];

  return (
    <section
      id="sistema"
      ref={ref}
      className="v8-system section-shell"
      aria-labelledby="system-title"
      data-reduced-motion={reduced || undefined}
    >
      <div className="v8-system-sticky">
        <div className="v8-system-meta page-shell">
          <div>
            <span className="section-number">03</span>
            <span className="section-label">EL SISTEMA</span>
          </div>
          <span>ACTIVIDAD → DIRECCIÓN → SISTEMA</span>
        </div>

        <div className="v8-system-copy page-shell">
          {beats.map(([label, title, copy], index) => (
            <motion.article
              key={label}
              style={{ opacity: reduced ? 1 : opacities[index] }}
              className={'v8-system-beat ' + (index % 2 ? 'is-right' : 'is-left')}
            >
              <span>{label}</span>
              <h2 id={index === 0 ? 'system-title' : undefined}>{title}</h2>
              <p>{copy}</p>
            </motion.article>
          ))}
        </div>

        <div className="v8-system-floor" aria-hidden="true">
          <CanvasCrowdExact src={SPRITE} rows={15} cols={7} density={0.64} />
        </div>

        <div className="v8-system-footer page-shell" aria-hidden="true">
          <span>ACTIVIDAD</span><i /><span>DIRECCIÓN</span><i /><span>SISTEMA</span>
        </div>
      </div>
    </section>
  );
}
