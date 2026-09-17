'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

type Props = {
  children: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
};

function RevealWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const reduced = useReducedMotion();
  const start = 0.08 + (index / Math.max(1, total)) * 0.64;
  const end = Math.min(1, start + 0.28);
  const opacity = useTransform(progress, [start, end], reduced ? [1, 1] : [0.18, 1]);
  const y = useTransform(progress, [start, end], reduced ? [0, 0] : [12, 0]);
  const blur = useTransform(progress, [start, end], reduced ? [0, 0] : [5, 0]);

  return <motion.span className="scroll-word" style={{ opacity, y, filter: useTransform(blur, (value) => `blur(${value}px)`) }}>{word}{index < total - 1 ? ' ' : ''}</motion.span>;
}

export default function ScrollRevealText({ children, className, as = 'p' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScroll({ target: ref, offset: ['start 88%', 'end 36%'] }).scrollYProgress;
  const words = children.trim().split(/\s+/);
  const Tag = motion[as];

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, index) => <RevealWord key={`${word}-${index}`} word={word} index={index} total={words.length} progress={progress} />)}
    </Tag>
  );
}
