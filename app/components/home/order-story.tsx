'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import ParticleCanvas, { type FieldController } from '../field/particle-canvas';
import type { ParticleSim } from '../field/sim';
import {
  chaosClusters,
  chaosShape,
  chatLayout,
  chatShape,
  flowEdges,
  flowLayout,
  flowNodeShape,
  heartbeatLayout,
  pulse,
  stageBox,
  tableColumns,
  tableLayout,
  tableShape,
} from '../field/shapes';
import { services } from '../../data/services';
import { ArrowRight } from '../ui/icons';

/*
  «Del desorden al sistema»: el mismo puñado de piezas pasa por los cuatro
  servicios. Suelto (hoy), ordenado en una tabla (apps web), conectado en un
  flujo (automatización), respondiendo en una conversación (agentes de IA) y
  vigilado con un latido (infraestructura). La figura explica el servicio.
*/

type Stop = {
  id: string;
  title: string;
  body: string;
  count: (n: string) => string;
  service?: (typeof services)[number];
};

const STOPS: Stop[] = [
  {
    id: 'hoy',
    title: 'Hoy, las piezas están sueltas.',
    body: 'Pedidos en el WhatsApp, inventario en una hoja que solo entiende una persona, citas en una libreta. Todo existe, pero nada habla con nada.',
    count: (n) => `${n} piezas sueltas`,
  },
  {
    id: 'ordenar',
    title: 'Primero, cada pieza en su lugar.',
    body: 'Una app web hecha para tu proceso: la información en una sola base, con permisos, historial y una vista que tu equipo entiende sin manual.',
    count: (n) => `${n} registros en una sola tabla`,
    service: services[0],
  },
  {
    id: 'conectar',
    title: 'Después, que viajen solas.',
    body: 'Automatizaciones que llevan cada pedido del chat al sistema, a la bodega y al reporte, sin copiar y pegar. Si algo falla, avisan.',
    count: (n) => `${n} datos en movimiento`,
    service: services[1],
  },
  {
    id: 'responder',
    title: 'Que alguien responda a toda hora.',
    body: 'Un agente de IA que contesta con tu información, toma pedidos y agenda citas. Cuando no sabe algo, pasa la conversación a una persona.',
    count: (n) => `${n} piezas, una conversación`,
    service: services[2],
  },
  {
    id: 'vigilar',
    title: 'Y que no se caiga.',
    body: 'Servidores con respaldos, acceso privado y monitoreo. Cada servicio tiene un latido; si se detiene, lo sabemos antes que tus clientes.',
    count: (n) => `${n} piezas vigiladas`,
    service: services[3],
  },
];

const HEART_ROWS = ['tu app', 'n8n', 'base de datos', 'agente'];

