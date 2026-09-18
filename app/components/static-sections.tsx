import { IconBox, icons } from './icons';
import TextScrollTitle from './skiper/text-scroll-title';
import ContactTrigger from './contact-trigger';
import { site } from '../data/site';

const problems = [
  { id: '01', word: 'MARCA', title: 'No se entiende.', copy: 'Una buena idea pierde fuerza cuando nadie entiende qué hace, para quién es o por qué importa.' },
  { id: '02', word: 'PROCESO', title: 'Se complica.', copy: 'Información dispersa, pasos manuales y herramientas que terminan haciendo más lento el trabajo.' },
  { id: '03', word: 'PRODUCTO', title: 'Se queda a medias.', copy: 'Una experiencia puede funcionar técnicamente y aun así sentirse incompleta, confusa o difícil de usar.' },
];

const capabilities = [
  { id: '01', title: 'Presencia', kicker: 'WEB · IDENTIDAD · EXPERIENCIA', copy: 'Sitios que explican, posicionan y convierten sin sentirse como una plantilla con el logo cambiado.', icon: icons.spark },
  { id: '02', title: 'Sistema', kicker: 'SOFTWARE · PROCESOS · DATOS', copy: 'Herramientas construidas alrededor de cómo funciona realmente un proceso, no de cuántos componentes caben.', icon: icons.system },
  { id: '03', title: 'Producto', kicker: 'FRONTEND · INTERACCIÓN · EVOLUCIÓN', copy: 'Experiencias digitales que necesitan diseño, desarrollo y criterio para dejar de sentirse a medio hacer.', icon: icons.code },
];

const steps = [
  ['01', 'Entender', 'Qué está pasando realmente.'],
  ['02', 'Definir', 'Qué necesita cambiar.'],
  ['03', 'Construir', 'La experiencia, sistema o producto adecuado.'],
  ['04', 'Pulir', 'Hasta que deje de sentirse como una versión a medias.'],
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
              <IconBox>{icons.arrow}</IconBox>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CapabilitiesSection() {
  return (
    <section id="capacidades" className="capabilities section-shell" aria-labelledby="capabilities-title">
      <div className="page-shell">
        <div className="section-heading">
          <div><span className="section-number">04</span><span className="section-label">LO QUE CONSTRUYO</span></div>
          <TextScrollTitle id="capabilities-title" segments={['No vendo', { text: 'categorías.', className: 'title-muted' }]} />
        </div>
        <p className="section-lead">A veces es una web. A veces es un sistema. A veces es un producto entero. Lo importante es qué necesita existir para resolver el problema.</p>
        <div className="capability-grid">
          {capabilities.map((capability, index) => (
            <article key={capability.id} className="capability-card">
              <div className="capability-top"><span>{capability.id}</span><IconBox>{capability.icon}</IconBox></div>
              <small>{capability.kicker}</small>
              <h3>{capability.title}</h3>
              <p>{capability.copy}</p>
              <span className="capability-index">0{index + 1} / 03</span>
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
        <div className="section-heading">
          <div><span className="section-number">06</span><span className="section-label">MÉTODO</span></div>
          <TextScrollTitle id="method-title" segments={['De la idea', { text: 'a algo que funciona.', className: 'title-muted' }]} />
        </div>
        <div className="method-intro"><p>La creatividad no reemplaza el criterio. El código tampoco. El proceso sirve para decidir qué vale la pena construir y qué sobra.</p></div>
        <div className="method-grid">
          {steps.map(([id, title, copy], index) => (
            <div className="method-cell" key={id}>
              <span>{id}</span>
              <div className="method-glyph">{index === 0 ? icons.dot : index === 1 ? icons.spark : index === 2 ? icons.code : icons.plus}</div>
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
    <footer className="footer">
      <div className="page-shell footer-inner">
        <div className="footer-main">
          <div className="footer-closing">
            <span className="section-number">08 / CIERRE</span>
            <h2>Que la idea <em>tenga dónde vivir.</em></h2>
          </div>
          <div className="footer-side">
            <span>ARAGON / SOFTWARE · DIGITAL · TECHNOLOGY</span>
            <ContactTrigger className="footer-contact-button">Empezar una conversación ↗</ContactTrigger>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-links-group">
            {site.socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                <IconBox>{icons[link.icon]}</IconBox>
                <span>{link.label}</span>
                <b>↗</b>
              </a>
            ))}
            <a href={site.portfolioUrl} target="_blank" rel="noopener noreferrer" aria-label="Portafolio personal">
              <IconBox>{icons.globe}</IconBox><span>Portafolio</span><b>↗</b>
            </a>
          </div>
          <a href="#inicio" className="footer-top">Back to top ↑</a>
        </div>

        <div className="footer-bottom">
          <span>Canvas crowd / Skiper UI + Open Peeps</span>
          <span>Popayán / Colombia · 2026</span>
        </div>
      </div>
    </footer>
  );
}
