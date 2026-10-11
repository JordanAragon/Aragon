import Link from 'next/link';
import { services } from '../../data/services';
import { site } from '../../data/site';
import { ArrowRight } from '../ui/icons';

export default function SiteFooter() {
  const year = 2026;
  return (
    <footer className="site-footer night" data-tone="night">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-lead">
            <h2>Software a la medida, desde Cali.</h2>
            <p>Apps web, automatizaciones, agentes de IA e infraestructura para negocios en Colombia y en remoto.</p>
            <Link href="/contacto" className="text-link">
              Escribirnos <ArrowRight className="arrow" />
            </Link>
          </div>
          <div className="footer-col">
            <h3>Servicios</h3>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicios/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h3>Estudio</h3>
            <ul>
              <li>
                <Link href="/como-trabajamos">Cómo trabajamos</Link>
              </li>
              <li>
                <Link href="/trabajo">Trabajo</Link>
              </li>
              <li>
                <Link href="/nosotros">Nosotros</Link>
              </li>
              <li>
                <Link href="/preguntas">Preguntas frecuentes</Link>
              </li>
              <li>
                <Link href="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contacto</h3>
            <ul>
              <li>
                <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp {site.whatsappDisplay}
                </a>
              </li>
              {site.socialLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-word" aria-hidden="true">
          aragon<span className="brand-mark" />
        </div>
        <div className="footer-base">
          <span>
            © {year} Aragon, estudio de software de <a href={site.portfolioUrl}>{site.founder}</a>. {site.location}.
          </span>
          <span>
            <Link href="/privacidad">Tratamiento de datos</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
