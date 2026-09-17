'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useState } from 'react';

const image = (file: string) => `https://raw.githubusercontent.com/JordanAragon/Aragon/main/img/${file}`;

const work = [
  {
    id: '01',
    title: 'AiDEN',
    kicker: 'Plataforma de gestión',
    body: 'Una plataforma digital creada para organizar la operación de un vivero y hacer que la información importante esté donde realmente se necesita.',
    tags: 'Producto digital · Web',
    image: image('aiden.png'),
    href: 'https://github.com/JordanAragon/AiDEN_',
    featured: true,
  },
  {
    id: '02',
    title: 'Aragon Server',
    kicker: 'Infraestructura personal',
    body: 'Una pequeña infraestructura propia para centralizar servicios digitales, almacenamiento y música, pensada para funcionar en el día a día.',
    tags: 'Infraestructura · Self-hosted',
    image: image('aragon-server.png'),
    href: '#contacto',
    featured: false,
  },
  {
    id: '03',
    title: 'Calendar App',
    kicker: 'Aplicación web',
    body: 'Una experiencia de calendario enfocada en organizar eventos y convertir una necesidad cotidiana en una herramienta usable.',
    tags: 'Web app · Producto',
    href: 'https://github.com/JordanAragon/Calendar_App',
    featured: false,
  },
  {
    id: '04',
    title: 'Sistema de inventario',
    kicker: 'Herramienta interna',
    body: 'Un sistema para transformar información operativa dispersa en una experiencia más clara para consultar, organizar y trabajar.',
    tags: 'Sistema · Operación',
    href: '#contacto',
    featured: false,
  },
];

const services = [
  ['01', 'Web', 'Sitios y experiencias digitales que se sienten como producto, no como una plantilla con el logo cambiado.'],
  ['02', 'Software', 'Aplicaciones y herramientas hechas alrededor del problema real, con lo necesario y nada de relleno.'],
  ['03', 'Evolución', 'Rediseño, mejora y optimización de productos existentes que necesitan verse, funcionar o comunicar mejor.'],
];

