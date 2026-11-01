'use client';

import { useEffect, useRef } from 'react';
import { SYMBOL_H, SYMBOL_PARTS, SYMBOL_W } from '../hero/symbol';

/*
  La precarga: el sistema se arma mientras carga la página.

  Sobre la noche, cuatro columnas con lo que se está cargando de verdad
  (tipografías, las piezas del hero, la página) y una cuenta grande. En el
  centro, la A de la marca, en el mismo lugar y tamaño que tendrá en el hero, se
  llena de piezas de abajo hacia arriba al ritmo de la carga real: la cuenta
  nunca pasa de lo que ya cargó. Al completarse, las columnas suben una tras
  otra y descubren el hero, donde la misma A ya está armada y empieza a
  trabajar.

  Solo al abrir «/», sin ancla, sin movimiento reducido y una vez por sesión
  (el script en línea de layout.tsx decide y pone `html.is-preloading` antes
  del primer cuadro). Un clic o una tecla la saltan; si algo tarda, se retira
  sola a los 6 s y el script la quita a los 7 s si el JS nunca llegó.
*/

const PRELOAD_CLASS = 'is-preloading';
const SEEN_KEY = 'aragon:intro';
const T_MAX = 6;
const STEPS = [
  { key: 'fonts', label: 'tipografías', status: 'cargando tipografías', weight: 0.3 },
  { key: 'stage', label: 'piezas', status: 'armando la A', weight: 0.3 },
  { key: 'page', label: 'página', status: 'cargando la página', weight: 0.4 },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

/** Paso de la retícula del relleno, en unidades del símbolo (igual que el hero: 98 columnas). */
const CELL = SYMBOL_W / 98;

export default function Preloader() {
  const layerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const layer = layerRef.current;
    if (!layer || !root.classList.contains(PRELOAD_CLASS)) return undefined;
    root.dataset.preloadTaken = '';

    const done: Record<StepKey, boolean> = { fonts: false, stage: false, page: false };
    const born = performance.now();
    let shown = 0;
    let last = born;
    let raf = 0;
    let finished = false;
    let disposed = false;
    const timers: number[] = [];

    // Lo que de verdad terminó limita la cuenta; la columna se marca cuando la cuenta llega a su tramo.
    const mark = (key: StepKey) => {
      done[key] = true;
    };

    document.fonts?.ready.then(() => mark('fonts')).catch(() => mark('fonts'));
    if (!document.fonts) mark('fonts');
    if (document.readyState === 'complete') mark('page');
    const onLoad = () => mark('page');
    window.addEventListener('load', onLoad);

    const finish = () => {
      if (finished || disposed) return;
      finished = true;
      if (countRef.current) countRef.current.textContent = '100';
      fillRef.current?.setAttribute('y', '0');
      fillRef.current?.setAttribute('height', String(SYMBOL_H));
      if (statusRef.current) statusRef.current.textContent = 'listo';
      layer.querySelectorAll('[data-step]').forEach((el) => el.setAttribute('data-done', ''));
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        // Sin almacenamiento (modo privado estricto): la precarga se verá de nuevo, nada más.
      }
      timers.push(
        window.setTimeout(() => {
          layer.dataset.leaving = 'true';
          // El hero arranca mientras las columnas suben: debajo ya está la misma A.
          timers.push(
            window.setTimeout(() => {
              root.classList.remove(PRELOAD_CLASS);
              if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
            }, 160),
          );
          timers.push(window.setTimeout(() => (layer.dataset.gone = 'true'), 1400));
        }, 220),
      );
    };

    const tick = (now: number) => {
      raf = 0;
      if (disposed || finished) return;
      // El paso del hero termina cuando su lienzo ya tiene la A acomodada.
      if (!done.stage && document.querySelector('.hero-stage[data-ready="true"]')) mark('stage');
      const t = (now - born) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const real = STEPS.reduce((sum, step) => sum + (done[step.key] ? step.weight : 0), 0);
      // La cuenta corre hacia lo que ya cargó, sin pasarse, y sin bajar de ~1 s en total.
      const speed = real >= 1 ? 1.6 : 0.85;
      shown = Math.min(real, shown + speed * dt);
      const pct = Math.round(shown * 100);
      if (countRef.current) countRef.current.textContent = String(pct).padStart(3, '0');
      if (fillRef.current) {
        fillRef.current.setAttribute('y', String(SYMBOL_H * (1 - shown)));
        fillRef.current.setAttribute('height', String(SYMBOL_H * shown));
      }
      let edge = 0;
      let current: (typeof STEPS)[number] | null = null;
      for (const step of STEPS) {
        edge += step.weight;
        const passed = shown >= edge - 0.001;
        layer.querySelector(`[data-step="${step.key}"]`)?.toggleAttribute('data-done', passed);
        if (!passed && !current) current = step;
      }
      if (statusRef.current) statusRef.current.textContent = current ? current.status : 'armando el sistema';
      if (shown >= 1 || t > T_MAX) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const skip = () => finish();
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener('load', onLoad);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  return (
    <div ref={layerRef} className="preloader" aria-hidden="true">
      <div className="pl-cols">
        {STEPS.map((step, i) => (
          <div key={step.key} className="pl-col" style={{ '--i': i } as React.CSSProperties}>
            <span className="pl-label" data-step={step.key}>
              <span className="tabular">{String(i + 1).padStart(2, '0')}</span> {step.label}
            </span>
          </div>
        ))}
        <div className="pl-col" style={{ '--i': 3 } as React.CSSProperties}>
          <span className="pl-label" data-step="ready">
            <span className="tabular">04</span> sistema
          </span>
        </div>
      </div>

      <div className="pl-hud">
        <p className="pl-count">
          <span ref={countRef} className="tabular">
            000
          </span>
          <small>%</small>
        </p>

        <svg className="pl-symbol" viewBox={`0 0 ${SYMBOL_W} ${SYMBOL_H}`}>
          <defs>
            <pattern id="pl-cells" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
              <rect x={CELL * 0.13} y={CELL * 0.13} width={CELL * 0.74} height={CELL * 0.74} fill="#fff" />
            </pattern>
            <pattern id="pl-cells-gray" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
              <rect x={CELL * 0.13} y={CELL * 0.13} width={CELL * 0.74} height={CELL * 0.74} fill="#9a9a9a" />
            </pattern>
            <clipPath id="pl-rise">
              <rect ref={fillRef} x="0" y={SYMBOL_H} width={SYMBOL_W} height="0" />
            </clipPath>
          </defs>
          {SYMBOL_PARTS.map((part) => (
            <path key={part.d} className="pl-outline" d={part.d} />
          ))}
          <g clipPath="url(#pl-rise)">
            {SYMBOL_PARTS.map((part) => (
              <path key={part.d} className={part.color === 0 ? 'pl-fill' : 'pl-fill pl-fill-gray'} d={part.d} />
            ))}
          </g>
        </svg>

        <p className="pl-status mono">
          <span ref={statusRef}>{STEPS[0].status}</span>
          <span className="pl-skip">clic o tecla para entrar</span>
        </p>
      </div>
    </div>
  );
}
