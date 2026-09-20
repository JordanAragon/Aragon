'use client';

import type { ReactNode } from 'react';

export default function ContactTrigger({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event('aragon:open-contact'))}
    >
      {children}
    </button>
  );
}
