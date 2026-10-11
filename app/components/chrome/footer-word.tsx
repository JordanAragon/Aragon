'use client';

import { useCallback, useEffect, useRef } from 'react';
import ParticleCanvas, { type FieldController } from '../field/particle-canvas';
import type { ParticleSim } from '../field/sim';
import { wordmarkPoints } from '../field/wordmark';

/*
  La marca del pie, hecha de piezas: llegan sueltas y se ordenan en la palabra
  cuando el pie aparece, como en la precarga. El cursor las aparta y vuelven a
  su lugar. El texto real queda debajo (para quien no tiene JS o lienzo).
*/
export default function FooterWord() {
  const boxRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<FieldController | null>(null);
  const shownRef = useRef(false);
  const wordRef = useRef<Float32Array | null>(null);

  const setup = useCallback((sim: ParticleSim) => {
    sim.stiffness = 0.05;
    sim.damping = 0.8;
    sim.jitter = 0;
    sim.pointerMode = 'push';
    sim.pointerRadius = 90;
    sim.baseSize = 1.9;
    sim.targetAlpha.fill(0.9);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return (w: number, h: number) => {
      const word = wordmarkPoints(sim.n, w / 2, h / 2, w, 13).points;
      wordRef.current = word;
      if (sim.time === 0) {
        sim.scatter(w * 0.5, h * 0.4, w * 0.7);
        // Mientras no se ve, las piezas esperan sueltas donde están.
        sim.tx.set(sim.x);
        sim.ty.set(sim.y);
      }
      if (shownRef.current || reduced) sim.setTargets(word, 0);
    };
  }, []);

  const onReady = useCallback((controller: FieldController) => {
    controllerRef.current = controller;
    const box = boxRef.current;
    // Con la tipografía de titulares lista, la palabra se vuelve a medir.
    document.fonts?.ready
      .then(() => {
        if (box) controller.layout(box.clientWidth, box.clientHeight);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || shownRef.current) return;
        shownRef.current = true;
        const controller = controllerRef.current;
        if (controller && wordRef.current) controller.sim.setTargets(wordRef.current, 1.1, 'x');
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="footer-word">
      <span className="footer-word-text" aria-hidden="true">
        aragon<span className="brand-mark" />
      </span>
      <ParticleCanvas className="footer-word-field" count={2600} seed={29} setup={setup} pointerTarget={boxRef} onReady={onReady} />
    </div>
  );
}
