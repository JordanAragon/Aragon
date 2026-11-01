'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import { HeroEngine, type HeroEvent, type HeroLayout } from './engine';
import { SYMBOL_H, SYMBOL_PARTS, SYMBOL_W } from './symbol';
import { createCanvasRenderer, createGpuRenderer, supportsGpu, type PieceRenderer, type Rgb } from './render';

/*
  El plano del hero: el lienzo con las piezas, la mira que enmarca la A y las
  etiquetas de cada tarea (qué entra suelto por la izquierda y cómo sale por
  la derecha). Las etiquetas son HTML: se leen, se traducen y no dependen del
  lienzo.
*/

export type HeroTask = { in: string; out: string };

const PALETTE: Rgb[] = [
  [0.039, 0.039, 0.039], // tinta: la pieza larga de la A
  [0.604, 0.604, 0.604], // gris de la marca: las otras dos piezas
  [1, 0.302, 0.09], // señal: lo resuelto
  [0.36, 0.355, 0.345], // gris oscuro de lo suelto: se ve sobre el papel y sobre la señal
];

const GPU_CAPACITY = 6000;
const PRELOAD_CLASS = 'is-preloading';

type Tag = { key: string; kind: 'in' | 'out'; text: string; x: number; y: number; dx: number; dy: number; dur: number };

type Props = {
  tasks: HeroTask[];
  pointerTarget: RefObject<HTMLElement | null>;
  onResolved?: (count: number) => void;
  /** Lo que se ubica sobre la A y la regla (la llamada a la acción, la leyenda). */
  children?: ReactNode;
  /** El hueco que la página deja para la A en el teléfono (oculto en pantallas grandes). */
  anchor?: RefObject<HTMLElement | null>;
};

