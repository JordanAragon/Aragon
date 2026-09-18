'use client';

import { useEffect, useRef, useState } from 'react';

const navItems = [
  ['problema', 'Problema'],
  ['capacidades', 'Sistemas'],
  ['trabajo', 'Trabajo'],
  ['metodo', 'Método'],
] as const;

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entryStarted, setEntryStarted] = useState(() => (
    typeof document !== 'undefined' && document.documentElement.dataset.aragonEntry === 'ready'
  ));
  const [active, setActive] = useState('inicio');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  const openContact = () => {
    setMenuOpen(false);
    window.dispatchEvent(new Event('aragon:open-contact'));
  };

  useEffect(() => {
    const onEntry = () => setEntryStarted(true);
    window.addEventListener('aragon:entry-start', onEntry);
    return () => window.removeEventListener('aragon:entry-start', onEntry);
  }, []);

  useEffect(() => {
    const sections = ['inicio', 'problema', 'contexto', 'capacidades', 'trabajo', 'metodo', 'contacto']
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const targetId = visible.target.id === 'contexto' ? 'problema' : visible.target.id;
          setActive(targetId);
        }
      },
      { rootMargin: '-26% 0px -58% 0px', threshold: [0.05, 0.15, 0.35, 0.6] },
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

  return (
    <>
      <header className="site-header-v2" data-scrolled={active !== 'inicio' || undefined} data-ready={entryStarted || undefined}>
        <a href="#inicio" className="brand-v2" onClick={() => setMenuOpen(false)} aria-label="Aragon, inicio" tabIndex={entryStarted ? 0 : -1}>
          <span className="brand-v2-mark">A</span>
          <span><strong>ARAGON</strong><small>SOFTWARE / DIGITAL</small></span>
        </a>

        <nav className="desktop-nav-v2" aria-label="Principal">
          {navItems.map(([id, label], index) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : undefined} aria-current={active === id ? 'location' : undefined} tabIndex={entryStarted ? 0 : -1}>
              <span>0{index + 1}</span>{label}
            </a>
          ))}
          <a href="#contacto" className="desktop-nav-cta" onClick={openContact} tabIndex={entryStarted ? 0 : -1}>Contacto <span>↗</span></a>
        </nav>

        <button ref={triggerRef} type="button" className={`menu-toggle-v2 ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-nav-v2" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} tabIndex={entryStarted ? 0 : -1}>
          <span />
          <span />
        </button>
      </header>

      <div className={`mobile-nav-v2-shell ${menuOpen ? 'is-open' : ''}`} data-open={menuOpen || undefined}>
        <nav id="mobile-nav-v2" ref={menuRef} className="mobile-nav-v2" aria-label="Menú móvil" aria-hidden={!menuOpen}>
          <div className="mobile-nav-v2-head"><span>ARAGON / MENU</span><span>INDEX {active.toUpperCase()}</span></div>
          {navItems.map(([id, label], index) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} tabIndex={menuOpen && entryStarted ? 0 : -1}>
              <span>{label}</span><b>0{index + 1}</b>
            </a>
          ))}
          <a href="#contacto" className="mobile-nav-v2-cta" onClick={openContact} tabIndex={menuOpen && entryStarted ? 0 : -1}>Contacto ↗</a>
        </nav>
      </div>
    </>
  );
}
