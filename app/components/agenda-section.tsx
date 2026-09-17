'use client';

import { useEffect, useState } from 'react';
import { projects } from '../data/projects';
import { site } from '../data/site';
import CalBooking from './cal-booking';
import { icons } from './icons';

export default function AgendaSection() {
  const [selectedProject, setSelectedProject] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.sessionStorage.getItem('aragon-selected-project');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const onProject = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      if (slug) setSelectedProject(slug);
    };

    window.addEventListener('aragon:project-selected', onProject);
    return () => window.removeEventListener('aragon:project-selected', onProject);
  }, []);

  const project = projects.find((item) => item.slug === selectedProject);

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
          <div className="contact-meta"><span>06 / AGENDA</span><span>ARAGON / 2026</span><span>CALI / COLOMBIA</span></div>
          <span className="contact-kicker">UNA IDEA. UN PROBLEMA. ALGO QUE CONSTRUIR.</span>
          <h2 id="contact-title">
            {project ? <>Hablemos de<br /><span>{project.title}.</span></> : <>Hablemos de<br /><span>lo que sigue.</span></>}
          </h2>
          <p>{project ? `La conversación parte de ${project.title}, pero el objetivo es entender el problema detrás del concepto y decidir qué tendría sentido construir.` : 'Elige un horario y cuéntame qué necesitas construir. La primera conversación sirve para entender el problema, no para venderte una solución prefabricada.'}</p>
          {project && <button type="button" className="context-reset" onClick={clearContext}>Quitar contexto {icons.plus}</button>}
          <a href={`https://cal.com/${site.calLink}`} target="_blank" rel="noopener noreferrer" className="under-link">Abrir Cal.com en otra ventana {icons.arrow}</a>
        </div>
        <div className="calendar-shell">
          <CalBooking />
        </div>
      </div>
    </section>
  );
}
