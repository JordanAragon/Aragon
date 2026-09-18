'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect } from 'react';

export default function CursorOrbit() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 32, mass: 0.16 });
  const sy = useSpring(y, { stiffness: 500, damping: 32, mass: 0.16 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  return (
    <motion.div
      className="cursor-orbit"
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      <span />
    </motion.div>
  );
}
