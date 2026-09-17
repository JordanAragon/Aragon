'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

const ASSETS = [
  '/img/portafolio.png',
  '/img/aiden.png',
  '/img/aragon-server.png',
  '/images/peeps/aragon-crowd-sprite.png',
];
const word = 'ARAGON';

function preloadAsset(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export default function Preloader() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add('is-preloading');
    let raf = 0;
    const timers = new Set<number>();
    let done = false;
    const start = performance.now();
    const minimum = reduced ? 260 : 720;

    const finish = () => {
      if (done) return;
      done = true;
      setProgress(1);
      const exitTimer = window.setTimeout(() => setLeaving(true), reduced ? 80 : 110);
      timers.add(exitTimer);
    };

    let loaded = 0;
    const handleLoaded = () => {
      loaded += 1;
      setProgress(Math.max(0.08, loaded / ASSETS.length));
    };

    Promise.all(ASSETS.map((src) => preloadAsset(src).then(handleLoaded))).then(() => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minimum - elapsed);
      const finishTimer = window.setTimeout(finish, wait);
      timers.add(finishTimer);
    });

    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - start) / minimum);
      setProgress((current) => Math.max(current, Math.min(0.98, 0.15 + elapsed * 0.8)));
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      document.body.classList.remove('is-preloading');
    };
  }, [reduced]);

  if (!visible) return null;
  const pct = Math.round(progress * 100);

  return (
    <motion.div
      className="preloader-v4"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reduced ? 0.28 : 0.48, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => { if (leaving) { document.body.classList.remove('is-preloading'); setVisible(false); } }}
      aria-hidden="true"
    >
      <div className="preloader-v4-grid" />
      <div className="preloader-v4-top"><span>ARAGON / ENTRY</span><span>BUILD WITH INTENT</span></div>

      <div className="preloader-v4-center">
        <div className="preloader-v4-mark"><span>A</span><i style={{ transform: `scaleX(${progress})` }} /></div>
        <div className="preloader-v4-type">
          {word.split('').map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: progress > (index + 1) / (word.length + 1) ? '0%' : '110%', opacity: progress > (index + 1) / (word.length + 1) ? 1 : 0 }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            >{letter}</motion.span>
          ))}
          <b className="preloader-v4-caret" />
        </div>
        <div className="preloader-v4-meta"><span>SOFTWARE / DIGITAL / TECHNOLOGY</span><b>{String(pct).padStart(3, '0')}</b></div>
        <div className="preloader-v4-bar"><motion.i style={{ scaleX: progress, transformOrigin: 'left' }} /></div>
      </div>

      <div className="preloader-v4-bottom"><span>LOADING ASSETS</span><span>EXPERIENCE / 01</span></div>
      <motion.div className="preloader-v4-shutter" animate={{ y: leaving ? '0%' : '100%' }} transition={{ duration: reduced ? 0.4 : 0.68, ease: [0.76, 0, 0.24, 1] }} />
    </motion.div>
  );
}
