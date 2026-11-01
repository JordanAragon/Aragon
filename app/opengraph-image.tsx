import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Aragon: automatizamos tus pedidos con inteligencia artificial. Agencia de automatización e IA para Colombia y Estados Unidos, con prototipo en 48 horas';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/*
  La imagen para compartir es el hero en una sola toma: sobre la noche, la
  palabra enorme hecha de piezas (la retícula la parte en cuadrados), piezas
  sueltas alrededor y el titular en las esquinas.
*/
const fontFile = (weight: number) => readFile(join(process.cwd(), `node_modules/@fontsource/inter-tight/files/inter-tight-latin-${weight}-normal.woff`));

const NIGHT = '#0a0a0a';
const CELL = 11;

// Piezas sueltas con posiciones fijas (la imagen sale igual en cada compilación).
const loose = Array.from({ length: 170 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12543.1234;
  return { x: Math.round((a - Math.floor(a)) * 1196), y: Math.round((b - Math.floor(b)) * 626), o: 0.2 + ((i * 37) % 10) / 22 };
});

export default async function Image() {
  const [bold, black] = await Promise.all([fontFile(700), fontFile(800)]);
  const wordTop = 214;
  const wordH = 262;
  const grid = [];
  for (let x = 0; x <= 1200; x += CELL) grid.push(<div key={`x${x}`} style={{ position: 'absolute', left: x - 1.5, top: wordTop, width: 3, height: wordH, background: NIGHT }} />);
  for (let y = wordTop; y <= wordTop + wordH; y += CELL) grid.push(<div key={`y${y}`} style={{ position: 'absolute', left: 0, top: y - 1.5, width: 1200, height: 3, background: NIGHT }} />);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: NIGHT, color: '#fff', fontFamily: 'Inter Tight' }}>
        {loose.map((p, i) => (
          <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 3, height: 3, background: '#fff', opacity: p.o }} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: wordTop - 6,
            display: 'flex',
            justifyContent: 'center',
            fontSize: 268,
            fontWeight: 800,
            letterSpacing: -10,
            lineHeight: 1,
            background: NIGHT,
          }}
        >
          PEDIDOS
        </div>
        {grid}
        <div style={{ position: 'absolute', left: 56, top: 44, display: 'flex', fontSize: 62, fontWeight: 700, letterSpacing: -3.4, lineHeight: 0.9 }}>Automatizamos tus</div>
        <div style={{ position: 'absolute', right: 56, top: 40, display: 'flex', alignItems: 'flex-end', fontSize: 92, fontWeight: 800, letterSpacing: -6, lineHeight: 0.8 }}>
          48<span style={{ fontSize: 40, color: '#828282', marginLeft: 4, letterSpacing: -1 }}>h</span>
        </div>
        <div style={{ position: 'absolute', left: 56, bottom: 46, display: 'flex', flexDirection: 'column', fontSize: 21, fontWeight: 700, color: '#b3b3b3', lineHeight: 1.4 }}>
          <span style={{ color: '#fff' }}>aragon · agencia de automatización e IA</span>
          <span>Colombia y Estados Unidos</span>
        </div>
        <div style={{ position: 'absolute', right: 56, bottom: 44, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: 62, fontWeight: 700, letterSpacing: -3.4, lineHeight: 0.9 }}>
          <span>con inteligencia</span>
          <span>artificial.</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter Tight', data: bold, weight: 700, style: 'normal' },
        { name: 'Inter Tight', data: black, weight: 800, style: 'normal' },
      ],
    },
  );
}
