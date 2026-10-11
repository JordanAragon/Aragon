'use client';

import Link from 'next/link';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import ParticleCanvas from '../field/particle-canvas';
import type { ParticleSim } from '../field/sim';
import { heroInterface } from '../field/shapes';
import { HERO_COUNT } from '../field/relay';
import { services } from '../../data/services';
import { ArrowRight } from '../ui/icons';

const WORDS = ['pedidos', 'citas', 'clientes', 'ventas', 'reportes', 'procesos'];

type Hud = {
  /** 0 arriba del todo, 1 cuando el hero salió de la pantalla. */
  exit: number;
  onCount: (ordered: number, total: number) => void;
};

/*
  El campo del hero cuenta la idea de Aragon: a la izquierda las piezas de un
  negocio flotan sueltas; a la derecha ya encontraron su lugar en la retícula y
  dibujan una interfaz. Al cargar, el frente del orden barre de derecha a
  izquierda. Lo que el cursor toca queda en orden (y se cuenta); al bajar, el
  frente termina de ordenar todo antes de llegar al problema.
*/
function setupHero(sim: ParticleSim, hud: Hud) {
  let home = new Float32Array(sim.n * 2);
  let ui = new Float32Array(sim.n);
  let gap = 14;
  const phase = new Float32Array(sim.n);
  // Orden que dejó el cursor (0–1, sube suave) y el destello de cuando una pieza encaja.
  const touched = new Float32Array(sim.n);
  const flash = new Float32Array(sim.n);
  for (let i = 0; i < sim.n; i++) phase[i] = sim.random() * Math.PI * 2;
  sim.stiffness = 0.06;
  sim.damping = 0.78;
  sim.jitter = 0;
  sim.pointerRadius = 130;
  sim.baseSize = 2.1;
  let start = -1;
  let lastReport = -1;

  sim.updater = (s, time, dt) => {
    // La entrada empieza en el primer cuadro que corre (con precarga, al recibir las piezas).
    if (start < 0) start = time;
    const w = s.width;
    const intro = Math.min(1, (time - start) / 2.4);
    const eased = 1 - Math.pow(1 - intro, 3);
    // El borde del orden: entra por la derecha hasta el 46 % del ancho; al bajar, sigue hasta el borde izquierdo.
    const exit = Math.min(1, Math.max(0, hud.exit));
    const edge = w * (1.08 - 0.62 * eased) - w * 0.7 * exit * exit * (3 - 2 * exit);
    const soft = w * 0.2;
    const p = s.pointer;
    const R2 = s.pointerRadius * s.pointerRadius * 0.55;
    const grow = Math.min(1, dt * 3.2);
    const fade = Math.min(1, dt * 2.4);
    let ordered = 0;
    for (let i = 0; i < s.n; i++) {
      const hx = home[i * 2];
      const hy = home[i * 2 + 1];
      if (p.active && touched[i] === 0) {
        const dx = s.x[i] - p.x;
        const dy = s.y[i] - p.y;
        if (dx * dx + dy * dy < R2) {
          touched[i] = 0.0001;
          flash[i] = 1;
        }
      }
      if (touched[i] > 0 && touched[i] < 1) touched[i] = Math.min(1, touched[i] + grow * (1.02 - touched[i]));
      if (flash[i] > 0) flash[i] = Math.max(0, flash[i] - fade);
      const t = (hx - edge) / soft;
      const front = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
      const o = Math.max(front, touched[i]);
      if (o > 0.5) ordered++;
      const amp = (1 - o) * gap * 3.2;
      const ph = phase[i];
      s.tx[i] = hx + Math.sin(time * 0.35 + ph) * amp + Math.sin(time * 0.13 + ph * 2) * amp * 0.8;
      s.ty[i] = hy + Math.cos(time * 0.29 + ph * 1.3) * amp * 0.8;
      // Ya ordenadas, las piezas dibujan una interfaz; fuera de ella quedan como una retícula tenue.
      const rest = ui[i] ? 0.1 + ui[i] * 0.86 : 0.17;
      s.targetAlpha[i] = 0.24 * (1 - o) + o * rest + flash[i] * 0.7;
      s.size[i] = 1 + o * ui[i] * 0.5 + flash[i] * 0.35;
    }
    if (ordered !== lastReport) {
      lastReport = ordered;
      hud.onCount(ordered, s.n);
    }
  };

  return (w: number, h: number) => {
    gap = Math.max(10, Math.sqrt((w * h) / sim.n));
    sim.gridSize = gap;
    const cols = Math.max(1, Math.floor(w / gap));
    home = new Float32Array(sim.n * 2);
    for (let i = 0; i < sim.n; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      home[i * 2] = (c + 0.5) * (w / cols);
      home[i * 2 + 1] = (r + 0.5) * gap;
    }
    const rects = heroInterface(w, h);
    ui = new Float32Array(sim.n);
    for (let i = 0; i < sim.n; i++) {
      const x = home[i * 2];
      const y = home[i * 2 + 1];
      ui[i] = rects.some((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) ? 1 : 0;
    }
    if (sim.time === 0) sim.scatter(w * 0.8, h * 0.5, Math.max(w, h));
  };
}

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let id = 0;
    const tick = () => {
      // Mientras la precarga corre, la palabra no cambia: el titular todavía no se ve.
      if (!document.documentElement.classList.contains('is-preloading')) setIndex((value) => (value + 1) % WORDS.length);
    };
    id = window.setInterval(tick, 2400);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const measure = () => {
      // offsetWidth no se deja engañar por la escala de la entrada del titular.
      const el = measureRef.current?.children[index] as HTMLElement | undefined;
      if (el) setWidth(el.offsetWidth);
    };
    measure();
    // La medida cambia cuando llega la tipografía y cuando cambia el tamaño del titular.
    document.fonts?.ready.then(measure).catch(() => undefined);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [index]);

  return (
    <span className="rotator" style={width ? { width } : undefined}>
      <span className="rotator-measure" ref={measureRef} aria-hidden="true">
        {WORDS.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </span>
      <span className="rotator-track" aria-hidden="true">
        {WORDS.map((word, i) => (
          <span key={word} className="rotator-word" data-state={i === index ? 'in' : i === (index - 1 + WORDS.length) % WORDS.length ? 'out' : 'wait'}>
            {word}
          </span>
        ))}
      </span>
      <span className="sr-only">procesos</span>
    </span>
  );
}

