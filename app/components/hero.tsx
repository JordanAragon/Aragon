'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { IconBox, icons } from './icons';

const letters = 'ARAGON'.split('');

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const rawProgress = useScroll({ target: heroRef, offset: ['start start', 'end end'] }).scrollYProgress;
  const progress = useSpring(rawProgress, { stiffness: 90, damping: 28, mass: 0.28 });

  const wordY = useTransform(progress, [0, 0.45, 1], [0, reduced ? 0 : -80, reduced ? 0 : -160]);
  const wordScale = useTransform(progress, [0, 0.52, 1], [1, reduced ? 1 : 0.9, reduced ? 1 : 0.74]);
  const visualY = useTransform(progress, [0, 0.42, 1], [80, reduced ? 0 : -10, reduced ? 0 : -135]);
  const visualScale = useTransform(progress, [0, 0.5, 1], [0.84, reduced ? 0.94 : 1.02, reduced ? 0.94 : 1.12]);
  const visualRotate = useTransform(progress, [0, 0.52, 1], [2.5, reduced ? 0 : -2, reduced ? 0 : -6]);
  const copyOpacity = useTransform(progress, [0.25, 0.48, 0.68], [1, 1, 0]);
  const secondOpacity = useTransform(progress, [0.4, 0.58, 0.76], [0, 1, 0]);
  const thirdOpacity = useTransform(progress, [0.66, 0.82, 1], [0, 1, 1]);
  const lineScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="inicio" ref={heroRef} className="hero-v3" aria-labelledby="hero-title">
      <div className="hero-v3-grid" aria-hidden="true" />
      <div className="hero-v3-glow" aria-hidden="true" />
      <div className="hero-v3-ghost">ARAGON</div>

      <div className="hero-v3-stage">
        <div className="page-shell hero-v3-shell">
          <header className="hero-v3-topline">
            <span className="hero-v3-status"><i /> ONLINE / 2026</span>
            <span>SOFTWARE · DIGITAL · TECHNOLOGY</span>
            <span>COLOMBIA / WORLDWIDE</span>
          </header>

          <div className="hero-v3-wordmark" aria-label="Aragon">
            <motion.div style={{ y: wordY, scale: wordScale }} className="hero-v3-wordmark-track">
              {letters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ opacity: 0, y: 42, rotateX: 65 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.16 + index * 0.07, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <div className="hero-v3-main">
            <motion.div className="hero-v3-copy" style={{ opacity: copyOpacity }}>
              <span className="hero-v3-index">01 / THE PREMISE</span>
              <h1 id="hero-title">Lo complejo puede <em>sentirse simple.</em></h1>
              <p>
                Diseño y desarrollo experiencias digitales, software y sistemas para que las ideas dejen de ser piezas sueltas y empiecen a funcionar como una sola cosa.
              </p>
              <div className="hero-v3-actions">
                <a href="#trabajo" className="hero-v3-primary">Explorar el trabajo <IconBox>{icons.arrow}</IconBox></a>
                <a href="#contacto" className="hero-v3-link">Contar un problema ↗</a>
              </div>
            </motion.div>

            <motion.div className="hero-v3-visual" style={{ y: visualY, scale: visualScale, rotate: visualRotate }}>
              <div className="hero-v3-frame">
                <div className="hero-v3-frame-head">
                  <span>ARAGON / SYSTEM PREVIEW</span>
                  <span>LIVE CONCEPT</span>
                </div>
                <div className="hero-v3-image">
                  <Image src="/img/portafolio.png" alt="Interfaces y sistemas digitales de Aragon" fill priority sizes="(max-width: 900px) 96vw, 59vw" />
                </div>
                <div className="hero-v3-window-note hero-v3-window-note-a">WEB / PRODUCT</div>
                <div className="hero-v3-window-note hero-v3-window-note-b">SYSTEM / DATA</div>
                <div className="hero-v3-frame-foot"><span>SCROLL TO BREAK IT APART</span><span>↘</span></div>
              </div>

              <div className="hero-v3-mini hero-v3-mini-a">
                <Image src="/img/aragon-server.png" alt="Terminal e infraestructura de Aragon" fill sizes="260px" />
                <span>INFRA / 01</span>
              </div>
              <div className="hero-v3-mini hero-v3-mini-b">
                <Image src="/img/aiden.png" alt="Producto digital de Aragon" fill sizes="290px" />
                <span>PRODUCT / 02</span>
              </div>
            </motion.div>
          </div>

          <motion.div className="hero-v3-beat hero-v3-beat-two" style={{ opacity: secondOpacity }} aria-hidden="true">
            <span>02 / THE FRICTION</span>
            <p>No necesitas otra herramienta.<br /><em>Necesitas que las piezas conversen.</em></p>
          </motion.div>

          <motion.div className="hero-v3-beat hero-v3-beat-three" style={{ opacity: thirdOpacity }} aria-hidden="true">
            <span>03 / THE BUILD</span>
            <p>Problema → sistema → experiencia.</p>
          </motion.div>

          <div className="hero-v3-foot">
            <span>FROM IDEA TO SYSTEM</span>
            <span className="hero-v3-foot-line"><i style={{ scaleX: lineScale }} /></span>
            <a href="#problema">KEEP SCROLLING <b>↓</b></a>
          </div>
        </div>
      </div>
    </section>
  );
}
