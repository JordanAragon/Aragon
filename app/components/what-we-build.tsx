import TextScrollTitle from './skiper/text-scroll-title';

const capabilities = [
  {
    number: '01',
    title: 'PRESENCIA',
    lead: 'Websites y experiencias digitales que explican, posicionan y convierten.',
    items: ['Websites', 'Digital experiences', 'Brand presence', 'Conversion-oriented interfaces'],
  },
  {
    number: '02',
    title: 'SISTEMA',
    lead: 'Herramientas construidas alrededor de cómo funciona realmente una operación.',
    items: ['Internal tools', 'Workflow systems', 'Data systems', 'Automation'],
  },
  {
    number: '03',
    title: 'PRODUCTO',
    lead: 'Aplicaciones y plataformas donde diseño, frontend y tecnología necesitan trabajar como una sola pieza.',
    items: ['Web applications', 'Digital products', 'Platforms', 'Interfaces'],
  },
];

export default function WhatWeBuild() {
  return (
    <section id="construimos" className="v8-build section-shell" aria-labelledby="build-title">
      <div className="page-shell">
        <div className="v8-section-heading">
          <div>
            <span className="section-number">04</span>
            <span className="section-label">WHAT WE BUILD</span>
          </div>
          <TextScrollTitle id="build-title" segments={['Qué necesita existir', { text: 'para resolverlo.', className: 'title-muted' }]} />
        </div>

        <p className="v8-build-intro">
          No vendemos categorías por separado. Definimos la combinación de diseño, software y tecnología que el problema realmente necesita.
        </p>

        <div className="v8-build-list">
          {capabilities.map((capability) => (
            <article className="v8-build-row" key={capability.number}>
              <span className="v8-build-number">{capability.number}</span>
              <div className="v8-build-main">
                <h3>{capability.title}</h3>
                <p>{capability.lead}</p>
              </div>
              <ul aria-label={'Qué incluye ' + capability.title.toLowerCase()}>
                {capability.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className="v8-build-stack">
          <span>UX</span><i /><span>FRONTEND</span><i /><span>BACKEND</span><i /><span>AI</span><i /><span>AUTOMATION</span><i /><span>INFRASTRUCTURE</span>
        </div>
      </div>
    </section>
  );
}
