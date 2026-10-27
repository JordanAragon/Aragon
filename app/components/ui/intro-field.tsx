'use client';

import { useCallback, useRef } from 'react';
import ParticleCanvas from '../field/particle-canvas';
import type { ParticleSim } from '../field/sim';

/*
  La apertura de cada página interna: las piezas llegan sueltas y se ordenan en
  la figura de lo que trata la página. Es la misma idea del inicio («poner en
  orden»), para quien llega directo desde la barra:
  - servicios: las tres figuras (conversación, flujo y tabla);
  - proceso: cuatro fases unidas por una línea, cada una más completa;
  - trabajo: las ventanas de los proyectos;
  - nosotros: una sola pieza grande (una agencia pequeña, a propósito);
  - preguntas: el signo de pregunta;
  - conversacion, flujo y tabla: la figura de cada servicio.
*/
export type IntroFigure = 'servicios' | 'proceso' | 'trabajo' | 'nosotros' | 'preguntas' | 'tabla' | 'flujo' | 'conversacion';

type Box = { x: number; y: number; w: number; h: number };

function figureBox(w: number, h: number): Box {
  if (w >= 900) {
    const size = Math.min(w * 0.3, h * 0.62, 440);
    return { x: w * 0.95 - size, y: h * 0.54 - size / 2, w: size, h: size };
  }
  const size = Math.min(w * 0.5, 220);
  return { x: w - size - 16, y: 88, w: size, h: size };
}

function drawTable(ctx: CanvasRenderingContext2D, b: Box) {
  const rows = 6;
  const rh = b.h / rows;
  for (let r = 0; r < rows; r++) {
    const y = b.y + r * rh + rh * 0.3;
    ctx.fillRect(b.x, y, rh * 0.4, rh * 0.4);
    const len = r === 0 ? 0.86 : [0.62, 0.8, 0.5, 0.72, 0.58][r - 1];
    ctx.fillRect(b.x + rh * 0.6, y + rh * 0.12, (b.w - rh * 0.6) * len, rh * 0.16);
  }
}

function drawFlow(ctx: CanvasRenderingContext2D, b: Box) {
  const s = b.w * 0.16;
  const nodes = [
    [b.x, b.y + b.h * 0.18],
    [b.x, b.y + b.h * 0.82 - s],
    [b.x + b.w / 2 - s / 2, b.y + b.h / 2 - s / 2],
    [b.x + b.w - s, b.y + b.h / 2 - s / 2],
  ];
  ctx.lineWidth = Math.max(3, b.w * 0.014);
  ctx.beginPath();
  ctx.moveTo(nodes[0][0] + s, nodes[0][1] + s / 2);
  ctx.bezierCurveTo(b.x + b.w * 0.36, nodes[0][1] + s / 2, b.x + b.w * 0.3, b.y + b.h / 2, nodes[2][0], b.y + b.h / 2);
  ctx.moveTo(nodes[1][0] + s, nodes[1][1] + s / 2);
  ctx.bezierCurveTo(b.x + b.w * 0.36, nodes[1][1] + s / 2, b.x + b.w * 0.3, b.y + b.h / 2, nodes[2][0], b.y + b.h / 2);
  ctx.moveTo(nodes[2][0] + s, b.y + b.h / 2);
  ctx.lineTo(nodes[3][0], b.y + b.h / 2);
  ctx.stroke();
  nodes.forEach(([x, y]) => ctx.fillRect(x, y, s, s));
}

function drawChat(ctx: CanvasRenderingContext2D, b: Box) {
  ctx.lineWidth = Math.max(4, b.w * 0.018);
  ctx.beginPath();
  ctx.roundRect(b.x, b.y + b.h * 0.08, b.w * 0.62, b.h * 0.24, b.h * 0.06);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(b.x + b.w * 0.28, b.y + b.h * 0.42, b.w * 0.72, b.h * 0.34, b.h * 0.06);
  ctx.fill();
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  [0.45, 0.6, 0.75].forEach((f) => ctx.fillRect(b.x + b.w * f, b.y + b.h * 0.56, b.w * 0.06, b.w * 0.06));
  ctx.restore();
}

