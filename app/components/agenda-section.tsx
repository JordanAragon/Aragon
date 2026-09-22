'use client';

import { useEffect, useState } from 'react';
import { projects } from '../data/projects';
import { site } from '../data/site';
import CalBooking from './cal-booking';
import ContactForm from './contact-form';
import { IconBox, icons } from './icons';
import TextScrollTitle from './skiper/text-scroll-title';

export default function AgendaSection() {
  const [selectedProject, setSelectedProject] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.sessionStorage.getItem('aragon-selected-project');
    } catch {
      return null;
    }
  });
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const onProject = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      if (slug) setSelectedProject(slug);
    };
    const onOpenContact = () => setContactOpen(true);

    window.addEventListener('aragon:project-selected', onProject);
    window.addEventListener('aragon:open-contact', onOpenContact);
    return () => {
      window.removeEventListener('aragon:project-selected', onProject);
      window.removeEventListener('aragon:open-contact', onOpenContact);
    };
  }, []);

  const project = projects.find((item) => item.slug === selectedProject);
  const emailSubject = project ? `Aragon / ${project.title}` : 'Aragon / Proyecto';

  const clearContext = () => {
    try {
      window.sessionStorage.removeItem('aragon-selected-project');
    } catch {
      // Ignore storage restrictions.
    }
    setSelectedProject(null);
  };

  return (
    <section id="contacto" className="contact section-shell" aria-labelledby="contact-title">
      <div className="contact-scan" aria-hidden="true" />
      <div className="page-shell agenda-grid">
        <div className="agenda-intro">
          <div className="contact-meta"><span>09 / CONTACT</span><span>ARAGON / 2026</span><span>CALI / COLOMBIA</span></div>
          <span className="contact-kicker">YOU SAW THE PROBLEM. YOU SAW THE SYSTEM. NOW LET\'S TALK.</span>
          <TextScrollTitle
            id="contact-title"
            segments={project
              ? ['Hablemos de', { text: `${project.title}.`, className: 'title-muted' }]
              : ['Hablemos de', { text: 'lo que sigue.', className: 'title-muted' }]}
          />
          <p>{project ? `La conversación parte de ${project.title}, pero el objetivo es entender el problema detrás del concepto y decidir qué tendría sentido construir.` : 'Elige un horario y cuéntame qué necesitas construir. La primera conversación sirve para entender el problema, no para venderte una solución prefabricada.'}</p>
          {project && <button type="button" className="context-reset" onClick={clearContext}>Quitar contexto {icons.plus}</button>}

          <div className="contact-actions-row">
            <button type="button" className="contact-form-trigger" onClick={() => setContactOpen(true)}>
              Prefiero escribir <IconBox>{icons.mail}</IconBox>
            </button>
            <a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(emailSubject)}`} className="contact-email-link">Email directo ↗</a>
          </div>
          <a href={`https://cal.com/${site.calLink}`} target="_blank" rel="noopener noreferrer" className="under-link">Abrir Cal.com en otra ventana {icons.arrow}</a>
        </div>
        <div className="calendar-shell">
          <CalBooking />
        </div>
      </div>
      <ContactForm open={contactOpen} onClose={() => setContactOpen(false)} subject={emailSubject} />
    </section>
  );
}
