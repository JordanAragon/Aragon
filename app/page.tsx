'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { useState } from 'react';

const image = (file: string) => `https://raw.githubusercontent.com/JordanAragon/Aragon/main/img/${file}`;

const icons = {
  arrow: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" /></svg>,
  globe: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.1 2.35 3.2 5.18 3.2 8.5s-1.1 6.15-3.2 8.5c-2.1-2.35-3.2-5.18-3.2-8.5s1.1-6.15 3.2-8.5Z"/></svg>,
  layers: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4M4 16l8 4 8-4"/></svg>,
  code: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>,
  spark: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>,
  cursor: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 3 4.4 14 2.6-4.4 4.6 2.6L19 13l-4.8-2.7L18 7 5 3Z"/></svg>,
};

const projects = [
  {
    id: '01',
    title: 'AiDEN',
    type: 'Plataforma web',
    state: 'En desarrollo',
    description: 'Una plataforma para organizar la gestión operativa de viveros agrícolas, con módulos por rol y una interfaz pensada para trabajar, no para decorar.',
    image: image('aiden.png'),
    href: 'https://github.com/JordanAragon/AiDEN_',
  },
  {
    id: '02',
    title: 'Calendar App',
    type: 'Web app',
    state: 'Producto',
    description: 'Una experiencia de calendario centrada en organizar eventos y resolver una necesidad concreta con una interfaz simple de usar.',
    image: '/projects/calendar.svg',
    href: 'https://github.com/JordanAragon/Calendar_App',
    dark: true,
  },
  {
    id: '03',
    title: 'Inventario FNC',
    type: 'Sistema interno',
    state: 'Experiencia aplicada',
    description: 'Trabajo sobre un sistema para convertir información operativa en una herramienta más clara para consultar, organizar y mantener activos.',
    image: '/projects/inventory.svg',
    href: 'mailto:jordandavidaragon@outlook.com?subject=Consulta sobre sistema de inventario',
  },
];

const services = [
  { id: '01', title: 'Web', eyebrow: 'Presencia que convierte', copy: 'Sitios y experiencias digitales con una identidad propia, estructura clara y movimiento que acompaña el contenido.', icon: icons.globe },
  { id: '02', title: 'Software', eyebrow: 'Problema → sistema', copy: 'Aplicaciones y herramientas construidas alrededor del flujo real que necesita una persona, un equipo o un negocio.', icon: icons.code },
  { id: '03', title: 'Evolución', eyebrow: 'Mejorar lo que ya existe', copy: 'Rediseño, frontend, experiencia y optimización para productos que necesitan dejar de sentirse viejos o difíciles.', icon: icons.layers },
];

const steps = [
  ['01', 'Contexto', 'Entender el problema, el objetivo y qué parte realmente merece ser construida.'],
  ['02', 'Dirección', 'Definir una idea visual y funcional que tenga sentido antes de llenar la pantalla de componentes.'],
  ['03', 'Construcción', 'Diseñar y desarrollar con atención a detalle, responsive, rendimiento y comportamiento real.'],
  ['04', 'Pulido', 'Probar, ajustar y quitar lo que sobra hasta conseguir una experiencia que se sienta inevitable.'],
];

