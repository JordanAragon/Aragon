export default function NotFound() {
  return (
    <main className="status-page">
      <div className="status-page-inner">
        <span className="section-number">404 / NOT FOUND</span>
        <h1>Esta página no existe.</h1>
        <p>La ruta que buscas no está disponible. El contenido principal de Aragon sigue en la página de inicio.</p>
        <a className="hero-cta" href="/#inicio">
          <span>Volver a Aragon</span>
          <span className="icon-box" aria-hidden="true">↗</span>
        </a>
      </div>
    </main>
  );
}
