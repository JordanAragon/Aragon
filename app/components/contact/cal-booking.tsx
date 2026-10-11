'use client';

import { useEffect, useRef, useState } from 'react';
import { calUrl, site } from '../../data/site';
import { ArrowUpRight } from '../ui/icons';

type CalApi = ((...args: unknown[]) => void) & { ns?: Record<string, (...args: unknown[]) => void> };

const CAL_NAMESPACE = 'aragon30min';
const CAL_SCRIPT_URL = 'https://app.cal.com/embed/embed.js';

const CAL_BOOTSTRAP = `(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal; let ar = arguments;
    if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; const s = d.createElement('script'); s.src = A; s.async = true; d.head.appendChild(s); cal.loaded = true; }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || [];
      if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else { p(cal, ar); }
      return;
    }
    p(cal, ar);
  };
})(window, '${CAL_SCRIPT_URL}', 'init');`;

/* La agenda de Cal.com, cargada solo cuando se acerca a la pantalla. Si no carga, queda el enlace directo. */
export default function CalBooking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const target = targetRef.current;
    if (!wrapper || !target) return undefined;
    let disposed = false;
    let timeout: number | undefined;
    let mutation: MutationObserver | undefined;

    const init = () => {
      const win = window as Window & { Cal?: CalApi };
      if (disposed || !win.Cal) return;
      try {
        win.Cal('init', CAL_NAMESPACE, { origin: 'https://app.cal.com' });
        const ns = win.Cal.ns?.[CAL_NAMESPACE];
        if (!ns) throw new Error('Cal no disponible');
        ns('inline', { elementOrSelector: target, calLink: site.calLink, config: { layout: 'month_view', theme: 'dark' } });
        ns('ui', { theme: 'dark', styles: { branding: { brandColor: '#ffffff' } }, hideEventTypeDetails: false });
        mutation = new MutationObserver(() => {
          if (target.querySelector('iframe')) {
            setState('ready');
            mutation?.disconnect();
          }
        });
        mutation.observe(target, { childList: true, subtree: true });
        timeout = window.setTimeout(() => {
          if (!disposed && !target.querySelector('iframe')) setState('error');
        }, 12000);
      } catch {
        if (!disposed) setState('error');
      }
    };

    const visibility = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        visibility.disconnect();
        setState('loading');
        if (!document.querySelector('script[data-cal-bootstrap]')) {
          const script = document.createElement('script');
          script.dataset.calBootstrap = 'true';
          script.textContent = CAL_BOOTSTRAP;
          document.head.appendChild(script);
        }
        requestAnimationFrame(init);
      },
      { rootMargin: '600px 0px' },
    );
    visibility.observe(wrapper);
    return () => {
      disposed = true;
      visibility.disconnect();
      mutation?.disconnect();
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="cal-shell" data-state={state}>
      <div ref={targetRef} className="cal-inline" aria-label="Calendario para agendar una llamada de 30 minutos" aria-busy={state === 'loading'} />
      {state !== 'ready' && (
        <div className="cal-fallback" role={state === 'error' ? 'alert' : 'status'}>
          <strong>{state === 'error' ? 'La agenda no cargó aquí.' : 'Cargando la agenda…'}</strong>
          <span>Puedes reservar directamente en Cal.com: es la misma agenda.</span>
          <a className="btn btn-ghost btn-sm" href={calUrl} target="_blank" rel="noopener noreferrer">
            Abrir Cal.com <ArrowUpRight className="arrow" />
          </a>
        </div>
      )}
    </div>
  );
}
