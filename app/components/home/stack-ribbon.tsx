'use client';

import { useEffect, useRef } from 'react';

/*
  Las herramientas con las que construimos, en una cinta inclinada cuya
  velocidad sigue al scroll (más rápida al bajar rápido, en reversa al subir).
*/
const TOOLS = ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Supabase', 'n8n', 'WhatsApp Business', 'Modelos de lenguaje', 'WebGPU', 'Docker', 'Caddy', 'Tailscale', 'Vercel', 'Linux'];

export default function StackRibbon() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let x = 0;
    let velocity = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    function loop() {
      raf = 0;
      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.12;
      lastY = y;
      x -= 0.6 + velocity * 0.25;
      const half = track!.scrollWidth / 2;
      if (x < -half) x += half;
      if (x > 0) x -= half;
      track!.style.transform = `translate3d(${x}px,0,0)`;
      if (visible) raf = requestAnimationFrame(loop);
    }
    io.observe(track);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const row = TOOLS.map((tool) => (
    <span key={tool} className="ribbon-item">
      {tool}
      <span className="ribbon-sep" aria-hidden="true" />
    </span>
  ));

  return (
    <div className="ribbon" aria-label="Herramientas con las que trabajamos">
      <div className="ribbon-band">
        <div className="ribbon-track" ref={trackRef}>
          <div className="ribbon-row">{row}</div>
          <div className="ribbon-row" aria-hidden="true">
            {row}
          </div>
        </div>
      </div>
    </div>
  );
}
