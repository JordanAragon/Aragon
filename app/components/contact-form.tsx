
'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { site } from '../data/site';
import { icons } from './icons';

type Props = {
  open: boolean;
  onClose: () => void;
  subject?: string;
};

export default function ContactForm({ open, onClose, subject = 'Proyecto Aragon' }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSubmitted(false);
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus());

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const close = () => {
    setSubmitted(false);
    onClose();
  };

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const body = [
      'Nombre: ' + String(form.get('name') ?? '').trim(),
      'Email: ' + String(form.get('email') ?? '').trim(),
      'Proyecto: ' + String(form.get('project') ?? '').trim(),
      '',
      String(form.get('message') ?? '').trim(),
    ].join('\n');

    setSubmitted(true);

    window.setTimeout(() => {
      window.location.href =
        'mailto:' + site.contactEmail +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    }, 40);
  };

  return (
    <div
      className="contact-form-layer"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        className="contact-form-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={submitted ? 'contact-form-success-title' : 'contact-form-title'}
      >
        <div className="contact-form-head">
          <div>
            <span>CONTACTO / ESCRIBIR</span>
            <small>NO HACE FALTA AGENDAR</small>
          </div>
          <button type="button" className="contact-form-close" onClick={close} aria-label="Cerrar formulario">×</button>
        </div>

        {submitted ? (
          <div className="contact-form-success">
            <span>MENSAJE / LISTO</span>
            <h2 id="contact-form-success-title">Tu correo está preparado.</h2>
            <p>Se abrirá tu cliente de correo con el contexto y el mensaje que acabas de escribir.</p>
            <button type="button" className="contact-form-submit" onClick={close}>Cerrar {icons.arrow}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-title">
              <span>CUÉNTAME QUÉ HAY QUE CONSTRUIR.</span>
              <h2 id="contact-form-title">Una idea, un problema o algo que todavía no tiene nombre.</h2>
            </div>

            <div className="contact-form-grid">
              <label>
                <span>01 / NOMBRE</span>
                <input required name="name" autoComplete="name" placeholder="Tu nombre" />
              </label>
              <label>
                <span>02 / EMAIL</span>
                <input required type="email" name="email" autoComplete="email" placeholder="tu@email.com" />
              </label>
              <label className="full">
                <span>03 / PROYECTO</span>
                <input name="project" placeholder="Nombre o contexto del proyecto" />
              </label>
              <label className="full">
                <span>04 / QUÉ HAY QUE RESOLVER</span>
                <textarea required name="message" rows={5} placeholder="Qué está pasando, qué quieres cambiar y qué debería existir al final." />
              </label>
            </div>

            <div className="contact-form-actions">
              <button type="submit" className="contact-form-submit">Preparar mensaje {icons.arrow}</button>
              <span>Se abrirá tu cliente de correo con el mensaje preparado.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
