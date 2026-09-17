'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

const word = 'ARAGON';

export default function Preloader() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const dateLabel = useMemo(() => {
    const now = new Date();
    return `${String(now.getMonth() + 1).padStart(2, '0')} · ${String(now.getDate()).padStart(2, '0')} · ${now.getFullYear()}`;
  }, []);

  useEffect(() => {
    // Respect reduced motion without triggering a synchronous state update in the effect.
    if (reduced) return undefined;

    let raf = 0;
    let timeout = 0;
    const start = performance.now();
    const duration = 1180;

    const tick = (now: number) => {
      const value = Math.min(1, (now - start) / duration);
      setProgress(value);
      if (value < 1) raf = requestAnimationFrame(tick);
      else timeout = window.setTimeout(() => setLeaving(true), 140);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [reduced]);

  if (reduced || !visible) return null;
  const pct = Math.round(progress * 100);

  return (
    <motion.div
      className="preloader-v3"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => { if (leaving) setVisible(false); }}
      aria-hidden="true"
    >
      <div className="preloader-v3-grid" />
      <div className="preloader-v3-top"><span>ARAGON / ENTRY SEQUENCE</span><span>{dateLabel}</span></div>

      <div className="preloader-v3-center">
        <div className="preloader-v3-mark"><span>A</span><i /></div>
        <div className="preloader-v3-word" aria-label="Aragon">
          {word.split('').map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: progress > index / word.length * 0.62 ? '0%' : '110%', opacity: progress > index / word.length * 0.62 ? 1 : 0 }}
              transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <div className="preloader-v3-subline">
          <span>SOFTWARE / DIGITAL / TECHNOLOGY</span>
          <b>{String(pct).padStart(3, '0')}</b>
        </div>
        <div className="preloader-v3-bar"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: progress }} /></div>
      </div>

      <div className="preloader-v3-bottom"><span>BUILD WITH INTENT</span><span>LOADING EXPERIENCE</span></div>
      <motion.div className="preloader-v3-shutter" animate={{ y: leaving ? '0%' : '100%' }} transition={{ duration: 0.68, ease: [0.76, 0, 0.24, 1] }} />
    </motion.div>
  );
}