/** Palabras del titular: cada una sube desde su propia línea, en cascada. El texto sigue siendo texto. */
function Words({ text, from }: { text: string; from: number }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="hw" style={{ '--i': from + i } as React.CSSProperties}>
        <span>{word}</span>
      </span>{' '}
    </Fragment>
  ));
}

export default function Hero() {
  const frameRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const hudRef = useRef<Hud>({ exit: 0, onCount: () => undefined });
  const fmt = useRef<Intl.NumberFormat | null>(null);

  useEffect(() => {
    fmt.current = new Intl.NumberFormat('es-CO');
    let lastText = '';
    let pending = 0;
    let latest = 0;
    let total = 0;
    // La cuenta se escribe a lo sumo diez veces por segundo: se lee, no parpadea.
    hudRef.current.onCount = (ordered, n) => {
      latest = ordered;
      if (n !== total && totalRef.current) {
        // En el teléfono el campo tiene menos piezas: el total dice las que hay.
        total = n;
        totalRef.current.textContent = `/ ${fmt.current?.format(n) ?? n}`;
      }
      if (pending) return;
      pending = window.setTimeout(() => {
        pending = 0;
        const text = fmt.current?.format(latest) ?? String(latest);
        if (text !== lastText && countRef.current) {
          countRef.current.textContent = text;
          lastText = text;
        }
      }, 100);
    };

    const frame = frameRef.current;
    if (!frame) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = frame.offsetHeight || 1;
      const exit = Math.min(1, Math.max(0, window.scrollY / (h * 0.8)));
      hudRef.current.exit = exit;
      if (!reduced) frame.style.setProperty('--exit', exit.toFixed(4));
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
      if (pending) window.clearTimeout(pending);
    };
  }, []);

  const setup = useCallback((sim: ParticleSim) => setupHero(sim, hudRef.current), []);

  return (
    <section ref={frameRef} className="hero night" data-tone="night" aria-labelledby="hero-title">
      <ParticleCanvas className="hero-field" count={HERO_COUNT} seed={7} setup={setup} pointerTarget={frameRef} relay />
      <div className="hero-veil" aria-hidden="true" />
      <div className="shell hero-inner">
        <p className="hero-kicker">
          <span className="chip chip-live">Estudio de software en Cali, Colombia</span>
        </p>
        {/* Líneas fijas: la palabra que rota cambia de ancho sin mover el resto del titular. */}
        <h1 id="hero-title" className="hero-title">
          <span className="hl">
            <Words text="Ponemos en" from={0} />
          </span>
          <span className="hl">
            <Words text="orden tus" from={2} />
            <span className="hw hw-rotator" style={{ '--i': 4 } as React.CSSProperties}>
              <span>
                <RotatingWord />
              </span>
            </span>{' '}
          </span>
          <span className="hl">
            <Words text="con software" from={5} />
          </span>
          <span className="hl">
            <Words text="a la medida." from={7} />
          </span>
        </h1>
        <p className="hero-lead">
          Diseñamos y construimos apps web, automatizaciones y agentes de IA para negocios que crecieron con WhatsApp, libretas y hojas de cálculo.
        </p>
        <div className="hero-ctas">
          <Link href="/contacto" className="btn btn-primary btn-lg">
            Agendar una llamada <ArrowRight className="arrow" />
          </Link>
          <Link href="/#del-desorden-al-sistema" className="btn btn-ghost btn-lg">
            Ver cómo lo hacemos
          </Link>
        </div>
        <p className="hero-readout" aria-hidden="true">
          <span className="hero-readout-count">
            <strong ref={countRef} className="tabular">
              0
            </strong>
            <span ref={totalRef} className="mono tabular">
              / {HERO_COUNT.toLocaleString('es-CO')}
            </span>
          </span>
          <span className="hero-readout-label mono">
            piezas en orden
            <span className="hero-readout-hint"> · pasa el cursor por las sueltas</span>
            <span className="hero-readout-hint-touch"> · baja para ordenarlas</span>
          </span>
        </p>
      </div>
      <nav className="hero-services shell" aria-label="Servicios">
        {services.map((s, i) => (
          <Link key={s.slug} href={`/servicios/${s.slug}`} className="hero-service" style={{ '--i': i } as React.CSSProperties}>
            <span className="hero-service-verb mono">
              <span className="tabular">{String(i + 1).padStart(2, '0')}</span> {s.verb.toLowerCase()}
            </span>
            <span className="hero-service-name">{s.name}</span>
            <ArrowRight className="hero-service-arrow" />
          </Link>
        ))}
      </nav>
    </section>
  );
}
