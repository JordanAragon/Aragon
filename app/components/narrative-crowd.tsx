'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import CanvasCrowdExact from './skiper/canvas-crowd-exact';

const SPRITE = '/images/peeps/aragon-crowd-sprite.png';

export default function NarrativeCrowd() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const raw = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(raw, { stiffness: 68, damping: 26, mass: 0.28 });

  const b1 = useTransform(progress, [0, 0.13, 0.24], [1, 1, 0]);
  const b2 = useTransform(progress, [0.19, 0.31, 0.45], [0, 1, 0]);
  const b3 = useTransform(progress, [0.4, 0.54, 0.69], [0, 1, 0]);
  const b4 = useTransform(progress, [0.64, 0.79, 1], [0, 1, 1]);

  const crowdX = useTransform(
    progress,
    [0, 0.24, 0.5, 0.76, 1],
    ['-6%', reduced ? '-2%' : '3%', reduced ? '1%' : '-4%', reduced ? '1%' : '4%', reduced ? '0%' : '8%'],
  );
  const crowdY = useTransform(
    progress,
    [0, 0.18, 0.45, 0.72, 1],
    ['28%', reduced ? '18%' : '10%', reduced ? '6%' : '0%', reduced ? '0%' : '-3%', reduced ? '0%' : '-16%'],
  );
  const crowdScale = useTransform(
    progress,
    [0, 0.16, 0.42, 0.72, 0.92, 1],
    [0.84, 0.92, 1.02, 1.08, 1.03, 0.82],
  );
  const crowdOpacity = useTransform(
    progress,
    [0, 0.1, 0.22, 0.75, 0.92, 1],
    [0, reduced ? 0.5 : 0.7, 1, 1, 0.65, 0],
  );
  const lineX = useTransform(progress, [0, 0.26, 0.58, 0.82, 1], ['0%', '28%', '62%', '86%', '100%']);

  return (
    <section id="contexto" ref={ref} className="crowd-story-v4" aria-labelledby="crowd-title">
      <div className="crowd-story-v4-sticky">
        <div className="crowd-story-v4-bg" aria-hidden="true" />
        <div className="page-shell crowd-story-v4-meta">
          <span>03</span>
          <span>THE HUMAN LAYER</span>
          <span>SCROLL / ACTIVITY → DIRECTION</span>
        </div>

        <div className="crowd-story-v4-copy page-shell">
          <motion.article style={{ opacity: b1 }} className="crowd-story-v4-beat">
            <span>01 / THE ASSUMPTION</span>
            <h2 id="crowd-title">Creemos que necesitamos <em>más herramientas.</em></h2>
            <p>Más software. Más automatización. Más ventanas abiertas.</p>
          </motion.article>

          <motion.article style={{ opacity: b2 }} className="crowd-story-v4-beat">
            <span>02 / THE FRICTION</span>
            <h2>Y cada cosa empieza a moverse por su lado.</h2>
            <p>Personas, procesos y productos acumulan actividad, pero no necesariamente dirección.</p>
          </motion.article>

          <motion.article style={{ opacity: b3 }} className="crowd-story-v4-beat">
            <span>03 / THE TURN</span>
            <h2>El problema no es moverse. Es no compartir <em>dirección.</em></h2>
            <p>Cuando las piezas empiezan a conectarse, el recorrido cambia.</p>
          </motion.article>

          <motion.article style={{ opacity: b4 }} className="crowd-story-v4-beat crowd-story-v4-beat-final">
            <span>04 / THE SYSTEM</span>
            <h2>El movimiento sigue. Lo que cambia es la <em>dirección.</em></h2>
            <p>Aragon conecta diseño, código, producto e infraestructura para que las piezas trabajen como un sistema.</p>
            <a href="#capacidades">Ver el sistema ↗</a>
          </motion.article>
        </div>

        <div className="crowd-story-v4-floor" aria-hidden="true">
          <motion.div
            className="crowd-story-v4-canvas"
            style={{ x: crowdX, y: crowdY, scale: crowdScale, opacity: crowdOpacity }}
          >
            <CanvasCrowdExact src={SPRITE} rows={15} cols={7} />
          </motion.div>
          <span className="crowd-story-v4-floor-line" />
        </div>

        <div className="page-shell crowd-story-v4-footer" aria-hidden="true">
          <span>ACTIVITY</span>
          <i><motion.b style={{ scaleX: lineX, transformOrigin: 'left' }} /></i>
          <span>FLOW</span>
          <i />
          <span>DIRECTION</span>
        </div>
      </div>
    </section>
  );
}
