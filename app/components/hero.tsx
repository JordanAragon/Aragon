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
  const progress = useSpring(raw, { stiffness: 95, damping: 30, mass: 0.3 });

  const wordY = useTransform(progress, [0, 0.16, 0.42, 1], [0, 0, reduced ? 0 : -18, reduced ? 0 : -26]);
  const wordScale = useTransform(progress, [0, 0.16, 0.45, 1], [1.03, 1, reduced ? 1 : 0.78, reduced ? 1 : 0.72]);
  const wordOpacity = useTransform(progress, [0, 0.22, 0.48, 0.7], [1, 1, reduced ? 1 : 0.58, 0.15]);
  const copyOpacity = useTransform(progress, [0.1, 0.27, 0.38, 0.82], [0, 0, 1, 1]);
  const copyY = useTransform(progress, [0.12, 0.38, 0.86], [reduced ? 0 : 56, 0, reduced ? 0 : -10]);
  const lineProgress = useTransform(progress, [0.02, 0.96], [0, 1]);

  useEffect(() => {
    const onEntry = () => setEntryStarted(true);
    window.addEventListener('aragon:entry-start', onEntry);
    return () => window.removeEventListener('aragon:entry-start', onEntry);
  }, []);

  const openContact = () => window.dispatchEvent(new Event('aragon:open-contact'));

  return (
    <section id="inicio" ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero-stage">
        <div className="hero-grid" aria-hidden="true" />
        <div className="page-shell hero-shell">
          <div className="hero-topline">
            <span><i /> ARAGON / 2026</span>
            <span>{'CALI / COLOMBIA'}</span>
          </div>

          <motion.div
            className="hero-wordmark"
            style={{ y: wordY, scale: wordScale, opacity: wordOpacity }}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={entryStarted ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Aragon"
          >
            <div className="hero-wordmark-track">
              {word.map((letter, index) => (
                <motion.span
                  key={letter + '-' + index}
                  initial={{ opacity: 0, y: 24, rotateX: 42 }}
                  animate={entryStarted ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 24, rotateX: 42 }}
                  transition={{ delay: entryStarted ? 0.04 + index * 0.045 : 0, duration: reduced ? 0.16 : 0.54, ease: [0.16, 1, 0.3, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div className="hero-copy" style={{ opacity: copyOpacity, y: copyY }}>
            <div className="hero-copy-index">
              <span>01</span>
              <span>FROM PROBLEM TO SYSTEM</span>
            </div>
            <span className="hero-kicker">SOFTWARE &amp; TECHNOLOGY STUDIO</span>
            <h1 id="hero-title">Diseñamos y construimos <em>lo que necesita existir.</em></h1>
            <p>Experiencias digitales, productos y sistemas para problemas que necesitan algo más que una plantilla.</p>

            <div className="hero-actions">
              <a href="#trabajo" className="button button-solid">
                Ver trabajo <IconBox>{icons.arrow}</IconBox>
              </a>
              <button type="button" className="text-link" onClick={openContact}>Contar un problema <span>↗</span></button>
            </div>
          </motion.div>

          <div className="hero-footer">
            <span>SCROLL TO EXPLORE</span>
            <span className="hero-progress"><motion.i style={{ scaleX: lineProgress, transformOrigin: 'left' }} /></span>
            <a href="#problema" aria-label="Explorar contenido">↓</a>
          </div>
        </div>
      </div>
    </section>
  );
}
