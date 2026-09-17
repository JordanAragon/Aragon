'use client';

import { useEffect, useRef, useState } from 'react';

const navItems = [
  ['capacidades', 'Capacidades'],
  ['trabajo', 'Trabajo'],
  ['metodo', 'Método'],
  ['contacto', 'Agenda'],
] as const;

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('inicio');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = ['inicio', 'problema', 'capacidades', 'trabajo', 'contexto', 'metodo', 'contacto']
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-32% 0px -58% 0px', threshold: [0.05, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      triggerRef.current?.focus();
      return;
    }

    const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>('a');
    links?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !links?.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header glass-panel">
        <a href="#inicio" className="brand" onClick={closeMenu} aria-label="Aragon, inicio">
          <span className="brand-mark">A</span>
          <strong>ARAGON</strong>
        </a>

        <nav className="desktop-nav" aria-label="Principal">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : undefined} aria-current={active === id ? 'location' : undefined}>
              {label}
            </a>
          ))}
          <a href="#contacto" className="nav-portfolio">
            Agendar
          </a>
        </nav>

        <button
          ref={triggerRef}
          type="button"
          className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span />
          <span />
        </button>
      </header>

      <div className={`mobile-nav-shell ${menuOpen ? 'is-open' : ''}`} data-open={menuOpen || undefined}>
        <nav id="mobile-nav" ref={menuRef} className="mobile-nav glass-panel" aria-label="Menú móvil" aria-hidden={!menuOpen}>
          <div className="mobile-nav-head">
            <span>ARAGON / MENÚ</span>
            <span>00{Math.max(1, navItems.findIndex(([id]) => id === active) + 1)}</span>
          </div>
          {navItems.map(([id, label], index) => (
            <a key={id} href={`#${id}`} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              <span>{label}</span>
              <span>0{index + 1}</span>
            </a>
          ))}
          <a href="#contacto" onClick={closeMenu} className="mobile-portfolio" tabIndex={menuOpen ? 0 : -1}>
            Agendar <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </>
  );
}
