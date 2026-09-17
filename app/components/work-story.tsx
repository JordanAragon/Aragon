'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/projects';
import { icons } from './icons';
import ProjectCardStack from './skiper/project-card-stack';
import ProgressiveBlur from './skiper/progressive-blur';
import TextScrollTitle from './skiper/text-scroll-title';

function rememberProject(slug: string) {
  try {
    window.sessionStorage.setItem('aragon-selected-project', slug);
    window.dispatchEvent(new CustomEvent('aragon:project-selected', { detail: slug }));
  } catch {
    // Storage can be unavailable in privacy-restricted contexts; navigation still works.
  }
}

export default function WorkStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [activeProject, setActiveProject] = useState(0);
  const [direction, setDirection] = useState(1);
  const previousProject = useRef(0);
  const workProgress = useScroll({ target: sectionRef, offset: ['start start', 'end end'] }).scrollYProgress;
  const smoothProgress = useSpring(workProgress, { stiffness: 90, damping: 30, mass: 0.4 });

  useEffect(() => {
    const stop = smoothProgress.on('change', (value) => {
      const next = Math.min(projects.length - 1, Math.floor(Math.min(0.999999, Math.max(0, value)) * projects.length));
      if (next === previousProject.current) return;
      setDirection(next > previousProject.current ? 1 : -1);
      previousProject.current = next;
      setActiveProject(next);
    });
    return () => stop();
  }, [smoothProgress]);

  const jumpToProject = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const distance = Math.max(0, section.offsetHeight - window.innerHeight);
    const top = window.scrollY + section.getBoundingClientRect().top + distance * ((index + 0.5) / projects.length);
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  };

  const handleControlKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const target = index + (event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0);
    if (target === index || target < 0 || target >= projects.length) return;
    event.preventDefault();
    const button = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[target];
    button?.focus();
    jumpToProject(target);
  };

  const active = projects[activeProject];
  const cards = projects.map((project) => ({
    id: project.id,
    image: project.image,
    alt: `Concepto visual de ${project.title}`,
    eyebrow: project.status,
  }));

  return (
    <section id="trabajo" ref={sectionRef} className="work-story section-shell" aria-labelledby="work-title">
      <div className="work-stage">
        <div className="page-shell work-story-head">
          <div><span className="section-number">03</span><span className="section-label">LAB / FUTURO</span></div>
          <TextScrollTitle id="work-title" segments={['Cuatro ideas.', { text: 'Cuatro sistemas por construir.', className: 'title-muted' }]} />
        </div>

        <div className="story-viewport page-shell">
          <div className="story-stack-column">
            <ProjectCardStack cards={cards} progress={smoothProgress} activeIndex={activeProject} />
            <ProgressiveBlur position="top" backgroundColor="#0b0b0c" height={74} blurAmount={5} />
            <ProgressiveBlur position="bottom" backgroundColor="#0b0b0c" height={86} blurAmount={5} />
          </div>

          <div className="story-copy">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                className="story-copy-item"
                initial={{ opacity: 0, x: reduced ? 0 : direction * 24, y: reduced ? 0 : 16 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: reduced ? 0 : direction * -18, y: reduced ? 0 : -10 }}
                transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="story-kicker">{active.kicker}</span>
                <h3>{active.title}</h3>
                <p>{active.body}</p>
                <div className="story-tags"><span className="story-stack-label">{active.stackLabel}</span>{active.stack}</div>
                <a href="#contacto" onClick={() => rememberProject(active.slug)}>Hablar de este concepto {icons.arrow}</a>
              </motion.div>
            </AnimatePresence>
          </div>

          <nav className="story-index" aria-label="Seleccionar concepto">
            <span>SCROLL STORY</span>
            <div className="story-controls">
              {projects.map((project, index) => (
                <button key={project.id} type="button" className={activeProject === index ? 'is-active' : undefined} onClick={() => jumpToProject(index)} onKeyDown={(event) => handleControlKey(event, index)} aria-label={`Ver ${project.title}`} aria-current={activeProject === index ? 'step' : undefined}>{project.id}</button>
              ))}
            </div>
          </nav>
          <div className="story-progress-rail" aria-hidden="true"><motion.i style={{ scaleX: smoothProgress }} /></div>
        </div>
      </div>
    </section>
  );
}
