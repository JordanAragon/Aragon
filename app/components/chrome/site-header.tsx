'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { chapters, nav } from '../../data/site';
import { services } from '../../data/services';
import { work } from '../../data/work';
import ServiceGlyph from '../ui/service-glyph';
import WorkShot from '../ui/work-shot';
import { ArrowRight } from '../ui/icons';
import { openCommandPalette } from './command-palette';

type Menu = 'servicios' | 'trabajo';
const MENUS: Menu[] = ['servicios', 'trabajo'];

/*
  La cabecera lleva todo lo que hacemos sin saturarse: Servicios y Trabajo
  abren un panel (cada servicio con su figura viva, cada proyecto con su
  captura), y el panel cambia de forma de un menú al otro en vez de cerrarse y
  abrirse. Quien navega solo desde aquí ve lo mismo que quien hace scroll.
  Se abre al pasar el cursor (con un instante de espera), con clic o con
  teclado; Esc lo cierra y devuelve el foco.
*/
export default function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<Menu, HTMLButtonElement | null>>({ servicios: null, trabajo: null });
  const contentRefs = useRef<Record<Menu, HTMLDivElement | null>>({ servicios: null, trabajo: null });
  const timer = useRef(0);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tone, setTone] = useState<'night' | 'paper'>('night');
  // El menú móvil y los paneles se abren para la ruta actual: al navegar, se cierran solos.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const [menuAt, setMenuAt] = useState<{ menu: Menu; path: string } | null>(null);
  const menu = menuAt?.path === pathname ? menuAt.menu : null;
  const [lastMenu, setLastMenu] = useState<Menu>('servicios');
  const [box, setBox] = useState({ x: 0, w: 0, h: 0 });

  const setOpen = (value: boolean | ((v: boolean) => boolean)) => {
    const next = typeof value === 'function' ? value(open) : value;
    setOpenAt(next ? pathname : null);
  };

  const showMenu = useCallback(
    (next: Menu | null) => {
      window.clearTimeout(timer.current);
      if (next) setLastMenu(next);
      setMenuAt(next ? { menu: next, path: pathname } : null);
    },
    [pathname],
  );

  const later = (next: Menu | null, ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => showMenu(next), ms);
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
        if (down) setMenuAt(null);
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

  // Con un panel abierto: Esc lo cierra (y el foco vuelve a su botón); un clic fuera, también.
  useEffect(() => {
    if (!menu) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      triggerRefs.current[menu]?.focus();
      showMenu(null);
    };
    const onDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) showMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [menu, showMenu]);

  // El panel toma el tamaño del menú activo y se centra bajo su botón.
  const current = menu ?? lastMenu;
  useLayoutEffect(() => {
    const measure = () => {
      const header = headerRef.current;
      const content = contentRefs.current[current];
      const trigger = triggerRefs.current[current];
      if (!header || !content || !trigger) return;
      const hw = header.offsetWidth;
      const w = Math.min(content.offsetWidth, hw);
      const center = trigger.getBoundingClientRect().left - header.getBoundingClientRect().left + trigger.offsetWidth / 2;
      const x = Math.max(0, Math.min(hw - w, center - w / 2));
      setBox({ x, w, h: content.offsetHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [current, menu]);

  // El indicador viaja de un enlace a otro; al entrar a la barra aparece donde está el cursor.
  const movePill = (event: React.PointerEvent<HTMLElement>) => {
    const bar = navRef.current;
    const link = (event.target as Element).closest('a, button');
    if (!bar || !link || !bar.contains(link)) return;
    const el = link as HTMLElement;
    bar.style.setProperty('--pill-x', `${el.offsetLeft}px`);
    bar.style.setProperty('--pill-w', `${el.offsetWidth}px`);
    bar.dataset.pill = bar.dataset.pill === 'true' || bar.dataset.pill === 'fresh' ? 'true' : 'fresh';
  };
  const hidePill = () => {
    if (navRef.current) navRef.current.dataset.pill = 'false';
  };

  const fine = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const effectiveTone = open ? 'night' : tone;
  const direction = MENUS.indexOf(current);

  return (
    <>
      <header
        ref={headerRef}
        className="site-header"
        data-solid={solid || open || Boolean(menu)}
        data-hidden={hidden && !open && !menu}
        data-tone={effectiveTone}
        data-menu={menu ?? undefined}
        onFocus={() => setHidden(false)}
        onPointerLeave={() => {
          if (menu && fine()) later(null, 220);
        }}
        onPointerEnter={() => window.clearTimeout(timer.current)}
      >
        <Link href="/" className="brand" aria-label="Aragon, inicio">
          aragon<span className="brand-mark" aria-hidden="true" />
        </Link>
        <nav ref={navRef} className="header-nav" aria-label="Principal" onPointerOver={movePill} onPointerLeave={hidePill}>
          <span className="nav-pill" aria-hidden="true" />
          {nav.map((item) => {
            const itemMenu = item.href === '/servicios' ? 'servicios' : item.href === '/trabajo' ? 'trabajo' : null;
            if (!itemMenu) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  onPointerEnter={() => {
                    if (menu && fine()) later(null, 120);
                  }}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={item.href}
                ref={(el) => {
                  triggerRefs.current[itemMenu] = el;
                }}
                type="button"
                className="nav-trigger"
                aria-expanded={menu === itemMenu}
                aria-controls={`menu-${itemMenu}`}
                data-current={isCurrent(item.href)}
                onPointerEnter={() => {
                  if (fine()) later(itemMenu, menu ? 0 : 90);
                }}
                onClick={() => showMenu(menu === itemMenu ? null : itemMenu)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    showMenu(itemMenu);
                    requestAnimationFrame(() => contentRefs.current[itemMenu]?.querySelector<HTMLElement>('a')?.focus());
                  }
                }}
              >
                {item.label}
                <svg className="nav-caret" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2 4l3 3 3-3" />
                </svg>
              </button>
            );
          })}
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

        <div
          className="nav-panel"
          data-open={Boolean(menu)}
          data-glyphs={menu === 'servicios' ? 'on' : 'off'}
          style={{ '--np-x': `${box.x}px`, '--np-w': `${box.w}px`, '--np-h': `${box.h}px` } as React.CSSProperties}
        >
          <div className="nav-panel-body">
            <div
              id="menu-servicios"
              ref={(el) => {
                contentRefs.current.servicios = el;
              }}
              className="np-content np-services"
              data-active={current === 'servicios'}
              data-side={direction > 0 ? 'before' : 'after'}
              inert={menu !== 'servicios'}
            >
              <ul className="np-service-list">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/servicios/${s.slug}`} className="np-service" aria-current={isCurrent(`/servicios/${s.slug}`) ? 'page' : undefined}>
                      <ServiceGlyph forma={s.forma} />
                      <span className="np-service-text">
                        <span className="np-verb mono">
                          {s.index} {s.verb.toLowerCase()}
                        </span>
                        <strong>{s.name}</strong>
                        <span className="np-promise">{s.promise}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="np-foot">
                <Link href="/servicios" className="np-foot-main">
                  Ver los cuatro servicios <ArrowRight className="arrow" />
                </Link>
                <Link href="/servicios#del-desorden-al-sistema">El recorrido: del desorden al sistema</Link>
                <Link href="/como-trabajamos">Cómo trabajamos</Link>
              </div>
            </div>
            <div
              id="menu-trabajo"
              ref={(el) => {
                contentRefs.current.trabajo = el;
              }}
              className="np-content np-work"
              data-active={current === 'trabajo'}
              data-side={direction > 1 ? 'before' : 'after'}
              inert={menu !== 'trabajo'}
            >
              <ul className="np-work-list">
                {work.map((w) => (
                  <li key={w.slug}>
                    <Link href={`/trabajo/${w.slug}`} className="np-work-item" aria-current={isCurrent(`/trabajo/${w.slug}`) ? 'page' : undefined}>
                      <span className="np-work-shot">
                        <WorkShot item={w} sizes="220px" decorative />
                      </span>
                      <strong>{w.title}</strong>
                      <span className="np-work-meta mono">
                        {w.kind.toLowerCase()} · {w.status.split(',')[0].toLowerCase()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="np-foot">
                <Link href="/trabajo" className="np-foot-main">
                  Ver todo el trabajo <ArrowRight className="arrow" />
                </Link>
                <span className="mono np-foot-note">Solo trabajo real, con su estado tal cual.</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div id="menu-movil" className="mobile-menu" data-open={open} data-glyphs={open ? 'on' : 'off'} aria-hidden={!open} inert={!open}>
        <nav aria-label="Menú">
          <ol className="mm-list">
            {chapters.map((c, i) => (
              <li key={c.href} style={{ '--i': i } as React.CSSProperties}>
                <Link href={c.href} className="mm-link" aria-current={c.href === pathname ? 'page' : undefined}>
                  <span className="mono tabular">{String(i + 1).padStart(2, '0')}</span>
                  {c.label}
                </Link>
                {c.href === '/servicios' && (
                  <ul className="mm-sub">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/servicios/${s.slug}`}>
                          <ServiceGlyph forma={s.forma} />
                          <span>{s.short}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {c.href === '/trabajo' && (
                  <ul className="mm-sub mm-sub-work">
                    {work.map((w) => (
                      <li key={w.slug}>
                        <Link href={`/trabajo/${w.slug}`}>{w.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Link href="/contacto" className="btn btn-primary btn-lg">
          Agendar una llamada de 30 minutos
        </Link>
      </div>
    </>
  );
}
