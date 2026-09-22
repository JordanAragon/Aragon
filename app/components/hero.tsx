'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { IconBox, icons } from './icons';

const word = 'ARAGON'.split('');

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [entryStarted, setEntryStarted] = useState(() => (
    typeof document !== 'undefined' && document.documentElement.dataset.aragonEntry === 'ready'
  ));
  const raw = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(raw, { stiffness: 100, damping: 30, mass: 0.28 });

  const wordY = useTransform(progress, [0, 0.12, 0.25, 1], [0, 0, reduced ? 0 : -28, reduced ? 0 : -40]);
  const wordScale = useTransform(progress, [0, 0.14, 0.30, 1], [1.02, 1, reduced ? 1 : 0.58, reduced ? 1 : 0.45]);
  const wordOpacity = useTransform(progress, [0, 0.14, 0.28, 0.40], [1, 1, reduced ? 1 : 0.46, 0]);
  const copyOpacity = useTransform(progress, [0.08, 0.22, 0.34, 0.78], [0, 0, 1, 1]);
  const copyY = useTransform(progress, [0.10, 0.34, 0.86], [reduced ? 0 : 90, 0, reduced ? 0 : -8]);
  const lineProgress = useTransform(progress, [0.02, 0.96], [0, 1]);

  useEffect(() => {
    const onEntry = () => setEntryStarted(true);
    window.addEventListener('aragon:entry-start', onEntry);
    return () => window.removeEventListener('aragon:entry-start', onEntry);
  }, []);

  const openContact = () => window.dispatchEvent(new Event('aragon:open-contact'));

  return (
    <section id="inicio" ref={ref} className="v8-hero" aria-labelledby="hero-title">
      <div className="v8-hero-stage">
        <div className="v8-hero-grid" aria-hidden="true" />
        <div className="page-shell v8-hero-shell">
          <div className="v8-hero-topline">
            <span><i /> ARAGON / 2026</span>
            <span>CALI / COLOMBIA</span>
          </div>

          <motion.div
            className="v8-hero-brand"
            style={{ y: wordY, scale: wordScale, opacity: wordOpacity }}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={entryStarted ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.65, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Aragon"
          >
            <div className="v8-hero-brand-track">
              {word.map((letter, index) => (
                <motion.span
                  key={letter + '-' + index}
                  initial={{ opacity: 0, y: 28, rotateX: 48 }}
                  animate={entryStarted ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 28, rotateX: 48 }}
                  transition={{ delay: entryStarted ? 0.03 + index * 0.045 : 0, duration: reduced ? 0.16 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div className="v8-hero-copy" style={{ opacity: copyOpacity, y: copyY }}>
            <span className="v8-hero-kicker">SOFTWARE &amp; TECHNOLOGY STUDIO</span>
            <h1 id="hero-title">Diseñamos y construimos <em>lo que necesita existir.</em></h1>
            <p>Experiencias digitales, productos y sistemas para problemas que necesitan algo más que una plantilla.</p>
            <div className="v8-hero-actions">
              <a href="#trabajo" className="v8-primary" tabIndex={entryStarted ? 0 : -1}>Ver trabajo <IconBox>{icons.arrow}</IconBox></a>
              <button type="button" className="v8-text-link" onClick={openContact} tabIndex={entryStarted ? 0 : -1}>Contar un problema ↗</button>
            </div>
          </motion.div>

          <div className="v8-hero-footer">
            <span>FROM PROBLEM TO SYSTEM</span>
            <span className="v8-hero-progress"><motion.i style={{ scaleX: lineProgress, transformOrigin: 'left' }} /></span>
            <a href="#problema" aria-label="Explorar contenido">↓</a>
          </div>
        </div>
      </div>
    </section>
  );
}
