'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import ParticleCanvas from '../field/particle-canvas';
import type { ParticleSim } from '../field/sim';
import { heroInterface } from '../field/shapes';
import { services } from '../../data/services';
import { ArrowRight } from '../ui/icons';

const WORDS = ['pedidos', 'citas', 'clientes', 'ventas', 'reportes', 'procesos'];

/*
  El campo del hero cuenta la idea de Aragon: a la izquierda las piezas de un
  negocio flotan sueltas; a la derecha ya encontraron su lugar en la retícula.
  Al cargar, el frente del orden barre de derecha a izquierda; el cursor ordena
  lo que toca.
*/
function setupHero(sim: ParticleSim) {
  let home = new Float32Array(sim.n * 2);
  let ui = new Float32Array(sim.n);
  let gap = 14;
  const phase = new Float32Array(sim.n);
  for (let i = 0; i < sim.n; i++) phase[i] = sim.random() * Math.PI * 2;
  const start = sim.time;
  sim.stiffness = 0.06;
  sim.damping = 0.78;
  sim.jitter = 0;
  sim.pointerRadius = 130;
  sim.baseSize = 2.1;

  sim.updater = (s, time) => {
    const w = s.width;
    const intro = Math.min(1, (time - start) / 2.4);
    const eased = 1 - Math.pow(1 - intro, 3);
    // El borde del orden: viaja desde fuera de la derecha hasta el 46 % del ancho.
    const edge = w * (1.08 - 0.62 * eased);
    const soft = w * 0.2;
    for (let i = 0; i < s.n; i++) {
      const hx = home[i * 2];
      const hy = home[i * 2 + 1];
      const t = (hx - edge) / soft;
      const o = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
      const amp = (1 - o) * gap * 3.2;
      const ph = phase[i];
      const cx = hx + Math.sin(time * 0.35 + ph) * amp + Math.sin(time * 0.13 + ph * 2) * amp * 0.8;
      const cy = hy + Math.cos(time * 0.29 + ph * 1.3) * amp * 0.8;
      s.tx[i] = cx;
      s.ty[i] = cy;
      // Ya ordenadas, las piezas dibujan una interfaz: el software que aparece cuando hay orden.
      s.targetAlpha[i] = 0.24 * (1 - o) + o * (0.1 + ui[i] * 0.86);
      s.size[i] = 1 + o * ui[i] * 0.5;
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
    const id = window.setInterval(() => setIndex((value) => (value + 1) % WORDS.length), 2200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const el = measureRef.current?.children[index] as HTMLElement | undefined;
    if (el) setWidth(el.getBoundingClientRect().width);
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

export default function Hero() {
  const frameRef = useRef<HTMLElement>(null);
  const setup = useCallback((sim: ParticleSim) => setupHero(sim), []);

  return (
    <section ref={frameRef} className="hero night" data-tone="night" aria-labelledby="hero-title">
      <ParticleCanvas className="hero-field" count={3800} seed={7} setup={setup} pointerTarget={frameRef} />
      <div className="hero-veil" aria-hidden="true" />
      <div className="shell hero-inner">
        <p className="hero-kicker">
          <span className="chip chip-live">Estudio de software en Cali, Colombia</span>
        </p>
        <h1 id="hero-title" className="hero-title">
          Ponemos en orden tus <RotatingWord /> con software a la medida.
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
        <p className="hero-hint" aria-hidden="true">
          Pasa el cursor por las piezas sueltas: así se ve el orden.
        </p>
      </div>
      <nav className="hero-services shell" aria-label="Servicios">
        {services.map((s) => (
          <Link key={s.slug} href={`/servicios/${s.slug}`} className="hero-service">
            <span className="hero-service-verb mono">{s.verb.toLowerCase()}</span>
            <span className="hero-service-name">{s.name}</span>
            <ArrowRight className="hero-service-arrow" />
          </Link>
        ))}
      </nav>
    </section>
  );
}
