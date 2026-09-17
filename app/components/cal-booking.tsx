'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';
import { icons } from './icons';

type CalApi = ((...args: unknown[]) => void) & {
  ns?: Record<string, (...args: unknown[]) => void>;
};

const CAL_NAMESPACE = 'aragon30min';
const CAL_SCRIPT_URL = 'https://app.cal.com/embed/embed.js';
const CAL_ORIGIN = 'https://app.cal.com';

const CAL_BOOTSTRAP = `(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal;
    let ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const script = d.createElement('script');
      script.src = A;
      script.async = true;
      d.head.appendChild(script);
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === 'string') {
        cal.ns[namespace] = cal.ns[namespace] || api;
        p(cal.ns[namespace], ar);
        p(cal, ['initNamespace', namespace]);
      } else {
        p(cal, ar);
      }
      return;
    }
    p(cal, ar);
  };
})(window, '${CAL_SCRIPT_URL}', 'init');`;

export default function CalBooking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const target = targetRef.current;
    if (!wrapper || !target) return;

    let disposed = false;
    let timeoutId: number | undefined;
    let observer: MutationObserver | undefined;
    let visibilityObserver: IntersectionObserver | undefined;

    const init = () => {
      if (disposed || !target) return;
      const win = window as Window & { Cal?: CalApi };
      if (!win.Cal) return;

      try {
        win.Cal('init', CAL_NAMESPACE, { origin: CAL_ORIGIN });
        const namespace = win.Cal.ns?.[CAL_NAMESPACE];
        if (!namespace) throw new Error('Cal namespace unavailable');

        namespace('inline', {
          elementOrSelector: target,
          calLink: site.calLink,
          config: { layout: 'month_view', theme: 'dark', useSlotsViewOnSmallScreen: true },
        });
        namespace('ui', {
          styles: { branding: { brandColor: '#f6f6f2' } },
          hideEventTypeDetails: false,
        });

        setState('loading');
        observer = new MutationObserver(() => {
          if (target.querySelector('iframe')) {
            setState('ready');
            if (timeoutId) window.clearTimeout(timeoutId);
            observer?.disconnect();
          }
        });
        observer.observe(target, { childList: true, subtree: true });

        if (target.querySelector('iframe')) setState('ready');
        timeoutId = window.setTimeout(() => {
          if (!disposed && !target.querySelector('iframe')) setState('error');
        }, 12000);
      } catch {
        if (!disposed) setState('error');
      }
    };

    const load = () => {
      if (disposed) return;
      setState('loading');

      const existing = document.querySelector<HTMLScriptElement>('script[data-aragon-cal-bootstrap="true"]');
      if (!existing) {
        const bootstrap = document.createElement('script');
        bootstrap.type = 'text/javascript';
        bootstrap.dataset.aragonCalBootstrap = 'true';
        bootstrap.textContent = CAL_BOOTSTRAP;
        document.head.appendChild(bootstrap);
      }

      requestAnimationFrame(init);
    };

    visibilityObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          visibilityObserver?.disconnect();
          load();
        }
      },
      { rootMargin: '720px 0px' },
    );
    visibilityObserver.observe(wrapper);

    return () => {
      disposed = true;
      visibilityObserver?.disconnect();
      observer?.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="cal-booking-shell">
      <div ref={targetRef} className="cal-inline" aria-label="Calendario para agendar una reunión" aria-busy={state === 'loading'} />
      {state === 'loading' && <p className="cal-status" role="status">Cargando agenda…</p>}
      {state === 'error' && (
        <div className="cal-fallback" role="alert">
          <strong>La agenda no pudo cargarse aquí.</strong>
          <span>Puedes reservar directamente en Cal.com sin perder el contexto.</span>
          <a href={`https://cal.com/${site.calLink}`} target="_blank" rel="noopener noreferrer">
            Abrir Cal.com {icons.arrow}
          </a>
        </div>
      )}
    </div>
  );
}
