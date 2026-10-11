'use client';

import { useCallback } from 'react';
import ParticleCanvas from '../field/particle-canvas';
import type { ParticleSim } from '../field/sim';

/* Piezas sueltas por toda la pantalla; el cursor las acomoda en la retícula. */
export default function NotFoundField() {
  const setup = useCallback((sim: ParticleSim) => {
    sim.stiffness = 0.04;
    sim.jitter = 0;
    sim.pointerRadius = 150;
    sim.gridSize = 16;
    const home = new Float32Array(sim.n * 2);
    const phase = new Float32Array(sim.n);
    for (let i = 0; i < sim.n; i++) phase[i] = sim.random() * 6.283;
    sim.updater = (s, time) => {
      for (let i = 0; i < s.n; i++) {
        s.tx[i] = home[i * 2] + Math.sin(time * 0.3 + phase[i]) * 26;
        s.ty[i] = home[i * 2 + 1] + Math.cos(time * 0.26 + phase[i] * 1.4) * 20;
        s.targetAlpha[i] = 0.32;
      }
    };
    return (w: number, h: number) => {
      for (let i = 0; i < sim.n; i++) {
        home[i * 2] = sim.random() * w;
        home[i * 2 + 1] = sim.random() * h;
      }
      if (sim.time === 0) sim.scatter(w / 2, h / 2, Math.max(w, h));
    };
  }, []);
  return <ParticleCanvas className="nf-field" count={2400} seed={404} setup={setup} />;
}
