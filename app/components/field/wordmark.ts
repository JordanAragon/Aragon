/*
  La palabra de marca hecha de piezas: `aragon` y su cuadrado, dibujados con la
  tipografía de titulares y medidos sobre una retícula. Cada punto es una pieza
  que ya encontró su lugar. La usan la precarga (las piezas sueltas se ordenan
  en la marca) y el pie (la marca se arma al llegar al final).
*/

import { rng } from './sim';

export type Wordmark = {
  /** x, y por pieza, en píxeles CSS del lienzo. */
  points: Float32Array;
  /** Orden de llegada de cada pieza (0–1), de izquierda a derecha con un poco de azar. */
  turn: Float32Array;
  /** Caja de la palabra dibujada. */
  box: { x: number; y: number; w: number; h: number };
  step: number;
};

/** La familia de titulares tal como la expone next/font en `--font-display`. */
export function displayFamily() {
  if (typeof document === 'undefined') return 'sans-serif';
  const value = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim();
  return value ? `${value}, 'Inter Tight', Inter, sans-serif` : "'Inter Tight', Inter, sans-serif";
}

/**
 * Reparte `n` piezas sobre la palabra de marca, centrada en (`cx`, `cy`) y de
 * ancho `width`. Las piezas caen en una retícula: la marca se lee ordenada.
 */
export function wordmarkPoints(n: number, cx: number, cy: number, width: number, seed = 5): Wordmark {
  const family = displayFamily();
  // Primero se mide la palabra a un tamaño de referencia para saber qué tamaño da el ancho pedido.
  const probe = document.createElement('canvas').getContext('2d');
  const ref = 200;
  let size = ref;
  if (probe) {
    probe.font = `650 ${ref}px ${family}`;
    (probe as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${-0.045 * ref}px`;
    const wordW = probe.measureText('aragon').width;
    const total = wordW + ref * (0.04 + 0.3);
    size = (ref * width) / Math.max(1, total);
  }

  const word = { w: 0, h: Math.ceil(size * 1.05) };
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const out: Wordmark = { points: new Float32Array(n * 2), turn: new Float32Array(n), box: { x: cx, y: cy, w: 0, h: 0 }, step: 4 };
  if (!ctx) return out;

  ctx.font = `650 ${size}px ${family}`;
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${-0.045 * size}px`;
  const textW = ctx.measureText('aragon').width;
  const mark = size * 0.3;
  word.w = Math.ceil(textW + size * 0.04 + mark + 2);
  canvas.width = Math.max(1, word.w);
  canvas.height = Math.max(1, word.h);
  // Cambiar el tamaño del lienzo reinicia el contexto.
  ctx.font = `650 ${size}px ${family}`;
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${-0.045 * size}px`;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';
  const baseline = size * 0.8;
  ctx.fillText('aragon', 0, baseline);
  // El cuadrado se apoya en la línea base, como en el logotipo.
  ctx.fillRect(textW + size * 0.04, baseline - mark - size * 0.006, mark, mark);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const inside = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    if (xi < 0 || yi < 0 || xi >= canvas.width || yi >= canvas.height) return false;
    return data[(yi * canvas.width + xi) * 4 + 3] > 128;
  };

  // Área con tinta, para elegir el paso de la retícula que reparte las piezas justas.
  let ink = 0;
  for (let y = 0; y < canvas.height; y += 2) for (let x = 0; x < canvas.width; x += 2) if (inside(x, y)) ink += 4;
  let step = Math.max(2, Math.sqrt(ink / n));
  let cells: number[] = [];
  for (let tries = 0; tries < 6; tries++) {
    cells = [];
    for (let y = step / 2; y < canvas.height; y += step) for (let x = step / 2; x < canvas.width; x += step) if (inside(x, y)) cells.push(x, y);
    const m = cells.length / 2;
    // Se busca que casi todas las piezas tengan su celda (las que sobran se apilan sin notarse).
    if (m >= n * 0.92 && m <= n * 1.08) break;
    step *= Math.sqrt(m / n);
  }

  const m = cells.length / 2 || 1;
  const ox = cx - word.w / 2;
  const oy = cy - word.h / 2;
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    // Si hay más celdas que piezas, se toman parejas; si faltan, se repiten.
    const k = Math.floor((i * m) / n) % m;
    const x = cells[k * 2] ?? word.w / 2;
    const y = cells[k * 2 + 1] ?? word.h / 2;
    out.points[i * 2] = ox + x;
    out.points[i * 2 + 1] = oy + y;
    out.turn[i] = Math.min(1, (x / word.w) * 0.82 + r() * 0.18);
  }
  out.box = { x: ox, y: oy, w: word.w, h: word.h };
  out.step = step;
  return out;
}