function IconBox({ children }: { children: React.ReactNode }) {
  return <span className="icon-box">{children}</span>;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 28, mass: 0.25 });
  const heroY = useTransform(smoothProgress, [0, 0.22], [0, -120]);
  const visualY = useTransform(smoothProgress, [0, 0.2], [0, 100]);

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    mouseX.set((event.clientX / window.innerWidth - 0.5) * 18);
    mouseY.set((event.clientY / window.innerHeight - 0.5) * 18);
  };

  const closeMenu = () => setOpen(false);

  return (
    <main className="site-root" onMouseMove={handleMove}>
      <motion.div className="scroll-progress" style={{ scaleX: smoothProgress }} />
      <div className="noise" aria-hidden="true" />

      <header className="site-header glass-panel">
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label="Aragon, inicio">
          <span className="brand-mark">A</span>
          <span>ARAGON</span>
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#servicios">Servicios</a>
          <a href="#trabajo">Trabajo</a>
          <a href="#metodo">Método</a>
          <a href="#contacto" className="nav-cta">Hablemos {icons.arrow}</a>
        </nav>

        <button className={`menu-toggle ${open ? 'is-open' : ''}`} type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span /><span />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-nav glass-panel" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .35 }}>
            <a href="#servicios" onClick={closeMenu}>Servicios <span>01</span></a>
            <a href="#trabajo" onClick={closeMenu}>Trabajo <span>02</span></a>
            <a href="#metodo" onClick={closeMenu}>Método <span>03</span></a>
            <a href="#contacto" onClick={closeMenu}>Hablemos <span>04</span></a>
          </motion.nav>
        )}
      </AnimatePresence>

      <section id="inicio" className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-crosshair crosshair-a" aria-hidden="true" />
        <div className="hero-crosshair crosshair-b" aria-hidden="true" />

        <motion.div className="hero-system" style={{ x: mouseX, y: mouseY }} aria-hidden="true">
          <div className="system-orbit orbit-1" />
          <div className="system-orbit orbit-2" />
          <div className="system-orbit orbit-3" />
          <div className="system-core"><span>A</span></div>
          <span className="system-tag tag-top">SIGNAL / 001</span>
          <span className="system-tag tag-right">BUILD + REFINE</span>
          <span className="system-tag tag-bottom">POPAYÁN / 2026</span>
        </motion.div>

        <div className="hero-meta page-shell">
          <span><i className="status-dot" /> ARAGON / DIGITAL STUDIO</span>
          <span>COLOMBIA / REMOTE</span>
          <span>SELECTED PROJECTS</span>
        </div>

        <motion.div className="hero-content page-shell" style={{ y: heroY }}>
          <motion.div className="hero-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <span>Diseño digital</span><b>×</b><span>Software</span><b>×</b><span>Interacción</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .08, ease: [0.16, 1, .3, 1] }}>
            Hacemos que las ideas <span>se vuelvan</span> <em>digitales.</em>
          </motion.h1>

          <div className="hero-bottom">
            <div className="hero-intro">
              <span className="micro-index">A / 0001</span>
              <p>Aragon es un estudio de software y experiencias digitales. Partimos del problema, diseñamos la forma y construimos algo que tenga una razón para existir.</p>
            </div>
            <a className="hero-button" href="#trabajo">
              <span>Ver lo que hacemos</span>
              <IconBox>{icons.arrow}</IconBox>
            </a>
          </div>
        </motion.div>

        <div className="hero-side-note" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span><span className="side-line" /><span>↓</span>
        </div>
      </section>

      <section className="statement section-shell page-shell">
        <div className="statement-index"><span className="section-number">00 / WHY</span><IconBox>{icons.spark}</IconBox></div>
        <div className="statement-main">
          <p className="statement-small">No hacemos páginas por hacer páginas.</p>
          <h2>Hacemos <span>sistemas digitales</span> que ayudan a una idea a avanzar.</h2>
          <div className="statement-foot"><p>La diferencia está en cómo pensamos antes de construir: qué necesita la persona, qué debe sentir, qué tiene que pasar después y qué podemos quitar sin perder valor.</p><div className="statement-points"><span>01 / Claridad</span><span>02 / Dirección</span><span>03 / Detalle</span></div></div>
        </div>
      </section>

      <section id="servicios" className="services section-shell">
        <div className="page-shell">
          <div className="section-heading services-heading"><div><span className="section-number">01</span><p className="section-label">CAPACIDADES</p></div><div><p className="heading-note">Tres caminos. Un mismo objetivo:<br />que la tecnología tenga sentido.</p></div></div>
          <div className="service-stack">
            {services.map((service, index) => (
              <motion.article key={service.title} className="service-row" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .65, delay: index * .08 }}>
                <div className="service-number">{service.id}</div><div className="service-icon"><IconBox>{service.icon}</IconBox></div><div className="service-title"><span>{service.eyebrow}</span><h3>{service.title}</h3></div><p>{service.copy}</p><div className="service-arrow">{icons.arrow}</div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="trabajo" className="work section-shell page-shell">
        <div className="section-heading work-heading"><div><span className="section-number">02</span><p className="section-label">TRABAJO DESTACADO</p></div><div className="work-heading-main"><h2>Hecho, probado<br /><span>y todavía creciendo.</span></h2><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">Abrir portfolio completo {icons.arrow}</a></div></div>

        <div className="project-feature">
          <motion.a href={projects[0].href} target="_blank" rel="noreferrer" className="project-feature-media" initial={{ opacity: 0, scale: .965 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .9, ease: [.16, 1, .3, 1] }}>
            <Image src={projects[0].image} alt="Vista del proyecto AiDEN" fill sizes="(max-width: 900px) 100vw, 68vw" priority />
            <div className="project-media-shade" /><div className="project-media-ui"><span>01 / AIDEN</span><span>OPEN CASE {icons.arrow}</span></div>
          </motion.a>
          <motion.div className="project-feature-card glass-card" style={{ y: visualY }} initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .8, delay: .15 }}>
            <div className="case-top"><span>{projects[0].type}</span><span>{projects[0].state}</span></div>
            <div className="case-middle"><span className="case-index">01</span><h3>{projects[0].title}</h3><p>{projects[0].description}</p></div>
            <div className="case-bottom"><span>React · Vite · Tailwind</span><span>↗</span></div>
          </motion.div>
        </div>

        <div className="project-grid">
          {projects.slice(1).map((project, index) => (
            <motion.a key={project.title} href={project.href} className="project-card" target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, delay: index * .08 }}>
              <div className={`project-image ${project.dark ? 'is-dark' : ''}`}><Image src={project.image} alt={`Vista visual de ${project.title}`} fill sizes="(max-width: 760px) 100vw, 50vw" /><div className="project-image-meta"><span>{project.id}</span><IconBox>{icons.arrow}</IconBox></div></div>
              <div className="project-card-copy"><div><span>{project.type}</span><h3>{project.title}</h3></div><p>{project.description}</p></div>
              <div className="project-card-foot"><span>{project.state}</span><span>View ↗</span></div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="experience section-shell"><div className="page-shell experience-grid">
        <div className="experience-visual glass-card"><div className="experience-orbit" aria-hidden="true"><span /><span /><span /></div><div className="experience-copy"><span className="section-number">03 / CONTEXTO</span><h2>Del mantenimiento de equipos al desarrollo de <span>productos.</span></h2></div><div className="experience-meta"><span>HARDWARE</span><span>WEB</span><span>SYSTEMS</span><span>SOFTWARE</span></div></div>
        <div className="experience-text"><span className="section-label">UNA MIRADA MÁS AMPLIA</span><p>Mi recorrido mezcla soporte técnico, infraestructura, desarrollo web y construcción de productos. Esa mezcla cambia la forma de pensar un proyecto: no solo cómo se ve, también cómo funciona detrás.</p><div className="experience-lines"><div><span>BASE</span><b>Sistemas / Tecnología</b></div><div><span>ENFOQUE</span><b>Producto / Experiencia</b></div><div><span>ORIGEN</span><b>Popayán, Colombia</b></div></div><a className="text-link" href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">Conocer mi recorrido {icons.arrow}</a></div>
      </div></section>

      <section id="metodo" className="method section-shell"><div className="page-shell"><div className="section-heading method-heading"><div><span className="section-number">04</span><p className="section-label">MÉTODO</p></div><h2>Primero pensamos.<br /><span>Después hacemos.</span></h2></div><div className="method-grid">
        {steps.map(([id, title, copy], index) => <motion.article key={id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .6, delay: index * .06 }}><span className="method-id">{id}</span><div className="method-symbol">{index === 0 ? icons.cursor : index === 1 ? icons.spark : index === 2 ? icons.code : icons.layers}</div><h3>{title}</h3><p>{copy}</p></motion.article>)}
      </div></div></section>

      <section className="presence section-shell page-shell"><div className="presence-shell glass-card"><div className="presence-top"><span>05 / PRESENCIA DIGITAL</span><span>ARAGON ONLINE</span></div><div className="presence-main"><div><span className="section-label">PARA VER MÁS</span><h2>El trabajo está<br /><span>en internet.</span></h2></div><div className="presence-links"><a href="https://github.com/JordanAragon" target="_blank" rel="noreferrer"><span><b>GH</b> GitHub</span>{icons.arrow}</a><a href="https://www.linkedin.com/in/jordanaragon/" target="_blank" rel="noreferrer"><span><b>in</b> LinkedIn</span>{icons.arrow}</a><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer"><span><b>↗</b> Portfolio</span>{icons.arrow}</a></div></div><div className="signal-panel" aria-label="Firma visual de movimiento de Aragon"><div className="signal-copy"><span>SIGNAL / MOTION</span><strong>07.26</strong></div><div className="signal-wave">{Array.from({ length: 42 }).map((_, i) => <i key={i} style={{ height: `${20 + ((i * 29) % 72)}%`, animationDelay: `${i * -.06}s` }} />)}</div><div className="signal-foot"><span>VISUAL SYSTEM</span><span>01 — 42</span></div></div></div></section>

      <section id="contacto" className="contact"><div className="contact-grid page-shell"><div className="contact-index"><span className="section-number">06</span><p className="section-label">CONTACTO</p><span className="contact-coordinate">2.4419° N / 76.6069° W</span></div><div className="contact-main"><span className="contact-kicker">Una idea. Un problema. Un proyecto.</span><h2>Construyamos<br /><span>algo que importe.</span></h2><a className="contact-button" href="mailto:jordandavidaragon@outlook.com"><span>jordandavidaragon@outlook.com</span><IconBox>{icons.arrow}</IconBox></a></div><div className="contact-side"><span>ARAGON / 2026</span><span>POPAYÁN / COLOMBIA</span><span>OPEN TO WORK</span></div></div></section>
      <footer className="footer page-shell"><div className="footer-brand"><span className="brand-mark">A</span><div><strong>ARAGON</strong><p>Software · Digital · Technology</p></div></div><div className="footer-right"><span>© 2026</span><a href="#inicio">TOP ↑</a></div></footer>
    </main>
  );
}
