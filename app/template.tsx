'use client';

import { useEffect, useState } from 'react';

/*
  Cada página entra al llegar desde otra (la barra, el pie, la paleta ⌘K): sube
  un poco y se enfoca, así se nota que cambió el lugar sin cortar el ritmo. La
  primera carga no lo hace: ahí manda la precarga o la entrada de cada página.
*/
let navigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [enter] = useState(() => navigated);
  useEffect(() => {
    navigated = true;
  }, []);
  return (
    <div className="page" data-enter={enter || undefined}>
      {children}
    </div>
  );
}
