'use client';

import Image from 'next/image';
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
  const progress = useSpring(raw, { stiffness: 96, damping: 30, mass: 0.3 });

  const wordY = useTransform(progress, [0, 0.26, 0.58, 1], [0, reduced ? 0 : -10, reduced ? 0 : -60, reduced ? 0 : -92]);
  const wordScale = useTransform(progress, [0, 0.22, 0.58, 1], [1.02, 1, reduced ? 1 : 0.66, reduced ? 1 : 0.52]);
  const wordOpacity = useTransform(progress, [0, 0.42, 0.72, 1], [1, 1, reduced ? 1 : 0.42, reduced ? 1 : 0.08]);
  const copyOpacity = useTransform(progress, [0.1, 0.22, 0.66, 0.9], [0, 1, 1, 0.9]);
  const copyY = useTransform(progress, [0.08, 0.24, 0.9], [36, 0, reduced ? 0 : -8]);
  const showcaseOpacity = useTransform(progress, [0.16, 0.3, 0.82, 1], [0, 0.96, 0.96, 0.58]);
  const showcaseY = useTransform(progress, [0.16, 0.38, 1], [48, 0, reduced ? 0 : -24]);
  const showcaseScale = useTransform(progress, [0.16, 0.4, 1], [0.92, 1, reduced ? 1 : 1.035]);
  const lineProgress = useTransform(progress, [0.04, 0.96], [0, 1]);

  useEffect(() => {
    setEntryStarted(document.documentElement.dataset.aragonEntry === 'ready');
    const onEntry = () => setEntryStarted(true);
    window.addEventListener('aragon:entry-start', onEntry);
    return () => window.removeEventListener('aragon:entry-start', onEntry);
  }, []);

  return (
    <section id="inicio" ref={ref} className="hero-v4" aria-labelledby="hero-title">
      <div className="hero-v4-stage">
        <div className="hero-v4-grid" aria-hidden="true" />
        <div className="hero-v4-orbit hero-v4-orbit-a" aria-hidden="true" />
        <div className="page-shell hero-v4-shell">
          <div className="hero-v4-topline">
            <span><i /> ARAGON / 2026</span>
            <span>SOFTWARE · DIGITAL · SYSTEMS</span>
            <span>COLOMBIA / WORLDWIDE</span>
          </div>

          <motion.div
            className="hero-v4-brandline"
            style={{ y: wordY, scale: wordScale, opacity: wordOpacity }}
            initial={{ opacity: 0, scale: 0.94, y: 22 }}
            animate={entryStarted ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0.25 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Aragon"
          >
            <div className="hero-v4-brandline-track">
              {word.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ opacity: 0, y: 34, rotateX: 52 }}
                  animate={entryStarted ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 34, rotateX: 52 }}
                  transition={{ delay: entryStarted ? 0.05 + index * 0.055 : 0, duration: reduced ? 0.2 : 0.58, ease: [0.16, 1, 0.3, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
              <b className="hero-v4-caret" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.div className="hero-v4-content" style={{ opacity: copyOpacity, y: copyY }}>
            <div className="hero-v4-copy">
              <span className="hero-v4-kicker">01 / FROM IDEA TO SYSTEM</span>
              <h1 id="hero-title">Lo complejo puede <em>sentirse simple.</em></h1>
              <p>Diseño y desarrollo experiencias digitales, software y sistemas alrededor de problemas reales.</p>
              <div className="hero-v4-actions">
                <a href="#trabajo" className="hero-v4-primary" tabIndex={entryStarted ? 0 : -1}>Explorar el trabajo <IconBox>{icons.arrow}</IconBox></a>
                <a href="#contacto" className="hero-v4-text-link" tabIndex={entryStarted ? 0 : -1}>Contar un problema ↗</a>
              </div>
            </div>

            <motion.figure className="hero-v4-showcase" style={{ opacity: showcaseOpacity, y: showcaseY, scale: showcaseScale }}>
              <div className="hero-v4-showcase-top"><span>ARAGON / PRODUCT VIEW</span><span>SCROLL / 01</span></div>
              <div className="hero-v4-showcase-image">
                <Image src="/img/portafolio.png" alt="Interfaces y sistemas digitales de Aragon" fill priority sizes="(max-width: 1000px) 92vw, 59vw" />
                <span className="hero-v4-tag hero-v4-tag-a">WEB / PRODUCT</span>
                <span className="hero-v4-tag hero-v4-tag-b">SYSTEM / DATA</span>
              </div>
              <figcaption><span>Design / Development / Infrastructure</span><span>↘</span></figcaption>
            </motion.figure>
          </motion.div>

          <div className="hero-v4-note" aria-hidden="true">
            <span>ONE DIRECTION / MANY PIECES</span>
            <span>THE WORK STARTS WITH THE PROBLEM.</span>
          </div>

          <div className="hero-v4-footer">
            <span>FROM IDEA TO SYSTEM</span>
            <span className="hero-v4-progress"><motion.i style={{ scaleX: lineProgress, transformOrigin: 'left' }} /></span>
            <a href="#problema">SCROLL <b>↓</b></a>
          </div>
        </div>
      </div>
    </section>
  );
}
