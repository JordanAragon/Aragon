
import Link from 'next/link';
import TextScrollTitle from './skiper/text-scroll-title';
import { site } from '../data/site';

export default function AboutSection() {
  return (
    <section id="about" className="v8-about section-shell" aria-labelledby="about-title">
      <div className="page-shell">
        <div className="v8-section-heading">
          <div>
            <span className="section-number">07</span>
            <span className="section-label">EL ESTUDIO</span>
          </div>
          <TextScrollTitle
            id="about-title"
            segments={['Un estudio pequeño.', { text: 'Una forma seria de construir.', className: 'title-muted' }]}
          />
        </div>

        <div className="v8-about-grid">
          <div className="v8-about-statement">
            <span>ARAGON / SOFTWARE · TECHNOLOGY · DIGITAL</span>
            <p>
              Aragon trabaja entre diseño, producto y tecnología para convertir problemas reales en experiencias digitales, software y sistemas que puedan sostenerse más allá de una demo.
            </p>
          </div>

          <div className="v8-about-founder">
            <span>FUNDADO / CONSTRUIDO POR</span>
            <h3>{site.person}</h3>
            <p>Founder · Software Developer · Builder</p>
            <Link href={site.portfolioUrl} target="_blank" rel="noopener noreferrer">
              Ver perfil personal <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
