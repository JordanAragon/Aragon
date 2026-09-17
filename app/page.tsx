'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';

const img = (file: string) => `https://raw.githubusercontent.com/JordanAragon/Aragon/main/img/${file}`;
const icon = (path: React.ReactNode) => <svg viewBox="0 0 24 24" aria-hidden="true">{path}</svg>;
const icons = {
  arrow: icon(<path d="M5 19 19 5M8 5h11v11" />),
  plus: icon(<path d="M12 5v14M5 12h14" />),
  dot: icon(<circle cx="12" cy="12" r="2.5" />),
  globe: icon(<><circle cx="12" cy="12" r="8.5"/><path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.1 2.35 3.2 5.18 3.2 8.5s-1.1 6.15-3.2 8.5c-2.1-2.35-3.2-5.18-3.2-8.5s1.1-6.15-3.2-8.5Z"/></>),
  code: icon(<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>),
  stack: icon(<><path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4M4 16l8 4 8-4"/></>),
  spark: icon(<><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>),
};

const projects = [
  { id: '01', title: 'AiDEN', label: 'PLATAFORMA OPERATIVA', image: img('aiden.png'), href: 'https://github.com/JordanAragon/AiDEN_', body: 'Gestión operativa para viveros agrícolas. Módulos por rol, trazabilidad y una interfaz construida alrededor del trabajo diario.', tags: ['React', 'Vite', 'Tailwind'] },
  { id: '02', title: 'Calendar App', label: 'WEB APP', image: '/projects/calendar.svg', href: 'https://github.com/JordanAragon/Calendar_App', body: 'Una experiencia de calendario enfocada en organizar eventos y resolver una necesidad concreta.', tags: ['React', 'Vite', 'App'] },
  { id: '03', title: 'Inventario FNC', label: 'SISTEMA INTERNO', image: '/projects/inventory.svg', href: 'mailto:jordandavidaragon@outlook.com?subject=Consulta sobre sistema de inventario', body: 'Interfaz y estructura para convertir información operativa en una herramienta más clara de consultar y mantener.', tags: ['Sistemas', 'Datos', 'UX'] },
];

const services = [
  { id: '01', title: 'Web', kicker: 'IDENTIDAD + EXPERIENCIA', copy: 'Sitios que no parecen una plantilla con el logo cambiado. Dirección visual, estructura y movimiento con una razón.', icon: icons.globe },
  { id: '02', title: 'Software', kicker: 'IDEA → SISTEMA', copy: 'Aplicaciones construidas alrededor de cómo funciona realmente un proceso, no de cuántos componentes podemos meter.', icon: icons.code },
  { id: '03', title: 'Evolución', kicker: 'REHACER SIN PERDER', copy: 'Rediseño, frontend y optimización para productos que ya existen y necesitan volver a sentirse actuales.', icon: icons.stack },
];

const principles = [
  ['01', 'Quitar', 'Si algo no aporta, desaparece.'],
  ['02', 'Mostrar', 'La estructura también puede ser parte del diseño.'],
  ['03', 'Mover', 'La animación guía. No entretiene por obligación.'],
  ['04', 'Resolver', 'El resultado tiene que funcionar después del screenshot.'],
];

function IconBox({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <span className={`icon-box ${className}`}>{children}</span>; }

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('inicio');
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 65, damping: 25, mass: .2 });
  const heroShift = useTransform(progress, [0, .18], [0, -150]);
  const visualShift = useTransform(progress, [0, .25], [0, 120]);

  useEffect(() => { document.body.classList.toggle('menu-open', menu); return () => document.body.classList.remove('menu-open'); }, [menu]);
  useEffect(() => {
    const ids = ['inicio', 'manifiesto', 'servicios', 'trabajo', 'contexto', 'metodo', 'contacto'];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => { const current = entries.filter((e) => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]; if (current) setActive(current.target.id); }, { rootMargin: '-40% 0px -50% 0px', threshold: [.05,.2,.5] });
    nodes.forEach((node) => observer.observe(node)); return () => observer.disconnect();
  }, []);
  useEffect(() => { const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false); window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, []);
  const handleMove = (e: React.MouseEvent<HTMLElement>) => { if (window.matchMedia('(pointer: coarse)').matches) return; mx.set((e.clientX/window.innerWidth-.5)*22); my.set((e.clientY/window.innerHeight-.5)*22); };

  return <main className="site-root" onMouseMove={handleMove}>
    <motion.div className="scroll-progress" style={{ scaleX: progress }} /><div className="noise" aria-hidden="true"/><a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header glass-panel"><a href="#inicio" className="brand" onClick={()=>setMenu(false)}><span className="brand-mark">A</span><strong>ARAGON</strong></a><nav className="desktop-nav" aria-label="Principal">{['servicios','trabajo','metodo','contacto'].map((id)=><a key={id} href={`#${id}`} className={active===id?'is-active':''}>{id}</a>)}<a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer" className="nav-portfolio">PORTFOLIO {icons.arrow}</a></nav><button className={`menu-toggle ${menu?'is-open':''}`} onClick={()=>setMenu(v=>!v)} aria-expanded={menu} aria-label={menu?'Cerrar menú':'Abrir menú'}><span/><span/></button></header>
    <AnimatePresence>{menu&&<motion.nav className="mobile-nav glass-panel" initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}}><div className="mobile-nav-head"><span>ARAGON / MENU</span><span>00{['servicios','trabajo','metodo','contacto'].indexOf(active)+1}</span></div>{['servicios','trabajo','metodo','contacto'].map((id,i)=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}><span>{id}</span><span>0{i+1}</span></a>)}<a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer" className="mobile-portfolio">Abrir portfolio {icons.arrow}</a></motion.nav>}</AnimatePresence>

    <div id="contenido">
      <section id="inicio" className="hero"><div className="hero-grid" aria-hidden="true"/><div className="hero-block hero-block-a" aria-hidden="true">001</div><div className="hero-block hero-block-b" aria-hidden="true">A / 26</div>
        <motion.div className="hero-machine" style={{x:mx,y:my}} aria-hidden="true"><span className="machine-ring machine-ring-1"/><span className="machine-ring machine-ring-2"/><span className="machine-ring machine-ring-3"/><span className="machine-core"><b>A</b></span><i>INPUT</i><i>FORM</i><i>OUTPUT</i></motion.div>
        <div className="hero-meta page-shell"><span><i className="status-dot"/> ARAGON / DIGITAL STUDIO</span><span>POPAYÁN / COLOMBIA</span><span>2026 / 001</span></div>
        <motion.div className="hero-content page-shell" style={{y:heroShift}}><div className="hero-topline"><span>SOFTWARE × DIGITAL × EXPERIENCE</span><span>NOT A TEMPLATE.</span></div><motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1,ease:[.16,1,.3,1]}}>No hacemos<br/><span>“páginas web”.</span><br/><em>Construimos presencia.</em></motion.h1><div className="hero-bottom"><div className="hero-copy"><span className="hero-index">MANIFESTO / 000</span><p>Diseño, desarrollo y tecnología para convertir una idea en algo que la gente pueda entender, usar y recordar.</p></div><a href="#trabajo" className="hero-cta"><span>Ver trabajo</span><IconBox>{icons.arrow}</IconBox></a></div></motion.div><div className="hero-side">SCROLL <span/> ↓</div>
      </section>

      <section id="manifiesto" className="manifesto section-shell page-shell"><div className="manifesto-rail"><span>00</span><span>MANIFIESTO</span><span className="vertical-rule"/></div><div className="manifesto-main"><span className="manifesto-kicker">PARA GENTE QUE ESTÁ CANSADA DE LO MISMO</span><h2>Tu negocio no necesita verse “profesional”. Necesita <span>tener una razón para entrar.</span></h2><div className="manifesto-foot"><p>La forma importa. La tecnología también. Pero ninguna sirve si la experiencia no tiene dirección. Aragon trabaja desde el problema, no desde el componente.</p><div className="stamps"><span>BUILT WITH INTENT</span><span>NO GENERIC UI</span><span>COLOMBIA → WORLD</span></div></div></div></section>
      <section className="principles"><div className="page-shell principles-grid">{principles.map(([id,title,copy],i)=><motion.article key={id} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.55,delay:i*.05}}><span>{id}</span><strong>{title}</strong><p>{copy}</p></motion.article>)}</div></section>

      <section id="servicios" className="services section-shell"><div className="page-shell"><div className="section-heading"><div><span className="section-number">01</span><p className="section-label">CAPACIDADES</p></div><h2>No vendemos humo.<br/><span>Construimos.</span></h2></div><div className="service-stack">{services.map((service,i)=><motion.article key={service.id} className="service-row" initial={{opacity:0,x:-28}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} transition={{duration:.6,delay:i*.06}}><span className="service-id">{service.id}</span><IconBox>{service.icon}</IconBox><div className="service-title"><span>{service.kicker}</span><h3>{service.title}</h3></div><p>{service.copy}</p><span className="service-mark">{icons.arrow}</span></motion.article>)}</div></div></section>

      <section id="trabajo" className="work section-shell page-shell"><div className="section-heading work-heading"><div><span className="section-number">02</span><p className="section-label">TRABAJO REAL</p></div><div className="work-title"><h2>Hecho.<br/><span>No imaginado.</span></h2><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">Ver todo el portfolio {icons.arrow}</a></div></div>
        <div className="work-feature"><motion.a href={projects[0].href} target="_blank" rel="noreferrer" className="feature-media" initial={{opacity:0,scale:.97}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:.2}} transition={{duration:.8}}><Image src={projects[0].image} alt="Interfaz de AiDEN" fill priority sizes="(max-width:900px) 100vw,72vw"/><div className="feature-overlay"/><div className="media-corner"><span>01 / AIDEN</span><span>OPEN ↗</span></div><div className="media-cross"/></motion.a><motion.div className="feature-info glass-card" style={{y:visualShift}} initial={{opacity:0,x:25}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} transition={{duration:.75,delay:.1}}><div className="feature-info-top"><span>{projects[0].label}</span><span>{projects[0].tags.join(' · ')}</span></div><span className="feature-number">/ 01</span><h3>AiDEN</h3><p>{projects[0].body}</p><a href={projects[0].href} target="_blank" rel="noreferrer" className="case-link">Abrir proyecto {icons.arrow}</a></motion.div></div>
        <div className="project-grid">{projects.slice(1).map((project,i)=><motion.a key={project.id} href={project.href} target={project.href.startsWith('http')?'_blank':undefined} rel={project.href.startsWith('http')?'noreferrer':undefined} className="project-card" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.6,delay:i*.07}}><div className="project-image"><Image src={project.image} alt={`Vista de ${project.title}`} fill sizes="(max-width:760px) 100vw,50vw"/><div className="project-badge"><span>{project.id}</span><IconBox>{icons.arrow}</IconBox></div></div><div className="project-copy"><div><span>{project.label}</span><h3>{project.title}</h3></div><p>{project.body}</p></div><div className="project-footer"><span>{project.tags.join(' / ')}</span><span>OPEN ↗</span></div></motion.a>)}</div>
      </section>

      <section id="contexto" className="context section-shell"><div className="page-shell context-grid"><div className="context-poster"><Image src={img('aragon-server.png')} alt="Infraestructura personal de Aragon" fill sizes="(max-width:900px) 100vw,65vw"/><div className="poster-mask"/><div className="poster-type"><span>CONTEXT / 03</span><h2>La tecnología<br/><span>también es</span><br/>criterio.</h2></div><div className="poster-coords"><span>HARDWARE</span><span>NETWORK</span><span>SOFTWARE</span><span>SYSTEMS</span></div></div><div className="context-copy"><span className="section-label">LO QUE HAY DETRÁS</span><p>Mi recorrido mezcla soporte técnico, infraestructura, desarrollo web y construcción de productos. Por eso no pienso solo en cómo se ve una interfaz: también en lo que ocurre detrás.</p><div className="context-list"><div><span>BASE</span><b>Sistemas / Tecnología</b></div><div><span>ENFOQUE</span><b>Producto / Experiencia</b></div><div><span>ORIGEN</span><b>Popayán, Colombia</b></div></div><a href="https://jordanaragon.vercel.app" target="_blank" rel="noreferrer">Conocer el recorrido {icons.arrow}</a></div></div></section>

      <section id="metodo" className="method section-shell"><div className="page-shell"><div className="section-heading"><div><span className="section-number">04</span><p className="section-label">MÉTODO</p></div><h2>Primero pensamos.<br/><span>Después rompemos la pantalla.</span></h2></div><div className="method-grid">{['01 / CONTEXTO','02 / DIRECCIÓN','03 / BUILD','04 / PULIDO'].map((label,i)=><motion.div key={label} className="method-cell" initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.5,delay:i*.05}}><span>{label}</span><div className="method-glyph">{i===0?icons.dot:i===1?icons.spark:i===2?icons.code:icons.plus}</div><h3>{principles[i][1]}</h3><p>{principles[i][2]}</p></motion.div>)}</div></div></section>

      <section id="contacto" className="contact"><div className="contact-scan"/><div className="page-shell contact-grid"><div className="contact-meta"><span>05 / CONTACT</span><span>ARAGON / 2026</span><span>OPEN FOR SELECTED PROJECTS</span></div><div className="contact-main"><span className="contact-kicker">UNA IDEA. UN PROBLEMA. ALGO QUE CONSTRUIR.</span><h2>Haz que<br/><span>pase algo.</span></h2><a href="mailto:jordandavidaragon@outlook.com" className="contact-link"><span>jordandavidaragon@outlook.com</span><IconBox>{icons.arrow}</IconBox></a></div><div className="contact-stamp">A<br/>R<br/>A<br/>G<br/>O<br/>N</div></div></section>
      <footer className="footer page-shell"><div className="footer-brand"><span className="brand-mark">A</span><div><strong>ARAGON</strong><small>Software · Digital · Technology</small></div></div><div className="footer-links"><a href="https://github.com/JordanAragon" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jordanaragon/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="#inicio">Top ↑</a></div></footer>
    </div>
  </main>;
}