export default function OrderStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<FieldController | null>(null);
  const stopRef = useRef(0);
  const basesRef = useRef<Float32Array[]>([]);
  const [stop, setStop] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [count, setCount] = useState('—');

  const applyStop = useCallback((next: number, immediate = false) => {
    const controller = controllerRef.current;
    stopRef.current = next;
    if (!controller) return;
    const { sim } = controller;
    const base = basesRef.current[next];
    if (!base) return;
    if (!immediate) sim.kick(9);
    sim.setTargets(base, immediate ? 0 : 0.7, next === 2 ? 'x' : 'seed');
    for (let i = 0; i < sim.n; i++) sim.targetAlpha[i] = next === 0 ? 0.42 : 0.72;
    if (immediate) sim.snap();
  }, []);

  const setup = useCallback(
    (sim: ParticleSim) => {
      sim.stiffness = 0.065;
      sim.damping = 0.8;
      sim.jitter = 0.05;
      sim.pointerMode = 'push';
      sim.pointerRadius = 70;
      sim.baseSize = 1.9;
      const edgeShare = 0.42;
      const edgeOf = new Uint8Array(sim.n);
      const speed = new Float32Array(sim.n);
      const lane = new Float32Array(sim.n);
      for (let i = 0; i < sim.n; i++) {
        edgeOf[i] = i % flowEdges.length;
        speed[i] = 0.12 + sim.random() * 0.1;
        lane[i] = (sim.random() - 0.5) * 6;
      }
      let geo = { w: 1, h: 1 };
      let edgeGeo: number[][] = [];

      sim.updater = (s, time) => {
        const current = stopRef.current;
        const base = basesRef.current[current];
        if (!base) return;
        if (current === 0) {
          // Piezas sueltas: flotan sin rumbo alrededor de su foco.
          for (let i = 0; i < s.n; i++) {
            const ph = s.seed[i] * 6.283;
            s.tx[i] = base[i * 2] + Math.sin(time * 0.6 + ph) * 9;
            s.ty[i] = base[i * 2 + 1] + Math.cos(time * 0.5 + ph * 1.7) * 7;
          }
        } else if (current === 2) {
          // Una parte dibuja los nodos; el resto viaja por las conexiones.
          const start = Math.floor(s.n * (1 - edgeShare));
          for (let i = start; i < s.n; i++) {
            const e = edgeGeo[edgeOf[i]];
            if (!e) continue;
            const t = (s.seed[i] + time * speed[i]) % 1;
            const u = 1 - t;
            const x = u * u * u * e[0] + 3 * u * u * t * e[4] + 3 * u * t * t * e[4] + t * t * t * e[2];
            const y = u * u * u * e[1] + 3 * u * u * t * e[1] + 3 * u * t * t * e[3] + t * t * t * e[3];
            s.tx[i] = x;
            s.ty[i] = y + lane[i];
            s.targetAlpha[i] = 0.35 + Math.sin(t * Math.PI) * 0.65;
          }
        } else if (current === 4) {
          // Cuatro servicios, cuatro latidos con su propio ritmo.
          const L = heartbeatLayout(geo.w, geo.h);
          for (let i = 0; i < s.n; i++) {
            const row = i % L.lines;
            const u = (base[i * 2] - L.b.x) / L.b.w;
            const phase = (time * (0.32 + row * 0.04) + row * 0.27) % 1.2;
            const amp = L.rowH * 0.36;
            s.tx[i] = base[i * 2];
            s.ty[i] = base[i * 2 + 1] - pulse(u, phase) * amp;
            const d = phase - u;
            s.targetAlpha[i] = d >= 0 && d < 0.22 ? 1 - d * 2.8 : 0.32;
          }
        }
      };

      return (w: number, h: number) => {
        geo = { w, h };
        const n = sim.n;
        const flowNodes = flowNodeShape(w, h, n);
        // Mezcla: los primeros índices son nodos, el resto viaja (el updater los mueve).
        const flow = new Float32Array(n * 2);
        flow.set(flowNodes.subarray(0, Math.floor(n * (1 - edgeShare)) * 2));
        const F = flowLayout(w, h);
        edgeGeo = flowEdges.map(([a, c]) => {
          const p0x = F.nodes[a].cx + F.nw / 2;
          const p3x = F.nodes[c].cx - F.nw / 2;
          return [p0x, F.nodes[a].cy, p3x, F.nodes[c].cy, (p0x + p3x) / 2];
        });
        for (let i = Math.floor(n * (1 - edgeShare)); i < n; i++) {
          const e = edgeGeo[edgeOf[i]];
          flow[i * 2] = e[0];
          flow[i * 2 + 1] = e[1];
        }
        const L = heartbeatLayout(w, h);
        const heart = new Float32Array(n * 2);
        for (let i = 0; i < n; i++) {
          const row = i % L.lines;
          const k = Math.floor(i / L.lines) / Math.ceil(n / L.lines);
          heart[i * 2] = L.b.x + L.b.w * 0.2 + k * L.b.w * 0.72;
          heart[i * 2 + 1] = L.b.y + (row + 0.5) * L.rowH;
        }
        basesRef.current = [chaosShape(w, h, n), tableShape(w, h, n), flow, chatShape(w, h, n), heart];
        if (sim.time === 0) sim.scatter(w * 0.7, h * 0.5, w * 0.6);
        applyStop(stopRef.current, sim.time === 0 && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        setSize({ w, h });
      };
    },
    [applyStop],
  );

  const onReady = useCallback((controller: FieldController) => {
    controllerRef.current = controller;
    setCount(controller.sim.n.toLocaleString('es-CO'));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(0.9999, Math.max(0, -rect.top / span)) : 0;
      const next = Math.floor(p * STOPS.length);
      section.style.setProperty('--story-progress', p.toFixed(4));
      if (next !== stopRef.current) {
        applyStop(next);
        setStop(next);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [applyStop]);

  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight - window.innerHeight;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: top + span * ((index + 0.5) / STOPS.length), behavior: reduced ? 'auto' : 'smooth' });
  };

  const overlays = size.w ? renderOverlays(stop, size.w, size.h) : null;

  return (
    <section ref={sectionRef} id="del-desorden-al-sistema" className="story night" data-tone="night" aria-labelledby="story-title">
      <div className="story-stage" ref={stageRef}>
        <ParticleCanvas className="story-field" count={3400} seed={19} setup={setup} pointerTarget={stageRef} onReady={onReady} />
        <div className="story-overlays" aria-hidden="true">
          {overlays}
        </div>
        <div className="shell story-inner">
          <div className="story-copy">
            <p className="section-label">del desorden al sistema</p>
            <h2 id="story-title" className="sr-only">
              Del desorden al sistema
            </h2>
            <ol className="story-stops">
              {STOPS.map((s, i) => (
                <li key={s.id} className="story-stop" data-active={i === stop} aria-current={i === stop ? 'step' : undefined}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  {s.service && (
                    <Link href={`/servicios/${s.service.slug}`} className="text-link" tabIndex={i === stop ? 0 : -1}>
                      {s.service.name} <ArrowRight className="arrow" />
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="story-meta">
            <span className="story-count mono tabular">{STOPS[stop].count(count)}</span>
            <div className="story-rail" role="group" aria-label="Paradas del recorrido">
              {STOPS.map((s, i) => (
                <button key={s.id} type="button" data-active={i === stop} onClick={() => goTo(i)} aria-label={`Ir a: ${s.title}`}>
                  <span className="mono">{s.service ? s.service.verb.toLowerCase() : 'hoy'}</span>
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderOverlays(stop: number, w: number, h: number) {
  const b = stageBox(w, h);
  if (stop === 0) {
    return chaosClusters.map((c) => (
      <span key={c.label} className="ov-tag mono" style={{ left: b.x + c.fx * b.w, top: b.y + c.fy * b.h }}>
        {c.label}
      </span>
    ));
  }
  if (stop === 1) {
    const T = tableLayout(w, h);
    let x = T.b.x;
    return tableColumns.map((col, i) => {
      const left = x;
      x += T.b.w * T.cols[i];
      return (
        <span key={col} className="ov-col mono" style={{ left, top: T.b.y - 26 }}>
          {col}
        </span>
      );
    });
  }
  if (stop === 2) {
    const F = flowLayout(w, h);
    return F.nodes.map((node) => (
      <span key={node.label} className="ov-node mono" style={{ left: node.cx, top: node.cy }}>
        {node.label}
      </span>
    ));
  }
  if (stop === 3) {
    const C = chatLayout(w, h);
    return C.bubbles
      .filter((bubble) => bubble.text)
      .map((bubble) => (
        <span
          key={bubble.text}
          className="ov-bubble"
          data-side={bubble.side}
          style={{ left: bubble.x, top: bubble.y, width: bubble.w, height: bubble.h }}
        >
          {bubble.text}
        </span>
      ));
  }
  const L = heartbeatLayout(w, h);
  return HEART_ROWS.map((row, i) => (
    <span key={row} className="ov-row mono" style={{ left: L.b.x, top: L.b.y + (i + 0.5) * L.rowH, width: L.b.w }}>
      <span>{row}</span>
      <span>en línea</span>
    </span>
  ));
}
