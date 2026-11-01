/*
  El motor del hero: «del desorden al sistema» en un solo plano.

  - El sistema: el símbolo A en el centro, hecho de piezas en retícula.
  - La entrada: cada pocos segundos llega por la izquierda un puñado de piezas
    sueltas (una tarea manual: un mensaje sin responder, un pedido anotado en
    un cuaderno…). Flotan desordenadas hasta tocar la A.
  - El cambio: al llegar, las piezas sueltas toman el lugar de otras tantas de
    la A, y esas salen por la derecha en una fila ordenada y en color de señal:
    la misma tarea, ya resuelta.

  Cada evento empieza de golpe (aparece la tarea, entra, sale resuelta): el
  inicio de un movimiento atrae la mirada; un movimiento constante no. Entre
  eventos, la A queda quieta. El cursor aparta las piezas y vuelven a su sitio.
*/

import { symbolSlots, SYMBOL_H, SYMBOL_W, type Slot } from './symbol';

export const COLOR_INK = 0;
export const COLOR_GRAY = 1;
export const COLOR_SIGNAL = 2;
export const COLOR_LOOSE = 3;

const MODE_POOL = 0;
const MODE_SLOT = 1;
const MODE_IN = 2;
const MODE_SNAP = 3;
const MODE_OUT = 4;

const T_FIRST = 1.4; // primer evento tras el arranque
const T_EVERY = 2.8; // un evento cada tanto
const T_TRAVEL = 2.1; // lo que tarda la tarea suelta en llegar a la A
const FLASH = 0.45; // la pieza que entra se enciende un instante
const OUT_SPEED = 95; // px/s de la fila resuelta

export type HeroLayout = {
  width: number;
  height: number;
  cx: number;
  cy: number;
  /** Ancho y alto del símbolo. */
  aw: number;
  ah: number;
  cell: number;
  /** Línea del horizonte: la base de la A, por donde sale la fila resuelta. */
  laneY: number;
  laneX: number;
  narrow: boolean;
};

export type HeroEvent =
  | { kind: 'in'; id: number; task: number; x: number; y: number }
  | { kind: 'arrive'; id: number; task: number }
  | { kind: 'out'; id: number; task: number; x: number; y: number; resolved: number };

type Burst = {
  id: number;
  task: number;
  t: number;
  /** Centro de la nube suelta: sale de (sx, sy) y llega a (ex, ey). */
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  pieces: number[];
  arrived: boolean;
};

type Lane = { id: number; x: number; pieces: number[]; cols: number };

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - (1 - t) ** 3);

export class HeroEngine {
  layout: HeroLayout | null = null;
  slots: Slot[] = [];
  /** Pieza que ocupa cada celda de la A (-1 si está libre). */
  owner = new Int32Array(0);
  n = 0;
  x = new Float32Array(0);
  y = new Float32Array(0);
  vx = new Float32Array(0);
  vy = new Float32Array(0);
  tx = new Float32Array(0);
  ty = new Float32Array(0);
  mode = new Uint8Array(0);
  slot = new Int32Array(0);
  color = new Uint8Array(0);
  delay = new Float32Array(0);
  flash = new Float32Array(0);
  phase = new Float32Array(0);
  offX = new Float32Array(0);
  offY = new Float32Array(0);
  out: Float32Array = new Float32Array(0);
  pointer = { x: 0, y: 0, active: false };
  /** 0 → 1 al bajar por el hero: las piezas se abren y se apagan. */
  exit = 0;
  /** El campo recién armado: las piezas entran a la A desde sus puestos sueltos. */
  time = 0;
  resolved = 0;
  private rand = mulberry(48);
  private bursts: Burst[] = [];
  private lanes: Lane[] = [];
  private nextBurst = T_FIRST;
  private burstSize = 16;
  private tasks = 1;
  private taskCursor = 0;
  private serial = 0;
  onEvent: ((event: HeroEvent) => void) | null = null;

  constructor(tasks: number) {
    this.tasks = Math.max(1, tasks);
  }

