'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Segment = string | { text: string; className?: string };

type Props = {
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
  segments: Segment[];
};

export default function TextScrollTitle({ as = 'h2', id, className, segments }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const Tag = as;

  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const words = title.querySelectorAll<HTMLElement>('[data-scroll-title-word]');

    const context = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          opacity: 0.2,
          y: 24,
          rotateX: 16,
          filter: 'blur(6px)',
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.035,
          scrollTrigger: {
            trigger: title,
            start: 'top 88%',
            end: 'top 42%',
            scrub: 0.8,
          },
        },
      );
    }, title);

    return () => context.revert();
  }, []);

  return (
    <Tag ref={titleRef} id={id} className={`text-scroll-title ${className ?? ''}`.trim()}>
      {segments.flatMap((segment, segmentIndex) => {
        const text = typeof segment === 'string' ? segment : segment.text;
        const toneClass = typeof segment === 'string' ? '' : segment.className ?? '';
        return text.trim().split(/\s+/).map((word, wordIndex) => (
          <span
            key={`${segmentIndex}-${wordIndex}-${word}`}
            data-scroll-title-word="true"
            className={`text-scroll-title-word ${toneClass}`.trim()}
          >
            {word}
            {' '}
          </span>
        ));
      })}
    </Tag>
  );
}
