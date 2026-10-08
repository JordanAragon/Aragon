
type Props = {
  slug: string;
};

const aidenModules = [
  'Producción', 'Inventario', 'Trazabilidad', 'Ambiente', 'Calidad',
  'Costos', 'Personal', 'Reportes', 'Roles',
];

const serverServices = [
  'Nextcloud', 'Navidrome', 'PostgreSQL', 'Redis', 'Caddy',
  'Uptime Kuma', 'Tailscale', 'Docker', 'Linux',
];

export default function WorkEvidence({ slug }: Props) {
  if (slug === 'aragon-server') {
    return (
      <div className="work-evidence evidence-server" aria-label="Mapa visual abstracto de Aragon Server">
        <div className="work-evidence-head">
          <span>02 / INFRAESTRUCTURA</span>
          <span>ABSTRACTED SYSTEM</span>
        </div>
        <h3 className="work-evidence-title">Un entorno privado, reducido a sus piezas.</h3>
        <p className="work-evidence-note">
          Representación editorial basada en la infraestructura operada: servicios, capa de contenedores y acceso privado. No es un dashboard en tiempo real.
        </p>
        <div className="evidence-server evidence-topology" role="list" aria-label="Capas del sistema">
          <div className="evidence-node" role="listitem">Linux</div>
          <div className="evidence-node" role="listitem">Docker</div>
          <div className="evidence-node" role="listitem">Red privada</div>
        </div>
        <div className="evidence-flow" aria-label="Flujo de infraestructura">
          <span>HOST</span><i /><span>CONTENEDORES</span><i /><span>SERVICIOS</span><i /><span>ACCESO</span>
        </div>
        <div className="evidence-server evidence-topology" role="list" aria-label="Servicios operados">
          {serverServices.map((service) => <div className="evidence-node" role="listitem" key={service}>{service}</div>)}
        </div>
        <div className="evidence-footer">
          <span>Trabajo real / operación privada</span>
          <span>Sin IP · sin secretos · sin datos operativos</span>
        </div>
      </div>
    );
  }

  return (
    <div className="work-evidence evidence-aiden" aria-label="Mapa visual abstracto de AiDEN">
      <div className="work-evidence-head">
        <span>01 / SISTEMA OPERATIVO</span>
        <span>ABSTRACTED SYSTEM</span>
      </div>
      <h3 className="work-evidence-title">Una operación reunida en una sola superficie.</h3>
      <p className="work-evidence-note">
        Visualización editorial de los módulos y flujos documentados del sistema AiDEN. No es una captura de producción ni muestra datos reales.
      </p>
      <div className="evidence-grid" role="list" aria-label="Módulos de AiDEN">
        {aidenModules.map((module) => <div className="evidence-chip" role="listitem" key={module}>{module}</div>)}
      </div>
      <div className="evidence-flow" aria-label="Flujo de trazabilidad">
        <span>REGISTRO</span><i /><span>ESTADO</span><i /><span>TRAZABILIDAD</span><i /><span>REPORTE</span>
      </div>
      <div className="evidence-role">ADMIN · SUPERVISOR · OPERADOR</div>
      <div className="evidence-footer">
        <span>9 módulos operativos</span>
        <span>Hecho · verificado por repo</span>
      </div>
    </div>
  );
}
