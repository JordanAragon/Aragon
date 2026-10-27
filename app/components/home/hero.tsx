'use client';

import Link from 'next/link';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import ParticleCanvas from '../field/particle-canvas';
import type { ParticleSim } from '../field/sim';
import type { HeroApp } from '../field/shapes';
import { HERO_COUNT } from '../field/relay';
import { STATES, setupHeroSystem, type HeroCounts, type HeroHud, type HeroRow } from './hero-system';
import { services } from '../../data/services';
import { ArrowRight } from '../ui/icons';

const WORDS = ['pedidos', 'citas', 'mensajes', 'ventas', 'reportes', 'procesos'];

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

/*
  La app del hero, en HTML sobre las piezas que la dibujan: la barra lateral,
  la cabecera, las cuentas y las filas de los pedidos que llegan. Así se lee
  qué está haciendo el campo: poner en orden lo que entra.
*/
function AppLayer({ app, rows, counts }: { app: HeroApp; rows: HeroRow[]; counts: HeroCounts }) {
  const cards = [
    { label: 'pedidos hoy', value: counts.arrived },
    { label: 'en ruta', value: counts.route },
    { label: 'entregados', value: counts.done },
  ];
  return (
    <div className="hero-app" aria-hidden="true">
      <div className="hero-app-side" style={{ left: app.sidebar.x, top: app.sidebar.y, width: app.sidebar.w }}>
        <span className="hero-app-brand">
          <i />
          distribuidora
        </span>
        {['Pedidos', 'Clientes', 'Inventario', 'Rutas', 'Reportes'].map((item, i) => (
          <span key={item} className="hero-app-nav" data-active={i === 0}>
            {item}
          </span>
        ))}
      </div>
      <div className="hero-app-head" style={{ left: app.header.x, top: app.header.y, width: app.header.w, height: app.header.h }}>
        <strong>Pedidos de hoy</strong>
        <span className="mono">datos de ejemplo</span>
      </div>
      {app.cards.map((c, i) => (
        <div key={cards[i].label} className="hero-app-card" style={{ left: c.x, top: c.y, width: c.w, height: c.h }}>
          <span className="mono">{cards[i].label}</span>
          <strong className="tabular" key={cards[i].value}>
            {cards[i].value}
          </strong>
        </div>
      ))}
      {rows.map((r) => {
        const slot = app.rows[Math.min(app.rows.length - 1, r.slot)];
        // El que sale baja una fila más mientras se apaga, como su cuadrado.
        const y = app.tableY + r.slot * app.rowH;
        return (
          <div
            key={r.id}
            className="hero-app-row"
            data-leaving={r.leaving}
            style={{ left: slot.x + app.square + 14, width: slot.w - app.square - 14, height: slot.h, transform: `translateY(${y}px)` }}
          >
            <span className="hero-app-row-main">
              <span className="mono tabular">{r.order}</span> {r.client}
            </span>
            <span className="hero-app-row-meta mono">
              <span className="hero-app-row-source">{r.source}</span>
              <span className="hero-app-row-state" data-state={r.state}>
                {STATES[r.state]}
              </span>
            </span>
          </div>
        );
      })}
      <p className="hero-legend mono" style={{ left: app.header.x, top: app.y1 + 18, width: app.header.w }}>
        <i />
        <span>
          Cada cuadrado es un pedido que llegó suelto y quedó en orden. <span className="hero-legend-hint">Pasa el cursor por las piezas sueltas: entran al sistema.</span>
        </span>
      </p>
    </div>
  );
}

export default function Hero() {
  const frameRef = useRef<HTMLElement>(null);
  const [app, setApp] = useState<HeroApp | null>(null);
  const [rows, setRows] = useState<HeroRow[]>([]);
  const [counts, setCounts] = useState<HeroCounts>({ arrived: 0, route: 0, done: 0 });
  const hudRef = useRef<HeroHud>({
    exit: 0,
    onLayout: (next) => setApp(next),
    onRows: (nextRows, nextCounts) => {
      setRows(nextRows);
      setCounts(nextCounts);
    },
  });

  useEffect(() => {
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
    };
  }, []);

  const setup = useCallback(
    (sim: ParticleSim) => setupHeroSystem(sim, hudRef.current, window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    [],
  );

  return (
    <section ref={frameRef} className="hero night" data-tone="night" aria-labelledby="hero-title">
      <ParticleCanvas className="hero-field" count={HERO_COUNT} seed={7} setup={setup} pointerTarget={frameRef} relay />
      <div className="hero-veil" aria-hidden="true" />
      {app && !app.narrow && <AppLayer app={app} rows={rows} counts={counts} />}
      <div className="shell hero-inner">
        <p className="hero-kicker">
          <span className="chip chip-live">Agencia de automatización e IA · Cali</span>
          <span className="chip chip-dot">Prototipos en 48 horas</span>
        </p>
        {/* Líneas fijas: la palabra que rota cambia de ancho sin mover el resto del titular. */}
        <h1 id="hero-title" className="hero-title">
          <span className="hl">
            <Words text="Automatizamos" from={0} />
          </span>
          <span className="hl">
            <Words text="tus" from={1} />
            <span className="hw hw-rotator" style={{ '--i': 2 } as React.CSSProperties}>
              <span>
                <RotatingWord />
              </span>
            </span>{' '}
          </span>
          <span className="hl">
            <Words text="con IA." from={3} />
          </span>
        </h1>
        <p className="hero-lead">
          Agentes de IA que atienden tu WhatsApp, automatizaciones que eliminan el trabajo manual y software a la medida sobre infraestructura web de alta velocidad. Aprobado el alcance, ves un prototipo funcionando en 48 horas.
        </p>
        <div className="hero-ctas">
          <Link href="/contacto" className="btn btn-primary btn-lg">
            Agendar una llamada <ArrowRight className="arrow" />
          </Link>
          <Link href="/#del-desorden-al-sistema" className="btn btn-ghost btn-lg">
            Ver cómo lo hacemos
          </Link>
        </div>
        <p className="hero-legend hero-legend-inline mono" aria-hidden="true">
          <i />
          Cada cuadrado es un pedido que llegó suelto y quedó en orden.
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
