'use client';

import { useEffect, useRef } from 'react';
import { HERO_COUNT, PRELOAD_CLASS, fieldCount, offeredField, onFieldOffered } from '../field/relay';
import { rng } from '../field/sim';
import { displayFamily, wordmarkPoints, type Wordmark } from '../field/wordmark';

/*
  La precarga: «poner en orden».

  1. La pieza. Antes de que llegue el JS, la capa ya pinta la noche y un
     cuadrado que parpadea como un cursor (el script en línea de layout.tsx
     enciende la capa; los estilos están en chrome.css).
  2. El desorden. El cuadrado revienta en las mismas piezas que tendrá el hero,
     que quedan sueltas por la pantalla.
  3. El orden. Las piezas aterrizan en la retícula de la palabra de marca, de
     izquierda a derecha. El avance es real: cada pieza que aterriza corresponde
     a lo que ya cargó (tipografías, campo del hero y página), con su tiempo
     medido, y la cuenta dice cuántas piezas están en orden.
  4. El relevo. Con la marca completa, las piezas pasan al campo del hero en el
     mismo cuadro y desde ahí se reparten: son las mismas piezas.

  Canvas 2D, sin dependencias. Un clic o una tecla la apuran; mientras dura, la
  página no se desplaza. Si algo tarda más de la cuenta, la capa se desvanece y
  el hero arranca solo.
*/

const T_SEED = 0.3; // el cuadrado late antes de reventar
const T_SCATTER = 0.75; // cada pieza vuela a su sitio suelto
const T_RAMP = 1.05; // el frente del orden recorre la palabra
const T_LAND = 0.5; // cada pieza, de suelta a su celda
const T_HOLD = 0.24; // la marca completa respira antes del relevo
const T_MAX = 9; // sin relevo a tiempo, la capa se desvanece
const T_STEP_MAX = 4; // un paso que no termina en este tiempo deja de frenar la precarga

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const out3 = (t: number) => 1 - (1 - t) ** 3;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type Step = { key: string; label: string; done: number };

