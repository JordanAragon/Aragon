'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { faqs } from '../../data/faq';
import { services } from '../../data/services';
import { calUrl, site } from '../../data/site';
import { work } from '../../data/work';

const OPEN_EVENT = 'aragon:cmdk';

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

type Item = { group: string; label: string; hint: string; href: string; keywords?: string };

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const ITEMS: Item[] = [
  { group: 'Páginas', label: 'Inicio', hint: '/', href: '/' },
  { group: 'Páginas', label: 'Servicios', hint: '/servicios', href: '/servicios' },
  { group: 'Páginas', label: 'Cómo trabajamos', hint: '/como-trabajamos', href: '/como-trabajamos', keywords: 'proceso fases metodo' },
  { group: 'Páginas', label: 'Trabajo', hint: '/trabajo', href: '/trabajo', keywords: 'casos proyectos portafolio' },
  { group: 'Páginas', label: 'Nosotros', hint: '/nosotros', href: '/nosotros', keywords: 'equipo quienes somos jordan' },
  { group: 'Páginas', label: 'Preguntas frecuentes', hint: '/preguntas', href: '/preguntas', keywords: 'faq dudas' },
  { group: 'Páginas', label: 'Contacto', hint: '/contacto', href: '/contacto', keywords: 'agendar llamada correo whatsapp' },
  ...services.map((s) => ({ group: 'Servicios', label: s.name, hint: s.verb.toLowerCase(), href: `/servicios/${s.slug}`, keywords: s.summary })),
  ...work.map((w) => ({ group: 'Trabajo', label: w.title, hint: w.kind.toLowerCase(), href: `/trabajo/${w.slug}`, keywords: w.summary })),
  ...faqs.map((f) => ({ group: 'Preguntas', label: f.q, hint: f.topic.toLowerCase(), href: `/preguntas#${f.id}`, keywords: f.a })),
  { group: 'Acciones', label: 'Agendar una llamada de 30 minutos', hint: 'cal.com', href: calUrl },
  { group: 'Acciones', label: 'Escribir por WhatsApp', hint: site.whatsappDisplay, href: site.whatsapp },
  { group: 'Acciones', label: 'Ver el portafolio de Jordan Aragon', hint: 'externo', href: site.portfolioUrl },
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return ITEMS.filter((item) => item.group !== 'Preguntas');
    return ITEMS.filter((item) => normalize(`${item.label} ${item.keywords ?? ''} ${item.group}`).includes(q)).slice(0, 14);
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus({ preventScroll: true });
  }, []);

  const go = useCallback(
    (item: Item) => {
      setOpen(false);
      if (item.href.startsWith('http')) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(item.href);
      }
    },
    [router],
  );

  useEffect(() => {
    const onOpen = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setQuery('');
      setActive(0);
      setOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => {
          if (!value) {
            returnFocus.current = document.activeElement as HTMLElement | null;
            setQuery('');
            setActive(0);
          }
          return !value;
        });
      }
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  if (!open) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((value) => Math.min(results.length - 1, value + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((value) => Math.max(0, value - 1));
    } else if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div className="cmdk-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Ir a una sección o buscar" onKeyDown={onKeyDown}>
        <div className="cmdk-input">
          <span aria-hidden="true">&gt;</span>
          <label htmlFor="cmdk-q" className="sr-only">
            Buscar
          </label>
          <input
            id="cmdk-q"
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            placeholder="Busca una página, un servicio o una pregunta"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={results[active] ? `cmdk-${active}` : undefined}
            autoComplete="off"
          />
        </div>
        <ul className="cmdk-list" id="cmdk-list" role="listbox" aria-label="Resultados">
          {results.length === 0 && <li className="cmdk-empty">Nada con ese nombre. Prueba con «automatización», «precio» o «contacto».</li>}
          {results.map((item, index) => {
            const header = index === 0 || results[index - 1].group !== item.group ? item.group : null;
            return (
              <li key={`${item.group}-${item.href}`} role="presentation">
                {header && (
                  <div className="cmdk-group" aria-hidden="true">
                    {header}
                  </div>
                )}
                <div className="cmdk-item" role="option" id={`cmdk-${index}`} aria-selected={index === active}>
                  <a
                    href={item.href}
                    onMouseEnter={() => setActive(index)}
                    onClick={(event) => {
                      event.preventDefault();
                      go(item);
                    }}
                    tabIndex={-1}
                  >
                    <span>{item.label}</span>
                    <small>{item.hint}</small>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="cmdk-foot" aria-hidden="true">
          <span>↑↓ moverse</span>
          <span>↵ abrir</span>
          <span>esc cerrar</span>
        </div>
      </div>
    </div>
  );
}