  /**
   * Acomoda la A al tamaño del lienzo. `assembled` deja las piezas ya en su sitio.
   * `anchor` (en el teléfono) es el hueco que la página deja para la A: su centro y su ancho.
   */
  resize(width: number, height: number, assembled: boolean, anchor?: { cx: number; top: number; width: number } | null) {
    const narrow = width < 760;
    let aw: number;
    let cx: number;
    let cy: number;
    if (anchor) {
      aw = Math.round(anchor.width * 0.86);
      cx = anchor.cx;
      cy = Math.round(anchor.top + (aw * (SYMBOL_H / SYMBOL_W)) / 2 + 56);
    } else {
      const maxByHeight = height * 0.36 * (SYMBOL_W / SYMBOL_H);
      aw = Math.round(Math.min(width * 0.52, 860, maxByHeight));
      cx = width / 2;
      cy = Math.round(height * 0.5);
    }
    const ah = aw * (SYMBOL_H / SYMBOL_W);
    const cell = Math.max(4.5, aw / (narrow ? 62 : 98));
    const laneY = cy + ah / 2 - cell / 2;
    const layout: HeroLayout = { width, height, cx, cy, aw, ah, cell, laneY, laneX: cx + aw / 2 + cell * 3, narrow };
    this.layout = layout;
    this.slots = symbolSlots(cx, cy, aw, cell);
    this.burstSize = narrow ? 12 : 22;
    const spare = this.burstSize * 8;
    const n = this.slots.length + spare;
    this.allocate(n);
    this.owner = new Int32Array(this.slots.length).fill(-1);
    this.bursts = [];
    this.lanes = [];
    this.nextBurst = this.time + (assembled ? 0.6 : T_FIRST);
    const r = this.rand;
    for (let i = 0; i < n; i++) {
      this.phase[i] = r() * Math.PI * 2;
      this.offX[i] = (r() - 0.5) * 2;
      this.offY[i] = (r() - 0.5) * 2;
      this.flash[i] = 0;
      this.vx[i] = 0;
      this.vy[i] = 0;
      if (i < this.slots.length) {
        const s = this.slots[i];
        this.mode[i] = MODE_SLOT;
        this.slot[i] = i;
        this.owner[i] = i;
        this.color[i] = s.color;
        this.tx[i] = s.x;
        this.ty[i] = s.y;
        if (assembled) {
          this.x[i] = s.x;
          this.y[i] = s.y;
          this.delay[i] = 0;
        } else {
          // Sueltas por todo el plano; entran a su celda de izquierda a derecha.
          this.x[i] = r() * width;
          this.y[i] = r() * height;
          this.delay[i] = ((s.x - (cx - aw / 2)) / aw) * 0.75 + r() * 0.22;
        }
      } else {
        this.mode[i] = MODE_POOL;
        this.slot[i] = -1;
        this.color[i] = COLOR_LOOSE;
        this.x[i] = -100;
        this.y[i] = -100;
        this.delay[i] = 0;
      }
    }
  }

  private allocate(n: number) {
    if (n === this.n) return;
    this.n = n;
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.tx = new Float32Array(n);
    this.ty = new Float32Array(n);
    this.mode = new Uint8Array(n);
    this.slot = new Int32Array(n);
    this.color = new Uint8Array(n);
    this.delay = new Float32Array(n);
    this.flash = new Float32Array(n);
    this.phase = new Float32Array(n);
    this.offX = new Float32Array(n);
    this.offY = new Float32Array(n);
    this.out = new Float32Array(n * 4);
  }

  /** Todo en su sitio y quieto (movimiento reducido). */
  settle() {
    for (let i = 0; i < this.n; i++) {
      if (this.mode[i] === MODE_SLOT) {
        this.x[i] = this.tx[i];
        this.y[i] = this.ty[i];
        this.delay[i] = 0;
      }
    }
  }

