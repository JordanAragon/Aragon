'use client';

import { useEffect } from 'react';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Aragon route error', error);
  }, [error]);

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
          <a className="under-link" href="/#inicio">Volver al inicio ↗</a>
        </div>
      </div>
    </main>
  );
}
