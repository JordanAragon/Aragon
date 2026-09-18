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

  // The identity owns the first scene. It only yields once the scroll has created enough visual distance.
  const wordY = useTransform(progress, [0, 0.10, 0.20, 0.32, 1], [0, 0, reduced ? 0 : -18, reduced ? 0 : -34, reduced ? 0 : -44]);
  const wordScale = useTransform(progress, [0, 0.12, 0.22, 0.34, 1], [1.02, 1, reduced ? 1 : 0.76, reduced ? 1 : 0.46, reduced ? 1 : 0.38]);
  const wordOpacity = useTransform(progress, [0, 0.10, 0.20, 0.32, 0.42], [1, 1, reduced ? 1 : 0.55, reduced ? 1 : 0.08, 0]);
  const copyOpacity = useTransform(progress, [0.16, 0.27, 0.35, 0.78], [0, 0, 1, 1]);
  const copyY = useTransform(progress, [0.18, 0.35, 0.84], [reduced ? 0 : 120, 0, reduced ? 0 : -10]);
  const copyScale = useTransform(progress, [0.18, 0.36, 0.84], [0.965, 1, reduced ? 1 : 0.985]);
  const lineProgress = useTransform(progress, [0.02, 0.96], [0, 1]);

  useEffect(() => {
    const onEntry = () => setEntryStarted(true);
    window.addEventListener('aragon:entry-start', onEntry);
    return () => window.removeEventListener('aragon:entry-start', onEntry);
  }, []);

  const openContact = () => window.dispatchEvent(new Event('aragon:open-contact'));

  return (
    <section id="inicio" ref={ref} className="hero-v4" aria-labelledby="hero-title">
      <div className="hero-v4-stage">
        <div className="hero-v4-grid" aria-hidden="true" />
        <div className="page-shell hero-v4-shell">
          <div className="hero-v4-topline">
            <span><i /> ARAGON / 2026</span>
            <span>SOFTWARE · DIGITAL · SYSTEMS</span>
          </div>

          <motion.div
            className="hero-v4-brandline"
            style={{ y: wordY, scale: wordScale, opacity: wordOpacity }}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={entryStarted ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0.25 : 0.72, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Aragon"
          >
            <div className="hero-v4-brandline-track">
              {word.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ opacity: 0, y: 28, rotateX: 48 }}
                  animate={entryStarted ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 28, rotateX: 48 }}
                  transition={{ delay: entryStarted ? 0.04 + index * 0.055 : 0, duration: reduced ? 0.18 : 0.54, ease: [0.16, 1, 0.3, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div className="hero-v4-content" style={{ opacity: copyOpacity, y: copyY, scale: copyScale }}>
            <div className="hero-v4-copy">
              <span className="hero-v4-kicker">01 / FROM IDEA TO SYSTEM</span>
              <h1 id="hero-title">Lo complejo puede <em>sentirse simple.</em></h1>
              <p>Diseño y desarrollo experiencias digitales, software y sistemas alrededor de problemas reales.</p>
              <div className="hero-v4-actions">
                <a href="#trabajo" className="hero-v4-primary" tabIndex={entryStarted ? 0 : -1}>Explorar el trabajo <IconBox>{icons.arrow}</IconBox></a>
                <button type="button" className="hero-v4-text-link" onClick={openContact} tabIndex={entryStarted ? 0 : -1}>Contar un problema ↗</button>
              </div>
            </div>
          </motion.div>

          <div className="hero-v4-footer">
            <span className="hero-v4-footer-label">SCROLL TO EXPLORE</span>
            <span className="hero-v4-progress"><motion.i style={{ scaleX: lineProgress, transformOrigin: 'left' }} /></span>
            <a href="#problema">↓</a>
          </div>
        </div>
      </div>
    </section>
  );
}
