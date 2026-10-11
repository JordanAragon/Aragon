'use client';

import { useEffect, useRef } from 'react';

/*
  Demo de infraestructura: los servicios de un servidor con su latido. Cada
  línea es un chequeo periódico: el pulso pasa cuando el servicio responde.
  Los nombres son los que corren en nuestro propio servidor.
*/

const SERVICES = [
  ['caddy', 'proxy y certificados'],
  ['postgres', 'base de datos'],
  ['n8n', 'automatizaciones'],
  ['nextcloud', 'archivos'],
  ['uptime-kuma', 'monitoreo'],
  ['respaldo', 'copia nocturna'],
] as const;

export default function ServerDemo({ running = true }: { running?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const rows = SERVICES.length;

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      const W = canvas.width;
      const H = canvas.height;
      const rowH = H / rows;
      ctx.clearRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) {
        const mid = rowH * (r + 0.5);
        const phase = reduced ? 0.6 : ((now / 1000) * (0.38 + r * 0.05) + r * 0.21) % 1.15;
        const beat = (u: number) => {
          const d = u - phase;
          if (d > 0.04 || d < -0.05) return 0;
          if (d < -0.025) return Math.sin(((d + 0.05) / 0.025) * Math.PI) * 0.15;
          if (d < 0) return -Math.sin(((d + 0.025) / 0.025) * Math.PI) * 0.2;
          return Math.sin((d / 0.04) * Math.PI);
        };
        ctx.lineWidth = 1.25 * dpr;
        ctx.strokeStyle = 'rgba(255,255,255,0.16)';
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) ctx.lineTo(x, mid - beat(x / W) * rowH * 0.36);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        const from = Math.max(0, (phase - 0.14) * W);
        const to = Math.min(W, (phase + 0.04) * W);
        for (let x = from; x <= to; x += 2) ctx.lineTo(x, mid - beat(x / W) * rowH * 0.36);
        ctx.stroke();
      }
      if (!reduced && running) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return (
    <div className="demo-server">
      <div className="demo-server-cmd mono">
        jordan@aragon-server ~ % <b>estado</b>
      </div>
      <div className="demo-server-grid">
        <ul className="demo-server-names">
          {SERVICES.map(([name, role]) => (
            <li key={name}>
              <span className="mono">{name}</span>
              <small>{role}</small>
            </li>
          ))}
        </ul>
        <canvas ref={canvasRef} className="demo-server-beats" aria-hidden="true" />
        <ul className="demo-server-state mono" aria-label="Estado">
          {SERVICES.map(([name]) => (
            <li key={name}>en línea</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
