'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav } from '../../data/site';
import { openCommandPalette } from './command-palette';

export default function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);
  const [tone, setTone] = useState<'night' | 'paper'>('night');
  // El menú se abre para la ruta actual: al navegar, se cierra solo.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (value: boolean | ((v: boolean) => boolean)) => {
    const next = typeof value === 'function' ? value(open) : value;
    setOpenAt(next ? pathname : null);
  };

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const header = headerRef.current;
      if (!header) return;
      setSolid(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
      // El tono de la cabecera sigue a la sección que tiene debajo.
      const rect = header.getBoundingClientRect();
      const probe = document.elementsFromPoint(window.innerWidth / 2, rect.bottom + 6);
      const section = probe.find((el) => !header.contains(el))?.closest<HTMLElement>('[data-tone]');
      setTone(section?.dataset.tone === 'paper' ? 'paper' : 'night');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenAt(null);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const effectiveTone = open ? 'night' : tone;

  return (
    <>
      <header ref={headerRef} className="site-header" data-solid={solid || open} data-tone={effectiveTone}>
        <Link href="/" className="brand" aria-label="Aragon, inicio">
          aragon<span className="brand-mark" aria-hidden="true" />
        </Link>
        <nav className="header-nav" aria-label="Principal">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="cmdk-trigger" onClick={openCommandPalette} aria-haspopup="dialog">
            Ir a <kbd>⌘K</kbd>
          </button>
          <Link href="/contacto" className="btn btn-primary btn-sm header-cta">
            Agendar llamada
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar el menú' : 'Abrir el menú'}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
        <span className="header-progress" aria-hidden="true" />
      </header>
      <div id="menu-movil" className="mobile-menu" data-open={open} aria-hidden={!open} inert={!open}>
        <nav aria-label="Menú">
          {[{ label: 'Inicio', href: '/' }, ...nav, { label: 'Contacto', href: '/contacto' }].map((item) => (
            <Link key={item.href} href={item.href} aria-current={item.href === pathname ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contacto" className="btn btn-primary btn-lg">
          Agendar una llamada de 30 minutos
        </Link>
      </div>
    </>
  );
}
