'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import HeroField from '../hero/hero-field';
import { site } from '../../data/site';
import { ArrowRight } from '../ui/icons';

/*
  El hero: una palabra enorme en el centro, hecha de piezas.

  Lo que un negocio hace a mano (pedidos, citas, mensajes…) flota suelto por la
  pantalla. Una línea barre la palabra y cada pieza vuela a su lugar: el
  sistema poniendo en orden. La palabra se sostiene, sale por la derecha ya
  resuelta y entra la siguiente. El titular se lee en Z: «Automatizamos tus»
  arriba a la izquierda, la palabra al centro, «con inteligencia artificial.»
  abajo a la derecha, y la acción justo debajo.
*/

const WORDS = ['pedidos', 'citas', 'mensajes', 'ventas', 'reportes', 'facturas'];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const onWord = useCallback((i: number) => setIndex(i), []);
  const fmt = (n: number) => String(n).padStart(2, '0');

  return (
    <section ref={sectionRef} className="hero" data-tone="night" aria-labelledby="hero-title">
      <HeroField words={WORDS} sectionRef={sectionRef} slotRef={slotRef} countRef={countRef} onWord={onWord} />

      <div className="hero-top shell">
        <h1 id="hero-title" className="hero-title">
          <span className="hero-l1">Automatizamos tus</span>
          <span className="sr-only"> pedidos, citas, mensajes y reportes con inteligencia artificial.</span>
        </h1>

        <div className="hero-proof">
          <p className="hero-proof-number">
            48<span>h</span>
          </p>
          <p className="hero-proof-text">del alcance aprobado al prototipo funcionando</p>
        </div>
      </div>

      <div ref={slotRef} className="hero-slot" aria-hidden="true">
        <span className="hero-reg hero-reg-tl" />
        <span className="hero-reg hero-reg-tr" />
        <span className="hero-reg hero-reg-bl" />
        <span className="hero-reg hero-reg-br" />
        <p className="hero-hud mono">
          <span>
            <b className="tabular">{fmt(index + 1)}</b> / {fmt(WORDS.length)} · {WORDS[index]}
          </span>
          <span>
            piezas en orden <b ref={countRef} className="tabular">0</b>
          </span>
        </p>
      </div>

      <div className="hero-bottom shell">
        <div className="hero-copy">
          <p className="hero-lead">
            Agencia de automatización e inteligencia artificial para negocios de Colombia y Estados Unidos. Agentes que atienden tu WhatsApp, automatizaciones y software a la medida: lo que hoy se hace a mano, hecho solo.
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

        <div className="hero-end">
          <p className="hero-l3" aria-hidden="true">
            con inteligencia artificial.
          </p>
          <a className="btn btn-primary btn-lg hero-cta" href="#contacto">
            Agenda 30 minutos <ArrowRight className="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
