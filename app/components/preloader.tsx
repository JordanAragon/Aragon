'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function Preloader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'enter' | 'exit' | 'done'>('enter');

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setPhase('exit'), reduced ? 80 : 760);
    const doneTimer = window.setTimeout(() => setPhase('done'), reduced ? 220 : 1210);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [reduced]);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: reduced ? 0.12 : 0.42, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <div className="preloader-top"><span>ARAGON</span><span>2026 / 001</span></div>
      <div className="preloader-center">
        <div className="preloader-mark">A</div>
        <div className="preloader-line"><i /></div>
        <span>SOFTWARE · DIGITAL · TECHNOLOGY</span>
      </div>
      <div className="preloader-bottom"><span>JORDAN ARAGON</span><span>HECHO CON INTENCIÓN</span></div>
    </motion.div>
  );
}
