'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav } from '../../data/site';
import { openCommandPalette } from './command-palette';

export default function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
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
    let lastY = window.scrollY;
    const update = () => {
      raf = 0;
      const header = headerRef.current;
      if (!header) return;
      const y = window.scrollY;
      setSolid(y > 24);
      // Se aparta al bajar pasada la primera pantalla y vuelve al subir (o si algo de ella tiene el foco).
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        const down = delta > 0 && y > window.innerHeight * 0.7;
        setHidden(down && !header.contains(document.activeElement));
        lastY = y;
      }
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

  // El indicador viaja de un enlace a otro; al entrar a la barra aparece donde está el cursor.
  const movePill = (event: React.PointerEvent<HTMLElement>) => {
    const nav = navRef.current;
    const link = (event.target as Element).closest('a');
    if (!nav || !link || !nav.contains(link)) return;
    nav.style.setProperty('--pill-x', `${link.offsetLeft}px`);
    nav.style.setProperty('--pill-w', `${link.offsetWidth}px`);
    nav.dataset.pill = nav.dataset.pill === 'true' || nav.dataset.pill === 'fresh' ? 'true' : 'fresh';
  };
  const hidePill = () => {
    if (navRef.current) navRef.current.dataset.pill = 'false';
  };

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const effectiveTone = open ? 'night' : tone;

  return (
    <>
      <header
        ref={headerRef}
        className="site-header"
        data-solid={solid || open}
        data-hidden={hidden && !open}
        data-tone={effectiveTone}
        onFocus={() => setHidden(false)}
      >
        <Link href="/" className="brand" aria-label="Aragon, inicio">
          aragon<span className="brand-mark" aria-hidden="true" />
        </Link>
        <nav ref={navRef} className="header-nav" aria-label="Principal" onPointerOver={movePill} onPointerLeave={hidePill}>
          <span className="nav-pill" aria-hidden="true" />
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
