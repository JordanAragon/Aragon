import Image from 'next/image';
import { IconBox, icons } from './icons';

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
          <div><span className="section-number">01</span><span className="section-label">EL PROBLEMA</span></div>
          <p>Los problemas digitales rara vez empiezan en el código.</p>
        </div>
        <div className="problem-marquee" aria-hidden="true"><span>¿QUÉ NO ESTÁ FUNCIONANDO?</span><span>¿QUÉ NO ESTÁ FUNCIONANDO?</span></div>
        <div className="problem-statement">
          <h2 id="problem-title">Todo empieza con algo que <span>no funciona como debería.</span></h2>
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
          <div><span className="section-number">02</span><span className="section-label">LO QUE CONSTRUYO</span></div>
          <h2 id="capabilities-title">No vendo<br /><span>categorías.</span></h2>
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

export function ContextSection() {
  return (
    <section id="contexto" className="context section-shell" aria-labelledby="context-title">
      <div className="page-shell context-grid">
        <div className="context-visual">
          <Image src="/projects/infrastructure-context.svg" alt="Mapa conceptual de una infraestructura personal con hardware, servicios y red privada" fill sizes="(max-width: 900px) 100vw, 58vw" />
          <div className="context-overlay" />
          <span className="context-stamp">CONTEXTO / 04</span>
          <span className="context-coordinates">HARDWARE · NETWORK · SOFTWARE · SYSTEMS</span>
        </div>
        <div className="context-copy">
          <span className="section-number">04</span><span className="section-label">LO QUE HAY DETRÁS</span>
          <h2 id="context-title">No solo diseño <span>la superficie.</span></h2>
          <p>Mi recorrido mezcla soporte técnico, infraestructura, desarrollo web y construcción de productos. Por eso pienso en la interfaz, pero también en lo que tiene que funcionar detrás.</p>
          <div className="context-facts">
            <div><small>BASE</small><b>Sistemas / Tecnología</b></div>
            <div><small>ENFOQUE</small><b>Producto / Experiencia</b></div>
            <div><small>ORIGEN</small><b>Cali, Colombia</b></div>
          </div>
          <a href="https://github.com/JordanAragon" target="_blank" rel="noopener noreferrer" className="under-link">Ver trabajo técnico ↗</a>
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
          <div><span className="section-number">05</span><span className="section-label">MÉTODO</span></div>
          <h2 id="method-title">De la idea<br /><span>a algo que funciona.</span></h2>
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
    <footer className="footer page-shell">
      <div className="footer-brand"><span className="brand-mark">A</span><div><strong>ARAGON</strong><small>Jordan Aragon · Software · Digital · Technology</small></div></div>
      <div className="footer-links"><a href="https://github.com/JordanAragon" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jordanaragon/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="#inicio">Top ↑</a></div>
    </footer>
  );
}
