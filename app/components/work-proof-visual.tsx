import type { CSSProperties, ReactNode } from 'react';

type Props = {
  slug: string;
  compact?: boolean;
};

function Module({ label, wide = false }: { label: string; wide?: boolean }) {
  return <span className={wide ? 'proof-module proof-module-wide' : 'proof-module'}>{label}</span>;
}

function FlowNode({ label, meta, tone = 'neutral' }: { label: string; meta: string; tone?: 'signal' | 'neutral' }) {
  return (
    <div className={tone === 'signal' ? 'proof-flow-node is-signal' : 'proof-flow-node'}>
      <strong>{label}</strong>
      <span>{meta}</span>
    </div>
  );
}

export default function WorkProofVisual({ slug, compact = false }: Props) {
  const isAiDEN = slug === 'aiden';

  if (isAiDEN) {
    const modules = ['Producción', 'Inventario', 'Trazabilidad', 'Ambiente', 'Calidad', 'Costos', 'Personal', 'Reportes', 'Configuración'];

    return (
      <div className={compact ? 'proof-board proof-board-compact proof-aiden' : 'proof-board proof-aiden'} aria-label="Esquema visual de AiDEN">
        <div className="proof-board-top">
          <span>AI DEN / OPERATION MAP</span>
          <b>09 MODULES</b>
        </div>
        <div className="proof-aiden-core">
          <div className="proof-aiden-ring" />
          <div className="proof-aiden-center">
            <span>AiDEN</span>
            <small>OPERACIÓN</small>
          </div>
          <div className="proof-aiden-track" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="proof-aiden-modules">
            {modules.map((module) => <Module key={module} label={module} />)}
          </div>
        </div>
        <div className="proof-board-bottom">
          <span>LOT → TRACE → STATE</span>
          <span>ROLES / DATA / FLOW</span>
        </div>
      </div>
    );
  }

  const services = [
    ['Tailscale', 'PRIVATE NETWORK'],
    ['Caddy', 'REVERSE PROXY'],
    ['Docker', 'CONTAINERS'],
    ['Nextcloud', 'PRIVATE CLOUD'],
    ['Navidrome', 'MUSIC'],
  ] as const;

  return (
    <div className={compact ? 'proof-board proof-board-compact proof-server' : 'proof-board proof-server'} aria-label="Esquema visual de Aragon Server">
      <div className="proof-board-top">
        <span>ARAGON SERVER / SELF-HOSTED</span>
        <b>PRIVATE SYSTEM</b>
      </div>
      <div className="proof-server-flow">
        <FlowNode label="CLIENT" meta="REMOTE" />
        <span className="proof-flow-line" aria-hidden="true">→</span>
        <FlowNode label="TAILSCALE" meta="PRIVATE" tone="signal" />
        <span className="proof-flow-line" aria-hidden="true">→</span>
        <FlowNode label="CADDY" meta="HTTPS" />
      </div>
      <div className="proof-server-grid">
        {services.map(([label, meta]) => (
          <div className="proof-service" key={label}>
            <span>{label}</span>
            <small>{meta}</small>
          </div>
        ))}
      </div>
      <div className="proof-server-base">
        <span>LINUX</span><i /><span>DOCKER</span><i /><span>PRIVATE ACCESS</span>
      </div>
    </div>
  );
}
