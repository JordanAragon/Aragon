'use client';

import { useEffect, useRef } from 'react';

/*
  Texto que se enciende palabra por palabra con el scroll: la lectura marca el
  ritmo. Sin JavaScript o con movimiento reducido, el texto se ve completo.
*/
export default function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>('.sw-word'));
    el.dataset.live = 'true';
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Empieza a encenderse cuando el párrafo entra y termina cuando su centro pasa el 40 % de la pantalla.
      const p = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.35)));
      const lit = p * words.length;
      words.forEach((word, i) => {
        const v = Math.min(1, Math.max(0, lit - i));
        word.style.setProperty('--lit', v.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className={`scroll-words ${className ?? ''}`}>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} className="sw-word">
          {word}{' '}
        </span>
      ))}
    </p>
  );
}
