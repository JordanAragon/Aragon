import TextScrollTitle from './skiper/text-scroll-title';
import ContactTrigger from './contact-trigger';
import { site } from '../data/site';

const problems = [
  { id: '01', word: 'MARCA', title: 'No se entiende.', copy: 'Una buena idea pierde fuerza cuando nadie entiende qué hace, para quién es o por qué importa.' },
  { id: '02', word: 'PROCESO', title: 'Se complica.', copy: 'Información dispersa, pasos manuales y herramientas que terminan haciendo más lento el trabajo.' },
  { id: '03', word: 'PRODUCTO', title: 'Se queda a medias.', copy: 'Una experiencia puede funcionar técnicamente y aun así sentirse incompleta, confusa o difícil de usar.' },
];

const steps = [
  ['01', 'Entender', 'Contexto, objetivos y restricciones.'],
  ['02', 'Definir', 'Qué necesita existir y qué puede desaparecer.'],
  ['03', 'Construir', 'Diseño, software y sistema alrededor del problema.'],
  ['04', 'Pulir', 'Iteración, detalle y entrega hasta que funcione de verdad.'],
];

export function ProblemSection() {
  return (
    <section id="problema" className="problem section-shell" aria-labelledby="problem-title">
      <div className="page-shell">
        <div className="problem-intro">
          <div><span className="section-number">02</span><span className="section-label">EL PROBLEMA</span></div>
          <p>Los problemas digitales rara vez empiezan en el código.</p>
        </div>
        <div className="problem-marquee" aria-hidden="true"><span>¿QUÉ NO ESTÁ FUNCIONANDO?</span><span>¿QUÉ NO ESTÁ FUNCIONANDO?</span></div>
        <div className="problem-statement">
          <TextScrollTitle id="problem-title" segments={['Todo empieza con algo que', { text: 'no funciona como debería.', className: 'title-muted' }]} />
          <p>Una marca que no se entiende. Un proceso que se complica. Un producto que se queda a medias.</p>
        </div>
        <div className="problem-list">
          {problems.map((problem) => (
            <article key={problem.id} className="problem-item">
              <span>{problem.id}</span>
              <div><small>{problem.word}</small><h3>{problem.title}</h3></div>
              <p>{problem.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MethodSection() {
  return (
    <section id="metodo" className="method section-shell" aria-labelledby="method-title">
      <div className="page-shell">
        <div className="v8-section-heading">
          <div><span className="section-number">06</span><span className="section-label">PROCESS</span></div>
          <TextScrollTitle id="method-title" segments={['Un proceso simple.', { text: 'Sin soluciones prefabricadas.', className: 'title-muted' }]} />
        </div>
        <div className="method-intro"><p>La creatividad no reemplaza el criterio. El código tampoco. El proceso sirve para decidir qué vale la pena construir y qué sobra.</p></div>
        <div className="method-grid v8-method-grid">
          {steps.map(([id, title, copy], index) => (
            <div className="method-cell" key={id}>
              <span>{id}</span>
              <div className="method-glyph" aria-hidden="true">{index === 0 ? '○' : index === 1 ? '✦' : index === 2 ? '⌘' : '+'}</div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer v8-footer">
      <div className="page-shell footer-inner">
        <div className="footer-main v8-footer-main">
          <div className="footer-closing">
            <span className="section-number">09 / CIERRE</span>
            <h2>Let's build something <em>useful.</em></h2>
          </div>
          <div className="footer-side">
            <span>ARAGON / SOFTWARE &amp; TECHNOLOGY STUDIO</span>
            <ContactTrigger className="footer-contact-button">Contactar ↗</ContactTrigger>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-links-group">
            {site.socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                <span className="v8-footer-link-label">{link.label}</span><b>↗</b>
              </a>
            ))}
            <a href={site.portfolioUrl} target="_blank" rel="noopener noreferrer" aria-label="Jordan, portfolio personal">
              <span className="v8-footer-link-label">Jordan</span><b>↗</b>
            </a>
          </div>
          <a href="#inicio" className="footer-top">Back to top ↑</a>
        </div>

        <div className="footer-bottom">
          <span>Cali, Colombia</span>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
}
