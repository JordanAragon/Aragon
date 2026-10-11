'use client';

import { useState } from 'react';
import { Check, Copy } from './icons';

export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="copy-btn"
      aria-label={done ? 'Copiado' : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 1800);
        } catch {
          setDone(false);
        }
      }}
    >
      {done ? <Check /> : <Copy />}
      <span>{done ? 'Copiado' : 'Copiar'}</span>
    </button>
  );
}
