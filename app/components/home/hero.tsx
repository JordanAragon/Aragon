'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import HeroStage, { type HeroTask } from '../hero/hero-stage';
import { services } from '../../data/services';
import { calUrl, site } from '../../data/site';
import { ArrowRight } from '../ui/icons';

/*
  El hero: un solo punto de atención en el centro.

  La A de Aragon está hecha de piezas en orden: es el sistema. Por la izquierda
  entran tareas sueltas (un mensaje sin responder, un pedido en un cuaderno);
  al tocar la A cambian de lugar con otras piezas, que salen por la derecha en
  fila y en color de señal: la misma tarea, resuelta. El titular dice eso
  mismo en dos golpes, a lado y lado de la A.
*/

const TASKS: HeroTask[] = [
  { in: 'mensaje de WhatsApp sin responder · 11:48 p. m.', out: 'respondido por el agente' },
  { in: 'pedido anotado en un cuaderno', out: 'pedido registrado' },
  { in: 'cotización pendiente desde el lunes', out: 'cotización enviada' },
  { in: 'factura en PDF por digitar', out: 'factura leída y guardada' },
  { in: 'cita por confirmar', out: 'cita confirmada' },
  { in: 'inventario contado a mano', out: 'inventario al día' },
  { in: 'reporte armado en Excel cada viernes', out: 'reporte listo sin tocarlo' },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState(0);
  const fmt = (n: number) => String(n).padStart(2, '0');

  return (
    <section ref={sectionRef} className="hero" data-tone="paper" aria-labelledby="hero-title">
      <p className="hero-word" aria-hidden="true">
        ARAGON
      </p>

      <div className="hero-top shell">
        <h1 id="hero-title" className="hero-title">
          <span className="hero-title-a">Del desorden</span> <span className="hero-title-b">al sistema.</span>
        </h1>

        <dl className="hero-meta hero-meta-left">
          <div>
            <dt>agencia</dt>
            <dd>automatización e IA</dd>
          </div>
          <div>
            <dt>desde</dt>
            <dd>{site.location}</dd>
          </div>
          <div>
            <dt>para</dt>
            <dd>Colombia y Estados Unidos</dd>
          </div>
        </dl>

        <nav className="hero-meta hero-meta-right" aria-label="Servicios">
          {services.map((s) => (
            <Link key={s.slug} href={`/servicios/${s.slug}`}>
              <span className="tabular">{s.index}</span>
              {s.name}
            </Link>
          ))}
        </nav>
      </div>


      {/* En el teléfono la A ocupa este hueco entre el titular y el texto. */}
      <div ref={slotRef} className="hero-a-slot" aria-hidden="true" />

      <div className="hero-bottom shell">
        <div className="hero-copy">
          <p className="hero-lead">
            Somos una agencia de automatización e inteligencia artificial. Construimos agentes que atienden tu WhatsApp, automatizaciones y software a la medida para que lo que hoy se hace a mano se haga solo.
          </p>
          <div className="hero-links">
            <a className="text-link" href={site.whatsapp} target="_blank" rel="noreferrer">
              Escríbenos por WhatsApp <ArrowRight className="arrow" />
            </a>
            <Link className="text-link" href="/trabajo">
              Ver el trabajo <ArrowRight className="arrow" />
            </Link>
          </div>
        </div>

        <div className="hero-proof">
          <p className="hero-proof-number">
            48<span>h</span>
          </p>
          <p className="hero-proof-text">del alcance aprobado al prototipo funcionando</p>
        </div>
      </div>

      <HeroStage tasks={TASKS} pointerTarget={sectionRef} onResolved={setResolved} anchor={slotRef}>
        <div className="hero-center">
          <a className="hero-cta" href={calUrl} target="_blank" rel="noreferrer">
            Agenda 30 minutos
            <span className="hero-cta-plus" aria-hidden="true" />
          </a>
        </div>
        <p className="hero-legend mono" aria-hidden="true">
          <span className="hero-legend-in">
            <i /> cada pieza es una tarea · entra suelta
          </span>
          <span className="hero-legend-out">
            sale resuelta <b className="tabular">{fmt(resolved)}</b>
          </span>
        </p>
      </HeroStage>
    </section>
  );
}
