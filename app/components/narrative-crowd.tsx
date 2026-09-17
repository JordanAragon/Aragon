'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import CanvasCrowdExact from './skiper/canvas-crowd-exact';

const SPRITE = '/images/peeps/aragon-crowd-sprite.png';
const SCENE = '/images/peeps/aragon-crowd-scene.png';

export default function NarrativeCrowd() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const raw = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(raw, { stiffness: 68, damping: 26, mass: 0.28 });

  const b1 = useTransform(progress, [0, 0.13, 0.24], [1, 1, 0]);
  const b2 = useTransform(progress, [0.19, 0.31, 0.45], [0, 1, 0]);
  const b3 = useTransform(progress, [0.4, 0.54, 0.69], [0, 1, 0]);
  const b4 = useTransform(progress, [0.64, 0.79, 1], [0, 1, 1]);
  const crowdX = useTransform(progress, [0, 0.24, 0.5, 0.76, 1], ['0%', reduced ? '0%' : '-2%', reduced ? '0%' : '2%', reduced ? '0%' : '-1%', reduced ? '0%' : '1%']);
  const crowdScale = useTransform(progress, [0, 0.22, 0.53, 0.78, 1], [1, 1.03, 1.055, 1.02, 1.08]);
  const assembled = useTransform(progress, [0.76, 0.9, 1], [0, 0.08, 0.14]);
  const lineX = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <section id="contexto" ref={ref} className="crowd-story-v4" aria-labelledby="crowd-title">
      <div className="crowd-story-v4-sticky">
        <div className="crowd-story-v4-bg" aria-hidden="true" />
        <div className="page-shell crowd-story-v4-meta"><span>03</span><span>THE HUMAN LAYER</span><span>SCROLL / DIRECTIONAL CROWD</span></div>

        <div className="crowd-story-v4-copy page-shell">
          <motion.article style={{ opacity: b1 }} className="crowd-story-v4-beat">
            <span>01 / THE ASSUMPTION</span>
            <h2 id="crowd-title">Creemos que necesitamos <em>más herramientas.</em></h2>
            <p>Más software. Más automatización. Más ventanas abiertas.</p>
          </motion.article>
          <motion.article style={{ opacity: b2 }} className="crowd-story-v4-beat">
            <span>02 / THE FRICTION</span>
            <h2>Pero cuando cada pieza va por su lado, todo <em>pesa más.</em></h2>
            <p>El equipo, el proceso y el producto empiezan a caminar en direcciones distintas.</p>
          </motion.article>
          <motion.article style={{ opacity: b3 }} className="crowd-story-v4-beat">
            <span>03 / THE TURN</span>
            <h2>Entonces dejamos de añadir piezas y empezamos a <em>conectarlas.</em></h2>
            <p>La multitud cambia de dirección. El sistema también.</p>
          </motion.article>
          <motion.article style={{ opacity: b4 }} className="crowd-story-v4-beat crowd-story-v4-beat-final">
            <span>04 / THE SYSTEM</span>
            <h2>Aragon convierte movimiento disperso en una sola <em>dirección.</em></h2>
            <p>Diseño, código, producto e infraestructura trabajando como uno.</p>
            <a href="#capacidades">Ver el sistema ↗</a>
          </motion.article>
        </div>

        <div className="crowd-story-v4-floor" aria-hidden="true">
          <motion.img src={SCENE} alt="" style={{ opacity: assembled }} />
          <motion.div className="crowd-story-v4-canvas" style={{ x: crowdX, scale: crowdScale }}>
            <CanvasCrowdExact src={SPRITE} rows={15} cols={7} progress={progress} />
          </motion.div>
          <span className="crowd-story-v4-floor-line" />
        </div>

        <div className="page-shell crowd-story-v4-footer" aria-hidden="true">
          <span>PEOPLE</span><i><b style={{ scaleX: lineX }} /></i><span>PROCESS</span><i /><span>SYSTEM</span>
        </div>
      </div>
    </section>
  );
}
