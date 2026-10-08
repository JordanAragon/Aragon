import { ImageResponse } from 'next/og';
import { site } from './data/site';

export const alt = 'Aragon · Software & Technology Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '58px',
          background: '#f3f0e8',
          color: '#0b0b0a',
          fontFamily: 'Georgia',
          border: '16px solid #0b0b0a',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, letterSpacing: 3, fontWeight: 700, fontFamily: 'Arial' }}>
          <span>ARAGON / SOFTWARE &amp; TECHNOLOGY STUDIO</span>
          <span>2026 / 001</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div style={{ fontSize: 116, lineHeight: 0.78, fontWeight: 800, letterSpacing: -8 }}>ARAGON</div>
          <div style={{ fontSize: 31, lineHeight: 1.1, color: '#6c6860', fontWeight: 700, fontFamily: 'Arial' }}>
            Diseño · Software · Sistemas
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 17, color: '#6c6860', fontWeight: 700, fontFamily: 'Arial' }}>
          <span>{site.location.toUpperCase()}</span>
          <span>PROBLEM → SYSTEM → WORK</span>
        </div>
      </div>
    ),
    size,
  );
}
