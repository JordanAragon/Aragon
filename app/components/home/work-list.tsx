'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { work } from '../../data/work';
import WorkVisual from '../ui/work-visual';
import { ArrowUpRight } from '../ui/icons';

/*
  Lista de trabajo: una fila por proyecto. Con puntero fino, la ilustración del
  proyecto sigue al cursor (inclinada según la velocidad) mientras se recorre la lista.
*/
export default function WorkList({ limit }: { limit?: number }) {
  const items = limit ? work.slice(0, limit) : work;
  const peekRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const peek = peekRef.current;
    if (!peek || !window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let prev = 0;
    let raf = 0;
    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      const rot = Math.max(-8, Math.min(8, (x - prev) * 0.35));
      prev = x;
      peek.style.transform = `translate3d(${x + 28}px, ${y - 90}px, 0) rotate(${rot}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="work-list-wrap" onPointerLeave={() => setHover(null)}>
      <ul className="work-list">
        {items.map((item, i) => (
          <li key={item.slug}>
            <Link href={`/trabajo/${item.slug}`} className="work-row" onPointerEnter={() => setHover(i)} onFocus={() => setHover(null)}>
              <span className="work-row-title">{item.title}</span>
              <span className="work-row-summary">{item.summary}</span>
              <span className="work-row-meta">
                <span className="chip">{item.kind}</span>
                <span className="work-row-status mono">{item.status}</span>
              </span>
              <ArrowUpRight className="work-row-arrow" />
            </Link>
          </li>
        ))}
      </ul>
      <div ref={peekRef} className="work-peek" data-on={hover !== null} aria-hidden="true">
        {items.map((item, i) => (
          <div key={item.slug} className="work-peek-item" data-on={hover === i}>
            <WorkVisual visual={item.visual} label="" />
          </div>
        ))}
      </div>
    </div>
  );
}