  private spawnBurst() {
    const L = this.layout;
    if (!L) return;
    const pool: number[] = [];
    for (let i = this.slots.length; i < this.n && pool.length < this.burstSize; i++) if (this.mode[i] === MODE_POOL) pool.push(i);
    if (pool.length < this.burstSize) return;
    const r = this.rand;
    const task = this.taskCursor;
    this.taskCursor = (this.taskCursor + 1) % this.tasks;
    const band = L.ah * 0.55;
    const sx = L.narrow ? -24 : L.width * 0.04;
    const sy = L.cy + (r() - 0.5) * 2 * band;
    // Llega al borde izquierdo de la A, a la altura del trazo largo.
    const ex = L.cx - L.aw * (L.narrow ? 0.26 : 0.3);
    const ey = L.cy + (r() - 0.35) * L.ah * 0.5;
    const id = ++this.serial;
    const radius = L.cell * (L.narrow ? 5 : 7);
    for (const i of pool) {
      this.mode[i] = MODE_IN;
      this.color[i] = COLOR_LOOSE;
      this.offX[i] = (r() - 0.5) * 2 * radius;
      this.offY[i] = (r() - 0.5) * 2 * radius * 0.7;
      this.x[i] = sx - L.cell * 6 + this.offX[i];
      this.y[i] = sy + this.offY[i];
      this.vx[i] = 0;
      this.vy[i] = 0;
    }
    this.bursts.push({ id, task, t: 0, sx, sy, ex, ey, pieces: pool, arrived: false });
    this.onEvent?.({ kind: 'in', id, task, x: sx, y: sy });
  }

  /** La tarea toca la A: sus piezas toman el lugar de otras, que salen resueltas. */
  private arrive(b: Burst) {
    const L = this.layout;
    if (!L) return;
    b.arrived = true;
    const r = this.rand;
    const leaving: number[] = [];
    const taken = new Set<number>();
    // Celdas repartidas por toda la A: el cambio se ve en todo el sistema, no en un rincón.
    let guard = 0;
    while (leaving.length < b.pieces.length && guard++ < 400) {
      const s = Math.floor(r() * this.slots.length);
      const p = this.owner[s];
      if (p < 0 || taken.has(s) || this.mode[p] !== MODE_SLOT) continue;
      taken.add(s);
      leaving.push(s);
    }
    const lanePieces: number[] = [];
    b.pieces.forEach((p, k) => {
      const s = leaving[k];
      if (s === undefined) {
        this.mode[p] = MODE_POOL;
        this.x[p] = -100;
        return;
      }
      const old = this.owner[s];
      // La pieza vieja sale a la fila resuelta.
      this.mode[old] = MODE_OUT;
      this.slot[old] = -1;
      this.color[old] = COLOR_SIGNAL;
      lanePieces.push(old);
      // La nueva entra a la celda: vuela un instante y se enciende al llegar.
      this.owner[s] = p;
      this.mode[p] = MODE_SNAP;
      this.slot[p] = s;
      this.tx[p] = this.slots[s].x;
      this.ty[p] = this.slots[s].y;
      this.delay[p] = k * 0.018;
    });
    const cols = Math.ceil(lanePieces.length / 2);
    this.lanes.push({ id: b.id, x: L.laneX, pieces: lanePieces, cols });
    this.resolved++;
    this.onEvent?.({ kind: 'arrive', id: b.id, task: b.task });
    this.onEvent?.({ kind: 'out', id: b.id, task: b.task, x: L.laneX, y: L.laneY, resolved: this.resolved });
  }

