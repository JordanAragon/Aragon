'use client';

import { motion, useMotionValue, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { IconBox, icons } from './icons';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smoothMx = useSpring(mx, { stiffness: 130, damping: 24, mass: 0.22 });
  const smoothMy = useSpring(my, { stiffness: 130, damping: 24, mass: 0.22 });
  const heroProgress = useScroll({ target: heroRef, offset: ['start start', 'end start'] }).scrollYProgress;
  const heroTextY = useTransform(heroProgress, [0, 1], [0, reduced ? 0 : -150]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, reduced ? 1 : 0.78]);
  const heroOpacity = useTransform(heroProgress, [0, 0.58, 1], [1, 1, 0]);
  const heroVisualScale = useTransform(heroProgress, [0, 1], [1, reduced ? 1 : 1.28]);
  const heroGhostX = useTransform(heroProgress, [0, 1], [0, reduced ? 0 : -120]);

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    mx.set((event.clientX / window.innerWidth - 0.5) * 14);
    my.set((event.clientY / window.innerHeight - 0.5) * 14);
  };

  return (
    <section id="inicio" ref={heroRef} className="hero" onMouseMove={handleMove} aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />

      <motion.div className="hero-visual" style={{ scale: heroVisualScale, x: reduced ? 0 : smoothMx, y: reduced ? 0 : smoothMy }} aria-hidden="true">
        <div className="hero-visual-ring hero-visual-ring-a" />
        <div className="hero-visual-ring hero-visual-ring-b" />
        <div className="hero-visual-word">ARAGON</div>
        <div className="hero-visual-core"><span>ARAGON</span><i /></div>
        <div className="hero-visual-tag tag-a">IDEA</div>
        <div className="hero-visual-tag tag-b">SYSTEM</div>
        <div className="hero-visual-tag tag-c">OUTPUT</div>
      </motion.div>

      <motion.div className="hero-meta page-shell" style={{ opacity: heroOpacity }}>
        <span><i className="status-dot" /> ARAGON / DIGITAL</span>
        <span>JORDAN ARAGON</span>
        <span>2026 / 001</span>
      </motion.div>

      <motion.div className="hero-content page-shell" style={{ y: heroTextY, opacity: heroOpacity }}>
        <div className="hero-topline">
          <span>IDEA → PROBLEMA → SISTEMA</span>
          <span>HECHO CON INTENCIÓN</span>
        </div>

        <motion.h1 id="hero-title" style={{ scale: heroScale }} initial={false}>
          Tu idea<br />
          <span>ya existe.</span><br />
          <em>Ahora hagámosla funcionar.</em>
        </motion.h1>

        <motion.div className="hero-ghost" style={{ x: heroGhostX }} aria-hidden="true">ARAGON / 001</motion.div>

        <div className="hero-bottom">
          <div className="hero-copy">
            <span className="hero-index">LA PREMISA</span>
            <p>Diseño y desarrollo experiencias digitales, software y sistemas alrededor de problemas reales.</p>
          </div>
          <a href="#trabajo" className="hero-cta">
            <span>Ver lo que construyo</span>
            <IconBox>{icons.arrow}</IconBox>
          </a>
        </div>
      </motion.div>

      <div className="hero-side" aria-hidden="true">SCROLL <span /> ↓</div>
    </section>
  );
}
