
'use client';

import { useEffect, useRef, useState } from 'react';

const navItems = [
  ['sistema', 'Sistema'],
  ['construimos', 'Construimos'],
  ['trabajo', 'Trabajo'],
  ['metodo', 'Método'],
  ['about', 'Estudio'],
] as const;

const darkSections = new Set(['problema', 'trabajo', 'contacto']);

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entryStarted, setEntryStarted] = useState(() => (
    typeof document !== 'undefined' && document.documentElement.dataset.aragonEntry === 'ready'
  ));
  const [active, setActive] = useState('inicio');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onEntry = () => setEntryStarted(true);
    window.addEventListener('aragon:entry-start', onEntry);
    return () => window.removeEventListener('aragon:entry-start', onEntry);
  }, []);

  useEffect(() => {
    const ids = ['inicio', 'problema', 'sistema', 'construimos', 'trabajo', 'metodo', 'about', 'lab', 'contacto'];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.05, 0.2, 0.45, 0.7] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      if (wasOpen.current) {
        wasOpen.current = false;
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
      return undefined;
    }

    wasOpen.current = true;
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
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const openContact = () => {
    setMenuOpen(false);
    window.dispatchEvent(new Event('aragon:open-contact'));
  };

  const theme = darkSections.has(active) ? 'dark' : 'light';

  return (
    <>
      <header
        className="site-header-v2 v9-header"
        data-theme={theme}
        data-scrolled={active !== 'inicio' || undefined}
        data-ready={entryStarted || undefined}
      >
        <a
          href="#inicio"
          className="brand-v2"
          onClick={() => setMenuOpen(false)}
          aria-label="Aragon, inicio"
          tabIndex={entryStarted ? 0 : -1}
        >
          <span className="brand-v2-mark">A</span>
          <span>
            <strong>ARAGON</strong>
            <small>SOFTWARE · TECHNOLOGY · DIGITAL</small>
          </span>
        </a>

        <nav className="desktop-nav-v2" aria-label="Principal">
          {navItems.map(([id, label], index) => (
            <a
              key={id}
              href={'#' + id}
              className={active === id ? 'is-active' : undefined}
              aria-current={active === id ? 'location' : undefined}
              tabIndex={entryStarted ? 0 : -1}
            >
              <span>0{index + 1}</span>{label}
            </a>
          ))}
          <a
            href="#contacto"
            className="desktop-nav-cta"
            onClick={openContact}
            tabIndex={entryStarted ? 0 : -1}
          >
            Contacto <span>↗</span>
          </a>
        </nav>

        <button
          ref={triggerRef}
          type="button"
          className={'menu-toggle-v2 ' + (menuOpen ? 'is-open' : '')}
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-v2"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          tabIndex={entryStarted ? 0 : -1}
        >
          <span />
          <span />
        </button>
      </header>

      <div className={'mobile-nav-v2-shell ' + (menuOpen ? 'is-open' : '')}>
        <nav
          id="mobile-nav-v2"
          ref={menuRef}
          className="mobile-nav-v2 v9-mobile-nav"
          aria-label="Menú móvil"
          aria-hidden={!menuOpen}
        >
          <div className="mobile-nav-v2-head">
            <span>ARAGON / INDEX</span>
            <span>{active.toUpperCase()}</span>
          </div>
          {navItems.map(([id, label], index) => (
            <a
              key={id}
              href={'#' + id}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen && entryStarted ? 0 : -1}
            >
              <span>{label}</span>
              <b>0{index + 1}</b>
            </a>
          ))}
          <a href="#lab" onClick={() => setMenuOpen(false)} tabIndex={menuOpen && entryStarted ? 0 : -1}>
            <span>Exploraciones</span><b>08</b>
          </a>
          <a href="#contacto" className="mobile-nav-v2-cta" onClick={openContact} tabIndex={menuOpen && entryStarted ? 0 : -1}>
            Contacto ↗
          </a>
        </nav>
      </div>
    </>
  );
}
