'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import aidenImage from '../img/aiden.png';
import aragonServerImage from '../img/aragon-server.png';

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

const process = [
  ['01', 'Entender', 'Qué está pasando realmente.'],
  ['02', 'Definir', 'Qué necesita cambiar.'],
  ['03', 'Construir', 'La experiencia, sistema o producto adecuado.'],
  ['04', 'Pulir', 'Hasta que deje de sentirse como una versión a medias.'],
];

function IconBox({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`icon-box ${className}`}>{children}</span>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('inicio');
  const heroRef = useRef<HTMLElement>(null);
  const problemsRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const heroProgress = useScroll({ target: heroRef, offset: ['start start', 'end start'] }).scrollYProgress;
  const problemsProgress = useScroll({ target: problemsRef, offset: ['start end', 'end start'] }).scrollYProgress;
  const workProgress = useScroll({ target: workRef, offset: ['start end', 'end start'] }).scrollYProgress;
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -150]);
  const heroScale = useTransform(heroProgress, [0, 0.8], [1, 0.78]);
  const heroGhostX = useTransform(heroProgress, [0, 1], [0, -120]);
  const problemX = useTransform(problemsProgress, [0, 1], ['8%', '-8%']);
  const workX = useTransform(workProgress, [0.05, 0.48, 0.92], ['0%', '-34%', '-68%']);
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.25 });

  useEffect(() => {
    document.body.classList.toggle('menu-open', menu);
    return () => document.body.classList.remove('menu-open');
  }, [menu]);

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
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    mx.set((event.clientX / window.innerWidth - 0.5) * 22);
    my.set((event.clientY / window.innerHeight - 0.5) * 22);
  };

  const navItems = [
    ['capacidades', 'capacidad'],
    ['trabajo', 'trabajo'],
    ['metodo', 'método'],
    ['contacto', 'hablemos'],
  ];

  return (
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
            <a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer" className="mobile-portfolio">Abrir portfolio {icons.arrow}</a>
          </motion.nav>
        )}
      </AnimatePresence>

      <div id="contenido">
        <section id="inicio" ref={heroRef} className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-a" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-b" aria-hidden="true" />
          <motion.div className="hero-signal" style={{ x: mx, y: my }} aria-hidden="true">
            <span className="signal-core">A</span><span className="signal-line signal-line-a"/><span className="signal-line signal-line-b"/>
            <span className="signal-label signal-label-a">INPUT</span><span className="signal-label signal-label-b">SYSTEM</span><span className="signal-label signal-label-c">OUTPUT</span>
          </motion.div>
          <div className="hero-meta page-shell"><span><i className="status-dot" /> ARAGON / DIGITAL STUDIO</span><span>POPAYÁN / COLOMBIA</span><span>2026 / 001</span></div>

          <motion.div className="hero-content page-shell" style={{ y: heroTextY }}>
            <div className="hero-topline"><span>IDEA → PROBLEM → SYSTEM</span><span>BUILT WITH INTENT</span></div>
            <motion.h1 style={{ scale: heroScale }} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              Tu idea<br /><span>ya existe.</span><br /><em>Ahora hagámosla funcionar.</em>
            </motion.h1>
            <motion.div className="hero-ghost" style={{ x: heroGhostX }} aria-hidden="true">IDEA / 001</motion.div>
            <div className="hero-bottom">
              <div className="hero-copy"><span className="hero-index">THE PREMISE</span><p>Aragon diseña y desarrolla experiencias digitales, software y sistemas para convertir problemas reales en productos que la gente puede entender y usar.</p></div>
              <a href="#trabajo" className="hero-cta"><span>Ver lo que construimos</span><IconBox>{icons.arrow}</IconBox></a>
            </div>
          </motion.div>
          <div className="hero-side">SCROLL <span /> ↓</div>
        </section>

        <section id="problema" ref={problemsRef} className="problem section-shell">
          <div className="page-shell">
            <div className="problem-intro"><div><span className="section-number">01</span><span className="section-label">EL PROBLEMA</span></div><p>Los problemas digitales rara vez empiezan en el código.</p></div>
            <motion.div className="problem-marquee" style={{ x: problemX }} aria-hidden="true"><span>WHAT ISN’T WORKING?</span><span>WHAT ISN’T WORKING?</span></motion.div>
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
          <div className="page-shell work-story-head"><div><span className="section-number">03</span><span className="section-label">TRABAJO REAL</span></div><h2>Esto es lo que pasa<br /><span>cuando una idea se vuelve sistema.</span></h2></div>
          <div className="work-track-viewport">
            <motion.div className="work-track" style={{ x: workX }}>
              {projects.map((project) => (
                <article className="story-project" key={project.id}>
                  <div className="story-project-copy"><div className="story-meta"><span>{project.id}</span><span>{project.label}</span></div><h3>{project.title}</h3><strong>{project.kicker}</strong><p>{project.body}</p><div className="story-tags">{project.tags}</div><a href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined}>Abrir proyecto {icons.arrow}</a></div>
                  <motion.a href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined} className="story-project-media" whileHover={{ scale: 0.985 }} transition={{ duration: 0.6 }}>
                    <Image src={project.image} alt={`Interfaz de ${project.title}`} fill sizes="(max-width: 900px) 92vw, 58vw" priority={project.id === '01'} />
                    <div className="story-media-overlay" /><div className="story-media-corner"><span>{project.label}</span><span>OPEN ↗</span></div><span className="story-media-number">{project.id}</span>
                  </motion.a>
                </article>
              ))}
            </motion.div>
          </div>
          <div className="work-scroll-hint page-shell"><span>DESLIZA / DESCUBRE</span><span className="work-scroll-line"><i /></span><span>03 PROYECTOS</span></div>
        </section>

        <section id="contexto" className="context section-shell">
          <div className="page-shell context-grid">
            <div className="context-visual"><Image src={aragonServerImage} alt="Infraestructura personal de Aragon" fill sizes="(max-width: 900px) 100vw, 58vw" /><div className="context-overlay"/><span className="context-stamp">CONTEXT / 04</span><span className="context-coordinates">HARDWARE · NETWORK · SOFTWARE · SYSTEMS</span></div>
            <div className="context-copy"><span className="section-number">04</span><span className="section-label">LO QUE HAY DETRÁS</span><h2>No solo diseño <span>la superficie.</span></h2><p>Mi recorrido mezcla soporte técnico, infraestructura, desarrollo web y construcción de productos. Por eso pienso en la interfaz, pero también en lo que tiene que funcionar detrás.</p><div className="context-facts"><div><small>BASE</small><b>Sistemas / Tecnología</b></div><div><small>ENFOQUE</small><b>Producto / Experiencia</b></div><div><small>ORIGEN</small><b>Popayán, Colombia</b></div></div><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer" className="under-link">Conocer el recorrido {icons.arrow}</a></div>
          </div>
        </section>

        <section id="metodo" className="method section-shell">
          <div className="page-shell">
            <div className="section-heading"><div><span className="section-number">05</span><span className="section-label">MÉTODO</span></div><h2>De la idea<br /><span>a algo que funciona.</span></h2></div>
            <div className="method-intro"><p>La creatividad no reemplaza el criterio. El código tampoco. El proceso sirve para decidir qué vale la pena construir y qué sobra.</p></div>
            <div className="method-grid">{process.map(([id, title, copy], index) => <motion.div className="method-cell" key={id} whileHover={{ backgroundColor: '#d7ff00', color: '#09090a' }} transition={{ duration: 0.25 }}><span>{id}</span><div className="method-glyph">{index === 0 ? icons.dot : index === 1 ? icons.spark : index === 2 ? icons.code : icons.plus}</div><h3>{title}</h3><p>{copy}</p></motion.div>)}</div>
          </div>
        </section>

        <section id="contacto" className="contact section-shell"><div className="contact-scan" aria-hidden="true"/><div className="page-shell contact-grid"><div className="contact-meta"><span>06 / CONTACT</span><span>ARAGON / 2026</span><span>OPEN FOR SELECTED PROJECTS</span></div><div className="contact-main"><span className="contact-kicker">UNA IDEA. UN PROBLEMA. ALGO QUE CONSTRUIR.</span><h2>¿Qué necesita<br /><span>existir?</span></h2><p>Una web que explique mejor. Un sistema que simplifique el trabajo. Un producto que por fin se sienta terminado.</p><a href="mailto:jordandavidaragon@outlook.com" className="contact-link"><span>jordandavidaragon@outlook.com</span><IconBox>{icons.arrow}</IconBox></a></div><div className="contact-side-word">ARAGON</div></div></section>

        <footer className="footer page-shell"><div className="footer-brand"><span className="brand-mark">A</span><div><strong>ARAGON</strong><small>Software · Digital · Technology</small></div></div><div className="footer-links"><a href="https://github.com/JordanAragon" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jordanaragon/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">Portfolio ↗</a><a href="#inicio">Top ↑</a></div></footer>
      </div>
    </main>
  );
}
