'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import aidenImage from '../img/aiden.png';
import aragonServerImage from '../img/aragon-server.png';

const CAL_LINK = 'jordan-david-micolta-aragon-cognqx/30min';

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
  { id: '01', title: 'AiDEN', label: 'SISTEMA OPERATIVO', image: aidenImage, href: 'https://github.com/JordanAragon/AiDEN_', kicker: 'CUANDO LA OPERACIÓN NECESITA CONVERTIRSE EN SISTEMA.', body: 'Una plataforma para organizar roles, procesos y trazabilidad en la operación de un vivero agrícola.', tags: 'React · Vite · Tailwind' },
  { id: '02', title: 'Calendar App', label: 'PRODUCTO WEB', image: '/projects/calendar.svg', href: 'https://github.com/JordanAragon/Calendar_App', kicker: 'CUANDO ORGANIZAR INFORMACIÓN TAMBIÉN ES DISEÑAR UNA EXPERIENCIA.', body: 'Una experiencia de calendario enfocada en organizar eventos y resolver una necesidad concreta.', tags: 'React · Vite · App' },
  { id: '03', title: 'Inventario FNC', label: 'SISTEMA INTERNO', image: '/projects/inventory.svg', href: 'mailto:jordandavidaragon@outlook.com?subject=Consulta sobre sistema de inventario', kicker: 'CUANDO DEMASIADA INFORMACIÓN NECESITA ENCONTRAR UNA ESTRUCTURA.', body: 'Una interfaz para convertir información operativa en una herramienta más clara de consultar y mantener.', tags: 'Sistemas · Datos · UX' },
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

  useEffect(() => {
    const existing = document.querySelector('script[data-cal-script="aragon"]');
    const init = () => {
      const Cal = (window as Window & { Cal?: (...args: unknown[]) => void }).Cal;
      if (!Cal || !calRef.current) return;
      Cal('inline', { elementOrSelector: calRef.current, calLink: CAL_LINK });
      Cal('ui', { styles: { body: { background: '#111112' }, eventTypeListItem: { background: '#111112' } } });
    };

    if (existing) {
      init();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    script.dataset.calScript = 'aragon';
    script.onload = init;
    document.head.appendChild(script);
  }, []);

  return <div id="my-cal-inline" ref={calRef} className="cal-inline" aria-label="Calendario para agendar una reunión" />;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('inicio');
  const [activeProject, setActiveProject] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const heroProgress = useScroll({ target: heroRef, offset: ['start start', 'end start'] }).scrollYProgress;
  const workProgress = useScroll({ target: workRef, offset: ['start start', 'end end'] }).scrollYProgress;
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -180]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.72]);
  const heroOpacity = useTransform(heroProgress, [0, 0.55, 1], [1, 1, 0]);
  const heroVisualScale = useTransform(heroProgress, [0, 1], [1, 1.4]);
  const heroGhostX = useTransform(heroProgress, [0, 1], [0, -150]);
  const storyScale = useTransform(workProgress, [0, 0.5, 1], [0.82, 1, 1.05]);
  const storyY = useTransform(workProgress, [0, 0.5, 1], ['8vh', '0vh', '-5vh']);
  const storyClip = useTransform(workProgress, [0, 0.18, 0.5, 0.82, 1], ['inset(14% 10% 14% 10% round 28px)', 'inset(7% 5% 7% 5% round 20px)', 'inset(0% 0% 0% 0% round 0px)', 'inset(7% 5% 7% 5% round 20px)', 'inset(14% 10% 14% 10% round 28px)']);
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.25 });

  useEffect(() => {
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
    const unsubscribe = workProgress.on('change', (value) => {
      const next = Math.min(projects.length - 1, Math.floor(value * projects.length));
      setActiveProject(next);
    });
    return () => unsubscribe();
  }, [workProgress]);

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
    if (window.matchMedia('(pointer: coarse)').matches) return;
    mx.set((event.clientX / window.innerWidth - 0.5) * 18);
    my.set((event.clientY / window.innerHeight - 0.5) * 18);
  };

  const navItems = [
    ['capacidades', 'capacidad'],
    ['trabajo', 'trabajo'],
    ['metodo', 'método'],
    ['contacto', 'agenda'],
  ];

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="entry-loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} aria-label="Cargando Aragon">
            <div className="loader-inner">
              <span className="loader-kicker">ARAGON / DIGITAL STUDIO</span>
              <div className="loader-word" aria-hidden="true">
                {'ARAGON'.split('').map((letter, index) => (
                  <motion.span key={letter + index} initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.55, delay: index * 0.11, ease: [0.16, 1, 0.3, 1] }}>{letter}</motion.span>
                ))}
              </div>
              <div className="loader-bottom"><span>INITIALIZING EXPERIENCE</span><span>001</span></div>
              <motion.div className="loader-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.65, ease: [0.76, 0, 0.24, 1] }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="site-root" onMouseMove={handleMove}>
        <motion.div className="scroll-progress" style={{ scaleX: progress }} />
        <div className="noise" aria-hidden="true" />
        <a className="skip-link" href="#contenido">Saltar al contenido</a>

        <header className="site-header glass-panel">
          <a href="#inicio" className="brand" onClick={() => setMenu(false)} aria-label="Aragon, inicio">
            <span className="brand-mark">A</span><strong>ARAGON</strong>
          </a>
          <nav className="desktop-nav" aria-label="Principal">
            {navItems.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''}>{label}</a>)}
            <a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer" className="nav-portfolio">portfolio {icons.arrow}</a>
          </nav>
          <button className={`menu-toggle ${menu ? 'is-open' : ''}`} onClick={() => setMenu((value) => !value)} aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}>
            <span /><span />
          </button>
        </header>

        <AnimatePresence>
          {menu && (
            <motion.nav id="mobile-nav" className="mobile-nav glass-panel" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} aria-label="Menú móvil">
              <div className="mobile-nav-head"><span>ARAGON / MENU</span><span>00{Math.max(1, navItems.findIndex(([id]) => id === active) + 1)}</span></div>
              {navItems.map(([id, label], index) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}><span>{label}</span><span>0{index + 1}</span></a>)}
              <a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noreferrer" className="mobile-portfolio">Abrir agenda {icons.arrow}</a>
            </motion.nav>
          )}
        </AnimatePresence>

        <div id="contenido">
          <section id="inicio" ref={heroRef} className="hero">
            <div className="hero-grid" aria-hidden="true" />
            <motion.div className="hero-visual" style={{ scale: heroVisualScale, x: mx, y: my }} aria-hidden="true">
              <div className="hero-visual-ring hero-visual-ring-a" />
              <div className="hero-visual-ring hero-visual-ring-b" />
              <div className="hero-visual-word">ARAGON</div>
              <div className="hero-visual-core"><span>ARAGON</span><i /></div>
              <div className="hero-visual-tag tag-a">IDEA</div><div className="hero-visual-tag tag-b">SYSTEM</div><div className="hero-visual-tag tag-c">OUTPUT</div>
            </motion.div>
            <motion.div className="hero-meta page-shell" style={{ opacity: heroOpacity }}><span><i className="status-dot" /> ARAGON / DIGITAL STUDIO</span><span>CALI / COLOMBIA</span><span>2026 / 001</span></motion.div>

            <motion.div className="hero-content page-shell" style={{ y: heroTextY, opacity: heroOpacity }}>
              <div className="hero-topline"><span>IDEA → PROBLEM → SYSTEM</span><span>BUILT WITH INTENT</span></div>
              <motion.h1 style={{ scale: heroScale }} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.55, ease: [0.16, 1, 0.3, 1] }}>
                Tu idea<br /><span>ya existe.</span><br /><em>Ahora hagámosla funcionar.</em>
              </motion.h1>
              <motion.div className="hero-ghost" style={{ x: heroGhostX }} aria-hidden="true">ARAGON / 001</motion.div>
              <div className="hero-bottom">
                <div className="hero-copy"><span className="hero-index">THE PREMISE</span><p>Aragon diseña y desarrolla experiencias digitales, software y sistemas para convertir problemas reales en productos que la gente puede entender y usar.</p></div>
                <a href="#trabajo" className="hero-cta"><span>Ver lo que construimos</span><IconBox>{icons.arrow}</IconBox></a>
              </div>
            </motion.div>
            <div className="hero-side">SCROLL <span /> ↓</div>
          </section>

          <section id="problema" className="problem section-shell">
            <div className="page-shell">
              <div className="problem-intro"><div><span className="section-number">01</span><span className="section-label">EL PROBLEMA</span></div><p>Los problemas digitales rara vez empiezan en el código.</p></div>
              <div className="problem-marquee" aria-hidden="true"><span>WHAT ISN’T WORKING?</span><span>WHAT ISN’T WORKING?</span></div>
              <div className="problem-statement"><h2>Todo empieza con algo que <span>no funciona como debería.</span></h2><p>Una marca que no se entiende. Un proceso que se complica. Un producto que se queda a medias.</p></div>
              <div className="problem-list">
                {problems.map((problem, index) => (
                  <motion.article key={problem.id} className="problem-item" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, delay: index * 0.06 }}>
                    <span>{problem.id}</span><div><small>{problem.word}</small><h3>{problem.title}</h3></div><p>{problem.copy}</p><IconBox>{icons.arrow}</IconBox>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          <section id="capacidades" className="capabilities section-shell">
            <div className="page-shell">
              <div className="section-heading"><div><span className="section-number">02</span><span className="section-label">LO QUE CONSTRUIMOS</span></div><h2>No vendemos<br /><span>categorías.</span></h2></div>
              <p className="section-lead">A veces es una web. A veces es un sistema. A veces es un producto entero. Lo importante es qué necesita existir para resolver el problema.</p>
              <div className="capability-grid">
                {capabilities.map((capability, index) => (
                  <motion.article key={capability.id} className="capability-card" whileHover={{ y: -10 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="capability-top"><span>{capability.id}</span><IconBox>{capability.icon}</IconBox></div><small>{capability.kicker}</small><h3>{capability.title}</h3><p>{capability.copy}</p><span className="capability-index">0{index + 1} / 03</span>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          <section id="trabajo" ref={workRef} className="work-story section-shell">
            <div className="work-stage">
              <div className="page-shell work-story-head"><div><span className="section-number">03</span><span className="section-label">TRABAJO REAL</span></div><h2>Desplázate.<br /><span>Mira cómo una idea se vuelve sistema.</span></h2></div>
              <div className="story-viewport page-shell">
                <motion.div className="story-backdrop" style={{ scale: storyScale, y: storyY, clipPath: storyClip }}>
                  {projects.map((project, index) => (
                    <motion.div key={project.id} className={`story-layer ${activeProject === index ? 'is-active' : ''}`} animate={{ opacity: activeProject === index ? 1 : 0, scale: activeProject === index ? 1 : 1.045, x: activeProject === index ? 0 : index < activeProject ? -20 : 20 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                      <Image src={project.image} alt={`Interfaz de ${project.title}`} fill sizes="(max-width: 900px) 100vw, 82vw" priority={index === 0} />
                      <div className="story-layer-shade" />
                    </motion.div>
                  ))}
                  <div className="story-ui"><span>{projects[activeProject].label}</span><span>{projects[activeProject].id} / 03</span></div>
                </motion.div>
                <div className="story-copy">
                  {projects.map((project, index) => (
                    <motion.div key={project.id} className="story-copy-item" animate={{ opacity: activeProject === index ? 1 : 0, y: activeProject === index ? 0 : activeProject > index ? -30 : 30 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
                      <span className="story-kicker">{project.kicker}</span><h3>{project.title}</h3><p>{project.body}</p><div className="story-tags">{project.tags}</div><a href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined}>Abrir proyecto {icons.arrow}</a>
                    </motion.div>
                  ))}
                </div>
                <div className="story-index"><span>SCROLL STORY</span><div>{projects.map((project, index) => <span key={project.id} className={activeProject === index ? 'is-active' : ''}>{project.id}</span>)}</div></div>
              </div>
            </div>
          </section>

          <section id="contexto" className="context section-shell">
            <div className="page-shell context-grid">
              <motion.div className="context-visual" whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }} initial={{ clipPath: 'inset(10% 10% 10% 10% round 28px)' }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}><Image src={aragonServerImage} alt="Infraestructura personal de Aragon" fill sizes="(max-width: 900px) 100vw, 58vw" /><div className="context-overlay"/><span className="context-stamp">CONTEXT / 04</span><span className="context-coordinates">HARDWARE · NETWORK · SOFTWARE · SYSTEMS</span></motion.div>
              <div className="context-copy"><span className="section-number">04</span><span className="section-label">LO QUE HAY DETRÁS</span><h2>No solo diseño <span>la superficie.</span></h2><p>Mi recorrido mezcla soporte técnico, infraestructura, desarrollo web y construcción de productos. Por eso pienso en la interfaz, pero también en lo que tiene que funcionar detrás.</p><div className="context-facts"><div><small>BASE</small><b>Sistemas / Tecnología</b></div><div><small>ENFOQUE</small><b>Producto / Experiencia</b></div><div><small>ORIGEN</small><b>Cali, Colombia</b></div></div><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer" className="under-link">Conocer el recorrido {icons.arrow}</a></div>
            </div>
          </section>

          <section id="metodo" className="method section-shell">
            <div className="page-shell">
              <div className="section-heading"><div><span className="section-number">05</span><span className="section-label">MÉTODO</span></div><h2>De la idea<br /><span>a algo que funciona.</span></h2></div>
              <div className="method-intro"><p>La creatividad no reemplaza el criterio. El código tampoco. El proceso sirve para decidir qué vale la pena construir y qué sobra.</p></div>
              <div className="method-grid">{steps.map(([id, title, copy], index) => <motion.div className="method-cell" key={id} whileHover={{ y: -8, backgroundColor: '#09090a', color: '#fff' }} transition={{ duration: 0.25 }}><span>{id}</span><div className="method-glyph">{index === 0 ? icons.dot : index === 1 ? icons.spark : index === 2 ? icons.code : icons.plus}</div><h3>{title}</h3><p>{copy}</p></motion.div>)}</div>
            </div>
          </section>

          <section id="contacto" className="contact section-shell">
            <div className="contact-scan" aria-hidden="true" />
            <div className="page-shell agenda-grid">
              <div className="agenda-intro"><div className="contact-meta"><span>06 / AGENDA</span><span>ARAGON / 2026</span><span>CALI / COLOMBIA</span></div><span className="contact-kicker">UNA IDEA. UN PROBLEMA. ALGO QUE CONSTRUIR.</span><h2>Hablemos de<br /><span>lo que sigue.</span></h2><p>Elige un horario y cuéntame qué necesitas construir. La primera conversación sirve para entender el problema, no para venderte una solución prefabricada.</p><a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noreferrer" className="under-link">Abrir Cal.com en otra ventana {icons.arrow}</a></div>
              <div className="calendar-shell"><CalBooking /></div>
            </div>
          </section>

          <footer className="footer page-shell"><div className="footer-brand"><span className="brand-mark">A</span><div><strong>ARAGON</strong><small>Software · Digital · Technology</small></div></div><div className="footer-links"><a href="https://github.com/JordanAragon" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jordanaragon/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">Portfolio ↗</a><a href="#inicio">Top ↑</a></div></footer>
        </div>
      </main>
    </>
  );
}
