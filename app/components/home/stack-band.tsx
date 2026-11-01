/*
  Con qué construimos, ordenado por lo que hace cada herramienta. Reemplaza a la
  cinta inclinada: aquí la lista dice algo (qué parte del sistema resuelve cada
  cosa), no solo pasa.
*/
const GROUPS = [
  { label: 'agentes de IA', tools: ['Modelos de lenguaje', 'WhatsApp Business', 'Bases vectoriales'] },
  { label: 'automatización', tools: ['n8n', 'APIs y webhooks', 'Google Workspace'] },
  { label: 'software', tools: ['Next.js', 'React', 'TypeScript', 'WebGPU'] },
  { label: 'datos y nube', tools: ['Supabase', 'PostgreSQL', 'Vercel'] },
];

export default function StackBand() {
  return (
    <section className="stack-band night" data-tone="night" aria-labelledby="stack-title">
      <div className="shell">
        <p className="section-label">con qué construimos</p>
        <h2 id="stack-title" className="stack-title">
          Cada herramienta, en la parte del sistema que resuelve.
        </h2>
        <ol className="stack-groups">
          {GROUPS.map((g, i) => (
            <li key={g.label}>
              <p className="stack-group-label mono">
                <span className="tabular">{String(i + 1).padStart(2, '0')}</span> {g.label}
              </p>
              <ul>
                {g.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
