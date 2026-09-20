'use client';

import Link from 'next/link';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="status-page">
      <div className="status-page-inner">
        <span className="section-number">500 / TEMPORARY ERROR</span>
        <h1>Algo no salió como debería.</h1>
        <p>La aplicación encontró un error inesperado. Puedes reintentar sin perder la navegación principal.</p>
        <div className="status-actions">
          <button type="button" className="hero-cta" onClick={() => reset()}>
            <span>Reintentar</span>
            <span className="icon-box" aria-hidden="true">↻</span>
          </button>
          <Link className="under-link" href="/#inicio">Volver al inicio ↗</Link>
        </div>
      </div>
    </main>
  );
}
