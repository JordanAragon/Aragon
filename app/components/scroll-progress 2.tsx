'use client';

import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.25 });
  return <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />;
}
