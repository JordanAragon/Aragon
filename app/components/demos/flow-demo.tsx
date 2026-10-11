'use client';

import { useEffect, useState } from 'react';

/*
  Demo de automatización: un pedido entra por WhatsApp y el flujo lo lleva al
  sistema, a la bodega y al reporte. A la derecha, el registro de cada ejecución.
*/

const STEPS = [
  { node: 'WhatsApp', log: 'Mensaje recibido: «2 cajas de café para mañana»' },
  { node: 'Entender', log: 'Pedido leído: 2 × Café molido 500 g · entrega mañana' },
  { node: 'Base de datos', log: 'Pedido #1043 guardado y asignado a la ruta Norte' },
  { node: 'Bodega', log: 'Aviso enviado a bodega: alistar pedido #1043' },
  { node: 'Cliente', log: 'Confirmación enviada al cliente por WhatsApp' },
];

export default function FlowDemo({ running = true }: { running?: boolean }) {
  const [step, setStep] = useState(0);
  const [runs, setRuns] = useState(1);

  useEffect(() => {
    if (!running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = window.setTimeout(() => setStep(STEPS.length), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setInterval(() => {
      setStep((value) => {
        if (value >= STEPS.length + 1) {
          setRuns((r) => r + 1);
          return 0;
        }
        return value + 1;
      });
    }, 1100);
    return () => window.clearInterval(id);
  }, [running]);

  const done = step >= STEPS.length;

  return (
    <div className="demo-flow">
      <ol className="demo-flow-nodes" aria-label="Pasos del flujo">
        {STEPS.map((s, i) => (
          <li key={s.node} data-state={i < step || done ? 'done' : i === step ? 'active' : 'wait'}>
            <span className="demo-flow-dot" aria-hidden="true" />
            <span>{s.node}</span>
          </li>
        ))}
      </ol>
      <div className="demo-flow-log" role="log" aria-live="off">
        <div className="demo-flow-log-head mono">
          <span>ejecución #{String(311 + runs).padStart(4, '0')}</span>
          <span>{done ? 'completada' : 'en curso'}</span>
        </div>
        <ul>
          {STEPS.slice(0, Math.min(step + 1, STEPS.length)).map((s, i) => (
            <li key={s.log} className="mono" data-state={i < step || done ? 'done' : 'active'}>
              <span aria-hidden="true">{i < step || done ? '✓' : '›'}</span>
              {s.log}
            </li>
          ))}
        </ul>
        <p className="demo-flow-foot mono">{done ? 'Sin intervención humana. Si un paso falla, el equipo recibe el aviso con el caso.' : 'Procesando…'}</p>
      </div>
    </div>
  );
}
