'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const rawImage = (file: string) =>
  `https://raw.githubusercontent.com/JordanAragon/Aragon/main/img/${file}`;

const projects = [
  {
    number: '01',
    name: 'AiDEN',
    type: 'Producto digital',
    description: 'Una plataforma enfocada en organizar y simplificar la gestión de un vivero.',
    image: rawImage('aiden.png'),
    href: 'https://github.com/JordanAragon/AiDEN_',
  },
  {
    number: '02',
    name: 'Aragon Server',
    type: 'Infraestructura personal',
    description: 'Servicios digitales propios para almacenamiento, música y herramientas de uso diario.',
    image: rawImage('aragon-server.png'),
    href: '#contacto',
  },
  {
    number: '03',
    name: 'Portafolio personal',
    type: 'Marca personal',
    description: 'Una experiencia digital para mostrar proyectos, capacidades y evolución profesional.',
    image: rawImage('portafolio.png'),
    href: 'https://jordanaragon.vercel.app',
  },
];

const services = [
  ['01', 'Web', 'Sitios, landing pages y experiencias digitales pensadas para comunicar y convertir.'],
  ['02', 'Software', 'Herramientas a medida para necesidades que una web normal no alcanza a resolver.'],
  ['03', 'Evolución', 'Rediseño, mejora y optimización de proyectos que ya existen pero necesitan avanzar.'],
];

export default function Home() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label="Aragon, inicio">
          ARAGON<span>®</span>
        </a>

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

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#servicios">Servicios</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#acerca">Aragon</a>
          <a className="nav-cta" href="#contacto">Hablemos <span>↗</span></a>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            aria-label="Navegación móvil"
          >
            <a href="#servicios" onClick={closeMenu}>Servicios</a>
            <a href="#proyectos" onClick={closeMenu}>Proyectos</a>
            <a href="#acerca" onClick={closeMenu}>Aragon</a>
            <a href="#contacto" onClick={closeMenu}>Hablemos ↗</a>
          </motion.nav>
        )}
      </AnimatePresence>

      <section id="inicio" className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-topline page-shell">
          <span>Digital studio / 2026</span>
          <span>Popayán, Colombia</span>
        </div>

        <div className="hero-content page-shell">
          <p className="eyebrow">Aragon · Digital solutions</p>
          <h1>
            Tecnología
            <br />
            que <em>toma forma.</em>
          </h1>
          <div className="hero-bottom">
            <p>
              Diseño y desarrollo soluciones digitales para convertir ideas,
              necesidades y problemas reales en productos que funcionan.
            </p>
            <a className="round-link" href="#proyectos" aria-label="Ver proyectos">
              <span>Explorar</span>
              <strong>↓</strong>
            </a>
          </div>
        </div>
      </section>

      <section className="manifesto page-shell">
        <p className="section-label">01 — ENFOQUE</p>
        <div className="manifesto-copy">
          <h2>Del problema al producto.</h2>
          <p>
            Aragon no busca llenar internet de páginas bonitas sin propósito. La idea es más simple:
            entender lo que hace falta, construirlo con criterio y dejar algo que realmente se pueda usar.
          </p>
        </div>
      </section>

      <section id="servicios" className="services section-shell">
        <div className="page-shell">
          <div className="section-heading">
            <div>
              <p className="section-label">02 — SERVICIOS</p>
              <h2>Lo que puedo construir.</h2>
            </div>
            <p>Una selección de servicios para proyectos que necesitan una solución digital clara.</p>
          </div>

          <div className="service-list">
            {services.map(([number, title, copy], index) => (
              <motion.article
                key={title}
                className="service-row"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <span className="service-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="service-arrow">↗</span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="proyectos" className="projects section-shell page-shell">
        <div className="section-heading project-heading">
          <div>
            <p className="section-label">03 — PROYECTOS</p>
            <h2>Trabajo que habla por sí solo.</h2>
          </div>
          <a className="text-link" href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">
            Ver portafolio completo ↗
          </a>
        </div>

        <div className="project-stack">
          {projects.map((project, index) => (
            <motion.a
              className="project-card"
              href={project.href}
              key={project.name}
              target={project.href.startsWith('http') ? '_blank' : undefined}
              rel={project.href.startsWith('http') ? 'noreferrer' : undefined}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="project-image">
                <Image
                  src={project.image}
                  alt={`Vista del proyecto ${project.name}`}
                  fill
                  sizes="(max-width: 800px) 100vw, 80vw"
                />
                <span className="project-hover">Ver proyecto ↗</span>
              </div>
              <div className="project-meta">
                <div>
                  <span>{project.number}</span>
                  <h3>{project.name}</h3>
                </div>
                <div className="project-copy">
                  <span>{project.type}</span>
                  <p>{project.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <section id="acerca" className="about section-shell">
        <div className="page-shell about-grid">
          <div>
            <p className="section-label">04 — ARAGON</p>
            <h2>Una marca construida alrededor de hacer.</h2>
          </div>
          <div className="about-copy">
            <p>
              Aragon nace como un espacio para desarrollar proyectos propios y trabajar con personas
              o empresas que necesitan soluciones digitales sin complicar lo sencillo.
            </p>
            <div className="about-details">
              <span>Founder / Developer</span>
              <span>Jordan Aragon</span>
              <span>Popayán · Colombia</span>
            </div>
            <a className="text-link" href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">
              Conocer mi trabajo ↗
            </a>
          </div>
        </div>
      </section>

      <section className="socials section-shell page-shell">
        <p className="section-label">05 — ONLINE</p>
        <h2>También estoy por aquí.</h2>
        <div className="social-grid">
          <a href="https://github.com/JordanAragon" target="_blank" rel="noreferrer"><span>GitHub</span><span>↗</span></a>
          <a href="https://www.linkedin.com/in/jordanaragon/" target="_blank" rel="noreferrer"><span>LinkedIn</span><span>↗</span></a>
          <a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer"><span>Portfolio</span><span>↗</span></a>
          <a href="mailto:jordandavidaragon@outlook.com"><span>Email</span><span>↗</span></a>
        </div>
      </section>

      <section id="contacto" className="contact">
        <div className="page-shell contact-inner">
          <p className="section-label">06 — CONTACTO</p>
          <h2>¿Tienes algo<br /><em>que construir?</em></h2>
          <div className="contact-bottom">
            <p>Cuéntame qué quieres hacer y vemos cómo llevarlo a una solución concreta.</p>
            <a className="contact-mail" href="mailto:jordandavidaragon@outlook.com">jordandavidaragon@outlook.com ↗</a>
          </div>
        </div>
      </section>

      <footer className="footer page-shell">
        <div>
          <strong>ARAGON<span>®</span></strong>
          <p>Technology · Development · Digital Solutions</p>
        </div>
        <div className="footer-right">
          <span>2026</span>
          <a href="#inicio">Volver arriba ↑</a>
        </div>
      </footer>
    </main>
  );
}
