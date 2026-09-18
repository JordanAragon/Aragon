'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { IconBox, icons } from './icons';

const word = 'ARAGON'.split('');

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const raw = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(raw, { stiffness: 85, damping: 30, mass: 0.25 });

  const wordY = useTransform(progress, [0, 0.2, 0.42, 1], [0, reduced ? 0 : -34, reduced ? 0 : -112, reduced ? 0 : -164]);
  const wordScale = useTransform(progress, [0, 0.2, 0.42, 1], [1.04, reduced ? 1 : 0.9, reduced ? 1 : 0.62, reduced ? 1 : 0.48]);
  const visualY = useTransform(progress, [0, 0.35, 0.72, 1], [22, reduced ? 0 : -8, reduced ? 0 : -54, reduced ? 0 : -92]);
  const visualScale = useTransform(progress, [0, 0.4, 0.78, 1], [0.92, reduced ? 0.96 : 1, reduced ? 1.04 : 1.12, reduced ? 0.98 : 1.16]);
  const visualRotate = useTransform(progress, [0, 0.4, 1], [1.6, reduced ? 0 : -1, reduced ? 0 : -3]);
  const heroCopyOpacity = useTransform(progress, [0.12, 0.24, 0.36, 0.48], [0, 1, 1, 0]);
  const bridgeOpacity = useTransform(progress, [0.24, 0.34, 0.57, 0.68], [0, 1, 1, 0]);
  const bridgeY = useTransform(progress, [0.24, 0.36, 0.68], [38, 0, -22]);
  const finalOpacity = useTransform(progress, [0.6, 0.74, 1], [0, 1, 1]);
  const finalY = useTransform(progress, [0.62, 0.76, 1], [28, 0, reduced ? 0 : -10]);
  const showcaseOpacity = useTransform(progress, [0.16, 0.3, 0.52, 0.7], [0, 0.92, 0.82, 0]);
  const lineProgress = useTransform(progress, [0, 1], [0, 1]);
  const [phase, setPhase] = useState<-1 | 0 | 1 | 2>(-1);

  useEffect(() => {
    const syncPhase = (value: number) => {
      const next: -1 | 0 | 1 | 2 = value < 0.24 ? -1 : value < 0.38 ? 0 : value < 0.7 ? 1 : 2;
      setPhase((current) => current === next ? current : next);
    };

    syncPhase(progress.get());
    return progress.on('change', syncPhase);
  }, [progress]);

  return (
    <section id="inicio" ref={ref} className="hero-v4" aria-labelledby="hero-title">
      <div className="hero-v4-stage">
        <div className="hero-v4-grid" aria-hidden="true" />
        <div className="hero-v4-orbit hero-v4-orbit-a" aria-hidden="true" />
        <div className="hero-v4-orbit hero-v4-orbit-b" aria-hidden="true" />
        <div className="page-shell hero-v4-shell">
          <div className="hero-v4-topline">
            <span><i /> ARAGON / 2026</span>
            <span>SOFTWARE · DIGITAL · SYSTEMS</span>
            <span>COLOMBIA / WORLDWIDE</span>
          </div>

          <div className="hero-v4-brandline" aria-label="Aragon">
            <motion.div className="hero-v4-brandline-track" style={{ y: wordY, scale: wordScale }}>
              {word.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ opacity: 0, y: 44, rotateX: 62 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.12 + index * 0.075, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
              <b className="hero-v4-caret" aria-hidden="true" />
            </motion.div>
          </div>

          <motion.div className="hero-v4-phase hero-v4-phase-main" style={{ opacity: heroCopyOpacity }} >
            <div className="hero-v4-copy">
              <span className="hero-v4-kicker">01 / FROM IDEA TO SYSTEM</span>
              <h1 id="hero-title">Lo complejo puede <em>sentirse simple.</em></h1>
              <p>
                Diseño y desarrollo experiencias digitales, software y sistemas que conectan lo que hoy está disperso.
              </p>
              <div className="hero-v4-actions">
                <a href="#trabajo" className="hero-v4-primary" tabIndex={phase === 0 ? 0 : -1}>Explorar el trabajo <IconBox>{icons.arrow}</IconBox></a>
                <a href="#contacto" className="hero-v4-text-link" tabIndex={phase === 0 ? 0 : -1}>Contar un problema ↗</a>
              </div>
            </div>

            <motion.figure className="hero-v4-showcase" style={{ y: visualY, scale: visualScale, rotate: visualRotate, opacity: showcaseOpacity }}>
              <div className="hero-v4-showcase-top"><span>ARAGON / PRODUCT VIEW</span><span>SCROLL / 01</span></div>
              <div className="hero-v4-showcase-image">
                <Image src="/img/portafolio.png" alt="Interfaces y sistemas digitales de Aragon" fill priority sizes="(max-width: 1000px) 94vw, 62vw" />
                <span className="hero-v4-tag hero-v4-tag-a">WEB / PRODUCT</span>
                <span className="hero-v4-tag hero-v4-tag-b">SYSTEM / DATA</span>
              </div>
              <figcaption><span>Design / Development / Infrastructure</span><span>↘</span></figcaption>
            </motion.figure>
          </motion.div>

          <motion.div className="hero-v4-phase hero-v4-phase-bridge" style={{ opacity: bridgeOpacity, y: bridgeY }} aria-hidden={phase !== 1}>
            <span className="hero-v4-kicker">02 / THE FRICTION</span>
            <div className="hero-v4-bridge-copy"><p>El problema casi nunca es que falte otra herramienta.</p><strong>Es que las piezas <em>no conversan.</em></strong></div>
            <div className="hero-v4-bridge-rail"><span>TOOLS</span><i /><span>DATA</span><i /><span>PEOPLE</span><i /><span>PRODUCT</span></div>
          </motion.div>

          <motion.div className="hero-v4-phase hero-v4-phase-final" style={{ opacity: finalOpacity, y: finalY }} aria-hidden={phase !== 2}>
            <span className="hero-v4-kicker">03 / THE BUILD</span>
            <div className="hero-v4-final-wrap">
              <p>Una sola dirección.</p>
              <h2>Un sistema que <em>se entiende.</em></h2>
              <a href="#capacidades" className="hero-v4-underline" tabIndex={phase === 2 ? 0 : -1}>Ver cómo se construye ↗</a>
            </div>
          </motion.div>

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
