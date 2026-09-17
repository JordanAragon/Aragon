'use client';

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';

type Props = {
  children: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
};

function RevealWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const start = 0.08 + (index / Math.max(1, total)) * 0.64;
  const end = Math.min(1, start + 0.28);
  const opacity = useTransform(progress, [start, end], reduced ? [1, 1] : [0.18, 1]);
  const y = useTransform(progress, [start, end], reduced ? [0, 0] : [12, 0]);
  const blur = useTransform(progress, [start, end], reduced ? [0, 0] : [5, 0]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return <motion.span className="scroll-word" style={{ opacity, y, filter }}>{word}{index < total - 1 ? ' ' : ''}</motion.span>;
}

export default function ScrollRevealText({ children, className, as = 'p' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScroll({ target: ref, offset: ['start 88%', 'end 36%'] }).scrollYProgress;
  const words = children.trim().split(/\s+/);
  const content = words.map((word, index) => (
    <RevealWord key={`${word}-${index}`} word={word} index={index} total={words.length} progress={progress} />
  ));

  return (
    <div ref={ref} className="scroll-reveal-trigger">
      {as === 'span' && <motion.span className={className}>{content}</motion.span>}
      {as === 'div' && <motion.div className={className}>{content}</motion.div>}
      {as === 'p' && <motion.p className={className}>{content}</motion.p>}
    </div>
  );
}
