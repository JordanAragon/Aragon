import type { WorkItem } from '../../data/work';

/*
  Ilustraciones de cada proyecto, dibujadas en código en el mismo lenguaje del
  sitio (piezas y retícula). No son capturas: cada una resume de qué trata el
  proyecto. Las capturas reales se agregan cuando estén aprobadas.
*/
export default function WorkVisual({ visual, label }: { visual: WorkItem['visual']; label: string }) {
  return (
    <div className="work-visual" data-visual={visual} role="img" aria-label={label}>
      {visual === 'vivero' && <Vivero />}
      {visual === 'servidor' && <Servidor />}
      {visual === 'portafolio' && <Portafolio />}
      {visual === 'finanzas' && <Finanzas />}
      {visual === 'calendario' && <Calendario />}
    </div>
  );
}

function Vivero() {
  // Camas de un vivero: filas de plantas, una sola cama resaltada.
  const beds = Array.from({ length: 6 }, (_, b) => b);
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true">
      {beds.map((b) =>
        Array.from({ length: 22 }, (_, i) =>
          Array.from({ length: 3 }, (_, r) => (
            <rect
              key={`${b}-${i}-${r}`}
              x={22 + i * 12.6}
              y={22 + b * 28 + r * 6}
              width="3"
              height="3"
              fill="currentColor"
              opacity={b === 2 ? 1 : 0.28 + ((i * 7 + r * 3 + b) % 5) * 0.06}
            />
          )),
        ),
      )}
    </svg>
  );
}

function Servidor() {
  const rows = ['caddy', 'postgres', 'nextcloud', 'navidrome', 'uptime-kuma', 'portainer'];
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true">
      {rows.map((r, i) => (
        <g key={r} transform={`translate(22 ${26 + i * 28})`}>
          <rect width="8" height="8" y="-7" fill="currentColor" />
          <text x="18" y="0" fontSize="11" fill="currentColor" opacity="0.8" fontFamily="var(--font-mono-stack)">
            {r}
          </text>
          <path d={`M120 -3 H${176 + i * 6} l4 -9 l5 16 l4 -7 H276`} fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

function Portafolio() {
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true">
      <rect x="22" y="24" width="150" height="22" fill="currentColor" />
      <rect x="22" y="56" width="110" height="6" fill="currentColor" opacity="0.4" />
      <rect x="22" y="68" width="130" height="6" fill="currentColor" opacity="0.4" />
      <rect x="190" y="24" width="108" height="150" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={22 + i * 54} y="98" width="46" height="76" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      ))}
    </svg>
  );
}

function Finanzas() {
  const bars = [42, 66, 54, 80, 72, 96, 60, 88];
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true">
      <line x1="22" y1="172" x2="298" y2="172" stroke="currentColor" opacity="0.4" />
      {bars.map((h, i) => (
        <rect key={i} x={30 + i * 34} y={172 - h * 1.4} width="18" height={h * 1.4} fill="currentColor" opacity={i === 5 ? 1 : 0.35} />
      ))}
    </svg>
  );
}

function Calendario() {
  const marked = [3, 9, 10, 17, 22, 26];
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <rect
          key={i}
          x={46 + (i % 7) * 34}
          y={24 + Math.floor(i / 7) * 40}
          width="26"
          height="30"
          fill={marked.includes(i) ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1"
          opacity={marked.includes(i) ? 1 : 0.35}
        />
      ))}
    </svg>
  );
}
