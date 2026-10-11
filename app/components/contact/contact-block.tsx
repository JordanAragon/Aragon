import { site } from '../../data/site';
import BriefForm from './brief-form';
import CalBooking from './cal-booking';
import CopyButton from '../ui/copy-button';

/* Dos caminos para empezar: agendar la llamada o dejar el caso escrito. */
export default function ContactBlock({ headingId = 'contacto-title', level = 2 }: { headingId?: string; level?: 2 | 1 }) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <div className="contact-block">
      <div className="contact-intro">
        <Heading id={headingId} className="contact-title">
          ¿Qué parte de tu operación debería estar hecha en software?
        </Heading>
        <p className="contact-lead">Cuéntanos en 30 minutos. Sales de la llamada sabiendo qué construiríamos primero y por qué. Si no es para nosotros, te lo decimos.</p>
        <ul className="contact-direct">
          <li>
            <span className="mono">correo</span>
            <span className="contact-direct-value">{site.contactEmail}</span>
            <CopyButton value={site.contactEmail} label="Copiar el correo" />
          </li>
          <li>
            <span className="mono">whatsapp</span>
            <a className="contact-direct-value" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              {site.whatsappDisplay}
            </a>
          </li>
          <li>
            <span className="mono">horario</span>
            <span className="contact-direct-value">Lunes a viernes, hora de Colombia (UTC−5)</span>
          </li>
        </ul>
      </div>
      <div className="contact-paths">
        <section className="contact-path" aria-labelledby={`${headingId}-cal`}>
          <h3 id={`${headingId}-cal`}>Agenda la llamada</h3>
          <p>Elige el día y la hora. Llega la invitación con el enlace.</p>
          <CalBooking />
        </section>
        <section className="contact-path" aria-labelledby={`${headingId}-form`}>
          <h3 id={`${headingId}-form`}>O déjanos tu caso por escrito</h3>
          <p>Te respondemos con preguntas concretas o con una propuesta de llamada.</p>
          <BriefForm />
        </section>
      </div>
    </div>
  );
}