export default function Preloader() {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLElement>(null);
  const logRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!layer || !canvas || !ctx || !root.classList.contains(PRELOAD_CLASS)) return undefined;
    root.dataset.preloadTaken = '';

    const born = performance.now();
    const n = offeredField()?.n ?? fieldCount(HERO_COUNT);
    const fmt = new Intl.NumberFormat('es-CO');
    const random = rng(2026);

    // Lo que de verdad hay que esperar, con su tiempo medido.
    const steps: Step[] = [
      { key: 'fonts', label: 'tipografías', done: -1 },
      { key: 'field', label: 'campo de piezas', done: -1 },
      { key: 'page', label: 'página', done: -1 },
    ];
    const finish = (key: string) => {
      const step = steps.find((s) => s.key === key);
      if (!step || step.done >= 0) return;
      step.done = performance.now() - born;
      const row = logRef.current?.querySelector<HTMLElement>(`[data-step="${key}"]`);
      if (row) {
        row.dataset.done = 'true';
        const ms = row.querySelector('em');
        if (ms) ms.textContent = `${Math.round(step.done)} ms`;
      }
    };

    let wordmark: Wordmark | null = null;
    const fontsReady = document.fonts
      ? Promise.all([
          document.fonts.load(`650 1em ${displayFamily()}`),
          document.fonts.load(`400 1em ${getComputedStyle(root).getPropertyValue('--font-sans') || 'sans-serif'}`),
        ]).catch(() => undefined)
      : Promise.resolve();
    fontsReady.then(() => {
      finish('fonts');
      layout();
    });
    if (offeredField()) finish('field');
    const stopListening = onFieldOffered(() => finish('field'));
    const onLoad = () => finish('page');
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    // Las piezas: sitio suelto, temperamento y, cuando aterrizan, desde dónde.
    const angle = new Float32Array(n);
    const dist = new Float32Array(n);
    const phase = new Float32Array(n);
    const leave = new Float32Array(n);
    const arc = new Float32Array(n);
    const landAt = new Float32Array(n).fill(-1);
    const fromX = new Float32Array(n);
    const fromY = new Float32Array(n);
    const px = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      angle[i] = random() * Math.PI * 2;
      dist[i] = 0.12 + Math.sqrt(random()) * 0.95;
      phase[i] = random() * Math.PI * 2;
      leave[i] = random() * 0.28;
      arc[i] = random() - 0.5;
    }

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    const layout = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cx = w / 2;
      cy = h * 0.46;
      if (steps[0].done >= 0) wordmark = wordmarkPoints(n, cx, cy, Math.min(w * (w < 760 ? 0.82 : 0.66), 980));
    };
    layout();

    // Mientras dura, la página no se mueve; un clic o una tecla la apuran.
    let haste = 1;
    const hurry = () => {
      haste = 2.8;
    };
    const block = (event: Event) => event.preventDefault();
    const onKey = (event: KeyboardEvent) => {
      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Tab'].includes(event.key)) event.preventDefault();
      hurry();
    };
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    window.addEventListener('keydown', onKey);
    layer.addEventListener('pointerdown', hurry);
    window.addEventListener('resize', layout, { passive: true });

    const flying: number[] = [];
    const landed: number[] = [];
    const paint = (list: number[], size: number, style: string) => {
      if (!list.length) return;
      ctx.fillStyle = style;
      ctx.beginPath();
      for (let k = 0; k < list.length; k += 2) ctx.rect(list[k] - size / 2, list[k + 1] - size / 2, size, size);
      ctx.fill();
      list.length = 0;
    };

    let time = 0;
    let prev = 0;
    let complete = -1;
    let lastCount = '';
    let raf = 0;
    let done = false;

    const cleanup = () => {
      done = true;
      cancelAnimationFrame(raf);
      stopListening();
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', layout);
      window.removeEventListener('load', onLoad);
      layer.removeEventListener('pointerdown', hurry);
    };

    const leaveLayer = () => {
      root.classList.remove(PRELOAD_CLASS);
      if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'auto';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Sin campo a dónde pasar (tardó o la página no está arriba): la capa solo se desvanece.
    const fadeOut = () => {
      if (done) return;
      cleanup();
      layer.dataset.leaving = 'true';
      window.setTimeout(() => {
        leaveLayer();
        delete layer.dataset.leaving;
      }, 520);
    };

    const handOver = () => {
      const field = offeredField();
      if (!field || field.n !== n || window.scrollY > 4) return fadeOut();
      cleanup();
      // Mismo cuadro: el hero dibuja las piezas donde están y la capa se retira.
      field.receive(px, 0.92);
      leaveLayer();
    };

    const frame = (now: number) => {
      raf = 0;
      if (done) return;
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 1 / 60;
      prev = now;
      time += dt * haste;
      const t = time;

      // Un paso que se demora demasiado deja de frenar el orden; su fila queda con el tiempo en que se soltó.
      steps.forEach((s) => {
        if (s.done < 0 && t > T_STEP_MAX) finish(s.key);
      });
      const ready = steps.filter((s) => s.done >= 0).length / steps.length;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // El frente del orden avanza con el tiempo, pero nunca más allá de lo que ya cargó.
      const timeFront = inOut(clamp((t - T_SEED - 0.4) / T_RAMP));
      const front = wordmark ? Math.min(timeFront, ready >= 1 ? 1 : ready * 0.9) : 0;

      // La pieza inicial: late y revienta.
      const seed = clamp(t / T_SEED);
      const seedSize = 10 * (1 + 0.4 * Math.sin(seed * Math.PI)) * (1 - clamp((t - T_SEED) / 0.08));
      if (seedSize > 0.2) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(cx - seedSize / 2, cy - seedSize / 2, seedSize, seedSize);
      }

      let inOrder = 0;
      const rx = w * 0.56;
      const ry = h * 0.52;
      for (let i = 0; i < n; i++) {
        const go = clamp((t - T_SEED - leave[i]) / T_SCATTER);
        if (go <= 0) {
          px[i * 2] = cx;
          px[i * 2 + 1] = cy;
          continue;
        }
        // Suelta: deriva alrededor de su sitio, como en el lado desordenado del hero.
        const a = angle[i] + Math.sin(t * 0.4 + phase[i]) * 0.06;
        const d = dist[i] * out3(go);
        const looseX = cx + Math.cos(a) * rx * d + Math.sin(t * 0.9 + phase[i]) * 6;
        const looseY = cy + Math.sin(a) * ry * d + Math.cos(t * 0.7 + phase[i] * 1.3) * 5;
        if (wordmark && landAt[i] < 0 && go >= 0.6 && front >= wordmark.turn[i]) {
          landAt[i] = t;
          fromX[i] = looseX;
          fromY[i] = looseY;
        }
        if (!wordmark || landAt[i] < 0) {
          px[i * 2] = looseX;
          px[i * 2 + 1] = looseY;
          flying.push(looseX, looseY);
          continue;
        }
        const tx = wordmark.points[i * 2];
        const ty = wordmark.points[i * 2 + 1];
        const v = clamp((t - landAt[i]) / T_LAND);
        if (v >= 1) {
          inOrder += 1;
          px[i * 2] = tx;
          px[i * 2 + 1] = ty;
          landed.push(tx, ty);
          continue;
        }
        // Cada pieza llega en un arco propio y se encaja en su celda.
        const e = inOut(v);
        const dx = tx - fromX[i];
        const dy = ty - fromY[i];
        const bend = Math.sin(Math.PI * e) * arc[i] * 0.3;
        const x = fromX[i] + dx * e - dy * bend;
        const y = fromY[i] + dy * e + dx * bend;
        px[i * 2] = x;
        px[i * 2 + 1] = y;
        flying.push(x, y);
      }
      paint(flying, 2, 'rgba(255, 255, 255, 0.58)');
      paint(landed, 2.1, 'rgba(255, 255, 255, 0.92)');

      const text = fmt.format(inOrder);
      if (text !== lastCount && countRef.current) {
        countRef.current.textContent = text;
        lastCount = text;
      }

      if (inOrder === n && complete < 0) complete = t;
      if (complete >= 0 && t - complete >= T_HOLD) return handOver();
      if (t > T_MAX) return fadeOut();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Al desmontar solo se detiene: en desarrollo React monta dos veces y la segunda retoma la capa.
    return () => {
      if (!done) cleanup();
    };
  }, []);

  return (
    <div ref={layerRef} className="preloader" aria-hidden="true">
      <span className="preloader-seed" />
      <canvas ref={canvasRef} className="preloader-canvas" />
      <div className="preloader-hud">
        <p className="preloader-count">
          <strong ref={countRef} className="tabular">
            0
          </strong>
          <span className="mono">piezas en orden</span>
        </p>
        <ol ref={logRef} className="preloader-log mono">
          <li data-step="fonts">
            <span>tipografías</span>
            <em>…</em>
          </li>
          <li data-step="field">
            <span>campo de piezas</span>
            <em>…</em>
          </li>
          <li data-step="page">
            <span>página</span>
            <em>…</em>
          </li>
        </ol>
      </div>
    </div>
  );
}
