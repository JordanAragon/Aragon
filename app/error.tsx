'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="not-found night" data-tone="night" aria-labelledby="err-title">
      <div className="shell not-found-inner">
        <p className="section-label">algo falló</p>
        <h1 id="err-title">Esta parte del sitio no cargó.</h1>
        <p>Vuelve a intentarlo. Si sigue fallando, escríbenos y lo revisamos.</p>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={reset}>
            Intentar de nuevo
          </button>
          <Link href="/" className="btn btn-ghost">
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
