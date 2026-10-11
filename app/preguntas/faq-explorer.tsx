'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { faqTopics, faqs, type FaqTopic } from '../data/faq';
import { Search } from '../components/ui/icons';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/* Buscador de preguntas: filtra por tema y por texto (sin importar tildes), y «/» enfoca la búsqueda. */
export default function FaqExplorer() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<FaqTopic | 'Todas'>('Todas');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === '/' && !/input|textarea|select/i.test(target.tagName)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    // Si la URL trae una pregunta (#id), se abre.
    const id = window.location.hash.slice(1);
    if (id) {
      const el = document.getElementById(id) as HTMLDetailsElement | null;
      if (el) el.open = true;
    }
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return faqs.filter((f) => (topic === 'Todas' || f.topic === topic) && (!q || normalize(`${f.q} ${f.a}`).includes(q)));
  }, [query, topic]);

  return (
    <div className="faq-explorer">
      <div className="faq-tools">
        <label className="faq-search" htmlFor="faq-q">
          <Search />
          <span className="sr-only">Buscar en las preguntas</span>
          <input id="faq-q" ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca: precio, código, WhatsApp…" />
          <kbd className="mono" aria-hidden="true">
            /
          </kbd>
        </label>
        <div className="faq-topics" role="group" aria-label="Temas">
          {(['Todas', ...faqTopics] as const).map((t) => (
            <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <p className="faq-count mono" aria-live="polite">
        {results.length === 1 ? '1 pregunta' : `${results.length} preguntas`}
      </p>
      {results.length ? (
        <div className="accordion">
          {results.map((item) => (
            <details key={item.id} id={item.id} className="acc-item">
              <summary>
                <span>
                  <span className="faq-topic mono">{item.topic.toLowerCase()}</span>
                  {item.q}
                </span>
                <span className="acc-icon" aria-hidden="true" />
              </summary>
              <div className="acc-body">
                <div>
                  <p>{item.a}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="faq-empty">
          <p>No encontramos una pregunta con «{query}».</p>
          <p>
            Escríbela tal cual en el <Link href="/contacto">formulario de contacto</Link> y te respondemos.
          </p>
        </div>
      )}
    </div>
  );
}
