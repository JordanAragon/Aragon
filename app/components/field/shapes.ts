/*
  Figuras que forman las partículas. Cada figura explica algo: el desorden de
  hoy, la tabla donde todo queda ordenado, el flujo que conecta herramientas,
  la conversación del agente y el latido del servidor vigilado.

  Las posiciones salen de dibujar la figura en un lienzo oculto y tomar sus
  píxeles. Las mismas medidas (`stageBox`, `flowLayout`…) sirven para ubicar
  las etiquetas HTML encima del lienzo.
*/

import { rng } from './sim';

export type Box = { x: number; y: number; w: number; h: number };

export function sampleDrawing(w: number, h: number, n: number, draw: (ctx: CanvasRenderingContext2D) => void, seed = 7) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(w));
  canvas.height = Math.max(1, Math.floor(h));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const out = new Float32Array(n * 2);
  if (!ctx) return out;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  draw(ctx);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const step = Math.max(2, Math.floor(Math.sqrt((canvas.width * canvas.height) / (n * 6))));
  const pts: number[] = [];
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4 + 3] > 120) pts.push(x, y);
    }
  }
  const r = rng(seed);
  const m = pts.length / 2;
  if (!m) {
    for (let i = 0; i < n; i++) {
      out[i * 2] = w / 2;
      out[i * 2 + 1] = h / 2;
    }
    return out;
  }
  const idx = Array.from({ length: m }, (_, i) => i);
  for (let i = m - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  for (let i = 0; i < n; i++) {
    const k = idx[i % m];
    const extra = i >= m ? (r() - 0.5) * step * 0.9 : 0;
    out[i * 2] = pts[k * 2] + extra;
    out[i * 2 + 1] = pts[k * 2 + 1] + (i >= m ? (r() - 0.5) * step * 0.9 : 0);
  }
  return out;
}

/** Reparte `n` puntos en retícula dentro de rectángulos: figuras nítidas, sin ruido de muestreo. */
export function latticeFill(rects: Box[], n: number) {
  const area = rects.reduce((sum, r) => sum + r.w * r.h, 0) || 1;
  const step = Math.max(2, Math.sqrt(area / n));
  const pts: number[] = [];
  for (const r of rects) {
    for (let y = r.y + step / 2; y < r.y + r.h; y += step) {
      for (let x = r.x + step / 2; x < r.x + r.w; x += step) pts.push(x, y);
    }
  }
  const out = new Float32Array(n * 2);
  const m = pts.length / 2 || 1;
  for (let i = 0; i < n; i++) {
    // Si sobran piezas, se apilan sobre los mismos puntos (no se ven de más); si faltan, se toman parejo.
    const k = Math.floor((i * m) / n) % m;
    out[i * 2] = pts[k * 2] ?? 0;
    out[i * 2 + 1] = pts[k * 2 + 1] ?? 0;
  }
  return out;
}

/** Zona del lienzo donde se dibuja la figura: a la derecha en escritorio, arriba en el teléfono. */
export function stageBox(w: number, h: number): Box {
  if (w >= 900) {
    const top = Math.max(h * 0.16, 120);
    return { x: w * 0.45, y: top, w: w * 0.5, h: h * 0.84 - top };
  }
  const top = Math.max(h * 0.1, 96);
  return { x: w * 0.06, y: top, w: w * 0.88, h: h * 0.5 - top };
}

/* ---------------- Hoy: piezas sueltas ---------------- */

export const chaosClusters = [
  { fx: 0.18, fy: 0.22, label: 'pedido por WhatsApp' },
  { fx: 0.74, fy: 0.16, label: 'inventario_final_v3.xlsx' },
  { fx: 0.5, fy: 0.52, label: 'libreta de la bodega' },
  { fx: 0.16, fy: 0.8, label: 'correo sin responder' },
  { fx: 0.82, fy: 0.74, label: 'factura pendiente' },
];

export function chaosShape(w: number, h: number, n: number) {
  const b = stageBox(w, h);
  const r = rng(11);
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    // La mitad de las piezas se amontona en focos (las herramientas sueltas) y el resto flota.
    if (r() < 0.62) {
      const c = chaosClusters[Math.floor(r() * chaosClusters.length)];
      const a = r() * Math.PI * 2;
      const d = Math.pow(r(), 0.7) * Math.min(b.w, b.h) * 0.16;
      out[i * 2] = b.x + c.fx * b.w + Math.cos(a) * d;
      out[i * 2 + 1] = b.y + c.fy * b.h + Math.sin(a) * d * 0.8;
    } else {
      out[i * 2] = b.x + r() * b.w;
      out[i * 2 + 1] = b.y + r() * b.h;
    }
  }
  return out;
}

/* ---------------- Ordenar: la tabla ---------------- */

export const tableColumns = ['Pedido', 'Cliente', 'Estado', 'Entrega'];

