'use client';

import { useEffect, useRef } from 'react';

/*
  La precarga es el desorden antes del sistema.

  Detrás, el lienzo del hero ya corre: solo piezas sueltas flotando. Encima,
  una cuenta enorme que sigue la carga real (tipografías, el motor de piezas y
  la página; nunca pasa de lo que ya cargó) y, al lado, cada paso con lo que
  tardó de verdad. Al llegar a 100 la cuenta sube y se va, y en el hero la
  línea empieza a poner las piezas en orden: la primera palabra se arma.

  Solo al abrir «/», sin ancla, sin movimiento reducido y una vez por sesión
  (el script en línea de layout.tsx decide y pone `html.is-preloading` antes
  del primer cuadro). Un clic o una tecla la saltan; si algo tarda, se retira
  sola a los 6 s y el script la quita a los 7 s si el JS nunca llegó.
*/

const PRELOAD_CLASS = 'is-preloading';
const SEEN_KEY = 'aragon:intro';
const T_MAX = 6;
const STEPS = [
  { key: 'fonts', label: 'tipografías', weight: 0.3 },
  { key: 'stage', label: 'motor de piezas', weight: 0.3 },
  { key: 'page', label: 'página', weight: 0.4 },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

export default function Preloader() {
  const layerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const layer = layerRef.current;
    if (!layer || !root.classList.contains(PRELOAD_CLASS)) return undefined;
    root.dataset.preloadTaken = '';

    const born = performance.now();
    const doneAt: Partial<Record<StepKey, number>> = {};
    let shown = 0;
    let last = born;
    let raf = 0;
    let finished = false;
    let disposed = false;
    const timers: number[] = [];

    const mark = (key: StepKey) => {
      if (doneAt[key] !== undefined) return;
      doneAt[key] = performance.now() - born;
      const row = layer.querySelector<HTMLElement>(`[data-step="${key}"]`);
      if (row) {
        row.dataset.done = '';
        const time = row.querySelector('[data-time]');
        if (time) time.textContent = `${Math.round(doneAt[key]!)} ms`;
      }
    };

    document.fonts?.ready.then(() => mark('fonts')).catch(() => mark('fonts'));
    if (!document.fonts) mark('fonts');
    if (document.readyState === 'complete') mark('page');
    const onLoad = () => mark('page');
    window.addEventListener('load', onLoad);

    const finish = () => {
      if (finished || disposed) return;
      finished = true;
      STEPS.forEach((s) => mark(s.key));
      if (countRef.current) countRef.current.textContent = '100';
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        // Sin almacenamiento (modo privado estricto): la precarga se verá de nuevo, nada más.
      }
      timers.push(
        window.setTimeout(() => {
          layer.dataset.leaving = 'true';
          root.classList.remove(PRELOAD_CLASS);
          if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
          timers.push(window.setTimeout(() => (layer.dataset.gone = 'true'), 1100));
        }, 260),
      );
    };

    const tick = (now: number) => {
      raf = 0;
      if (disposed || finished) return;
      // El paso del motor termina cuando el hero ya midió sus palabras.
      if (doneAt.stage === undefined && document.querySelector('.hero[data-ready="true"]')) mark('stage');
      const t = (now - born) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const real = STEPS.reduce((sum, s) => sum + (doneAt[s.key] !== undefined ? s.weight : 0), 0);
      // La cuenta corre hacia lo que ya cargó, sin pasarse, y sin bajar de ~1 s en total.
      shown = Math.min(real, shown + (real >= 1 ? 1.7 : 0.9) * dt);
      if (countRef.current) countRef.current.textContent = String(Math.round(shown * 100)).padStart(3, '0');
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
      <p className="pl-brand mono">
        aragon<i /> <span>· poniendo en orden</span>
      </p>

      <ol className="pl-steps mono">
        {STEPS.map((s, i) => (
          <li key={s.key} data-step={s.key}>
            <span className="tabular">{String(i + 1).padStart(2, '0')}</span>
            <span>{s.label}</span>
            <i />
            <span data-time className="tabular">
              …
            </span>
          </li>
        ))}
        <li className="pl-skip">clic o tecla para entrar</li>
      </ol>

      <p className="pl-count">
        <span ref={countRef} className="tabular">
          000
        </span>
      </p>
    </div>
  );
}
