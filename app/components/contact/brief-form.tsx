'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { services } from '../../data/services';
import { site } from '../../data/site';
import { Check, Copy } from '../ui/icons';

/*
  Formulario de contacto sin servidor propio: arma un resumen del proyecto y
  lo envía por el canal que la persona elija (WhatsApp o correo), o lo copia.
  No se guarda nada en el sitio.
*/

type Fields = { name: string; company: string; need: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const NEEDS = [...services.map((s) => s.name), 'Todavía no lo sé'];

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Escribe tu nombre para saber cómo llamarte.';
  if (!f.need) e.need = 'Elige la opción más cercana; puedes cambiarla en la llamada.';
  if (f.message.trim().length < 20) e.message = 'Cuéntanos un poco más: qué pasa hoy y qué te gustaría que cambiara.';
  return e;
}

export default function BriefForm() {
  const uid = useId();
  const [fields, setFields] = useState<Fields>({ name: '', company: '', need: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [brief, setBrief] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [key]: event.target.value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const e = validate(fields);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setBrief(
      [
        `Hola, soy ${fields.name.trim()}${fields.company.trim() ? ` de ${fields.company.trim()}` : ''}.`,
        `Me interesa: ${fields.need}.`,
        '',
        fields.message.trim(),
      ].join('\n'),
    );
    setCopied(false);
  };

  const copy = async () => {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (brief) {
    const wa = `${site.whatsapp}?text=${encodeURIComponent(brief)}`;
    const mail = `mailto:${site.contactEmail}?subject=${encodeURIComponent(`Proyecto con Aragon — ${fields.need}`)}&body=${encodeURIComponent(brief)}`;
    return (
      <div className="brief-ready" role="status">
        <p className="brief-ready-title">Tu mensaje está listo. Elige por dónde enviarlo.</p>
        <pre className="brief-preview">{brief}</pre>
        <div className="brief-actions">
          <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer">
            Enviar por WhatsApp
          </a>
          <a className="btn btn-ghost" href={mail}>
            Enviar por correo
          </a>
          <button type="button" className="btn btn-ghost" onClick={copy}>
            {copied ? <Check className="arrow" /> : <Copy className="arrow" />} {copied ? 'Copiado' : 'Copiar el mensaje'}
          </button>
        </div>
        <p className="brief-note">
          Si el botón no abre tu app, copia el mensaje y escríbenos a <span className="mono">{site.contactEmail}</span>.
        </p>
        <button type="button" className="text-link" onClick={() => setBrief(null)}>
          Editar el mensaje
        </button>
      </div>
    );
  }

  const describedBy = (key: keyof Fields) => (errors[key] ? `${uid}-${key}-error` : undefined);

  return (
    <form className="brief-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor={`${uid}-name`}>Tu nombre</label>
        <input id={`${uid}-name`} name="name" autoComplete="name" value={fields.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={describedBy('name')} />
        {errors.name && (
          <p className="field-error" id={`${uid}-name-error`}>
            {errors.name}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor={`${uid}-company`}>
          Empresa o negocio <span>opcional</span>
        </label>
        <input id={`${uid}-company`} name="company" autoComplete="organization" value={fields.company} onChange={set('company')} />
      </div>
      <fieldset className="field field-full">
        <legend id={`${uid}-need`} tabIndex={-1}>
          ¿Qué necesitas?
        </legend>
        <div className="need-options" role="radiogroup" aria-labelledby={`${uid}-need`} aria-describedby={describedBy('need')}>
          {NEEDS.map((need) => (
            <label key={need} className="need-option" data-checked={fields.need === need}>
              <input type="radio" name="need" value={need} checked={fields.need === need} onChange={set('need')} />
              {need}
            </label>
          ))}
        </div>
        {errors.need && (
          <p className="field-error" id={`${uid}-need-error`}>
            {errors.need}
          </p>
        )}
      </fieldset>
      <div className="field field-full">
        <label htmlFor={`${uid}-message`}>¿Qué pasa hoy y qué te gustaría cambiar?</label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          value={fields.message}
          onChange={set('message')}
          placeholder="Ej.: los pedidos llegan por WhatsApp y se nos pierden entre la libreta y la bodega."
          aria-invalid={!!errors.message}
          aria-describedby={describedBy('message')}
        />
        {errors.message && (
          <p className="field-error" id={`${uid}-message-error`}>
            {errors.message}
          </p>
        )}
      </div>
      <div className="form-foot field-full">
        <button type="submit" className="btn btn-primary btn-lg">
          Preparar mi mensaje
        </button>
        <p>
          No guardamos nada en este sitio: el mensaje sale por tu WhatsApp o tu correo. Ver{' '}
          <a href="/privacidad">tratamiento de datos</a>.
        </p>
      </div>
    </form>
  );
}
