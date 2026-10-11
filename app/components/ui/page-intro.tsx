import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from './icons';

type Crumb = { label: string; href: string };

/* Apertura de las páginas internas: miga, título, entrada y acciones. */
export default function PageIntro({
  label,
  title,
  lead,
  crumbs = [],
  children,
}: {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="page-intro night" data-tone="night">
      <div className="page-intro-grid" aria-hidden="true" />
      <div className="shell">
        <nav className="crumbs mono" aria-label="Ruta">
          <Link href="/">inicio</Link>
          {crumbs.map((c) => (
            <span key={c.href}>
              <span aria-hidden="true">/</span>
              <Link href={c.href}>{c.label.toLowerCase()}</Link>
            </span>
          ))}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{label}</span>
        </nav>
        <h1 className="page-title">{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
        {children && <div className="page-actions">{children}</div>}
      </div>
    </section>
  );
}

export function CtaBand({ title = 'Cuéntanos qué quieres poner en orden.', body = 'Una llamada de 30 minutos para entender tu caso. Si no es para nosotros, te lo decimos.' }: { title?: string; body?: string }) {
  return (
    <section className="cta-band paper" data-tone="paper">
      <div className="shell cta-band-inner">
        <h2>{title}</h2>
        <div>
          <p>{body}</p>
          <Link href="/contacto" className="btn btn-primary btn-lg">
            Agendar una llamada <ArrowRight className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
