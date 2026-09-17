import { IconBox, icons } from './icons';
import CanvasCrowd from './skiper/canvas-crowd';
import TextScrollTitle from './skiper/text-scroll-title';

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

export function ContextSection() {
  return (
    <section id="contexto" className="context section-shell" aria-labelledby="context-title">
      <style>{`
        .context{background:var(--bg);border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);overflow:hidden}
        .context-grid{display:grid;grid-template-columns:minmax(0,.78fr) minmax(0,1.22fr);grid-template-areas:"copy visual";align-items:center;gap:clamp(42px,6.5vw,106px)}
        .context-copy{grid-area:copy;position:relative;z-index:10;min-width:0}
        .context-copy .section-label{margin-bottom:24px}
        .context-copy .text-scroll-title{max-width:720px;font-size:clamp(60px,7.2vw,110px);line-height:.81}
        .context-copy>p{max-width:520px;margin:34px 0 40px;color:#4f4f55;font-size:14px;line-height:1.9}
        .context-facts{display:grid;grid-template-columns:1fr;max-width:520px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .context-facts article{display:flex;align-items:baseline;gap:22px;padding:14px 0;border-bottom:1px solid rgba(196,195,189,.72)}
        .context-facts article:last-child{border-bottom:0}
        .context-facts small{width:82px;flex:none;color:var(--muted);font:900 8px/1 var(--body);letter-spacing:.15em;text-transform:uppercase}
        .context-facts b{font:800 11px/1.35 var(--body);letter-spacing:.02em}
        .context-copy .under-link{display:inline-flex;margin-top:28px;color:var(--ink);font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;text-decoration:underline;text-underline-offset:5px}
        .context-visual{grid-area:visual;position:relative;isolation:isolate;overflow:hidden;min-height:clamp(600px,70svh,820px);border:1px solid var(--ink);background:#e9e8e3;border-radius:2px;box-shadow:22px 22px 0 rgba(8,8,9,.06);contain:layout paint}
        .context-visual::before{content:"";position:absolute;inset:0;z-index:0;background:radial-gradient(circle at 52% 29%,rgba(255,255,255,.98),transparent 24%),linear-gradient(145deg,rgba(255,255,255,.24),transparent 45%);pointer-events:none}
        .context-visual::after{content:"";position:absolute;inset:0;z-index:14;border:1px solid rgba(8,8,9,.12);pointer-events:none}
        .context-visual-head{position:absolute;inset:18px 20px auto;z-index:12;display:flex;justify-content:space-between;color:#55555b;font:900 8px/1 var(--body);letter-spacing:.16em;text-transform:uppercase}
        .context-visual-head span:last-child{color:var(--ink)}
        .context-visual-grid{position:absolute;inset:0;z-index:1;background-image:linear-gradient(to right,rgba(8,8,9,.075) 1px,transparent 1px),linear-gradient(to bottom,rgba(8,8,9,.075) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.8),transparent 88%);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,.8),transparent 88%);pointer-events:none}
        .context-architecture{position:absolute;left:10%;right:10%;top:12%;height:51%;z-index:3;pointer-events:none}
        .context-orbit{position:absolute;left:50%;top:45%;border:1px solid rgba(8,8,9,.17);border-radius:50%;animation:context-spin 24s linear infinite}
        .context-orbit-a{width:74%;height:39%;transform:translate(-50%,-50%) rotate(15deg)}
        .context-orbit-b{width:59%;height:59%;transform:translate(-50%,-50%) rotate(-29deg);animation-duration:31s;animation-direction:reverse}
        .context-orbit-c{width:36%;height:76%;transform:translate(-50%,-50%) rotate(62deg);animation-duration:38s}
        .context-node{position:absolute;display:grid;place-items:center;border:1px solid rgba(8,8,9,.2);background:rgba(244,244,240,.93);box-shadow:0 8px 20px rgba(8,8,9,.07);color:var(--ink);font:900 7px/1 var(--body);letter-spacing:.14em;text-transform:uppercase}
        .context-node-core{left:50%;top:45%;width:74px;height:74px;transform:translate(-50%,-50%);border-radius:50%;background:#080809;color:#f4f4f0;border-color:#080809;font:900 24px/1 var(--display);letter-spacing:-.08em;box-shadow:0 18px 45px rgba(8,8,9,.22)}
        .context-node-hardware{left:2%;top:20%;padding:9px 11px}.context-node-network{right:1%;top:29%;padding:9px 11px}.context-node-software{left:9%;bottom:3%;padding:9px 11px}.context-node-product{right:7%;bottom:10%;padding:9px 11px}
        .context-readout{position:absolute;left:20px;right:20px;bottom:28%;z-index:11;display:flex;justify-content:space-between;gap:16px;color:#626269;font:900 7px/1 var(--body);letter-spacing:.15em;text-transform:uppercase}
        .context-readout span{display:flex;align-items:center;gap:6px}.context-readout i{display:block;width:5px;height:5px;border-radius:50%;background:var(--ink);box-shadow:0 0 0 4px rgba(8,8,9,.055);animation:context-blink 2.6s ease-in-out infinite}
        .context-crowd-stage{position:absolute;left:0;right:0;bottom:0;height:49%;z-index:8;overflow:hidden;border-top:1px solid rgba(8,8,9,.2);background:linear-gradient(to bottom,rgba(233,232,227,.12),rgba(233,232,227,.82) 100%)}
        .context-crowd-stage::before{content:"";position:absolute;left:0;right:0;top:0;height:22%;z-index:5;background:linear-gradient(to bottom,#e9e8e3 0%,rgba(233,232,227,.62) 52%,transparent 100%);pointer-events:none}
        .context-crowd-stage::after{content:"";position:absolute;left:0;right:0;bottom:0;height:30%;z-index:5;background:linear-gradient(to bottom,transparent,rgba(8,8,9,.05));pointer-events:none}
        .context-crowd-stage .canvas-crowd-wrap{z-index:3!important}.context-crowd-stage .canvas-crowd{opacity:1!important;filter:contrast(1.12)!important;mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.78) 8%,#000 17%,#000 100%)!important;-webkit-mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.78) 8%,#000 17%,#000 100%)!important}
        .context-ground-label{position:absolute;left:20px;bottom:18px;z-index:7;color:#626269;font:900 7px/1 var(--body);letter-spacing:.16em;text-transform:uppercase}.context-ground-line{position:absolute;left:0;right:0;bottom:48px;z-index:6;height:1px;background:rgba(8,8,9,.18)}
        @keyframes context-spin{from{rotate:0deg}to{rotate:360deg}}@keyframes context-blink{0%,100%{opacity:.3}50%{opacity:1}}
        @media (max-width:1100px){.context-grid{grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr);gap:38px}.context-visual{min-height:560px}.context-copy .text-scroll-title{font-size:clamp(54px,7.2vw,90px)}}
        @media (max-width:780px){.context-grid{grid-template-columns:1fr;grid-template-areas:"visual" "copy";gap:38px}.context-visual{min-height:540px;box-shadow:14px 14px 0 rgba(8,8,9,.055)}.context-copy .text-scroll-title{font-size:clamp(50px,12vw,78px)}.context-copy>p{margin:28px 0 34px}.context-crowd-stage{height:50%}.context-readout{bottom:30%;font-size:6px}.context-node-core{width:62px;height:62px}.context-node{font-size:6px;padding:7px 8px}.context-ground-label{left:14px;bottom:14px}.context-ground-line{bottom:42px}.context-facts article{gap:14px}.context-facts small{width:70px}.context-visual-head{inset:14px 14px auto;font-size:7px}}
        @media (max-width:520px){.context-visual{min-height:500px}.context-architecture{left:5%;right:5%;top:11%;height:49%}.context-node-core{width:56px;height:56px}.context-readout{left:14px;right:14px;bottom:30%;gap:8px}.context-crowd-stage{height:51%}.context-ground-label{font-size:6px}.context-copy>p{font-size:13px}.context-facts b{font-size:10px}}
        @media (prefers-reduced-motion:reduce){.context-orbit,.context-readout i{animation:none}.context-crowd-stage .canvas-crowd{opacity:.8!important}}
      `}</style>
      <div className="page-shell context-grid">
        <div className="context-copy">
          <span className="section-number">04</span>
          <span className="section-label">LO QUE HAY DETRÁS</span>
          <TextScrollTitle id="context-title" segments={['No solo diseño', { text: 'la superficie.', className: 'title-muted' }]} />
          <p>Mi recorrido mezcla soporte técnico, infraestructura, desarrollo web y construcción de productos. Por eso pienso en la interfaz, pero también en lo que tiene que funcionar detrás.</p>
          <div className="context-facts">
            <article><small>BASE</small><b>Sistemas / Tecnología</b></article>
            <article><small>ENFOQUE</small><b>Producto / Experiencia</b></article>
            <article><small>ORIGEN</small><b>Popayán, Colombia</b></article>
          </div>
          <a href="https://github.com/JordanAragon" target="_blank" rel="noopener noreferrer" className="under-link">Ver trabajo técnico ↗</a>
        </div>

        <figure className="context-visual" aria-label="Sistema editorial de Aragon con arquitectura abstracta y personas caminando en la base">
          <header className="context-visual-head">
            <span>ARAGON / SYSTEMS</span>
            <span>04 — 2026</span>
          </header>
          <div className="context-visual-grid" aria-hidden="true" />
          <div className="context-architecture" aria-hidden="true">
            <span className="context-orbit context-orbit-a" />
            <span className="context-orbit context-orbit-b" />
            <span className="context-orbit context-orbit-c" />
            <span className="context-node context-node-core">A</span>
            <span className="context-node context-node-hardware">HARDWARE</span>
            <span className="context-node context-node-network">NETWORK</span>
            <span className="context-node context-node-software">SOFTWARE</span>
            <span className="context-node context-node-product">PRODUCT</span>
          </div>
          <div className="context-readout" aria-hidden="true">
            <span><i />ONLINE</span><span>PRIVATE STACK</span><span>LOCAL / REMOTE</span>
          </div>
          <div className="context-crowd-stage" aria-hidden="true">
            <span className="context-ground-label">PEOPLE / SYSTEM / FLOW</span>
            <span className="context-ground-line" />
            <CanvasCrowd src="/images/peeps/aragon-crowd-scene.png" rows={1} cols={1} />
          </div>
        </figure>
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
    <footer className="footer page-shell">
      <div className="footer-brand"><span className="brand-mark">A</span><div><strong>ARAGON</strong><small>Jordan Aragon · Software · Digital · Technology</small></div></div>
      <div className="footer-links"><a href="https://github.com/JordanAragon" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jordanaragon/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="#inicio">Top ↑</a></div>
      <div className="footer-attribution">Motion studies <a href="https://skiper-ui.com/" target="_blank" rel="noopener noreferrer">Skiper UI</a></div>
    </footer>
  );
}