export function tableLayout(w: number, h: number) {
  const b = stageBox(w, h);
  const rows = 7;
  const cols = [0.22, 0.34, 0.22, 0.22];
  const gap = Math.max(6, b.w * 0.012);
  const rowH = (b.h - gap * (rows - 1)) / rows;
  return { b, rows, cols, gap, rowH };
}

export function tableShape(w: number, h: number, n: number) {
  const { b, rows, cols, gap, rowH } = tableLayout(w, h);
  const rects: Box[] = [];
  for (let r = 0; r < rows; r++) {
    let x = b.x;
    const y = b.y + r * (rowH + gap);
    cols.forEach((c, ci) => {
      const cw = b.w * c - gap;
      // La cabecera es una barra llena; las filas tienen celdas con contenido de distinto largo.
      const fill = r === 0 ? 1 : 0.35 + (((r * 7 + ci * 3) % 5) / 5) * 0.6;
      rects.push({ x, y: y + rowH * 0.3, w: cw * fill, h: rowH * 0.4 });
      x += b.w * c;
    });
  }
  return latticeFill(rects, n);
}

/* ---------------- El hero: la app que se llena ---------------- */

/** Pedidos visibles en la tabla del hero y piezas por pedido (un cuadrado de 7 × 7). */
export const HERO_ROWS = 5;
export const PACKET_SIDE = 7;

/**
 * La app del hero, a la derecha: barra lateral, cabecera, tres tarjetas y la
 * tabla de pedidos. Cada pedido llega como un cuadrado de piezas (la pieza
 * ordenada de la marca) y su texto va al lado.
 */
export function heroApp(w: number, h: number) {
  const narrow = w < 900;
  const x0 = narrow ? w * 0.5 : w * 0.6;
  const x1 = w - Math.max(narrow ? 16 : 24, w * 0.03);
  const y0 = narrow ? Math.max(96, h * 0.12) : Math.max(120, h * 0.16);
  const y1 = narrow ? h * 0.46 : h * 0.79;
  const W = x1 - x0;
  const H = y1 - y0;
  const side = W * 0.21;
  const gap = W * 0.035;
  const cx = x0 + side + gap;
  const cw = x1 - cx;
  const header = { x: cx, y: y0, w: cw, h: H * 0.1 };
  const cardGap = W * 0.025;
  const cardW = (cw - cardGap * 2) / 3;
  const cards = [0, 1, 2].map((i) => ({ x: cx + i * (cardW + cardGap), y: y0 + H * 0.15, w: cardW, h: H * 0.2 }));
  const tableY = y0 + H * 0.42;
  const rowH = (y1 - tableY) / HERO_ROWS;
  const square = Math.min(rowH * 0.6, 30);
  const rows = Array.from({ length: HERO_ROWS }, (_, r) => {
    const y = tableY + r * rowH;
    return { x: cx, y, w: cw, h: rowH, sq: { x: cx, y: y + (rowH - square) / 2, size: square } };
  });
  const sidebar = { x: x0, y: y0, w: side, h: H };
  // La frontera entre lo suelto y lo ordenado: por aquí cruzan los pedidos.
  const gateX = x0 - Math.max(18, W * 0.06);
  return { x0, x1, y0, y1, W, H, sidebar, header, cards, rows, tableY, rowH, square, gateX, narrow };
}

export type HeroApp = ReturnType<typeof heroApp>;

/** Las líneas de la app (cabecera, tarjetas y separadores de la tabla), para dibujarlas con piezas. */
export function heroFrameLines(app: HeroApp): Box[] {
  const t = Math.max(1.5, app.W * 0.004);
  const rects: Box[] = [{ x: app.header.x, y: app.header.y + app.header.h, w: app.header.w, h: t }];
  app.cards.forEach((c) => {
    rects.push({ x: c.x, y: c.y, w: c.w, h: t }, { x: c.x, y: c.y + c.h - t, w: c.w, h: t });
    rects.push({ x: c.x, y: c.y, w: t, h: c.h }, { x: c.x + c.w - t, y: c.y, w: t, h: c.h });
  });
  app.rows.forEach((r) => rects.push({ x: r.x, y: r.y + r.h - t / 2, w: r.w, h: t * 0.6 }));
  return rects;
}

/* ---------------- Conectar: el flujo ---------------- */

export const flowNodes = [
  { label: 'WhatsApp', fx: 0.08, fy: 0.22 },
  { label: 'Formulario', fx: 0.08, fy: 0.78 },
  { label: 'n8n', fx: 0.5, fy: 0.5 },
  { label: 'Base de datos', fx: 0.92, fy: 0.2 },
  { label: 'Bodega', fx: 0.92, fy: 0.5 },
  { label: 'Reporte', fx: 0.92, fy: 0.8 },
];
export const flowEdges: [number, number][] = [
  [0, 2],
  [1, 2],
  [2, 3],
  [2, 4],
  [2, 5],
];

