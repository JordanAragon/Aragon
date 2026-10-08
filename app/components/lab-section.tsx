
import Image from 'next/image';
import { projects } from '../data/projects';
import TextScrollTitle from './skiper/text-scroll-title';

const visuals: Record<string, { src: string; alt: string }> = {
  'aragon-finance': {
    src: '/projects/aragon-finance.svg',
    alt: 'Concepto visual de Aragon Finance, con panel de patrimonio y flujo mensual usando datos de muestra',
  },
  'agro-os': {
    src: '/projects/agro-os.svg',
    alt: 'Concepto visual de Agro OS, con estado operativo y trazabilidad usando datos de muestra',
  },
  nexo: {
    src: '/projects/nexo-infrastructure.svg',
    alt: 'Concepto visual de Nexo, con estado de servicios y mapa de infraestructura usando estado de muestra',
  },
  atelier: {
    src: '/projects/atelier.svg',
    alt: 'Concepto visual de Atelier, una experiencia privada de comercio y drops limitados',
  },
};

export default function LabSection() {
  return (
    <section id="lab" className="v8-lab section-shell" aria-labelledby="lab-title">
      <div className="page-shell">
        <div className="v8-section-heading">
          <div>
            <span className="section-number">08</span>
            <span className="section-label">EXPLORACIONES</span>
          </div>
          <TextScrollTitle
            id="lab-title"
            segments={['Ideas en desarrollo.', { text: 'Todavía no son promesas.', className: 'title-muted' }]}
          />
        </div>

        <div className="v8-lab-list">
          {projects.map((project) => {
            const visual = visuals[project.slug];
            return (
              <article className="v8-lab-row" key={project.slug} id={'lab-' + project.slug}>
                <span>{project.id}</span>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.body}</p>
                  {visual && (
                    <div className="lab-visual">
                      <Image
                        src={visual.src}
                        alt={visual.alt}
                        width={1600}
                        height={1000}
                        sizes="(max-width: 780px) 100vw, 70vw"
                      />
                    </div>
                  )}
                </div>
                <strong>{project.stackLabel}</strong>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
