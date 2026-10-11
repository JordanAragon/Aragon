import Link from 'next/link';
import NotFoundField from './components/home/not-found-field';
import { ArrowRight } from './components/ui/icons';

export default function NotFound() {
  return (
    <section className="not-found night" data-tone="night" aria-labelledby="nf-title">
      <NotFoundField />
      <div className="shell not-found-inner">
        <p className="section-label">error 404</p>
        <h1 id="nf-title">Esta página no está en su lugar.</h1>
        <p>Puede que el enlace haya cambiado. Pasa el cursor por las piezas: al menos ellas sí encuentran el suyo.</p>
        <div className="page-actions">
          <Link href="/" className="btn btn-primary">
            Volver al inicio <ArrowRight className="arrow" />
          </Link>
          <Link href="/contacto" className="btn btn-ghost">
            Escribirnos
          </Link>
        </div>
      </div>
    </section>
  );
}
