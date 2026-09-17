'use client';

import { useEffect, useRef } from 'react';

export default function CanvasCrowd() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const figures = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: 0.55 + Math.random() * 0.32,
      scale: 0.55 + Math.random() * 0.65,
      speed: 0.006 + Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.11 + Math.random() * 0.12,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFigure = (figure: typeof figures[number], width: number, height: number, time: number) => {
      const x = figure.x * width;
      const ground = figure.y * height;
      const unit = Math.max(7, Math.min(width, height) * 0.018) * figure.scale;
      const stride = reduced ? 0 : Math.sin(time * 0.005 * figure.speed * 1100 + figure.phase) * unit * 0.32;

      context.save();
      context.translate(x, ground);
      context.globalAlpha = figure.alpha;
      context.fillStyle = '#080809';
      context.strokeStyle = '#080809';
      context.lineWidth = Math.max(0.8, unit * 0.12);
      context.lineCap = 'round';

      context.beginPath();
      context.arc(0, -unit * 1.55, unit * 0.34, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.moveTo(0, -unit * 1.16);
      context.lineTo(-stride * 0.18, -unit * 0.15);
      context.moveTo(0, -unit * 1.04);
      context.lineTo(-unit * 0.62, -unit * 0.52 + stride * 0.2);
      context.moveTo(0, -unit * 1.02);
      context.lineTo(unit * 0.58, -unit * 0.47 - stride * 0.2);
      context.moveTo(-stride * 0.18, -unit * 0.15);
      context.lineTo(-unit * 0.48 - stride, unit * 0.72);
      context.moveTo(-stride * 0.18, -unit * 0.15);
      context.lineTo(unit * 0.48 + stride, unit * 0.72);
      context.stroke();
      context.restore();
    };

    let frame = 0;
    const loop = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);

      for (const figure of figures) {
        drawFigure(figure, width, height, time);
        if (!reduced) {
          figure.x += figure.speed * 0.0015;
          if (figure.x > 1.08) figure.x = -0.08;
        }
      }

      if (!reduced) frame = window.requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    frame = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-crowd" aria-hidden="true" />;
}
