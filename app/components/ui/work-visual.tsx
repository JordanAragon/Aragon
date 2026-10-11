'use client';

import { useEffect, useId, useRef } from 'react';
import type { WorkItem } from '../../data/work';

/*
  Ilustraciones de cada proyecto, dibujadas en código en el mismo lenguaje del
  sitio (piezas y retícula). No son capturas: cada una resume de qué trata el
  proyecto y su movimiento lo explica. El vivero brota y se sigue un lote; los
  servicios del servidor laten; el portafolio se recorre como una página.
  Solo se mueven mientras se ven (y nunca con movimiento reducido).
*/
export default function WorkVisual({ visual, label, play }: { visual: WorkItem['visual']; label: string; play?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    // Si quien la usa decide cuándo se mueve (la vista previa), no se observa.
    if (!el || play !== undefined) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.play = String(entry.isIntersecting);
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  return (
    <div
      ref={ref}
      className="work-visual"
      data-visual={visual}
      data-play={play === undefined ? undefined : String(play)}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      {visual === 'vivero' && <Vivero />}
      {visual === 'servidor' && <Servidor />}
      {visual === 'portafolio' && <Portafolio />}
    </div>
  );
}

const BEDS = 6;
const COLS = 26;

function Vivero() {
  // Camas del vivero: cada punto es una planta. Brotan en ola y una barra sigue un lote.
  return (
    <svg viewBox="0 0 400 250" aria-hidden="true">
      {Array.from({ length: BEDS }, (_, b) => (
        <g key={b} className={b === 2 ? 'wv-bed wv-bed-on' : 'wv-bed'}>
          {Array.from({ length: COLS }, (_, i) =>
            Array.from({ length: 3 }, (_, r) => (
              <rect
                key={`${i}-${r}`}
                className="wv-plant"
                x={32 + i * 13.2}
                y={34 + b * 32 + r * 6.5}
                width="3.2"
                height="3.2"
                style={{ '--d': i * 28 + b * 60 + r * 14, opacity: b === 2 ? 1 : 0.26 + ((i * 7 + r * 3 + b) % 5) * 0.07 } as React.CSSProperties}
              />
            )),
          )}
        </g>
      ))}
      <rect className="wv-track" x="28" y={34 + 2 * 32 - 5} width="2" height="23" />
      <text className="wv-label" x="32" y="22">
        lote en seguimiento
      </text>
    </svg>
  );
}

const SERVICES = ['caddy', 'postgres', 'nextcloud', 'navidrome', 'uptime-kuma', 'portainer'];

function Servidor() {
  // Un latido por servicio, cada uno con su ritmo: el monitoreo de Aragon-Server.
  return (
    <svg viewBox="0 0 400 250" aria-hidden="true">
      {SERVICES.map((name, i) => {
        const y = 40 + i * 32;
        const beat = 196 + ((i * 37) % 90);
        const d = `M150 ${y} H${beat} l5 -10 l6 18 l5 -12 l4 4 H352`;
        return (
          <g key={name} className="wv-service" style={{ '--i': i } as React.CSSProperties}>
            <rect className="wv-led" x="32" y={y - 4} width="7" height="7" />
            <text className="wv-name" x="50" y={y + 3}>
              {name}
            </text>
            <path className="wv-base" d={d} />
            <path className="wv-beat" d={d} pathLength="100" />
            <text className="wv-ok" x="368" y={y + 3} textAnchor="end">
              ok
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Portafolio() {
  // Una página hecha a la medida que se recorre de arriba abajo.
  const clip = `wv-page-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg viewBox="0 0 400 250" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <rect x="24" y="18" width="352" height="214" rx="4" />
        </clipPath>
      </defs>
      <rect className="wv-frame" x="24" y="18" width="352" height="214" rx="4" />
      <g clipPath={`url(#${clip})`}>
        <g className="wv-scroll">
          <rect x="40" y="32" width="38" height="6" className="wv-solid" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={262 + i * 34} y="33" width="24" height="4" className="wv-soft" />
          ))}
          <rect x="40" y="64" width="208" height="20" className="wv-solid" />
          <rect x="40" y="90" width="150" height="20" className="wv-solid" />
          <rect x="40" y="124" width="190" height="5" className="wv-soft" />
          <rect x="40" y="135" width="160" height="5" className="wv-soft" />
          <rect x="276" y="60" width="84" height="92" className="wv-line" />
          <rect x="290" y="74" width="56" height="56" className="wv-soft" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={40 + i * 108} y="176" width="96" height="70" className="wv-line" />
              <rect x={50 + i * 108} y="230" width="50" height="4" className="wv-soft" />
            </g>
          ))}
          <rect x="40" y="272" width="120" height="12" className="wv-solid" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="40" y={296 + i * 11} width={300 - i * 40} height="4" className="wv-soft" />
          ))}
          <rect x="40" y="360" width="320" height="1" className="wv-soft" />
          <rect x="40" y="372" width="60" height="5" className="wv-solid" />
        </g>
      </g>
    </svg>
  );
}