export function flowLayout(w: number, h: number) {
  const b = stageBox(w, h);
  const nw = Math.min(150, b.w * 0.26);
  const nh = Math.min(54, b.h * 0.13);
  const inner = { x: b.x + nw / 2, y: b.y + nh / 2, w: b.w - nw, h: b.h - nh };
  const nodes = flowNodes.map((node) => ({ ...node, cx: inner.x + node.fx * inner.w, cy: inner.y + node.fy * inner.h }));
  return { b, nw, nh, nodes };
}

export function flowPath(w: number, h: number, edge: number, t: number) {
  const { nw, nodes } = flowLayout(w, h);
  const [a, c] = flowEdges[edge];
  const p0x = nodes[a].cx + nw / 2;
  const p0y = nodes[a].cy;
  const p3x = nodes[c].cx - nw / 2;
  const p3y = nodes[c].cy;
  const mx = (p0x + p3x) / 2;
  const u = 1 - t;
  const x = u * u * u * p0x + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * p3x;
  const y = u * u * u * p0y + 3 * u * u * t * p0y + 3 * u * t * t * p3y + t * t * t * p3y;
  return [x, y] as const;
}

export function flowNodeShape(w: number, h: number, n: number) {
  const { nw, nh, nodes } = flowLayout(w, h);
  return sampleDrawing(w, h, n, (ctx) => {
    ctx.lineWidth = 7;
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.roundRect(node.cx - nw / 2, node.cy - nh / 2, nw, nh, 14);
      ctx.stroke();
    });
  }, 31);
}

/* ---------------- Responder: la conversación ---------------- */

export const chatBubbles = [
  { side: 'in', fy: 0.04, fw: 0.62, fh: 0.15, text: '¿Tienen domicilio a Jamundí hoy?' },
  { side: 'out', fy: 0.26, fw: 0.7, fh: 0.22, text: 'Sí. Si el pedido entra antes de las 12 m., llega hoy en la ruta de la tarde.' },
  { side: 'in', fy: 0.56, fw: 0.48, fh: 0.15, text: 'Perfecto, ¿y mi pedido de ayer?' },
  { side: 'out', fy: 0.78, fw: 0.3, fh: 0.13, text: '' },
] as const;

export function chatLayout(w: number, h: number) {
  const b = stageBox(w, h);
  const bubbles = chatBubbles.map((c) => {
    const bw = b.w * c.fw;
    const bh = b.h * c.fh;
    const x = c.side === 'in' ? b.x : b.x + b.w - bw;
    return { ...c, x, y: b.y + b.h * c.fy, w: bw, h: bh };
  });
  return { b, bubbles };
}

export function chatShape(w: number, h: number, n: number) {
  const { bubbles } = chatLayout(w, h);
  return sampleDrawing(w, h, n, (ctx) => {
    bubbles.forEach((bb) => {
      ctx.lineWidth = bb.side === 'out' ? 9 : 5;
      ctx.beginPath();
      ctx.roundRect(bb.x, bb.y, bb.w, bb.h, 18);
      ctx.stroke();
      if (!bb.text) {
        // El agente escribiendo: tres puntos dentro de la última burbuja.
        const r = Math.max(0.5, Math.min(bb.h * 0.16, 8));
        [0.32, 0.5, 0.68].forEach((f) => {
          ctx.beginPath();
          ctx.arc(bb.x + bb.w * f, bb.y + bb.h / 2, r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
  }, 41);
}

/* ---------------- Vigilar: el latido ---------------- */

export function heartbeatLayout(w: number, h: number) {
  const b = stageBox(w, h);
  const lines = 4;
  return { b, lines, rowH: b.h / lines };
}

/** Altura del pulso en una posición `u` (0–1) de la línea cuando el barrido va en `phase`. */
export function pulse(u: number, phase: number) {
  const d = u - phase;
  if (d > 0.05 || d < -0.06) return 0;
  if (d < -0.03) return Math.sin(((d + 0.06) / 0.03) * Math.PI) * 0.18;
  if (d < 0.0) return -Math.sin(((d + 0.03) / 0.03) * Math.PI) * 0.25;
  return Math.sin((d / 0.05) * Math.PI) * 1;
}

/* ---------------- Retícula del hero ---------------- */

export function heroGrid(w: number, h: number, n: number, gap: number) {
  const cols = Math.max(1, Math.floor(w / gap));
  const rows = Math.max(1, Math.ceil(n / cols));
  const out = new Float32Array(n * 2);
  const offY = Math.max(0, (h - rows * gap) / 2);
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    out[i * 2] = (c + 0.5) * gap;
    out[i * 2 + 1] = offY + (r + 0.5) * gap;
  }
  return out;
}
