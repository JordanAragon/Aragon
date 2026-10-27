import { ImageResponse } from 'next/og';

export const alt = 'Aragon: agencia de automatización e IA. Agentes de IA, automatización y software a la medida, con prototipos en 48 horas';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* La imagen para compartir: piezas sueltas a la izquierda, ordenadas en la retícula a la derecha. */
export default function Image() {
  const dots = [];
  for (let r = 0; r < 18; r++) {
    for (let c = 0; c < 40; c++) {
      const x = 40 + c * 28;
      const y = 40 + r * 30;
      const order = Math.min(1, Math.max(0, (x - 520) / 320));
      const jx = Math.sin(r * 12.9 + c * 78.2) * 22 * (1 - order);
      const jy = Math.cos(r * 4.1 + c * 9.7) * 18 * (1 - order);
      dots.push({ x: x + jx, y: y + jy, o: 0.18 + order * 0.6 });
    }
  }
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#0a0a0a', color: '#fff' }}>
        {dots.map((d, i) => (
          <div key={i} style={{ position: 'absolute', left: d.x, top: d.y, width: 4, height: 4, background: '#fff', opacity: d.o }} />
        ))}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 760, height: 630, display: 'flex', background: 'linear-gradient(90deg, #0a0a0a 55%, rgba(10,10,10,0))' }} />
        <div style={{ position: 'absolute', left: 72, top: 72, display: 'flex', alignItems: 'flex-end', fontSize: 52, fontWeight: 700, letterSpacing: -3 }}>
          aragon
          <div style={{ width: 14, height: 14, background: '#fff', marginLeft: 4, marginBottom: 12 }} />
        </div>
        <div style={{ position: 'absolute', left: 72, bottom: 72, display: 'flex', flexDirection: 'column', width: 680 }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -3.5, lineHeight: 1 }}>Automatizamos tu operación con IA.</div>
          <div style={{ marginTop: 26, fontSize: 26, color: '#b3b3b3' }}>Agentes de IA · Automatización · Software a la medida · Prototipos en 48 horas</div>
        </div>
      </div>
    ),
    size,
  );
}
