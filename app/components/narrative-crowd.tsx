'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import CanvasCrowdExact from './skiper/canvas-crowd-exact';

const CROWD = '/images/peeps/aragon-crowd-scene.png';

export default function NarrativeCrowd() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const raw = useScroll({ target: sectionRef, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(raw, { stiffness: 74, damping: 28, mass: 0.3 });

  const beat1 = useTransform(progress, [0, 0.14, 0.24], [1, 1, 0]);
  const beat2 = useTransform(progress, [0.18, 0.31, 0.43], [0, 1, 0]);
  const beat3 = useTransform(progress, [0.38, 0.52, 0.66], [0, 1, 0]);
  const beat4 = useTransform(progress, [0.62, 0.78, 1], [0, 1, 1]);
  const crowdScale = useTransform(progress, [0, 0.25, 0.58, 1], [1.08, 1.11, 1.16, 1.24]);
  const crowdX = useTransform(progress, [0, 0.48, 1], ['2%', reduced ? '0%' : '-2%', reduced ? '0%' : '4%']);
  const crowdY = useTransform(progress, [0, 0.5, 1], [reduced ? 0 : 26, reduced ? 0 : 4, reduced ? 0 : -20]);
  const vignette = useTransform(progress, [0, 0.6, 1], [0.1, 0.22, 0.38]);

  return (
    <section ref={sectionRef} id="contexto" className="crowd-story-v3" aria-labelledby="crowd-title">
      <div className="crowd-story-v3-sticky">
        <div className="crowd-story-v3-grid" aria-hidden="true" />
        <div className="page-shell crowd-story-v3-top">
          <span className="section-number">03</span>
          <span className="section-label">THE HUMAN LAYER</span>
          <span>SCROLL STORY / 04 BEATS</span>
        </div>

        <div className="page-shell crowd-story-v3-copy">
          <motion.div className="crowd-story-v3-beat" style={{ opacity: beat1 }}>
            <span>01 / THE ASSUMPTION</span>
            <h2 id="crowd-title">Muchas personas creen que necesitan <em>otra herramienta.</em></h2>
          </motion.div>
          <motion.div className="crowd-story-v3-beat" style={{ opacity: beat2 }}>
            <span>02 / MORE NOISE</span>
            <h2>Más software. Más automatización. Más pantallas.</h2>
          </motion.div>
          <motion.div className="crowd-story-v3-beat" style={{ opacity: beat3 }}>
            <span>03 / THE REAL PROBLEM</span>
            <h2>Pero cuando cada pieza vive por su cuenta, el problema <em>solo cambia de forma.</em></h2>
          </motion.div>
          <motion.div className="crowd-story-v3-beat crowd-story-v3-beat-final" style={{ opacity: beat4 }}>
            <span>04 / THE SYSTEM</span>
            <h2>Aragon convierte el ruido en un sistema que <em>se entiende y se usa.</em></h2>
            <a href="#capacidades">Ver cómo se construye ↗</a>
          </motion.div>
        </div>

        <motion.div className="crowd-story-v3-canvas-wrap" style={{ scale: crowdScale, x: crowdX, y: crowdY }}>
          <img className="crowd-story-v3-fallback" src={CROWD} alt="" aria-hidden="true" />
          <CanvasCrowdExact src={CROWD} rows={1} cols={1} className="crowd-story-v3-canvas" />
        </motion.div>

        <motion.div className="crowd-story-v3-vignette" style={{ opacity: vignette }} aria-hidden="true" />
        <div className="page-shell crowd-story-v3-bottom">
          <span>PEOPLE</span><i /><span>PROCESS</span><i /><span>SYSTEM</span>
        </div>
      </div>
    </section>
  );
}
