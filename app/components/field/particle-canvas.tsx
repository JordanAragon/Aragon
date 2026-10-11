'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { ParticleSim } from './sim';
import { createCanvasRenderer, type FieldRenderer } from './render-canvas';

export type FieldController = {
  sim: ParticleSim;
  /** Se llama al montar y en cada cambio de tamaño, con el tamaño en píxeles CSS. */
  layout: (width: number, height: number) => void;
};

type Props = {
  className?: string;
  style?: CSSProperties;
  /** Cuántas piezas en escritorio; en teléfonos se usa menos de la mitad. */
  count: number;
  seed?: number;
  color?: [number, number, number];
  /** Recibe la simulación lista y devuelve cómo acomodarla según el tamaño. */
  setup: (sim: ParticleSim) => (width: number, height: number) => void;
  /** Elemento que escucha el cursor (por defecto, el propio lienzo). */
  pointerTarget?: React.RefObject<HTMLElement | null>;
  onReady?: (controller: FieldController & { renderer: FieldRenderer['kind'] }) => void;
};

function supportsGpu() {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && /(^|-)2g|3g/.test(connection.effectiveType)) return false;
  return true;
}

export default function ParticleCanvas({ className, style, count, seed = 1, color = [1, 1, 1], setup, pointerTarget, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setupRef = useRef(setup);
  const readyRef = useRef(onReady);
  useLayoutEffect(() => {
    setupRef.current = setup;
    readyRef.current = onReady;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 760px)').matches;
    const n = Math.round(small ? count * 0.42 : count);
    const sim = new ParticleSim(n, seed);
    const layout = setupRef.current(sim);
    let renderer: FieldRenderer = createCanvasRenderer(canvas, color);
    let visible = true;
    let raf = 0;
    let disposed = false;
    let last = performance.now();

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      sim.resize(rect.width, rect.height);
      renderer.resize(rect.width, rect.height, dpr);
      layout(rect.width, rect.height);
    };
    measure();

    const render = () => renderer.draw(sim.write(), sim.n);

    const settle = () => {
      // Movimiento reducido: la figura queda quieta en su lugar, sin bucle.
      sim.snap();
      sim.step(0);
      sim.snap();
      render();
    };

    const tick = (now: number) => {
      raf = 0;
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      sim.step(dt);
      try {
        render();
      } catch {
        // Si el render en GPU falla en pleno uso, se cambia al respaldo y se sigue.
        renderer.dispose();
        renderer = createCanvasRenderer(canvas, color);
        measure();
      }
      if (visible) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduced || disposed || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      if (reduced) settle();
    });
    resizeObserver.observe(canvas);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { rootMargin: '160px' },
    );
    visibility.observe(canvas);

    const pointerEl = pointerTarget?.current ?? canvas;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      sim.pointer.x = event.clientX - rect.left;
      sim.pointer.y = event.clientY - rect.top;
      sim.pointer.active = true;
    };
    const onLeave = () => {
      sim.pointer.active = false;
    };
    if (fine && !reduced) {
      pointerEl.addEventListener('pointermove', onMove);
      pointerEl.addEventListener('pointerleave', onLeave);
    }

    const controller = { sim, layout: (w: number, h: number) => layout(w, h) };
    readyRef.current?.({ ...controller, renderer: renderer.kind });

    if (reduced) settle();
    else start();

    // WebGPU se intenta después del primer cuadro, sin bloquear la página.
    if (!reduced && supportsGpu()) {
      import('./render-gpu')
        .then(async ({ createGpuRenderer }) => {
          if (disposed) return;
          const gpuCanvas = document.createElement('canvas');
          gpuCanvas.className = canvas.className;
          gpuCanvas.setAttribute('aria-hidden', 'true');
          gpuCanvas.dataset.fieldGpu = 'true';
          Object.assign(gpuCanvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });
          canvas.parentElement?.insertBefore(gpuCanvas, canvas.nextSibling);
          try {
            const gpuRenderer = await createGpuRenderer(gpuCanvas, n, color, () => {
              // Si WebGPU falla en cualquier momento, vuelve el respaldo en Canvas 2D.
              if (disposed || renderer.kind !== 'webgpu') return;
              renderer.dispose();
              gpuCanvas.remove();
              renderer = createCanvasRenderer(canvas, color);
              canvas.style.visibility = '';
              canvas.dataset.renderer = 'canvas';
              measure();
            });
            if (disposed) {
              gpuRenderer.dispose();
              gpuCanvas.remove();
              return;
            }
            const rect = canvas.getBoundingClientRect();
            gpuRenderer.resize(rect.width, rect.height, Math.min(2, window.devicePixelRatio || 1));
            gpuRenderer.draw(sim.write(), sim.n);
            renderer.dispose();
            renderer = gpuRenderer;
            canvas.style.visibility = 'hidden';
            canvas.dataset.renderer = 'webgpu';
          } catch {
            gpuCanvas.remove();
          }
        })
        .catch(() => undefined);
    }

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      pointerEl.removeEventListener('pointermove', onMove);
      pointerEl.removeEventListener('pointerleave', onLeave);
      renderer.dispose();
      canvas.parentElement?.querySelectorAll('canvas[data-field-gpu]').forEach((c) => c.remove());
    };
    // El campo se monta una vez; `setup` se lee por referencia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seed]);

  return <canvas ref={canvasRef} className={className} style={style} aria-hidden="true" data-renderer="canvas" />;
}
