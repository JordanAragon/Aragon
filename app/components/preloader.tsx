'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function Preloader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), reduced ? 220 : 1050);
    return () => window.clearTimeout(timeout);
  }, [reduced]);

  if (!visible) return null;

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <div className="preloader-top"><span>ARAGON</span><span>2026 / 001</span></div>
      <div className="preloader-center">
        <div className="preloader-mark">A</div>
        <div className="preloader-line"><i /></div>
        <span>SOFTWARE · DIGITAL · TECHNOLOGY</span>
      </div>
      <div className="preloader-bottom"><span>JORDAN ARAGON</span><span>BUILT WITH INTENT</span></div>
    </motion.div>
  );
}
