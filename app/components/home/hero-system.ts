/*
  El campo del hero es un sistema trabajando (la idea del globo de Stripe, donde
  cada arco es un pago real, llevada a la de Aragon):

  - A la izquierda flotan las piezas sueltas de un negocio: mensajes, notas,
    datos que nadie ha registrado.
  - Cada tanto, un puñado de esas piezas se junta (un pedido), cruza la frontera
    del orden y llega a la app de la derecha convertido en el cuadrado de la
    marca: la pieza ya ordenada. Su fila dice qué es y de dónde vino.
  - Los pedidos bajan por la tabla y avanzan de estado (recibido, en bodega, en
    ruta, entregado); el que sale de la tabla vuelve a ser parte del negocio.
  - Lo que toca el cursor entra al sistema; al bajar, lo que queda suelto se
    ordena antes de llegar al problema.

  Solo decide destinos y brillo de cada pieza; la física y el dibujo son de
  ParticleSim y del renderizador.
*/

import type { ParticleSim } from '../field/sim';
import { HERO_ROWS, PACKET_SIDE, heroApp, heroFrameLines, latticeFill, type HeroApp } from '../field/shapes';

export const STATES = ['recibido', 'en bodega', 'en ruta', 'entregado'] as const;
/** Estado de cada fila de la tabla: los pedidos avanzan mientras bajan. */
const SLOT_STATE = [0, 1, 2, 2, 3];
/** Columnas encendidas del cuadrado según el estado: la pieza se completa al avanzar. */
const LIT = [2, 4, 5, 7];

// Datos de ejemplo (la app lo dice en su cabecera).
const CLIENTS = ['Panadería Sol', 'Tienda La 14', 'Droguería Norte', 'Minimercado El Ancla', 'Café Ladera', 'Ferretería Real', 'Frutería La 5'];
const SOURCES = ['WhatsApp', 'formulario web', 'correo', 'llamada', 'Instagram'];

export type HeroRow = { id: number; order: string; client: string; source: string; slot: number; state: number; leaving: boolean };
export type HeroCounts = { arrived: number; route: number; done: number };

export type HeroHud = {
  /** 0 arriba del todo, 1 cuando el hero salió de la pantalla. */
  exit: number;
  onLayout: (app: HeroApp) => void;
  onRows: (rows: HeroRow[], counts: HeroCounts) => void;
};

type Packet = {
  id: number;
  members: Int32Array;
  slot: number;
  launched: number;
  arrived: boolean;
  retiring: number;
  fromX: number;
  fromY: number;
  offs: Float32Array;
  row: Omit<HeroRow, 'slot' | 'state' | 'leaving'>;
};