export default function HeroStage({ tasks, pointerTarget, onResolved, children, anchor }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layout, setLayout] = useState<HeroLayout | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const tasksRef = useRef(tasks);
  const resolvedRef = useRef(onResolved);
  useLayoutEffect(() => {
    tasksRef.current = tasks;
    resolvedRef.current = onResolved;
  });

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return undefined;
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const engine = new HeroEngine(tasksRef.current.length);
    let renderer: PieceRenderer = createCanvasRenderer(canvas, PALETTE);
    let disposed = false;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    // Con precarga, la A ya se armó allá: aquí arranca en su sitio y espera el relevo.
    let held = !reduced && root.classList.contains(PRELOAD_CLASS);
    let first = true;
    // «assemble»: la A se arma aquí; «ready»: ya llegó armada desde la precarga (o no hay movimiento).
    if (held || reduced) stage.dataset.intro = 'ready';

    const tagFor = (event: HeroEvent, L: HeroLayout): Tag | null => {
      const task = tasksRef.current[event.task % tasksRef.current.length];
      if (!task) return null;
      if (event.kind === 'in') {
        const tx = L.cx - L.aw * (L.narrow ? 0.26 : 0.3);
        return {
          key: `in-${event.id}`,
          kind: 'in',
          text: task.in,
          x: Math.max(12, event.x),
          y: event.y - L.cell * 7 - 18,
          dx: tx - Math.max(12, event.x) - 40,
          dy: 0,
          dur: 2.1,
        };
      }
      if (event.kind === 'out') {
        const travel = L.width - event.x;
        return {
          key: `out-${event.id}`,
          kind: 'out',
          text: task.out,
          x: event.x,
          y: event.y - L.cell * 2 - 30,
          dx: travel,
          dy: 0,
          dur: travel / 95,
        };
      }
      return null;
    };

    engine.onEvent = (event) => {
      const L = engine.layout;
      if (!L) return;
      if (event.kind === 'out') resolvedRef.current?.(event.resolved);
      if (L.narrow && event.kind === 'in') return;
      const tag = tagFor(event, L);
      if (!tag) return;
      setTags((current) => [...current, tag].slice(-5));
    };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const slot = anchor?.current;
      let box: { cx: number; top: number; width: number } | null = null;
      if (slot && slot.offsetHeight > 0) {
        const r = slot.getBoundingClientRect();
        box = { cx: r.left - rect.left + r.width / 2, top: r.top - rect.top, width: r.width };
      }
      engine.resize(rect.width, rect.height, reduced || held || !first, box);
      const L = engine.layout;
      // La palabra de marca, fuera del plano, se centra en la misma A.
      if (L) stage.parentElement?.style.setProperty('--cy', `${L.cy}px`);
      first = false;
      renderer.resize(rect.width, rect.height, dpr);
      if (reduced) engine.settle();
      setLayout(engine.layout ? { ...engine.layout } : null);
      setTags([]);
      renderer.draw(engine.write(), engine.count);
    };
    measure();

    const tick = (now: number) => {
      raf = 0;
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      engine.step(dt, !held);
      try {
        renderer.draw(engine.write(), engine.count);
      } catch {
        renderer.dispose();
        renderer = createCanvasRenderer(canvas, PALETTE);
        canvas.style.visibility = '';
        measure();
      }
      if (visible && !reduced) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reduced || disposed || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const resize = new ResizeObserver(() => measure());
    resize.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { rootMargin: '120px' },
    );
    io.observe(canvas);

    // El relevo: cuando la precarga se retira, empiezan a llegar las tareas.
    const watch = new MutationObserver(() => {
      if (held && !root.classList.contains(PRELOAD_CLASS)) {
        held = false;
        watch.disconnect();
      }
    });
    if (held) watch.observe(root, { attributes: true, attributeFilter: ['class'] });

    const pointerEl = pointerTarget.current ?? canvas;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      engine.pointer.x = event.clientX - rect.left;
      engine.pointer.y = event.clientY - rect.top;
      engine.pointer.active = true;
    };
    const onLeave = () => {
      engine.pointer.active = false;
    };
    if (fine && !reduced) {
      pointerEl.addEventListener('pointermove', onMove);
      pointerEl.addEventListener('pointerleave', onLeave);
    }

    // Al bajar, la A se abre y se apaga: deja paso a la página.
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const h = stage.offsetHeight || 1;
        const e = Math.min(1, Math.max(0, window.scrollY / (h * 0.85)));
        engine.exit = reduced ? 0 : e;
        (stage.parentElement ?? stage).style.setProperty('--exit', e.toFixed(4));
        if (reduced) renderer.draw(engine.write(), engine.count);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!reduced) start();

    // WebGPU después del primer cuadro, sin bloquear nada.
    if (!reduced && supportsGpu()) {
      void (async () => {
          if (disposed) return;
          const gpuCanvas = document.createElement('canvas');
          gpuCanvas.className = canvas.className;
          gpuCanvas.setAttribute('aria-hidden', 'true');
          gpuCanvas.dataset.heroGpu = 'true';
          canvas.parentElement?.insertBefore(gpuCanvas, canvas.nextSibling);
          try {
            const gpu = await createGpuRenderer(gpuCanvas, GPU_CAPACITY, PALETTE, () => {
              if (disposed || renderer.kind !== 'webgpu') return;
              renderer.dispose();
              gpuCanvas.remove();
              renderer = createCanvasRenderer(canvas, PALETTE);
              canvas.style.visibility = '';
              canvas.dataset.renderer = 'canvas';
              measure();
            });
            if (disposed) {
              gpu.dispose();
              gpuCanvas.remove();
              return;
            }
            const rect = canvas.getBoundingClientRect();
            gpu.resize(rect.width, rect.height, Math.min(2, window.devicePixelRatio || 1));
            gpu.draw(engine.write(), engine.count);
            renderer.dispose();
            renderer = gpu;
            canvas.style.visibility = 'hidden';
            canvas.dataset.renderer = 'webgpu';
          } catch {
            gpuCanvas.remove();
          }
      })();
    }

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      resize.disconnect();
      io.disconnect();
      watch.disconnect();
      window.removeEventListener('scroll', onScroll);
      pointerEl.removeEventListener('pointermove', onMove);
      pointerEl.removeEventListener('pointerleave', onLeave);
      renderer.dispose();
      canvas.parentElement?.querySelectorAll('canvas[data-hero-gpu]').forEach((c) => c.remove());
    };
    // El plano se monta una vez; las tareas y el aviso se leen por referencia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vars = layout
    ? ({
        '--cx': `${layout.cx}px`,
        '--cy': `${layout.cy}px`,
        '--aw': `${layout.aw}px`,
        '--ah': `${layout.ah}px`,
        '--lane-y': `${layout.laneY}px`,
        '--legend-y': `${layout.laneY + layout.cell * 2.2 + 14}px`,
        '--lane-x': `${layout.laneX}px`,
        '--cell': `${layout.cell}px`,
      } as CSSProperties)
    : undefined;

  return (
    <div ref={stageRef} className="hero-stage" style={vars} data-ready={layout ? 'true' : 'false'} data-intro="assemble">
      {layout && <Knockout layout={layout} />}
      {layout && <Reticle layout={layout} />}
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" data-renderer="canvas" />
      <div className="hero-tags" aria-hidden="true">
        {tags.map((tag) => (
          <span
            key={tag.key}
            className="hero-tag mono"
            data-kind={tag.kind}
            style={{ left: tag.x, top: tag.y, '--dx': `${tag.dx}px`, '--dy': `${tag.dy}px`, '--dur': `${tag.dur}s` } as CSSProperties}
            onAnimationEnd={() => setTags((current) => current.filter((t) => t.key !== tag.key))}
          >
            <i />
            {tag.text}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}

/*
  La mira: dos anillos, la cruz y las esquinas que enmarcan la A, y la regla
  del horizonte por donde sale lo resuelto. Solo señala dónde mirar.
*/
function Knockout({ layout: L }: { layout: HeroLayout }) {
  // La silueta de la A, en papel, recorta la palabra de atrás: la A se lee entera aunque sea de piezas.
  return (
    <svg className="hero-knock" width={L.width} height={L.height} viewBox={`0 0 ${L.width} ${L.height}`} aria-hidden="true">
      <g transform={`translate(${L.cx - L.aw / 2} ${L.cy - L.ah / 2}) scale(${L.aw / SYMBOL_W} ${L.ah / SYMBOL_H})`}>
        {SYMBOL_PARTS.map((part) => (
          <path key={part.d} d={part.d} style={{ strokeWidth: (L.cell * 2.2) / (L.aw / SYMBOL_W) }} />
        ))}
      </g>
    </svg>
  );
}

function Reticle({ layout: L }: { layout: HeroLayout }) {
  const r1 = L.ah * 0.98;
  const r2 = L.ah * 1.14;
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const left = L.cx - L.aw / 2 - L.cell * 2;
  const right = L.cx + L.aw / 2 + L.cell * 2;
  const top = L.cy - L.ah / 2 - L.cell * 2;
  const bottom = L.cy + L.ah / 2 + L.cell * 2;
  const arm = Math.max(10, L.cell * 2.4);
  const rulerY = L.laneY + L.cell * 2.2;
  const rulerTicks = Math.floor(L.width / 24);
  return (
    <svg className="hero-reticle" width={L.width} height={L.height} viewBox={`0 0 ${L.width} ${L.height}`} aria-hidden="true">
      <circle className="ret-ring" cx={L.cx} cy={L.cy} r={r1} />
      <g className="ret-dial" style={{ transformOrigin: `${L.cx}px ${L.cy}px` }}>
        {ticks.map((deg) => {
          const long = deg % 45 === 0;
          const a = (deg * Math.PI) / 180;
          const r0 = r2 - (long ? 14 : 6);
          return (
            <line
              key={deg}
              className={long ? 'ret-tick ret-tick-long' : 'ret-tick'}
              x1={L.cx + Math.cos(a) * r0}
              y1={L.cy + Math.sin(a) * r0}
              x2={L.cx + Math.cos(a) * r2}
              y2={L.cy + Math.sin(a) * r2}
            />
          );
        })}
      </g>
      <line className="ret-cross" x1={0} y1={L.cy} x2={left - L.cell * 6} y2={L.cy} />
      <line className="ret-cross" x1={right + L.cell * 6} y1={L.cy} x2={L.width} y2={L.cy} />
      <line className="ret-cross" x1={L.cx} y1={L.cy - r2 - 10} x2={L.cx} y2={top - L.cell * 3} />
      <path
        className="ret-corner"
        d={`M${left} ${top + arm}V${top}H${left + arm} M${right - arm} ${top}H${right}V${top + arm} M${left} ${bottom - arm}V${bottom}H${left + arm} M${right - arm} ${bottom}H${right}V${bottom - arm}`}
      />
      <line className="ret-ruler" x1={L.width * 0.03} y1={rulerY} x2={L.width * 0.97} y2={rulerY} />
      {Array.from({ length: rulerTicks }, (_, i) => {
        const x = L.width * 0.03 + i * 24;
        if (x > L.width * 0.97) return null;
        return <line key={i} className={i % 5 === 0 ? 'ret-rtick ret-rtick-long' : 'ret-rtick'} x1={x} y1={rulerY} x2={x} y2={rulerY + (i % 5 === 0 ? 8 : 4)} />;
      })}
    </svg>
  );
}