function draw(figure: IntroFigure, ctx: CanvasRenderingContext2D, b: Box) {
  switch (figure) {
    case 'tabla':
      return drawTable(ctx, b);
    case 'flujo':
      return drawFlow(ctx, b);
    case 'conversacion':
      return drawChat(ctx, b);
    case 'servicios': {
      // En el orden del recorrido: la conversación y el flujo arriba, la tabla donde todo termina.
      const g = b.w * 0.1;
      const q = (b.w - g) / 2;
      drawChat(ctx, { x: b.x, y: b.y, w: q, h: q });
      drawFlow(ctx, { x: b.x + q + g, y: b.y, w: q, h: q });
      drawTable(ctx, { x: b.x + (b.w - q) / 2, y: b.y + q + g, w: q, h: q });
      return;
    }
    case 'proceso': {
      // Cuatro fases: cada una más completa que la anterior, unidas por la línea del proceso.
      const s = b.w * 0.17;
      const gap = (b.w - s * 4) / 3;
      const y = b.y + b.h / 2 - s / 2;
      ctx.fillRect(b.x, b.y + b.h / 2 - 2, b.w, 4);
      ctx.lineWidth = Math.max(3, s * 0.08);
      for (let i = 0; i < 4; i++) {
        const x = b.x + i * (s + gap);
        ctx.clearRect(x - gap * 0.2, y - 4, s + gap * 0.4, s + 8);
        ctx.strokeRect(x, y, s, s);
        ctx.fillRect(x, y + s * (1 - (i + 1) / 4), s, (s * (i + 1)) / 4);
      }
      return;
    }
    case 'trabajo': {
      // Tres ventanas: los proyectos, cada uno con su barra.
      ctx.lineWidth = Math.max(5, b.w * 0.022);
      [
        [0, 0.06, 0.66, 0.42],
        [0.2, 0.3, 0.66, 0.42],
        [0.34, 0.54, 0.66, 0.42],
      ].forEach(([fx, fy, fw, fh]) => {
        const x = b.x + b.w * fx;
        const y = b.y + b.h * fy;
        const ww = b.w * fw;
        const hh = b.h * fh;
        ctx.clearRect(x, y, ww, hh);
        ctx.strokeRect(x, y, ww, hh);
        ctx.fillRect(x, y, ww, hh * 0.13);
      });
      return;
    }
    case 'nosotros': {
      const s = b.w * 0.56;
      ctx.fillRect(b.x + (b.w - s) / 2, b.y + (b.h - s) / 2, s, s);
      return;
    }
    case 'preguntas': {
      ctx.font = `700 ${b.h * 0.95}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-display') || 'sans-serif'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', b.x + b.w / 2, b.y + b.h * 0.52);
      return;
    }
  }
}

/**
 * Reparte las piezas sobre la figura en una retícula cuyo paso sale de la tinta
 * real: las figuras de trazo fino quedan nítidas, sin piezas de más con ruido.
 */
function inkLattice(w: number, h: number, n: number, paint: (ctx: CanvasRenderingContext2D) => void) {
  const out = new Float32Array(n * 2);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(w));
  canvas.height = Math.max(1, Math.floor(h));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return out;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  paint(ctx);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const inside = (x: number, y: number) => data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3] > 128;
  let ink = 0;
  for (let y = 0; y < canvas.height; y += 2) for (let x = 0; x < canvas.width; x += 2) if (inside(x, y)) ink += 4;
  let step = Math.max(2.5, Math.sqrt(ink / n));
  let pts: number[] = [];
  for (let tries = 0; tries < 5; tries++) {
    pts = [];
    for (let y = step / 2; y < canvas.height; y += step) for (let x = step / 2; x < canvas.width; x += step) if (inside(x, y)) pts.push(x, y);
    const m = pts.length / 2;
    if (m >= n * 0.9 && m <= n * 1.1) break;
    step = Math.max(2.5, step * Math.sqrt(m / n));
  }
  const m = pts.length / 2 || 1;
  for (let i = 0; i < n; i++) {
    // Si sobran piezas se apilan exactas (no se ven de más); si faltan celdas, se toman parejas.
    const k = Math.floor((i * m) / n) % m;
    out[i * 2] = pts[k * 2] ?? w / 2;
    out[i * 2 + 1] = pts[k * 2 + 1] ?? h / 2;
  }
  return out;
}

export default function IntroField({ figure }: { figure: IntroFigure }) {
  const hostRef = useRef<HTMLDivElement>(null);

  const setup = useCallback(
    (sim: ParticleSim) => {
      sim.stiffness = 0.055;
      sim.damping = 0.8;
      sim.jitter = 0;
      sim.pointerMode = 'push';
      sim.pointerRadius = 80;
      sim.baseSize = 2;
      sim.targetAlpha.fill(0.85);
      const phase = new Float32Array(sim.n);
      for (let i = 0; i < sim.n; i++) phase[i] = sim.random() * Math.PI * 2;
      let home = new Float32Array(sim.n * 2);
      // Ya en su figura, las piezas respiran apenas: la figura está viva, no quieta.
      sim.updater = (s, time) => {
        for (let i = 0; i < s.n; i++) {
          if (time < s.delay[i]) continue;
          s.tx[i] = home[i * 2] + Math.sin(time * 0.8 + phase[i]) * 0.6;
          s.ty[i] = home[i * 2 + 1] + Math.cos(time * 0.7 + phase[i]) * 0.6;
        }
      };
      return (w: number, h: number) => {
        const b = figureBox(w, h);
        home = inkLattice(w, h, sim.n, (ctx) => draw(figure, ctx, b));
        if (sim.time === 0) {
          // Llegan sueltas desde la izquierda, como las piezas del inicio, y se ordenan de izquierda a derecha.
          for (let i = 0; i < sim.n; i++) {
            sim.x[i] = b.x - w * (0.2 + sim.random() * 0.5);
            sim.y[i] = h * (0.1 + sim.random() * 0.8);
            sim.alpha[i] = 0;
          }
        }
        sim.setTargets(home, sim.time === 0 ? 1.1 : 0, 'x');
      };
    },
    [figure],
  );

  return (
    <div ref={hostRef} className="intro-field" aria-hidden="true">
      <ParticleCanvas className="intro-field-canvas" count={1500} seed={23} setup={setup} pointerTarget={hostRef} />
    </div>
  );
}
