import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SYMBOL_H, SYMBOL_PARTS, SYMBOL_W } from './components/hero/symbol';

export const alt = 'Aragon: agencia de automatización e IA para Colombia y Estados Unidos. Del desorden al sistema, con un prototipo funcionando en 48 horas';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/*
  La imagen para compartir es el hero en una sola toma: la A de la marca en el
  centro, hecha de piezas, delante de ARAGON en color de señal, con el titular
  a lado y lado.
*/
const fontFile = (weight: number) => readFile(join(process.cwd(), `node_modules/@fontsource/inter-tight/files/inter-tight-latin-${weight}-normal.woff`));

export default async function Image() {
  const [bold, black] = await Promise.all([fontFile(700), fontFile(800)]);
  const aw = 500;
  const ah = aw * (SYMBOL_H / SYMBOL_W);
  const cell = SYMBOL_W / 70;
  const grid = [];
  // Líneas en papel sobre la A: la dividen en piezas, como en la web.
  for (let x = 0; x <= SYMBOL_W; x += cell) grid.push(<rect key={`x${x}`} x={x - cell * 0.12} y={0} width={cell * 0.24} height={SYMBOL_H} fill="#f5f5f4" />);
  for (let y = 0; y <= SYMBOL_H; y += cell) grid.push(<rect key={`y${y}`} x={0} y={y - cell * 0.12} width={SYMBOL_W} height={cell * 0.24} fill="#f5f5f4" />);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#f5f5f4', color: '#0a0a0a', fontFamily: 'Inter Tight' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 214,
            display: 'flex',
            justifyContent: 'center',
            fontSize: 236,
            fontWeight: 800,
            letterSpacing: -16,
            lineHeight: 1,
            color: '#ff4d17',
          }}
        >
          ARAGON
        </div>
        <svg
          width={aw + 36}
          height={ah + 36}
          viewBox={`-3 -3 ${SYMBOL_W + 6} ${SYMBOL_H + 6}`}
          style={{ position: 'absolute', left: (1200 - aw - 36) / 2, top: 330 - (ah + 36) / 2 }}
        >
          {SYMBOL_PARTS.map((part) => (
            <path key={`k${part.d}`} d={part.d} fill="#f5f5f4" stroke="#f5f5f4" strokeWidth={4} strokeLinejoin="round" />
          ))}
          {SYMBOL_PARTS.map((part) => (
            <path key={part.d} d={part.d} fill={part.color === 0 ? '#0a0a0a' : '#9a9a9a'} />
          ))}
          <defs>
            <clipPath id="a">
              {SYMBOL_PARTS.map((part) => (
                <path key={`c${part.d}`} d={part.d} />
              ))}
            </clipPath>
          </defs>
          <g clipPath="url(#a)">{grid}</g>
        </svg>
        <div style={{ position: 'absolute', left: 56, top: 48, display: 'flex', flexDirection: 'column', fontSize: 64, fontWeight: 700, letterSpacing: -3.5, lineHeight: 0.9 }}>
          <span>DEL</span>
          <span>DESORDEN</span>
        </div>
        <div style={{ position: 'absolute', right: 56, top: 48, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: 64, fontWeight: 700, letterSpacing: -3.5, lineHeight: 0.9 }}>
          <span>AL</span>
          <span>SISTEMA.</span>
        </div>
        <div style={{ position: 'absolute', left: 56, bottom: 48, display: 'flex', flexDirection: 'column', fontSize: 22, fontWeight: 700, color: '#454545', lineHeight: 1.35 }}>
          <span style={{ color: '#0a0a0a', fontWeight: 700 }}>aragon · agencia de automatización e IA</span>
          <span>Agentes de WhatsApp, automatización y software a la medida</span>
          <span>Colombia y Estados Unidos</span>
        </div>
        <div style={{ position: 'absolute', right: 56, bottom: 40, display: 'flex', alignItems: 'flex-end', fontSize: 96, fontWeight: 800, letterSpacing: -6, lineHeight: 0.8 }}>
          48<span style={{ fontSize: 40, color: '#ff4d17', marginLeft: 4, letterSpacing: -1 }}>h</span>
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
