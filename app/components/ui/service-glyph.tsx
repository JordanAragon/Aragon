import type { Service } from '../../data/services';

/*
  Una figura mínima por servicio, que explica qué hace con su movimiento:
  - conversación: llega una pregunta y el agente escribe la respuesta (agentes de IA);
  - flujo: un dato viaja de una herramienta a otra pasando por el centro (automatización);
  - tabla: los registros llegan a su fila (software a la medida).
  Solo se mueve dentro de un contenedor con `data-glyphs="on"` y sin movimiento reducido.
*/
export default function ServiceGlyph({ forma }: { forma: Service['forma'] }) {
  return (
    <svg className="service-glyph" data-forma={forma} viewBox="0 0 64 44" aria-hidden="true">
      {forma === 'tabla' &&
        [0, 1, 2, 3].map((r) => (
          <g key={r} className="sg-row" style={{ '--r': r } as React.CSSProperties}>
            <rect x="4" y={5 + r * 9.5} width="6" height="6" />
            <rect x="14" y={7 + r * 9.5} width={[38, 28, 44, 22][r]} height="2" className="sg-soft" />
          </g>
        ))}
      {forma === 'flujo' && (
        <>
          <path d="M11 11 C 22 11, 22 22, 32 22 M11 33 C 22 33, 22 22, 32 22 M32 22 H 53" className="sg-line" />
          <rect x="4" y="7" width="8" height="8" />
          <rect x="4" y="29" width="8" height="8" />
          <rect x="28" y="18" width="8" height="8" />
          <rect x="52" y="18" width="8" height="8" />
          <circle cx="0" cy="0" r="2.2" className="sg-dot" />
        </>
      )}
      {forma === 'conversacion' && (
        <>
          <rect x="4" y="5" width="34" height="12" rx="4" className="sg-outline" />
          <rect x="9" y="10" width="22" height="2" className="sg-soft" />
          <rect x="22" y="23" width="38" height="16" rx="4" className="sg-outline" />
          <g className="sg-typing">
            <rect x="33" y="30" width="3" height="3" />
            <rect x="39" y="30" width="3" height="3" />
            <rect x="45" y="30" width="3" height="3" />
          </g>
          <g className="sg-answer">
            <rect x="27" y="28" width="28" height="2" />
            <rect x="27" y="33" width="18" height="2" />
          </g>
        </>
      )}
    </svg>
  );
}
