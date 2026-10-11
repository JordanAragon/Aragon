'use client';

import { useEffect, useRef } from 'react';
import { phases } from '../../data/process';

/*
  Las cuatro fases en orden. La línea se llena con la lectura: muestra en qué
  punto del proceso va quien lee, como en un proyecto real.
*/
export default function ProcessTimeline({ detailed = false }: { detailed?: boolean }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.6 - rect.top) / rect.height));
      el.style.setProperty('--fill', p.toFixed(4));
      el.querySelectorAll<HTMLElement>('.phase').forEach((phase) => {
        const r = phase.getBoundingClientRect();
        phase.dataset.reached = String(r.top < vh * 0.6);
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
    <ol className="timeline" ref={ref} data-detailed={detailed}>
      <span className="timeline-line" aria-hidden="true">
        <span />
      </span>
      {phases.map((phase) => (
        <li key={phase.n} className="phase" data-reached="false">
          <span className="phase-n mono">{phase.n}</span>
          <div className="phase-body">
            <h3>{phase.name}</h3>
            <p className="phase-line">{phase.line}</p>
            <p className="phase-text">{phase.body}</p>
            {detailed && (
              <div className="phase-lists">
                <div>
                  <h4>Tú pones</h4>
                  <ul>
                    {phase.youGive.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Recibes</h4>
                  <ul>
                    {phase.youGet.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
