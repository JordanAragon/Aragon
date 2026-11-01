/*
  El motor del hero: una palabra enorme hecha de piezas.

  Todas las piezas empiezan sueltas, flotando por la pantalla (el desorden de
  un negocio: mensajes, pedidos, datos). Una línea barre la palabra de
  izquierda a derecha y, a su paso, cada lugar de la retícula llama a una
  pieza suelta, que vuela y se clava en él: el sistema poniendo en orden.
  La palabra queda quieta un momento; luego sale por la derecha en filas, ya
  resuelta, y esas piezas vuelven a la pantalla como desorden nuevo. Siguiente
  palabra.

  Canvas 2D, arreglos tipados y un resorte por pieza. Sin dependencias.
*/

export type Box = { x: number; y: number; w: number; h: number };
export type Phase = 'idle' | 'build' | 'hold' | 'leave';

const LOOSE = 0;
const FORMING = 2;
const FORMED = 3;
const LEAVING = 4;

const T_BUILD = 1.35;
const T_BUILD_FIRST = 1.9;
const T_HOLD = 2.7;
const T_LEAVE = 1.25;
const K = 95; // rigidez del resorte
const C = 2 * Math.sqrt(K) * 0.72; // un poco por debajo del amortiguamiento crítico: llega y se asienta

type Shape = { xs: Float32Array; ys: Float32Array; box: Box };

export class WordField {
  readonly words: string[];
  private family: string;

  width = 0;
  height = 0;
  cell = 6;
  private shapes: Shape[] = [];
  private narrow = false;

  // Piezas
  count = 0;
  private x = new Float32Array(0);
  private y = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private tx = new Float32Array(0);
  private ty = new Float32Array(0);
  private mode = new Uint8Array(0);
  private wait = new Float32Array(0); // retraso de salida
  private fade = new Float32Array(0); // 0→1 al reaparecer
  private seed = new Float32Array(0);
  private r1 = new Float32Array(0);
  private r2 = new Float32Array(0);
  private tone = new Float32Array(0); // brillo de la pieza suelta

  phase: Phase = 'idle';
  private phaseT = 0;
  private first = true;
  index = 0;
  sweepX = -1;
  private nextSlot = 0;
  private scan = 0;
  formed = 0;
  time = 0;

  /** 0..1 al bajar: la palabra se deshace hacia arriba. */
  exit = 0;
  pointer = { x: -9999, y: -9999, active: false };

  onPhase?: (phase: Phase, index: number) => void;

  constructor(words: string[], family: string) {
    this.words = words.map((w) => w.toUpperCase());
    this.family = family;
  }

  /** Mide todas las palabras con la misma letra (la más larga cabe a lo ancho) y reparte las piezas. */
  resize(width: number, height: number, slot: Box, narrow: boolean) {
    this.width = width;
    this.height = height;
    this.narrow = narrow;

    const probe = document.createElement('canvas').getContext('2d');
    if (!probe) return;
    const font = (size: number) => `800 ${size}px ${this.family}`;
    probe.font = font(200);
    if ('letterSpacing' in probe) (probe as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '-8px';
    let maxW = 0;
    let cap = 0;
    for (const w of this.words) {
      const m = probe.measureText(w);
      maxW = Math.max(maxW, m.actualBoundingBoxLeft + m.actualBoundingBoxRight);
      cap = Math.max(cap, m.actualBoundingBoxAscent);
    }
    const size = Math.min((slot.w / maxW) * 200, ((slot.h * 0.66) / cap) * 200);
    const capH = (cap * size) / 200;
    this.cell = Math.max(3, Math.round(capH / (narrow ? 22 : 34)));
    this.shapes = this.words.map((w) => this.sample(w, size, slot));

    const maxSlots = this.shapes.reduce((m, s) => Math.max(m, s.xs.length), 0);
    const loose = narrow ? 420 : Math.round(Math.min(1500, (width * height) / 900));
    this.alloc(maxSlots + loose);

    // Si ya había una palabra armada, se rearma en su sitio sin animación.
    if (this.phase === 'hold' || this.phase === 'build') this.formNow(this.index);
  }

  private sample(word: string, size: number, slot: Box): Shape {
    const cv = document.createElement('canvas');
    const ctx = cv.getContext('2d', { willReadFrequently: true })!;
    ctx.font = `800 ${size}px ${this.family}`;
    const ls = (-8 * size) / 200;
    if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${ls}px`;
    const m = ctx.measureText(word);
    const w = Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight) + 4;
    const h = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + 4;
    cv.width = w;
    cv.height = h;
    ctx.font = `800 ${size}px ${this.family}`;
    if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${ls}px`;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(word, m.actualBoundingBoxLeft + 2, m.actualBoundingBoxAscent + 2);
    const data = ctx.getImageData(0, 0, w, h).data;

    // La palabra se centra en el hueco y se ajusta a una retícula común a todas.
    const c = this.cell;
    const ox = Math.round((slot.x + slot.w / 2 - w / 2) / c) * c;
    const oy = Math.round((slot.y + slot.h * 0.45 - h / 2) / c) * c;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let gx = 0; gx < w; gx += c) {
      for (let gy = 0; gy < h; gy += c) {
        const px = Math.min(w - 1, Math.floor(gx + c / 2));
        const py = Math.min(h - 1, Math.floor(gy + c / 2));
        if (data[(py * w + px) * 4 + 3] > 120) {
          xs.push(ox + gx + c / 2);
          ys.push(oy + gy + c / 2);
        }
      }
    }
    return { xs: Float32Array.from(xs), ys: Float32Array.from(ys), box: { x: ox, y: oy, w, h } };
  }

