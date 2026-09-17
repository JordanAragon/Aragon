'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { MotionValue } from 'motion/react';

type Card = {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
};

type Props = {
  cards: Card[];
  progress: MotionValue<number>;
  activeIndex: number;
};

export default function ProjectCardStack({ cards, progress, activeIndex }: Props) {
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const render = (value: number) => {
      const cursor = Math.min(cards.length - 1, Math.max(0, value * cards.length));

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const distance = index - cursor;
        const absolute = Math.min(3, Math.abs(distance));
        const behind = distance < 0;
        const x = Math.max(-16, Math.min(16, distance * 12));
        const y = behind ? -absolute * 7 : absolute * 8;
        const scale = 1 - absolute * 0.045;
        const rotation = distance * 4.5;
        const opacity = absolute > 2.1 ? 0 : 1 - absolute * 0.16;

        gsap.set(card, {
          xPercent: x,
          yPercent: y,
          scale,
          rotation,
          opacity,
          zIndex: 100 - Math.round(absolute * 10) - (behind ? 20 : 0),
        });
      });
    };

    render(progress.get());
    const unsubscribe = progress.on('change', render);
    return () => unsubscribe();
  }, [cards.length, progress]);

  return (
    <div ref={stackRef} className="project-card-stack" aria-label="Conceptos de proyecto">
      {cards.map((card, index) => (
        <article
          key={card.id}
          ref={(node) => {
            cardRefs.current[index] = node;
          }}
          className={`project-card ${index === activeIndex ? 'is-active' : ''}`}
        >
          <Image src={card.image} alt={index === activeIndex ? card.alt : ''} fill sizes="(max-width: 780px) 92vw, 62vw" priority={index < 2} />
          <div className="project-card-shade" />
          <div className="project-card-meta">
            <span>{card.eyebrow}</span>
            <span>0{index + 1} / 04</span>
          </div>
        </article>
      ))}
    </div>
  );
}
