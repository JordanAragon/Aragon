'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/projects';
import { icons } from './icons';

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
  const velocity = useSpring(useVelocity(workProgress), { stiffness: 90, damping: 24, mass: 0.3 });
  const storyScale = useTransform(smoothProgress, [0, 0.14, 0.3, 0.7, 0.86, 1], [0.9, 0.96, 1, 1, 0.96, 0.9]);
  const storyY = useTransform(smoothProgress, [0, 0.14, 0.3, 0.7, 0.86, 1], ['5vh', '2vh', '0vh', '0vh', '-2vh', '-5vh']);
  const storyRotate = useTransform(smoothProgress, [0, 0.18, 0.35, 0.65, 0.82, 1], [1, 0.35, 0, 0, -0.35, -1]);
  const velocityTilt = useTransform(velocity, [-1.1, 0, 1.1], reduced ? [0, 0, 0] : [1, 0, -1]);
  const clip = useTransform(smoothProgress, [0, 0.16, 0.28, 0.72, 0.84, 1], [
    'inset(9% 6% 9% 6% round 22px)',
    'inset(4% 2% 4% 2% round 12px)',
    'inset(0% 0% 0% 0% round 0px)',
    'inset(0% 0% 0% 0% round 0px)',
    'inset(4% 2% 4% 2% round 12px)',
    'inset(9% 6% 9% 6% round 22px)',
  ]);

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

  return (
    <section id="trabajo" ref={sectionRef} className="work-story section-shell" aria-labelledby="work-title">
      <div className="work-stage">
        <div className="page-shell work-story-head">
          <div><span className="section-number">03</span><span className="section-label">LAB / FUTURO</span></div>
          <h2 id="work-title">Cuatro ideas.<br /><span>Cuatro sistemas por construir.</span></h2>
        </div>

        <div className="story-viewport page-shell">
          <motion.div className="story-backdrop" style={{ scale: storyScale, y: storyY, rotateZ: reduced ? 0 : storyRotate, rotateY: velocityTilt, clipPath: clip, transformPerspective: 1200 }}>
            {projects.map((project, index) => {
              const distance = index - activeProject;
              const directionForLayer = distance < 0 ? -1 : 1;
              const isActive = activeProject === index;
              return (
                <motion.div key={project.id} className="story-layer" animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 1.045, x: reduced || isActive ? 0 : directionForLayer * 34, y: reduced || isActive ? 0 : 10, rotateZ: reduced || isActive ? 0 : directionForLayer * -0.7 }} transition={{ duration: reduced ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }} aria-hidden={!isActive}>
                  <Image src={project.image} alt={isActive ? `Concepto visual de ${project.title}` : ''} fill sizes="(max-width: 900px) 100vw, 82vw" priority={index === 0} />
                  <div className="story-layer-shade" />
                </motion.div>
              );
            })}
            <div className="story-ui"><span>{active.status}</span><span>{active.id} / 04</span></div>
          </motion.div>

          <div className="story-copy">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.id} className="story-copy-item" initial={{ opacity: 0, x: reduced ? 0 : direction * 24, y: reduced ? 0 : 16 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: reduced ? 0 : direction * -18, y: reduced ? 0 : -10 }} transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}>
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
        </div>
      </div>
    </section>
  );
}
