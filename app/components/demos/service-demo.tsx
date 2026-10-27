'use client';

import type { ServiceSlug } from '../../data/services';
import AgentDemo from './agent-demo';
import AppDemo from './app-demo';
import FlowDemo from './flow-demo';

const TITLES: Record<ServiceSlug, string> = {
  'apps-web': 'distribuidora — pedidos',
  automatizacion: 'n8n — flujo de pedidos',
  'agentes-ia': 'whatsapp — asistente',
};

export default function ServiceDemo({ slug, running = true }: { slug: ServiceSlug; running?: boolean }) {
  return (
    <div className="window demo-window">
      <div className="window-bar">
        <span className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="window-title">{TITLES[slug]}</span>
        <span className="chip chip-live demo-live">en vivo</span>
      </div>
      <div className="demo-body">
        {slug === 'apps-web' && <AppDemo running={running} />}
        {slug === 'automatizacion' && <FlowDemo running={running} />}
        {slug === 'agentes-ia' && <AgentDemo />}
      </div>
    </div>
  );
}
