'use client';

import { useEffect, useRef, useState } from 'react';

/*
  Demo de agente: responde con una base de preguntas de ejemplo y muestra de
  dónde sacó la respuesta. El tiempo de la traza es el que de verdad tardó la
  búsqueda en tu navegador, medido con performance.now().
*/

type Entry = { q: string; keys: string[]; a: string; source: string };

const KB: Entry[] = [
  { q: '¿Tienen domicilio a Jamundí?', keys: ['domicilio', 'jamundí', 'envío', 'jamundi'], a: 'Sí. Los domicilios a Jamundí salen de lunes a sábado en la ruta de la tarde. Si el pedido entra antes de las 12 m., llega el mismo día.', source: 'Política de envíos' },
  { q: '¿Dónde va mi pedido?', keys: ['pedido', 'dónde', 'estado', 'va'], a: 'Tu pedido #1043 está en bodega, listo para salir en la ruta Norte. Te escribo cuando esté en camino.', source: 'Sistema de pedidos' },
  { q: '¿A qué hora abren?', keys: ['hora', 'abren', 'horario'], a: 'Atendemos de lunes a viernes de 7 a. m. a 6 p. m. y los sábados hasta la 1 p. m. Por aquí respondo a cualquier hora.', source: 'Información del negocio' },
  { q: 'Quiero hablar con una persona', keys: ['hablar', 'persona', 'alguien', 'asesor'], a: 'Listo. Le paso la conversación a alguien del equipo con todo lo que hablamos. Te responde en el horario de atención.', source: 'Regla: pasar a una persona' },
];

/** Busca la respuesta y mide cuánto tardó la búsqueda de verdad. */
function lookup(entry: Entry) {
  const t0 = performance.now();
  const q = entry.q.toLowerCase();
  let best = KB[0];
  let score = -1;
  let read = 0;
  for (const item of KB) {
    read += 1;
    const s = item.keys.filter((k) => q.includes(k)).length;
    if (s > score) {
      score = s;
      best = item;
    }
  }
  return { best, read, ms: performance.now() - t0 };
}

type Message = { from: 'me' | 'bot'; text: string; trace?: string; typing?: boolean };

export default function AgentDemo() {
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: 'Hola. Soy el asistente de la distribuidora. Pregúntame por pedidos, horarios o domicilios.' }]);
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  const ask = (entry: Entry) => {
    if (busy) return;
    setBusy(true);
    const { best, read, ms } = lookup(entry);
    const trace = `leyó: ${best.source.toLowerCase()} · ${read} fuentes revisadas · ${ms.toFixed(2).replace('.', ',')} ms`;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setMessages((list) => [...list, { from: 'me', text: entry.q }, { from: 'bot', text: '', typing: true }]);
    if (reduced) {
      setMessages((list) => [...list.slice(0, -1), { from: 'bot', text: best.a, trace }]);
      setBusy(false);
      return;
    }
    const words = best.a.split(' ');
    timers.current.push(
      window.setTimeout(() => {
        let k = 0;
        const typeNext = () => {
          k += 1;
          const done = k >= words.length;
          setMessages((list) => [...list.slice(0, -1), { from: 'bot', text: words.slice(0, k).join(' '), trace: done ? trace : undefined, typing: !done }]);
          if (!done) timers.current.push(window.setTimeout(typeNext, 45));
          else setBusy(false);
        };
        typeNext();
      }, 650),
    );
  };

  return (
    <div className="demo-agent">
      <div className="demo-agent-log" ref={logRef} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className="demo-msg" data-from={m.from}>
            {m.typing && !m.text ? (
              <span className="demo-typing" aria-label="Escribiendo">
                <i />
                <i />
                <i />
              </span>
            ) : (
              <>
                {m.text}
                {m.typing && <span className="demo-caret" aria-hidden="true" />}
              </>
            )}
            {m.trace && <span className="demo-trace mono">{m.trace}</span>}
          </div>
        ))}
      </div>
      <div className="demo-agent-asks">
        {KB.map((entry) => (
          <button key={entry.q} type="button" onClick={() => ask(entry)} disabled={busy}>
            {entry.q}
          </button>
        ))}
      </div>
    </div>
  );
}