const process = [
  ['01', 'Entender', 'Antes de diseñar, entendemos qué está pasando, qué hace falta y qué no vale la pena construir.'],
  ['02', 'Diseñar', 'Convertimos el problema en una experiencia clara: estructura, contenido, interfaz y dirección visual.'],
  ['03', 'Construir', 'Desarrollamos una solución funcional, responsive y preparada para crecer sin convertirse en una criatura mitológica.'],
  ['04', 'Mejorar', 'Probamos, corregimos y pulimos detalles hasta que el resultado se sienta natural.'],
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.2 });
  const heroY = useTransform(progress, [0, 0.18], [0, -90]);
  const orbY = useTransform(progress, [0, 0.25], [0, 160]);

  const closeMenu = () => setOpen(false);

  return (
    <main className="site-root">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="noise" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />

      <header className="site-header glass-panel">
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label="Aragon, inicio">
          ARAGON<span>®</span>
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#servicios">Servicios</a>
          <a href="#trabajo">Trabajo</a>
          <a href="#proceso">Proceso</a>
          <a href="#contacto" className="nav-cta">Hablemos <span>↗</span></a>
        </nav>

        <button
          className={`menu-toggle ${open ? 'is-open' : ''}`}
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav glass-panel"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            aria-label="Navegación móvil"
          >
            <a href="#servicios" onClick={closeMenu}>Servicios <span>↘</span></a>
            <a href="#trabajo" onClick={closeMenu}>Trabajo <span>↘</span></a>
            <a href="#proceso" onClick={closeMenu}>Proceso <span>↘</span></a>
            <a href="#contacto" onClick={closeMenu}>Hablemos <span>↗</span></a>
          </motion.nav>
        )}
      </AnimatePresence>

      <section id="inicio" className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <motion.div className="hero-orb" style={{ y: orbY }} aria-hidden="true">
          <span className="orb-ring orb-ring-a" />
          <span className="orb-ring orb-ring-b" />
          <span className="orb-core" />
        </motion.div>

        <div className="hero-meta page-shell">
          <span>ARAGON / DIGITAL STUDIO</span>
          <span>POPAYÁN · COLOMBIA</span>
          <span>OPEN FOR SELECTED PROJECTS</span>
        </div>

        <motion.div className="hero-content page-shell" style={{ y: heroY }}>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Diseño · Desarrollo · Tecnología
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Ideas que
            <br />
            <span className="outlined-word">toman</span> forma.
          </motion.h1>

          <div className="hero-lower">
            <p>
              Aragon convierte problemas reales en experiencias digitales que se entienden,
              se usan y tienen una razón para existir.
            </p>
            <a className="hero-action" href="#trabajo">
              <span>Explorar trabajo</span>
              <b>↘</b>
            </a>
          </div>
        </motion.div>

        <div className="hero-stamp glass-panel" aria-hidden="true">
          <span>BUILD</span>
          <span>MOVE</span>
          <span>REFINE</span>
        </div>
      </section>

      <section className="ticker" aria-label="Servicios">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, row) => (
            <div className="ticker-row" key={row}>
              <span>WEB</span><i>✳</i><span>SOFTWARE</span><i>✳</i><span>DIGITAL</span><i>✳</i><span>INTERACTION</span><i>✳</i><span>COLOMBIA</span><i>✳</i>
            </div>
          ))}
        </div>
      </section>

      <section className="story section-shell page-shell">
        <div className="story-label">
          <span className="section-number">01</span>
          <span className="section-label">LA IDEA</span>
        </div>
        <div className="story-copy">
          <p className="story-lead">No necesitas otra web.</p>
          <h2>Necesitas que algo <em>funcione.</em></h2>
          <p className="story-body">
            Una marca puede verse increíble y seguir sin resolver nada. Aragon parte desde otro lugar:
            entender el problema, encontrar la forma correcta de solucionarlo y construir una experiencia
            que conecte con quien la va a usar.
          </p>
          <div className="story-pills">
            <span>Problema</span>
            <span>Experiencia</span>
            <span>Producto</span>
          </div>
        </div>
      </section>

      <section id="servicios" className="services section-shell">
        <div className="page-shell">
          <div className="section-intro">
            <div>
              <span className="section-number">02</span>
              <p className="section-label">LO QUE HACEMOS</p>
            </div>
            <h2>Construimos lo que hace falta.</h2>
          </div>

          <div className="service-grid">
            {services.map(([number, title, copy], index) => (
              <motion.article
                key={title}
                className="service-card glass-card"
                initial={{ opacity: 0, y: 38 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, delay: index * 0.08 }}
                whileHover={{ y: -10, rotateX: 1, rotateY: -1 }}
              >
                <div className="card-top"><span>{number}</span><span>↗</span></div>
                <div className="service-mark" aria-hidden="true">{index === 0 ? '↗' : index === 1 ? '[]' : '◎'}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <div className="card-bottom"><span>ARAGON</span><span>0{index + 1}</span></div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="trabajo" className="work section-shell page-shell">
        <div className="section-intro work-intro">
          <div>
            <span className="section-number">03</span>
            <p className="section-label">TRABAJO SELECCIONADO</p>
          </div>
          <div>
            <h2>Lo que ya he construido.</h2>
            <a className="under-link" href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">Ver portafolio completo ↗</a>
          </div>
        </div>

        <div className="work-feature">
          <motion.a
            href={work[0].href}
            target="_blank"
            rel="noreferrer"
            className="feature-visual"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <Image src={work[0].image!} alt="Vista del proyecto AiDEN" fill sizes="(max-width: 900px) 100vw, 70vw" />
            <span className="visual-overlay"><span>01</span><strong>Open case ↗</strong></span>
          </motion.a>
          <div className="feature-copy glass-panel">
            <span className="tiny-label">{work[0].kicker}</span>
            <h3>{work[0].title}</h3>
            <p>{work[0].body}</p>
            <span className="work-tags">{work[0].tags}</span>
          </div>
        </div>

        <div className="work-grid">
          {work.slice(1).map((item, index) => (
            <motion.a
              href={item.href}
              key={item.title}
              className="work-item"
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.06 }}
            >
              <div className={`work-art work-art-${index}`}>
                {item.image && <Image src={item.image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" />}
                {!item.image && (
                  <div className="ui-mockup" aria-hidden="true">
                    <div className="ui-window"><span /><span /><span /></div>
                    <div className="ui-grid-lines" />
                    <div className="ui-block ui-block-a" />
                    <div className="ui-block ui-block-b" />
                    <div className="ui-block ui-block-c" />
                  </div>
                )}
                <span className="work-number">{item.id}</span>
                <span className="work-open">↗</span>
              </div>
              <div className="work-item-copy">
                <div><span className="tiny-label">{item.kicker}</span><h3>{item.title}</h3></div>
                <p>{item.body}</p>
              </div>
              <span className="work-tags">{item.tags}</span>
            </motion.a>
          ))}
        </div>
      </section>

      <section id="proceso" className="process section-shell">
        <div className="page-shell">
          <div className="section-intro">
            <div><span className="section-number">04</span><p className="section-label">CÓMO TRABAJAMOS</p></div>
            <h2>Menos vueltas.<br /><em>Mejor trabajo.</em></h2>
          </div>

          <div className="process-list">
            {process.map(([number, title, copy], index) => (
              <motion.div
                key={title}
                className="process-row"
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
              >
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <b>↘</b>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="presence section-shell page-shell">
        <div className="presence-card glass-card">
          <div className="presence-head"><span>ARAGON / ONLINE</span><span>05</span></div>
          <div className="presence-body">
            <h2>Si el trabajo te interesa, <em>sigamos la conversación.</em></h2>
            <p>Mis proyectos, código y recorrido están abiertos. La mejor forma de conocer Aragon es viendo lo que ya existe.</p>
          </div>
          <div className="presence-links">
            <a href="https://github.com/JordanAragon" target="_blank" rel="noreferrer"><span>GitHub</span><b>↗</b></a>
            <a href="https://www.linkedin.com/in/jordanaragon/" target="_blank" rel="noreferrer"><span>LinkedIn</span><b>↗</b></a>
            <a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer"><span>Portfolio</span><b>↗</b></a>
          </div>
          <div className="audio-signature" aria-label="Firma visual de Aragon">
            <span className="audio-label">ARAGON / MOTION SIGNATURE</span>
            <div className="audio-bars">{Array.from({ length: 28 }).map((_, index) => <i key={index} style={{ animationDelay: `${index * -0.08}s`, height: `${18 + ((index * 17) % 48)}%` }} />)}</div>
            <span className="audio-state">LIVE / VISUAL ONLY</span>
          </div>
        </div>
      </section>

      <section id="contacto" className="contact">
        <div className="contact-grid page-shell">
          <div>
            <span className="section-number">06</span>
            <p className="section-label">CONTACTO</p>
          </div>
          <div className="contact-main">
            <p className="contact-kicker">Tienes una idea. Hay un problema. Necesitas construir algo.</p>
            <h2>Hablemos de lo que viene.</h2>
            <a className="contact-button" href="mailto:jordandavidaragon@outlook.com"><span>jordandavidaragon@outlook.com</span><b>↗</b></a>
          </div>
        </div>
      </section>

      <footer className="footer page-shell">
        <div><strong>ARAGON<span>®</span></strong><p>Technology · Development · Digital Solutions</p></div>
        <div className="footer-right"><span>POPAYÁN / COLOMBIA</span><a href="#inicio">TOP ↑</a></div>
      </footer>
    </main>
  );
}