  private alloc(n: number) {
    this.count = n;
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.tx = new Float32Array(n);
    this.ty = new Float32Array(n);
    this.mode = new Uint8Array(n);
    this.wait = new Float32Array(n);
    this.fade = new Float32Array(n).fill(1);
    this.seed = new Float32Array(n);
    this.r1 = new Float32Array(n);
    this.r2 = new Float32Array(n);
    this.tone = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      this.x[i] = Math.random() * this.width;
      this.y[i] = Math.random() * this.height;
      this.seed[i] = Math.random() * 1000;
      this.r1[i] = Math.random() - 0.5;
      this.r2[i] = Math.random();
      this.tone[i] = 0.18 + Math.random() * 0.42;
    }
  }

  get box(): Box | null {
    return this.shapes[this.index]?.box ?? null;
  }

  /** Arma la palabra al instante (movimiento reducido, o al cambiar el tamaño). */
  formNow(index: number) {
    this.index = index;
    const s = this.shapes[index];
    if (!s) return;
    this.mode.fill(LOOSE);
    for (let i = 0; i < s.xs.length; i++) {
      this.mode[i] = FORMED;
      this.x[i] = this.tx[i] = s.xs[i];
      this.y[i] = this.ty[i] = s.ys[i];
      this.vx[i] = this.vy[i] = 0;
      this.fade[i] = 1;
    }
    this.formed = s.xs.length;
    this.phase = 'hold';
    this.phaseT = 0;
    this.sweepX = -1;
  }

  /** Empieza el ciclo: la primera palabra se arma con el barrido. */
  start() {
    if (this.phase !== 'idle') return;
    this.build(0);
  }

  private setPhase(p: Phase) {
    this.phase = p;
    this.phaseT = 0;
    this.onPhase?.(p, this.index);
  }

  private build(index: number) {
    this.index = index;
    const s = this.shapes[index];
    if (!s) return;
    this.nextSlot = 0;
    this.sweepX = s.box.x - 40;
    this.setPhase('build');
  }

  /** Busca una pieza suelta cualquiera (recorrido con salto primo: parece al azar y no repite). */
  private takeLoose(): number {
    const n = this.count;
    for (let k = 0; k < n; k++) {
      this.scan = (this.scan + 7919) % n;
      if (this.mode[this.scan] === LOOSE) return this.scan;
    }
    return -1;
  }

  private leave() {
    const s = this.shapes[this.index];
    if (!s) return;
    const right = s.box.x + s.box.w;
    for (let i = 0; i < this.count; i++) {
      if (this.mode[i] === FORMED || this.mode[i] === FORMING) {
        // Sale primero lo de la derecha; cada fila con un poco de azar, como datos que se envían.
        this.wait[i] = ((right - this.tx[i]) / s.box.w) * 0.42 + this.r2[i] * 0.12;
      }
    }
    this.setPhase('leave');
  }

  step(dt: number) {
    dt = Math.min(dt, 1 / 30);
    this.time += dt;
    this.phaseT += dt;
    const W = this.width;
    const H = this.height;
    const t = this.time;
    const s = this.shapes[this.index];

    // Fases
    if (this.phase === 'build' && s) {
      const dur = this.first ? T_BUILD_FIRST : T_BUILD;
      const p = Math.min(1, this.phaseT / dur);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      this.sweepX = s.box.x - 40 + (s.box.w + 80) * e;
      // Cada lugar que deja atrás la línea llama a una pieza suelta.
      while (this.nextSlot < s.xs.length && s.xs[this.nextSlot] <= this.sweepX) {
        const i = this.takeLoose();
        if (i < 0) break;
        this.mode[i] = FORMING;
        this.tx[i] = s.xs[this.nextSlot];
        this.ty[i] = s.ys[this.nextSlot];
        this.fade[i] = 1;
        this.nextSlot++;
      }
      if (p >= 1 && this.phaseT > dur + 0.45) {
        this.first = false;
        this.sweepX = -1;
        this.setPhase('hold');
      }
    } else if (this.phase === 'hold' && this.phaseT > T_HOLD) {
      this.leave();
    } else if (this.phase === 'leave' && this.phaseT > T_LEAVE) {
      this.build((this.index + 1) % this.shapes.length);
    }

    const px = this.pointer.x;
    const py = this.pointer.y;
    const pr = this.narrow ? 70 : 130;
    const pr2 = pr * pr;
    const pointerOn = this.pointer.active;
    const flowSpeed = this.narrow ? 10 : 14;
    let formed = 0;

    for (let i = 0; i < this.count; i++) {
      let m = this.mode[i];
      let x = this.x[i];
      let y = this.y[i];
      let vx = this.vx[i];
      let vy = this.vy[i];

      if (this.phase === 'leave' && (m === FORMED || m === FORMING)) {
        this.wait[i] -= dt;
        if (this.wait[i] <= 0) m = LEAVING;
      }

      if (m === FORMING || m === FORMED) {
        const dx = this.tx[i] - x;
        const dy = this.ty[i] - y;
        vx += (K * dx - C * vx) * dt;
        vy += (K * dy - C * vy) * dt;
        if (m === FORMING && dx * dx + dy * dy < 0.5 && vx * vx + vy * vy < 400) m = FORMED;
        if (m === FORMED) formed++;
      } else if (m === LEAVING) {
        vx += (3000 + this.r2[i] * 2400) * dt;
        vy *= 1 - Math.min(1, dt * 6);
        if (x > W + 60) {
          // Vuelve a la pantalla como desorden nuevo.
          m = LOOSE;
          x = Math.random() * W;
          y = Math.random() * H;
          vx = vy = 0;
          this.fade[i] = 0;
        }
      } else {
        // Suelta: sigue un campo de flujo lento que cambia con el tiempo.
        const sd = this.seed[i];
        const a = Math.sin(x * 0.0021 + t * 0.23 + sd) * 2.2 + Math.cos(y * 0.0027 - t * 0.19) * 2.2 + sd;
        const sp = flowSpeed * (0.5 + this.r2[i]);
        const k = Math.min(1, dt * 1.6);
        vx += (Math.cos(a) * sp - vx) * k;
        vy += (Math.sin(a) * sp - vy) * k;
        if (this.fade[i] < 1) this.fade[i] = Math.min(1, this.fade[i] + dt * 1.4);
      }

      if (pointerOn) {
        const dx = x - px;
        const dy = y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < pr2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / pr) ** 2 * 5200 * dt;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
        }
      }

      x += vx * dt;
      y += vy * dt;
      if (m === LOOSE) {
        if (x < -10) x += W + 20;
        else if (x > W + 10) x -= W + 20;
        if (y < -10) y += H + 20;
        else if (y > H + 10) y -= H + 20;
      }

      this.mode[i] = m;
      this.x[i] = x;
      this.y[i] = y;
      this.vx[i] = vx;
      this.vy[i] = vy;
    }
    this.formed = formed;
  }

  draw(ctx: CanvasRenderingContext2D, dpr: number, monoFamily: string) {
    const W = this.width;
    const H = this.height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const ex = this.exit;
    const fadeAll = 1 - ex;
    if (fadeAll <= 0.001) return;
    const c = this.cell;
    const big = c * 0.8;
    const looseSize = this.narrow ? 1.4 : 1.7;
    const xs = this.x;
    const ys = this.y;

    // Al bajar, cada pieza se va por su lado hacia arriba: la palabra se deshace.
    const offX = (i: number) => (ex ? this.r1[i] * ex * W * 0.5 : 0);
    const offY = (i: number) => (ex ? -ex * H * (0.15 + this.r2[i] * 0.45) : 0);

    // Sueltas, en tres tonos de gris.
    ctx.fillStyle = '#fff';
    for (let b = 0; b < 3; b++) {
      const lo = 0.18 + b * 0.14;
      const hi = lo + 0.14;
      ctx.globalAlpha = (lo + 0.07) * fadeAll;
      for (let i = 0; i < this.count; i++) {
        const m = this.mode[i];
        if (m !== LOOSE) continue;
        const tn = this.tone[i] * this.fade[i];
        if (tn < lo || tn >= hi) continue;
        ctx.fillRect(xs[i] + offX(i) - looseSize / 2, ys[i] + offY(i) - looseSize / 2, looseSize, looseSize);
      }
    }

    // En camino: una estela según la velocidad, y la pieza crece al acercarse.
    ctx.globalAlpha = 0.9 * fadeAll;
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < this.count; i++) {
      if (this.mode[i] !== FORMING) continue;
      const vx = this.vx[i];
      const vy = this.vy[i];
      if (vx * vx + vy * vy > 160000) {
        const x = xs[i] + offX(i);
        const y = ys[i] + offY(i);
        ctx.moveTo(x, y);
        ctx.lineTo(x - vx * 0.035, y - vy * 0.035);
      }
    }
    ctx.stroke();
    for (let i = 0; i < this.count; i++) {
      if (this.mode[i] !== FORMING) continue;
      const dx = this.tx[i] - xs[i];
      const dy = this.ty[i] - ys[i];
      const p = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy) / (c * 14));
      const sz = looseSize + (big - looseSize) * p;
      ctx.fillRect(xs[i] + offX(i) - sz / 2, ys[i] + offY(i) - sz / 2, sz, sz);
    }

    // En su lugar: cuadrados blancos, la pieza de la marca.
    ctx.globalAlpha = fadeAll;
    for (let i = 0; i < this.count; i++) {
      const m = this.mode[i];
      if (m !== FORMED) continue;
      ctx.fillRect(xs[i] + offX(i) - big / 2, ys[i] + offY(i) - big / 2, big, big);
    }

    // Saliendo: filas que se estiran hacia la derecha.
    ctx.globalAlpha = 0.85 * fadeAll;
    for (let i = 0; i < this.count; i++) {
      if (this.mode[i] !== LEAVING) continue;
      const len = Math.max(big, this.vx[i] * 0.045);
      ctx.fillRect(xs[i] + offX(i) - len, ys[i] + offY(i) - big / 2, len, big * 0.7);
    }

    // La línea que pone en orden.
    const s = this.shapes[this.index];
    if (this.sweepX >= 0 && s) {
      const top = s.box.y - 26;
      const bottom = s.box.y + s.box.h + 26;
      const sx = Math.round(this.sweepX) + 0.5;
      const grad = ctx.createLinearGradient(sx - 140, 0, sx, 0);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(1, 'rgba(255,255,255,0.09)');
      ctx.globalAlpha = fadeAll;
      ctx.fillStyle = grad;
      ctx.fillRect(sx - 140, top, 140, bottom - top);
      ctx.fillStyle = '#fff';
      ctx.fillRect(sx - 0.5, top, 1, bottom - top);
      ctx.fillRect(sx - 3, top - 3, 6, 6);
      ctx.font = `500 11px ${monoFamily}`;
      ctx.textBaseline = 'bottom';
      ctx.fillText('ordenando', sx + 8, top + 4);
    }
    ctx.globalAlpha = 1;
  }
}
