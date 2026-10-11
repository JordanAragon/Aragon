'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/*
  Detalles de toda la página, con un solo oyente cada uno:
  - La luz bajo el cursor de los botones.
  - Los revelados al hacer scroll: titulares que suben desde su línea, reglas de
    sección que se trazan y listas que entran en orden. Solo se esconde lo que
    está por debajo de la pantalla al cargar (nada parpadea), y nada sin JS o con
    movimiento reducido.
*/
const REVEAL = [
  'main h2:not(.sr-only)',
  'main .section-label',
  'main [data-reveal]',
  'main .split-head > div',
  'main .problem-signs li',
  'main .principles li',
  'main .phase',
  'main .acc-item',
  'main .contact-paths > *',
  'main .contact-direct li',
  'main .showcase-head .text-link',
  '.site-footer .footer-top > *',
].join(',');

export default function Interactions() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const button = target?.closest?.<HTMLElement>('.btn');
      if (!button) return;
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      button.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        // Lo que entra en el mismo cuadro se escalona (las filas de una lista, por ejemplo).
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            const el = entry.target as HTMLElement;
            el.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 70}ms`);
            el.dataset.rv = 'in';
            io.unobserve(el);
          });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    const armed: HTMLElement[] = [];
    const arm = () => {
      const fold = window.innerHeight;
      document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
        if (el.dataset.rv) return;
        if (el.closest('.story-stage')) return;
        if (el.getBoundingClientRect().top < fold) return;
        el.dataset.rv = 'wait';
        armed.push(el);
        io.observe(el);
      });
    };
    // Tras el primer cuadro de la página nueva (su contenido ya está en el DOM).
    const raf = requestAnimationFrame(arm);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      // Al cambiar de página, lo que quedó esperando se muestra.
      armed.forEach((el) => {
        if (el.dataset.rv === 'wait') el.dataset.rv = 'in';
      });
    };
  }, [pathname]);

  return null;
}
