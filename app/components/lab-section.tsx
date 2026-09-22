import { projects } from '../data/projects';
import TextScrollTitle from './skiper/text-scroll-title';

export default function LabSection() {
  return (
    <section id="lab" className="v8-lab section-shell" aria-labelledby="lab-title">
      <div className="page-shell">
        <div className="v8-section-heading">
          <div>
            <span className="section-number">08</span>
            <span className="section-label">LAB / CURRENT EXPLORATIONS</span>
          </div>
          <TextScrollTitle id="lab-title" segments={['Ideas en desarrollo.', { text: 'Todavía no son promesas.', className: 'title-muted' }]} />
        </div>

        <div className="v8-lab-list">
          {projects.map((project) => (
            <article className="v8-lab-row" key={project.slug} id={`lab-${project.slug}`}>
              <span>{project.id}</span>
              <div>
                <h3>{project.title}</h3>
                <p>{project.body}</p>
              </div>
              <strong>{project.stackLabel}</strong>
              </article>
          ))}
        </div>
      </div>
    </section>
  );
}
