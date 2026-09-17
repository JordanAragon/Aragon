'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import aragonServerImage from '../img/aragon-server.png';

const CAL_LINK = 'jordan-david-micolta-aragon-cognqx/30min';
const CAL_NAMESPACE = 'aragon30min';

type CalNamespace = ((...args: unknown[]) => void);
type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  q?: unknown[][];
  ns?: Record<string, CalNamespace>;
};

const icon = (path: React.ReactNode) => <svg viewBox="0 0 24 24" aria-hidden="true">{path}</svg>;
const icons = {
  arrow: icon(<path d="M5 19 19 5M8 5h11v11" />),
  plus: icon(<path d="M12 5v14M5 12h14" />),
  dot: icon(<circle cx="12" cy="12" r="2.5" />),
  code: icon(<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />),
  system: icon(<><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h5M8 16h3"/></>),
  spark: icon(<><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>),
};

const problems = [
  { id: '01', word: 'MARCA', title: 'No se entiende.', copy: 'Una buena idea pierde fuerza cuando nadie entiende qué hace, para quién es o por qué importa.' },
  { id: '02', word: 'PROCESO', title: 'Se complica.', copy: 'Información dispersa, pasos manuales y herramientas que terminan haciendo más lento el trabajo.' },
  { id: '03', word: 'PRODUCTO', title: 'Se queda a medias.', copy: 'Una experiencia puede funcionar técnicamente y aun así sentirse incompleta, confusa o difícil de usar.' },
];

const capabilities = [
  { id: '01', title: 'Presencia', kicker: 'WEB · IDENTIDAD · EXPERIENCIA', copy: 'Sitios que explican, posicionan y convierten sin sentirse como una plantilla con el logo cambiado.', icon: icons.spark },
  { id: '02', title: 'Sistema', kicker: 'SOFTWARE · PROCESOS · DATOS', copy: 'Herramientas construidas alrededor de cómo funciona realmente un proceso, no de cuántos componentes caben.', icon: icons.system },
  { id: '03', title: 'Producto', kicker: 'FRONTEND · INTERACCIÓN · EVOLUCIÓN', copy: 'Experiencias digitales que necesitan diseño, desarrollo y criterio para dejar de sentirse a medio hacer.', icon: icons.code },
];

const projects = [
  { id: '01', title: 'Aragon Finance', label: 'CONCEPTO / EN DESARROLLO', image: '/projects/aragon-finance.svg', href: '#contacto', kicker: 'UN SISTEMA PERSONAL PARA ENTENDER, PLANEAR Y CONTROLAR EL DINERO.', body: 'Una plataforma de finanzas personales con patrimonio, flujo mensual, presupuestos y una lectura más clara de cómo se mueve el dinero.', tags: 'Next.js · Supabase · FastAPI · Gemini' },
  { id: '02', title: 'Agro OS', label: 'CONCEPTO / EN DESARROLLO', image: '/projects/agro-os.svg', href: '#contacto', kicker: 'LA OPERACIÓN AGRÍCOLA, VISTA COMO UN SOLO SISTEMA.', body: 'Un centro operativo para viveros y pequeñas operaciones agrícolas: lotes, tareas, trazabilidad, alertas y estado general en una sola experiencia.', tags: 'React · Data · Workflows · UX' },
  { id: '03', title: 'Nexo', label: 'CONCEPTO / EN DESARROLLO', image: '/projects/nexo-infrastructure.svg', href: '#contacto', kicker: 'UNA CONSOLA PARA HACER VISIBLE TODA TU INFRAESTRUCTURA.', body: 'Una interfaz privada para supervisar servicios, almacenamiento, red, disponibilidad y automatizaciones de un entorno self-hosted.', tags: 'Next.js · Docker · Linux · APIs' },
  { id: '04', title: 'Atelier', label: 'CONCEPTO / EN DESARROLLO', image: '/projects/cali-commerce.svg', href: '#contacto', kicker: 'COMERCIO PRIVADO QUE SE SIENTE COMO UNA EXPERIENCIA EDITORIAL.', body: 'Una plataforma premium para marcas y clubes de compra con drops limitados, perfiles privados, catálogo curado y una experiencia de checkout más cuidada.', tags: 'Next.js · WooCommerce · UX · Commerce' },
];

const steps = [
  ['01', 'Entender', 'Qué está pasando realmente.'],
  ['02', 'Definir', 'Qué necesita cambiar.'],
  ['03', 'Construir', 'La experiencia, sistema o producto adecuado.'],
  ['04', 'Pulir', 'Hasta que deje de sentirse como una versión a medias.'],
];

function IconBox({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`icon-box ${className}`}>{children}</span>;
}

function CalBooking() {
  const calRef = useRef<HTMLDivElement>(null);
  const [calLoaded, setCalLoaded] = useState(false);
  const [calFailed, setCalFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let failTimer: number | undefined;
    let observer: MutationObserver | undefined;

    const win = window as Window & { Cal?: CalApi };

    const queue = (api: CalApi, args: unknown[]) => {
      api.q = api.q || [];
      api.q.push(args);
    };

    if (!win.Cal) {
      const cal = ((...args: unknown[]) => {
        const current = win.Cal as CalApi;

        if (!current.loaded) {
          current.ns = {};
          current.q = current.q || [];
          const script = document.createElement('script');
          script.src = 'https://app.cal.com/embed/embed.js';
          script.async = true;
          script.dataset.calScript = 'aragon-sdk';
          script.addEventListener('error', () => {
            if (!disposed) setCalFailed(true);
          }, { once: true });
          document.head.appendChild(script);
          current.loaded = true;
        }

        if (args[0] === 'init') {
          const namespace = args[1];
          const api = ((...apiArgs: unknown[]) => queue(api, apiArgs)) as CalNamespace & { q?: unknown[][] };
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            current.ns = current.ns || {};
            const existing = current.ns[namespace] as (CalNamespace & { q?: unknown[][] }) | undefined;
            current.ns[namespace] = existing || api;
            queue(current.ns[namespace], args);
            queue(current, ['initNamespace', namespace]);
          } else {
            queue(current, args);
          }
          return;
        }

        queue(current, args);
      }) as CalApi;

      win.Cal = cal;
    }

    if (!win.Cal) {
      setCalFailed(true);
      return () => undefined;
    }

    win.Cal('init', CAL_NAMESPACE, { origin: 'https://app.cal.com' });
    const namespace = win.Cal.ns?.[CAL_NAMESPACE];

    if (!namespace || !calRef.current) {
      setCalFailed(true);
      return () => undefined;
    }

    namespace('inline', {
      elementOrSelector: calRef.current,
      calLink: CAL_LINK,
      config: { layout: 'month_view', theme: 'dark' },
    });
    namespace('ui', {
      styles: { branding: { brandColor: '#f6f6f2' } },
    });

    observer = new MutationObserver(() => {
      if (calRef.current?.querySelector('iframe')) {
        setCalLoaded(true);
        if (failTimer) window.clearTimeout(failTimer);
        observer?.disconnect();
      }
    });
    observer.observe(calRef.current, { childList: true, subtree: true });

    if (calRef.current.querySelector('iframe')) setCalLoaded(true);

    failTimer = window.setTimeout(() => {
      if (!disposed && !calRef.current?.querySelector('iframe')) setCalFailed(true);
    }, 10000);

    return () => {
      disposed = true;
      if (failTimer) window.clearTimeout(failTimer);
      observer?.disconnect();
    };
  }, []);

  return (
    <div className="cal-booking-shell">
      <div ref={calRef} className="cal-inline" aria-label="Calendario para agendar una reunión" aria-busy={!calLoaded && !calFailed} />
      {!calLoaded && !calFailed && <p className="cal-status" role="status">Cargando agenda…</p>}
      {calFailed && (
        <div className="cal-fallback" role="alert">
          <strong>La agenda no pudo cargarse aquí.</strong>
          <span>La reserva sigue disponible directamente en Cal.com.</span>
          <a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noreferrer">Abrir Cal.com {icons.arrow}</a>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('inicio');
  const [activeProject, setActiveProject] = useState(0);
  const [projectDirection, setProjectDirection] = useState(1);
  const heroRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const previousProject = useRef(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smoothMx = useSpring(mx, { stiffness: 130, damping: 22, mass: 0.22 });
  const smoothMy = useSpring(my, { stiffness: 130, damping: 22, mass: 0.22 });
  const { scrollYProgress } = useScroll();
  const heroProgress = useScroll({ target: heroRef, offset: ['start start', 'end start'] }).scrollYProgress;
  const workProgress = useScroll({ target: workRef, offset: ['start start', 'end end'] }).scrollYProgress;
  const smoothWorkProgress = useSpring(workProgress, { stiffness: 95, damping: 28, mass: 0.38 });
  const workVelocity = useSpring(useVelocity(workProgress), { stiffness: 90, damping: 22, mass: 0.3 });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -180]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.72]);
  const heroOpacity = useTransform(heroProgress, [0, 0.55, 1], [1, 1, 0]);
  const heroVisualScale = useTransform(heroProgress, [0, 1], [1, 1.4]);
  const heroGhostX = useTransform(heroProgress, [0, 1], [0, -150]);
  const storyScale = useTransform(smoothWorkProgress, [0, 0.12, 0.3, 0.5, 0.7, 0.88, 1], [0.86, 0.94, 1, 1, 0.98, 0.93, 0.87]);
  const storyY = useTransform(smoothWorkProgress, [0, 0.12, 0.3, 0.5, 0.7, 0.88, 1], ['8vh', '3vh', '0vh', '0vh', '-1vh', '-4vh', '-8vh']);
  const storyRotate = useTransform(smoothWorkProgress, [0, 0.14, 0.32, 0.68, 0.86, 1], [1.7, 0.6, 0, 0, -0.7, -1.6]);
  const storyVelocityTilt = useTransform(workVelocity, [-1.2, 0, 1.2], [1.4, 0, -1.4]);
  const storyClip = useTransform(smoothWorkProgress, [0, 0.12, 0.3, 0.7, 0.88, 1], ['inset(12% 9% 12% 9% round 28px)', 'inset(6% 4% 6% 4% round 18px)', 'inset(0% 0% 0% 0% round 0px)', 'inset(0% 0% 0% 0% round 0px)', 'inset(6% 4% 6% 4% round 18px)', 'inset(12% 9% 12% 9% round 28px)']);
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.25 });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setLoading(false);
      return;
    }
    const timer = window.setTimeout(() => setLoading(false), 1750);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ids = ['inicio', 'problema', 'capacidades', 'trabajo', 'contexto', 'metodo', 'contacto'];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActive(current.target.id);
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let previous = -1;
    const unsubscribe = smoothWorkProgress.on('change', (value) => {
      const next = Math.min(projects.length - 1, Math.floor(Math.min(0.999999, Math.max(0, value)) * projects.length));
      if (next !== previous) {
        previous = next;
        setProjectDirection(next >= previousProject.current ? 1 : -1);
        previousProject.current = next;
        setActiveProject(next);
      }
    });
    return () => unsubscribe();
  }, [smoothWorkProgress]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menu || loading);
    return () => document.body.classList.remove('menu-open');
  }, [menu, loading]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    mx.set((event.clientX / window.innerWidth - 0.5) * 18);
    my.set((event.clientY / window.innerHeight - 0.5) * 18);
  };

  const navItems = [['capacidades', 'capacidades'], ['trabajo', 'trabajo'], ['metodo', 'método'], ['contacto', 'agenda']];
  const activeStory = projects[activeProject];

  return (
    <>
      <AnimatePresence>
        {loading && <motion.div className="entry-loader" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ clipPath: 'inset(0% 0% 100% 0%)' }} transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }} role="status" aria-label="Cargando Aragon"><div className="loader-inner"><span className="loader-kicker">ARAGON / DIGITAL STUDIO</span><div className="loader-word" aria-hidden="true">{'ARAGON'.split('').map((letter, index) => <motion.span key={letter + index} initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.55, delay: index * 0.11, ease: [0.16, 1, 0.3, 1] }}>{letter}</motion.span>)}</div><div className="loader-bottom"><span>INITIALIZING EXPERIENCE</span><span>001</span></div><motion.div className="loader-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.65, ease: [0.76, 0, 0.24, 1] }} /></div></motion.div>}
      </AnimatePresence>

      <main className="site-root" onMouseMove={handleMove}>
        <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
        <div className="noise" aria-hidden="true" />
        <a className="skip-link" href="#contenido">Saltar al contenido</a>

        <header className="site-header glass-panel"><a href="#inicio" className="brand" onClick={() => setMenu(false)} aria-label="Aragon, inicio"><span className="brand-mark">A</span><strong>ARAGON</strong></a><nav className="desktop-nav" aria-label="Principal">{navItems.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''}>{label}</a>)}<a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer" className="nav-portfolio">portfolio {icons.arrow}</a></nav><button className={`menu-toggle ${menu ? 'is-open' : ''}`} onClick={() => setMenu((value) => !value)} aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}><span /><span /></button></header>

        <AnimatePresence>{menu && <motion.nav id="mobile-nav" className="mobile-nav glass-panel" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} aria-label="Menú móvil"><div className="mobile-nav-head"><span>ARAGON / MENU</span><span>00{Math.max(1, navItems.findIndex(([id]) => id === active) + 1)}</span></div>{navItems.map(([id, label], index) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}><span>{label}</span><span>0{index + 1}</span></a>)}<a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noreferrer" className="mobile-portfolio">Abrir agenda {icons.arrow}</a></motion.nav>}</AnimatePresence>

        <div id="contenido">
          <section id="inicio" ref={heroRef} className="hero" aria-labelledby="hero-title"><div className="hero-grid" aria-hidden="true" /><motion.div className="hero-visual" style={{ scale: heroVisualScale, x: smoothMx, y: smoothMy }} aria-hidden="true"><div className="hero-visual-ring hero-visual-ring-a" /><div className="hero-visual-ring hero-visual-ring-b" /><div className="hero-visual-word">ARAGON</div><div className="hero-visual-core"><span>ARAGON</span><i /></div><div className="hero-visual-tag tag-a">IDEA</div><div className="hero-visual-tag tag-b">SYSTEM</div><div className="hero-visual-tag tag-c">OUTPUT</div></motion.div><motion.div className="hero-meta page-shell" style={{ opacity: heroOpacity }}><span><i className="status-dot" /> ARAGON / DIGITAL STUDIO</span><span>CALI / COLOMBIA</span><span>2026 / 001</span></motion.div><motion.div className="hero-content page-shell" style={{ y: heroTextY, opacity: heroOpacity }}><div className="hero-topline"><span>IDEA → PROBLEM → SYSTEM</span><span>BUILT WITH INTENT</span></div><motion.h1 id="hero-title" style={{ scale: heroScale }} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}>Tu idea<br /><span>ya existe.</span><br /><em>Ahora hagámosla funcionar.</em></motion.h1><motion.div className="hero-ghost" style={{ x: heroGhostX }} aria-hidden="true">ARAGON / 001</motion.div><div className="hero-bottom"><div className="hero-copy"><span className="hero-index">THE PREMISE</span><p>Aragon diseña y desarrolla experiencias digitales, software y sistemas para convertir problemas reales en productos que la gente puede entender y usar.</p></div><a href="#trabajo" className="hero-cta"><span>Ver lo que construimos</span><IconBox>{icons.arrow}</IconBox></a></div></motion.div><div className="hero-side" aria-hidden="true">SCROLL <span /> ↓</div></section>

          <section id="problema" className="problem section-shell"><div className="page-shell"><div className="problem-intro"><div><span className="section-number">01</span><span className="section-label">EL PROBLEMA</span></div><p>Los problemas digitales rara vez empiezan en el código.</p></div><div className="problem-marquee" aria-hidden="true"><span>WHAT ISN’T WORKING?</span><span>WHAT ISN’T WORKING?</span></div><div className="problem-statement"><h2>Todo empieza con algo que <span>no funciona como debería.</span></h2><p>Una marca que no se entiende. Un proceso que se complica. Un producto que se queda a medias.</p></div><div className="problem-list">{problems.map((problem, index) => <motion.article key={problem.id} className="problem-item" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, delay: index * 0.06 }}><span>{problem.id}</span><div><small>{problem.word}</small><h3>{problem.title}</h3></div><p>{problem.copy}</p><IconBox>{icons.arrow}</IconBox></motion.article>)}</div></div></section>

          <section id="capacidades" className="capabilities section-shell"><div className="page-shell"><div className="section-heading"><div><span className="section-number">02</span><span className="section-label">LO QUE CONSTRUIMOS</span></div><h2>No vendemos<br /><span>categorías.</span></h2></div><p className="section-lead">A veces es una web. A veces es un sistema. A veces es un producto entero. Lo importante es qué necesita existir para resolver el problema.</p><div className="capability-grid">{capabilities.map((capability, index) => <motion.article key={capability.id} className="capability-card" whileHover={{ y: -10 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}><div className="capability-top"><span>{capability.id}</span><IconBox>{capability.icon}</IconBox></div><small>{capability.kicker}</small><h3>{capability.title}</h3><p>{capability.copy}</p><span className="capability-index">0{index + 1} / 03</span></motion.article>)}</div></div></section>

          <section id="trabajo" ref={workRef} className="work-story section-shell"><div className="work-stage"><div className="page-shell work-story-head"><div><span className="section-number">03</span><span className="section-label">LAB / FUTURO</span></div><h2>Cuatro ideas.<br /><span>Cuatro sistemas por construir.</span></h2></div><div className="story-viewport page-shell"><motion.div className="story-backdrop" style={{ scale: storyScale, y: storyY, rotateZ: storyRotate, rotateY: storyVelocityTilt, clipPath: storyClip, transformPerspective: 1200 }}>{projects.map((project, index) => { const distance = index - activeProject; const direction = distance === 0 ? 0 : distance < 0 ? -1 : 1; return <motion.div key={project.id} className="story-layer" animate={{ opacity: activeProject === index ? 1 : 0, scale: activeProject === index ? 1 : 1.065, x: activeProject === index ? 0 : direction * 54, y: activeProject === index ? 0 : 16, rotateZ: activeProject === index ? 0 : direction * -1.1 }} transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }} aria-hidden={activeProject !== index}><Image src={project.image} alt={activeProject === index ? `Concepto visual de ${project.title}` : ''} fill sizes="(max-width: 900px) 100vw, 82vw" priority={index === 0} /><div className="story-layer-shade" /></motion.div>; })}<div className="story-ui"><AnimatePresence mode="wait" initial={false}><motion.span key={`${activeStory.id}-label`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>{activeStory.label}</motion.span><motion.span key={`${activeStory.id}-count`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>{activeStory.id} / 04</motion.span></AnimatePresence></div></motion.div><div className="story-copy" aria-live="polite"><AnimatePresence mode="sync" initial={false}><motion.div key={activeStory.id} className="story-copy-item" initial={{ opacity: 0, x: projectDirection * 34, y: 20, scale: 0.985 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} exit={{ opacity: 0, x: projectDirection * -26, y: -16, scale: 0.99 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>{activeStory && <><span className="story-kicker">{activeStory.kicker}</span><h3>{activeStory.title}</h3><p>{activeStory.body}</p><div className="story-tags">{activeStory.tags}</div><a href={activeStory.href}>Hablar de este concepto {icons.arrow}</a></>}</motion.div></AnimatePresence></div><div className="story-index" aria-label="Progreso de proyectos"><span>SCROLL STORY</span><div>{projects.map((project, index) => <span key={project.id} className={activeProject === index ? 'is-active' : ''} aria-current={activeProject === index ? 'step' : undefined}>{project.id}</span>)}</div></div></div></div></section>

          <section id="contexto" className="context section-shell"><div className="page-shell context-grid"><motion.div className="context-visual" whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }} initial={{ clipPath: 'inset(10% 10% 10% 10% round 28px)' }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}><Image src={aragonServerImage} alt="Infraestructura personal de Aragon" fill sizes="(max-width: 900px) 100vw, 58vw" /><div className="context-overlay"/><span className="context-stamp">CONTEXT / 04</span><span className="context-coordinates">HARDWARE · NETWORK · SOFTWARE · SYSTEMS</span></motion.div><div className="context-copy"><span className="section-number">04</span><span className="section-label">LO QUE HAY DETRÁS</span><h2>No solo diseño <span>la superficie.</span></h2><p>Mi recorrido mezcla soporte técnico, infraestructura, desarrollo web y construcción de productos. Por eso pienso en la interfaz, pero también en lo que tiene que funcionar detrás.</p><div className="context-facts"><div><small>BASE</small><b>Sistemas / Tecnología</b></div><div><small>ENFOQUE</small><b>Producto / Experiencia</b></div><div><small>ORIGEN</small><b>Cali, Colombia</b></div></div><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer" className="under-link">Conocer el recorrido {icons.arrow}</a></div></div></section>

          <section id="metodo" className="method section-shell"><div className="page-shell"><div className="section-heading"><div><span className="section-number">05</span><span className="section-label">MÉTODO</span></div><h2>De la idea<br /><span>a algo que funciona.</span></h2></div><div className="method-intro"><p>La creatividad no reemplaza el criterio. El código tampoco. El proceso sirve para decidir qué vale la pena construir y qué sobra.</p></div><div className="method-grid">{steps.map(([id, title, copy], index) => <motion.div className="method-cell" key={id} whileHover={{ y: -8, backgroundColor: '#09090a', color: '#fff' }} transition={{ duration: 0.25 }}><span>{id}</span><div className="method-glyph">{index === 0 ? icons.dot : index === 1 ? icons.spark : index === 2 ? icons.code : icons.plus}</div><h3>{title}</h3><p>{copy}</p></motion.div>)}</div></div></section>

          <section id="contacto" className="contact section-shell"><div className="contact-scan" aria-hidden="true"/><div className="page-shell agenda-grid"><div className="agenda-intro"><div className="contact-meta"><span>06 / AGENDA</span><span>ARAGON / 2026</span><span>CALI / COLOMBIA</span></div><span className="contact-kicker">UNA IDEA. UN PROBLEMA. ALGO QUE CONSTRUIR.</span><h2>Hablemos de<br /><span>lo que sigue.</span></h2><p>Elige un horario y cuéntame qué necesitas construir. La primera conversación sirve para entender el problema, no para venderte una solución prefabricada.</p><a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noreferrer" className="under-link">Abrir Cal.com en otra ventana {icons.arrow}</a></div><div className="calendar-shell"><CalBooking /></div></div></section>

          <footer className="footer page-shell"><div className="footer-brand"><span className="brand-mark">A</span><div><strong>ARAGON</strong><small>Software · Digital · Technology</small></div></div><div className="footer-links"><a href="https://github.com/JordanAragon" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jordanaragon/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">Portfolio ↗</a><a href="#inicio">Top ↑</a></div></footer>
        </div>
      </main>
    </>
  );
}
