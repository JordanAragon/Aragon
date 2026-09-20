import { ImageResponse } from 'next/og';

export const alt = 'Aragon · Software · Digital · Technology';
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
          padding: '56px',
          background: '#f4f4f0',
          color: '#080809',
          fontFamily: 'Arial',
          border: '18px solid #080809',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, letterSpacing: 4, fontWeight: 800 }}>
          <span>ARAGON / DIGITAL STUDIO</span>
          <span>2026 / 001</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 112, lineHeight: 0.82, fontWeight: 900, letterSpacing: -8 }}>ARAGON</div>
          <div style={{ fontSize: 34, lineHeight: 1.05, color: '#6d6d73', fontWeight: 700 }}>
            Software · Digital · Technology
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 18, color: '#6d6d73', fontWeight: 700 }}>
          <span>CALI / COLOMBIA</span>
          <span>IDEA → PROBLEM → SYSTEM</span>
        </div>
      </div>
    ),
    size,
  );
}
