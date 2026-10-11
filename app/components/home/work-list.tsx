'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { work } from '../../data/work';
import WorkVisual from '../ui/work-visual';
import { ArrowUpRight } from '../ui/icons';

const LIVE = /^(en producción|operando)/i;

/*
  Lista de trabajo: una fila por proyecto. Con puntero fino, una ventana con la
  vista previa del proyecto sigue al cursor (se inclina con la velocidad y se
  voltea al acercarse al borde); al pasar de una fila a otra, las vistas corren
  como un carrete, así se lee que es la misma ventana mostrando otro proyecto.
  En pantallas táctiles la ilustración va dentro de cada fila.
*/
export default function WorkList({ limit }: { limit?: number }) {
  const items = limit ? work.slice(0, limit) : work;
  const wrapRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [last, setLast] = useState(0);

  const show = (i: number | null) => {
    setHover(i);
    if (i !== null) setLast(i);
  };

  useEffect(() => {
    const peek = peekRef.current;
    const wrap = wrapRef.current;
    if (!peek || !wrap || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let prev = x;
    let side = 1;
    let raf = 0;
    let moved = false;
    let scrolled = false;

    const loop = () => {
      raf = 0;
      const w = peek.offsetWidth;
      const h = peek.offsetHeight;
      // Cerca del borde derecho la ventana pasa al otro lado del cursor.
      if (tx + w + 48 > window.innerWidth) side = -1;
      else if (tx - w - 48 < 0) side = 1;
      const k = reduced ? 1 : 0.15;
      x += (tx - x) * k;
      y += (ty - y) * k;
      const rot = reduced ? 0 : Math.max(-6, Math.min(6, (x - prev) * 0.3));
      prev = x;
      const left = side > 0 ? x + 32 : x - w - 32;
      const top = Math.min(window.innerHeight - h - 16, Math.max(16, y - h / 2));
      peek.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      if (scrolled) {
        // Al desplazar sin mover el ratón, la fila bajo el cursor cambia: se vuelve a leer.
        scrolled = false;
        const row = document.elementFromPoint(tx, ty)?.closest<HTMLElement>('[data-work-row]');
        const inside = row && wrap.contains(row);
        const next = inside ? Number(row.dataset.workRow) : null;
        setHover(next);
        if (next !== null) setLast(next);
      }
      if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 || Math.abs(rot) > 0.05) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      if (!moved) {
        moved = true;
        x = tx;
        y = ty;
      }
      kick();
    };
    const onScroll = () => {
      if (!moved) return;
      scrolled = true;
      kick();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const active = hover ?? last;

  return (
    <div ref={wrapRef} className="work-list-wrap" data-hovering={hover !== null} onPointerLeave={() => show(null)}>
      <ul className="work-list">
        {items.map((item, i) => (
          <li key={item.slug}>
            <Link
              href={`/trabajo/${item.slug}`}
              className="work-row"
              data-work-row={i}
              data-active={hover === i}
              onPointerEnter={() => show(i)}
              onFocus={() => show(null)}
            >
              <span className="work-row-index mono tabular" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="work-row-title">
                <span className="work-row-title-text" data-text={item.title}>
                  {item.title}
                </span>
              </span>
              <span className="work-row-summary">{item.summary}</span>
              <span className="work-row-meta">
                <span className="chip">{item.kind}</span>
                <span className="work-row-status mono" data-live={LIVE.test(item.status)}>
                  {item.status}
                </span>
              </span>
              <span className="work-row-arrow-wrap" aria-hidden="true">
                <ArrowUpRight className="work-row-arrow" />
              </span>
              <span className="work-row-visual">
                <WorkVisual visual={item.visual} label="" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={peekRef} className="work-peek" data-on={hover !== null} aria-hidden="true" style={{ '--i': active } as React.CSSProperties}>
        <div className="work-peek-bar">
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="work-peek-titles">
            {items.map((item) => (
              <span key={item.slug}>{item.bar}</span>
            ))}
          </span>
          <span className="work-peek-count mono tabular">
            {String(active + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
          </span>
        </div>
        <div className="work-peek-body">
          <div className="work-peek-reel">
            {items.map((item, i) => (
              <div key={item.slug} className="work-peek-item">
                <WorkVisual visual={item.visual} label="" play={hover === i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
