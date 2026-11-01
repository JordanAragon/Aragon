/*
  El símbolo A de Aragon (marca/logo/simbolo.svg): una A sin travesaño hecha de
  tres piezas. La pieza negra es el trazo largo; las dos grises, la pierna
  derecha y la pieza pequeña del centro. En el hero, esas tres piezas se
  rellenan con cuadrados en retícula: el sistema hecho de tareas en orden.
*/

export const SYMBOL_W = 145.59;
export const SYMBOL_H = 72;

/** Índice de color de cada pieza en la paleta del hero (0 tinta, 1 gris). */
export const SYMBOL_PARTS: { d: string; color: 0 | 1 }[] = [
  {
    d: 'M10.58 72L28.04 72A5.6 5.6 0 0 0 32.67 69.55L61.29 27.45A5.6 5.6 0 0 1 65.92 25L86.42 25A5.6 5.6 0 0 0 91.05 16.25L81.67 2.45A5.6 5.6 0 0 0 77.04 0L51.92 0A5.6 5.6 0 0 0 47.29 2.45L5.95 63.25A5.6 5.6 0 0 0 10.58 72Z',
    color: 0,
  },
  {
    d: 'M97.58 29.95L114.04 29.95A5.6 5.6 0 0 1 118.67 32.4L139.64 63.25A5.6 5.6 0 0 1 135.01 72L118.56 72A5.6 5.6 0 0 1 113.93 69.55L92.95 38.7A5.6 5.6 0 0 1 97.58 29.95Z',
    color: 1,
  },
  {
    d: 'M62.95 43.99L77.24 65A4.48 4.48 0 0 1 73.54 72L62.37 72A4.48 4.48 0 0 1 58.67 70.04L49.96 57.24A4.48 4.48 0 0 1 49.96 52.2L55.55 43.99A4.48 4.48 0 0 1 62.95 43.99Z',
    color: 1,
  },
];

export type Slot = { x: number; y: number; color: number };

/**
 * Las celdas de la retícula que caen dentro del símbolo, en coordenadas del
 * lienzo. `cx` y `cy` son el centro del símbolo; `width`, su ancho; `cell`, el
 * paso de la retícula.
 */
export function symbolSlots(cx: number, cy: number, width: number, cell: number): Slot[] {
  const scale = width / SYMBOL_W;
  const height = SYMBOL_H * scale;
  const left = cx - width / 2;
  const top = cy - height / 2;
  const probe = document.createElement('canvas').getContext('2d');
  if (!probe) return [];
  const paths = SYMBOL_PARTS.map((part) => ({ path: new Path2D(part.d), color: part.color }));
  const slots: Slot[] = [];
  // La retícula arranca en una celda entera para que las filas queden alineadas con el resto del hero.
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const ox = left + (width - cols * cell) / 2 + cell / 2;
  const oy = top + (height - rows * cell) / 2 + cell / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * cell;
      const y = oy + r * cell;
      const sx = (x - left) / scale;
      const sy = (y - top) / scale;
      for (const part of paths) {
        if (probe.isPointInPath(part.path, sx, sy)) {
          slots.push({ x, y, color: part.color });
          break;
        }
      }
    }
  }
  return slots;
}
