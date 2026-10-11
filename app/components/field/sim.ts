/*
  Simulación de partículas de Aragon. Cada partícula es una «pieza suelta» de un
  negocio (un pedido, un dato, una tarea). La simulación solo decide dónde está
  cada pieza; dibujarla es trabajo del renderizador (WebGPU con vgpu, o Canvas 2D).

  Las coordenadas están en píxeles CSS del lienzo. El buffer de salida guarda,
  por partícula: x, y, alfa y tamaño.
*/

export type Pointer = { x: number; y: number; active: boolean };

export type Updater = (sim: ParticleSim, time: number, dt: number) => void;

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export class ParticleSim {
  readonly n: number;
  readonly x: Float32Array;
  readonly y: Float32Array;
  readonly vx: Float32Array;
  readonly vy: Float32Array;
  readonly tx: Float32Array;
  readonly ty: Float32Array;
  readonly delay: Float32Array;
  readonly seed: Float32Array;
  readonly alpha: Float32Array;
  readonly targetAlpha: Float32Array;
  readonly size: Float32Array;
  readonly out: Float32Array;
  readonly random: () => number;

  width = 1;
  height = 1;
  time = 0;
  stiffness = 0.07;
  damping = 0.8;
  jitter = 0.08;
  pointer: Pointer = { x: -9999, y: -9999, active: false };
  pointerRadius = 110;
  /** Lo que hace el cursor: «order» acomoda las piezas en la retícula, «push» las aparta. */
  pointerMode: 'order' | 'push' | 'none' = 'order';
  gridSize = 12;
  updater: Updater | null = null;
  baseSize = 1.8;

  constructor(n: number, seed = 1) {
    this.n = n;
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.tx = new Float32Array(n);
    this.ty = new Float32Array(n);
    this.delay = new Float32Array(n);
    this.seed = new Float32Array(n);
    this.alpha = new Float32Array(n);
    this.targetAlpha = new Float32Array(n);
    this.size = new Float32Array(n);
    this.out = new Float32Array(n * 4);
    this.random = rng(seed);
    for (let i = 0; i < n; i++) {
      this.seed[i] = this.random();
      this.alpha[i] = 0;
      this.targetAlpha[i] = 0.55;
      this.size[i] = 1;
    }
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
  }

  scatter(cx: number, cy: number, radius: number) {
    for (let i = 0; i < this.n; i++) {
      const a = this.random() * Math.PI * 2;
      const d = Math.sqrt(this.random()) * radius;
      this.x[i] = cx + Math.cos(a) * d;
      this.y[i] = cy + Math.sin(a) * d;
    }
  }

  /** Nuevos destinos. `stagger` reparte la salida en segundos para que el cambio viaje como una ola. */
  setTargets(points: Float32Array, stagger = 0, order: 'index' | 'x' | 'seed' = 'seed') {
    for (let i = 0; i < this.n; i++) {
      this.tx[i] = points[i * 2];
      this.ty[i] = points[i * 2 + 1];
      let k = this.seed[i];
      if (order === 'index') k = i / this.n;
      if (order === 'x') k = Math.min(1, Math.max(0, points[i * 2] / this.width));
      this.delay[i] = this.time + k * stagger;
    }
  }

  snap() {
    this.x.set(this.tx);
    this.y.set(this.ty);
    this.vx.fill(0);
    this.vy.fill(0);
    this.alpha.set(this.targetAlpha);
  }

  kick(strength: number) {
    for (let i = 0; i < this.n; i++) {
      this.vx[i] += (this.random() - 0.5) * strength;
      this.vy[i] += (this.random() - 0.5) * strength;
    }
  }

  step(dt: number) {
    this.time += dt;
    if (this.updater) this.updater(this, this.time, dt);
    const { n, x, y, vx, vy, tx, ty, alpha, targetAlpha } = this;
    const p = this.pointer;
    const R = this.pointerRadius;
    const R2 = R * R;
    const g = this.gridSize;
    const k = this.stiffness;
    const damp = this.damping;
    const jit = this.jitter;
    const fade = Math.min(1, dt * 4);
    const order = p.active && this.pointerMode === 'order';
    const push = p.active && this.pointerMode === 'push';

    for (let i = 0; i < n; i++) {
      let gx = tx[i];
      let gy = ty[i];
      let near = 0;
      if (order || push) {
        const dx = x[i] - p.x;
        const dy = y[i] - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          near = 1 - Math.sqrt(d2) / R;
          if (order) {
            // Cerca del cursor cada pieza encuentra su lugar en la retícula.
            const sx = (Math.floor(x[i] / g) + 0.5) * g;
            const sy = (Math.floor(y[i] / g) + 0.5) * g;
            const e = near * near * (3 - 2 * near);
            gx = gx + (sx - gx) * e;
            gy = gy + (sy - gy) * e;
          } else {
            const d = Math.sqrt(d2) || 1;
            vx[i] += (dx / d) * near * 3;
            vy[i] += (dy / d) * near * 3;
          }
        }
      }
      let ax = 0;
      let ay = 0;
      if (this.time >= this.delay[i]) {
        ax = (gx - x[i]) * k;
        ay = (gy - y[i]) * k;
      }
      if (jit) {
        ax += (this.random() - 0.5) * jit;
        ay += (this.random() - 0.5) * jit;
      }
      vx[i] = (vx[i] + ax) * damp;
      vy[i] = (vy[i] + ay) * damp;
      x[i] += vx[i];
      y[i] += vy[i];
      const want = order ? Math.min(1, targetAlpha[i] + near * 0.6) : targetAlpha[i];
      alpha[i] += (want - alpha[i]) * fade;
    }
  }

  /** Llena `out` (x, y, alfa, tamaño) para el renderizador. */
  write() {
    const { out, n, x, y, alpha, size, baseSize } = this;
    for (let i = 0; i < n; i++) {
      const o = i * 4;
      out[o] = x[i];
      out[o + 1] = y[i];
      out[o + 2] = alpha[i];
      out[o + 3] = size[i] * baseSize;
    }
    return out;
  }
}