  step(dt: number, flows: boolean) {
    const L = this.layout;
    if (!L) return;
    this.time += dt;
    const t = this.time;

    if (flows && t >= this.nextBurst) {
      this.nextBurst = t + T_EVERY;
      this.spawnBurst();
    }

    for (const b of this.bursts) {
      b.t += dt;
      const k = ease(b.t / T_TRAVEL);
      // La nube avanza con su propio vaivén: llega dando tumbos, no en línea recta.
      const cx = b.sx + (b.ex - b.sx) * k;
      const cy = b.sy + (b.ey - b.sy) * k + Math.sin(b.t * 2.3) * L.cell * 2.2 * (1 - k);
      for (const p of b.pieces) {
        if (this.mode[p] !== MODE_IN) continue;
        const wobble = L.cell * 1.6;
        this.tx[p] = cx + this.offX[p] * (1 - k * 0.55) + Math.sin(t * 3.1 + this.phase[p]) * wobble;
        this.ty[p] = cy + this.offY[p] * (1 - k * 0.55) + Math.cos(t * 2.7 + this.phase[p]) * wobble;
      }
      if (!b.arrived && b.t >= T_TRAVEL) this.arrive(b);
    }
    this.bursts = this.bursts.filter((b) => !b.arrived);

    for (const lane of this.lanes) {
      lane.x += OUT_SPEED * dt;
      lane.pieces.forEach((p, k) => {
        const col = Math.floor(k / 2);
        const row = k % 2;
        this.tx[p] = lane.x + col * L.cell;
        this.ty[p] = L.laneY - row * L.cell;
        if (this.x[p] > L.width + L.cell * 4) {
          this.mode[p] = MODE_POOL;
          this.color[p] = COLOR_LOOSE;
          this.x[p] = -100;
          this.y[p] = -100;
        }
      });
      lane.pieces = lane.pieces.filter((p) => this.mode[p] === MODE_OUT);
    }
    this.lanes = this.lanes.filter((lane) => lane.pieces.length > 0);

    const px = this.pointer.x;
    const py = this.pointer.y;
    const pr = L.cell * (L.narrow ? 10 : 16);
    const pr2 = pr * pr;
    const pointer = this.pointer.active;

    for (let i = 0; i < this.n; i++) {
      const m = this.mode[i];
      if (m === MODE_POOL) continue;
      if (this.delay[i] > 0) {
        this.delay[i] -= dt;
        continue;
      }
      if (this.flash[i] > 0) this.flash[i] = Math.max(0, this.flash[i] - dt);
      let stiff = 90;
      let damp = 0.82;
      if (m === MODE_IN) {
        stiff = 26;
        damp = 0.88;
      } else if (m === MODE_SNAP) {
        stiff = 140;
        damp = 0.74;
      } else if (m === MODE_OUT) {
        stiff = 60;
        damp = 0.8;
      }
      let ax = (this.tx[i] - this.x[i]) * stiff;
      let ay = (this.ty[i] - this.y[i]) * stiff;
      if (pointer && m === MODE_SLOT) {
        const dx = this.x[i] - px;
        const dy = this.y[i] - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < pr2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / pr) * 5200;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
        }
      }
      // Resorte amortiguado, independiente de los cuadros por segundo.
      const keep = damp ** (dt * 60);
      this.vx[i] = this.vx[i] * keep + ax * dt;
      this.vy[i] = this.vy[i] * keep + ay * dt;
      this.x[i] += this.vx[i] * dt;
      this.y[i] += this.vy[i] * dt;
      if (m === MODE_SNAP) {
        const dx = this.tx[i] - this.x[i];
        const dy = this.ty[i] - this.y[i];
        if (dx * dx + dy * dy < L.cell * L.cell * 0.2) {
          this.mode[i] = MODE_SLOT;
          this.color[i] = this.slots[this.slot[i]].color;
          this.flash[i] = FLASH;
        }
      }
    }
  }

  /** Escribe las piezas para el render: x, y, color y alfa empacados, tamaño. */
  write(): Float32Array {
    const L = this.layout;
    const o = this.out;
    if (!L) return o;
    const e = this.exit;
    const fade = 1 - e;
    const size = L.cell * 0.8;
    const loose = L.cell * 0.72;
    let c = 0;
    for (let i = 0; i < this.n; i++) {
      const m = this.mode[i];
      if (m === MODE_POOL) continue;
      let x = this.x[i];
      let y = this.y[i];
      let alpha = 1;
      let col = this.color[i];
      let s = size;
      if (m === MODE_IN) {
        s = loose;
        alpha = 1;
      } else if (m === MODE_OUT) {
        // La fila resuelta se apaga al llegar al borde.
        alpha = Math.max(0, Math.min(1, (L.width - x) / (L.cell * 14)));
      }
      if (this.flash[i] > 0) col = COLOR_SIGNAL;
      if (e > 0) {
        // Al bajar, la A se abre desde su centro: el sistema se reparte por la página.
        const dx = x - L.cx;
        const dy = y - L.cy;
        x += dx * e * 0.9 + this.offX[i] * L.cell * 18 * e;
        y += dy * e * 0.6 - e * L.ah * 0.35 + this.offY[i] * L.cell * 18 * e;
        alpha *= fade;
      }
      if (alpha <= 0.01) continue;
      o[c * 4] = x;
      o[c * 4 + 1] = y;
      o[c * 4 + 2] = col * 2 + Math.min(1, alpha);
      o[c * 4 + 3] = s;
      c++;
    }
    this.count = c;
    return o;
  }

  count = 0;
}