const K = PACKET_SIDE * PACKET_SIDE;
const FLIGHT = 1.55; // segundos de un pedido en camino
const RETIRE = 0.7;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function setupHeroSystem(sim: ParticleSim, hud: HeroHud, reduced: boolean) {
  const n = sim.n;
  // Papel de cada pieza: 0 suelta, 1 panel lateral, 2 líneas de la app, 3 en un pedido, 4 saliendo.
  const role = new Uint8Array(n);
  const member = new Int16Array(n);
  const home = new Float32Array(n * 2);
  const frame = new Float32Array(n * 2);
  const phase = new Float32Array(n);
  const touched = new Float32Array(n);
  const flash = new Float32Array(n);
  for (let i = 0; i < n; i++) phase[i] = sim.random() * Math.PI * 2;

  const sidebarCount = Math.round(n * 0.09);
  const lineCount = Math.round(n * 0.13);
  for (let i = 0; i < n; i++) role[i] = i < sidebarCount ? 1 : i < sidebarCount + lineCount ? 2 : 0;

  sim.stiffness = 0.07;
  sim.damping = 0.78;
  sim.jitter = 0;
  sim.pointerRadius = 110;
  sim.baseSize = 2.1;

  let app: HeroApp | null = null;
  let pool = { x: 0, y: 0, w: 1, h: 1 };
  let gap = 14;
  const packets: Packet[] = [];
  let nextId = 0;
  let orderNo = 1040;
  let arrived = 0;
  let done = 0;
  let start = -1;
  let nextAuto = 0;
  let lastPointer = -10;
  let lastRowsKey = '';

  const report = () => {
    const rows: HeroRow[] = packets
      .filter((p) => p.arrived)
      .map((p) => ({ ...p.row, slot: p.slot, state: SLOT_STATE[Math.min(HERO_ROWS - 1, p.slot)] ?? 3, leaving: p.retiring >= 0 }));
    const route = rows.filter((r) => !r.leaving && STATES[r.state] === 'en ruta').length;
    const key = rows.map((r) => `${r.id}:${r.slot}:${r.leaving}`).join('|') + `/${arrived}/${done}`;
    if (key === lastRowsKey) return;
    lastRowsKey = key;
    hud.onRows(rows, { arrived, route, done });
  };

  const squareTarget = (p: Packet, m: number) => {
    // Fuera de la tabla (el que sale) sigue bajando una fila más mientras se apaga.
    const a = app!;
    const size = a.square;
    const x = a.rows[0].sq.x;
    const y = a.tableY + p.slot * a.rowH + (a.rowH - size) / 2;
    const step = size / PACKET_SIDE;
    const col = m % PACKET_SIDE;
    const row = Math.floor(m / PACKET_SIDE);
    return [x + (col + 0.5) * step, y + (row + 0.5) * step, col] as const;
  };

  /** Un pedido nace de las piezas sueltas más cercanas a (x, y). */
  const launch = (time: number, x: number, y: number) => {
    if (!app) return;
    const candidates: number[] = [];
    for (let i = 0; i < n; i++) if (role[i] === 0) candidates.push(i);
    if (candidates.length < K * 3) return;
    candidates.sort((a, b) => (sim.x[a] - x) ** 2 + (sim.y[a] - y) ** 2 - ((sim.x[b] - x) ** 2 + (sim.y[b] - y) ** 2));
    const members = Int32Array.from(candidates.slice(0, K));
    let cx = 0;
    let cy = 0;
    members.forEach((i) => {
      cx += sim.x[i];
      cy += sim.y[i];
    });
    cx /= K;
    cy /= K;
    const offs = new Float32Array(K * 2);
    members.forEach((i, m) => {
      role[i] = 3;
      member[i] = m;
      offs[m * 2] = sim.x[i] - cx;
      offs[m * 2 + 1] = sim.y[i] - cy;
    });
    // Los que ya están en la tabla bajan una fila; el último sale.
    packets.forEach((p) => {
      p.slot += 1;
      if (p.slot >= HERO_ROWS && p.retiring < 0) {
        p.retiring = time;
        done += 1;
      }
    });
    const id = nextId++;
    orderNo += 1;
    packets.push({
      id,
      members,
      slot: 0,
      launched: time,
      arrived: false,
      retiring: -1,
      fromX: cx,
      fromY: cy,
      offs,
      row: {
        id,
        order: `#${orderNo}`,
        client: CLIENTS[(id * 3 + 1) % CLIENTS.length],
        source: SOURCES[(id * 2) % SOURCES.length],
      },
    });
    report();
  };

  /** Punto de partida automático: piezas sueltas del lado cercano a la frontera, para que el viaje se vea. */
  const autoOrigin = () => {
    const x = pool.x + pool.w * (0.55 + sim.random() * 0.4);
    const y = pool.y + pool.h * (0.12 + sim.random() * 0.76);
    return [x, y] as const;
  };

  const fillTable = (time: number) => {
    // Sin movimiento: la tabla ya está llena y quieta.
    for (let k = 0; k < HERO_ROWS; k++) {
      const [x, y] = autoOrigin();
      launch(time, x, y);
    }
    packets.forEach((p) => {
      p.arrived = true;
    });
    arrived = HERO_ROWS;
    report();
  };

  sim.updater = (s, time, dt) => {
    if (!app) return;
    if (start < 0) {
      start = time;
      nextAuto = time + 0.7;
      if (reduced) fillTable(time);
    }
    const a = app;

    // El primer tramo llena la tabla rápido; luego llega un pedido cada poco más de dos segundos.
    if (!reduced && time >= nextAuto) {
      const [x, y] = autoOrigin();
      launch(time, x, y);
      nextAuto = time + (arrived < 3 ? 0.55 : 2.3 + sim.random() * 0.6);
    }

    // Lo que toca el cursor entra al sistema.
    const p = s.pointer;
    if (!reduced && p.active && p.x < pool.x + pool.w && p.y > pool.y && time - lastPointer > 0.65) {
      let near = 0;
      for (let i = 0; i < n && near < K; i++) {
        if (role[i] !== 0) continue;
        const dx = s.x[i] - p.x;
        const dy = s.y[i] - p.y;
        if (dx * dx + dy * dy < 70 * 70) near++;
      }
      if (near >= K * 0.4) {
        lastPointer = time;
        launch(time, p.x, p.y);
        nextAuto = Math.max(nextAuto, time + 1.6);
      }
    }

    // Piezas sueltas y la orden de bajar: el frente recorre lo suelto de derecha a izquierda.
    const exit = clamp(hud.exit);
    const edge = pool.x + pool.w * (1.15 - 1.4 * smooth(exit));
    const soft = pool.w * 0.25;
    const R2 = s.pointerRadius * s.pointerRadius * 0.5;
    const grow = Math.min(1, dt * 3);
    const fade = Math.min(1, dt * 2.2);

    for (let i = 0; i < n; i++) {
      const r = role[i];
      if (flash[i] > 0) flash[i] = Math.max(0, flash[i] - fade);
      if (r === 1 || r === 2) {
        s.tx[i] = frame[i * 2];
        s.ty[i] = frame[i * 2 + 1];
        s.targetAlpha[i] = r === 1 ? 0.12 : 0.5;
        s.size[i] = r === 1 ? 0.9 : 0.8;
        continue;
      }
      if (r === 0) {
        if (p.active && touched[i] === 0) {
          const dx = s.x[i] - p.x;
          const dy = s.y[i] - p.y;
          if (dx * dx + dy * dy < R2) {
            touched[i] = 0.0001;
            flash[i] = 1;
          }
        }
        if (touched[i] > 0 && touched[i] < 1) touched[i] = Math.min(1, touched[i] + grow * (1.02 - touched[i]));
        const hx = home[i * 2];
        const hy = home[i * 2 + 1];
        const f = smooth(clamp((hx - edge) / soft));
        const o = Math.max(f, touched[i]);
        const amp = (1 - o) * gap * 3.2;
        const ph = phase[i];
        s.tx[i] = hx + Math.sin(time * 0.35 + ph) * amp + Math.sin(time * 0.13 + ph * 2) * amp * 0.8;
        s.ty[i] = hy + Math.cos(time * 0.29 + ph * 1.3) * amp * 0.8;
        s.targetAlpha[i] = 0.26 * (1 - o) + o * 0.17 + flash[i] * 0.7;
        s.size[i] = 1 + flash[i] * 0.35;
      }
    }

    // Pedidos: en camino, en la tabla o saliendo.
    let changed = false;
    for (let k = packets.length - 1; k >= 0; k--) {
      const pk = packets[k];
      if (pk.retiring >= 0) {
        const v = clamp((time - pk.retiring) / RETIRE);
        pk.members.forEach((i, m) => {
          const [x, y] = squareTarget(pk, m);
          s.tx[i] = x;
          s.ty[i] = y;
          s.targetAlpha[i] = 0.9 * (1 - v);
          s.size[i] = 1.1;
        });
        if (v >= 1) {
          // Entregado: sus piezas vuelven al negocio, cada una a su lugar entre las sueltas.
          pk.members.forEach((i) => {
            role[i] = 0;
            touched[i] = 0;
            s.x[i] = home[i * 2] + (sim.random() - 0.5) * gap * 4;
            s.y[i] = home[i * 2 + 1] + (sim.random() - 0.5) * gap * 4;
            s.vx[i] = 0;
            s.vy[i] = 0;
            s.alpha[i] = 0;
          });
          packets.splice(k, 1);
          changed = true;
        }
        continue;
      }
      const t = clamp((time - pk.launched) / FLIGHT);
      if (!pk.arrived && t >= 1) {
        pk.arrived = true;
        arrived += 1;
        changed = true;
        pk.members.forEach((i) => {
          flash[i] = 1;
        });
      }
      const state = SLOT_STATE[Math.min(HERO_ROWS - 1, pk.slot)];
      const sq = a.rows[Math.min(HERO_ROWS - 1, pk.slot)].sq;
      const tx = sq.x + sq.size / 2;
      const ty = sq.y + sq.size / 2;
      // El viaje: se junta, cruza la frontera y se encaja en su celda.
      const u = inOut(clamp((t - 0.12) / 0.88));
      const ctrlX = a.gateX;
      const ctrlY = pk.fromY * 0.25 + ty * 0.75;
      const iu = 1 - u;
      const px = iu * iu * pk.fromX + 2 * iu * u * ctrlX + u * u * tx;
      const py = iu * iu * pk.fromY + 2 * iu * u * ctrlY + u * u * ty;
      const gather = 1 - smooth(clamp(t / 0.3)) * 0.82;
      const form = smooth(clamp((t - 0.5) / 0.4));
      pk.members.forEach((i, m) => {
        const [sx, sy, col] = squareTarget(pk, m);
        const lx = sx - tx;
        const ly = sy - ty;
        const bx = pk.offs[m * 2] * gather;
        const by = pk.offs[m * 2 + 1] * gather;
        s.tx[i] = px + bx + (lx - bx) * form;
        s.ty[i] = py + by + (ly - by) * form;
        const lit = col < LIT[state];
        s.targetAlpha[i] = pk.arrived ? (lit ? 0.95 : 0.3) + flash[i] * 0.05 : 0.55 + 0.4 * form;
        s.size[i] = 1.05 + flash[i] * 0.3;
      });
    }
    if (changed) report();
  };

  return (w: number, h: number) => {
    app = heroApp(w, h);
    hud.onLayout(app);
    // Lo suelto vive a la izquierda de la frontera (en el teléfono, debajo de la app).
    pool = app.narrow ? { x: 0, y: app.y1 + 24, w, h: Math.max(1, h - app.y1 - 24) } : { x: 0, y: 0, w: Math.max(1, app.gateX - 16), h };
    gap = Math.max(9, Math.sqrt((pool.w * pool.h) / Math.max(1, n - sidebarCount - lineCount)));
    const cols = Math.max(1, Math.floor(pool.w / gap));
    let k = 0;
    for (let i = 0; i < n; i++) {
      if (i < sidebarCount + lineCount) continue;
      const c = k % cols;
      const r = Math.floor(k / cols);
      home[i * 2] = pool.x + (c + 0.5) * (pool.w / cols);
      home[i * 2 + 1] = pool.y + (r + 0.5) * gap;
      k++;
    }
    const side = latticeFill([app.sidebar], sidebarCount);
    const lines = latticeFill(heroFrameLines(app), lineCount);
    for (let i = 0; i < sidebarCount; i++) {
      frame[i * 2] = side[i * 2];
      frame[i * 2 + 1] = side[i * 2 + 1];
    }
    for (let j = 0; j < lineCount; j++) {
      const i = sidebarCount + j;
      frame[i * 2] = lines[j * 2];
      frame[i * 2 + 1] = lines[j * 2 + 1];
    }
    if (sim.time === 0) sim.scatter(w * 0.45, h * 0.5, Math.max(w, h) * 0.7);
  };
}
