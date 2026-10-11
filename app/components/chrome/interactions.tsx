'use client';

import { useEffect } from 'react';

/** La luz bajo el cursor de los botones: un solo oyente para toda la página. */
export default function Interactions() {
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
  return null;
}
