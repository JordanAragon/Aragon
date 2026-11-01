'use client';

import { useEffect, useRef } from 'react';
import { WordField, type Box } from './word-field';

type Props = {
  words: string[];
  sectionRef: React.RefObject<HTMLElement | null>;
  slotRef: React.RefObject<HTMLElement | null>;
  countRef: React.RefObject<HTMLElement | null>;
  onWord: (index: number) => void;
};

const PRELOAD_CLASS = 'is-preloading';

/*
  El lienzo del hero. Cubre toda la sección (las piezas sueltas flotan por
  todo el hero) y arma la palabra en el hueco `slotRef`. Mientras corre la
  precarga solo hay desorden; al irse la precarga empieza el barrido.
*/
export default function HeroField({ words, sectionRef, slotRef, countRef, onWord }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const slot = slotRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !section || !slot || !ctx) return undefined;

    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    let field: WordField | null = null;
    let raf = 0;
    let last = 0;
    let visible = true;
    let disposed = false;
    let lastW = 0;
    let lastH = 0;
    let lastHud = 0;
    let mono = 'monospace';
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const layout = (force = false) => {
      if (!field) return;
      const W = section.clientWidth;
      const H = section.clientHeight;
      // En el teléfono la barra del navegador cambia el alto al bajar: no se rearma por eso.
      if (!force && W === lastW && Math.abs(H - lastH) < 140) return;
      lastW = W;
      lastH = H;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      const r = section.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      const box: Box = { x: s.left - r.left, y: s.top - r.top, w: s.width, h: s.height };
      field.resize(W, H, box, W < 760);
      placeHud();
      if (reduced) field.draw(ctx, dpr, mono);
    };

    // Las marcas de registro y la regla siguen la caja de la palabra que está armada.
    const placeHud = () => {
      const b = field?.box;
      if (!b) return;
      section.style.setProperty('--wx', `${b.x}px`);
      section.style.setProperty('--wy', `${b.y}px`);
      section.style.setProperty('--ww', `${b.w}px`);
      section.style.setProperty('--wh', `${b.h}px`);
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !field) return;
      const dt = last ? (now - last) / 1000 : 1 / 60;
      last = now;
      field.step(dt);
      field.draw(ctx, dpr, mono);
      if (now - lastHud > 120 && countRef.current) {
        lastHud = now;
        countRef.current.textContent = field.formed.toLocaleString('es-CO');
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (!raf && !reduced && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const begin = () => {
      if (!field || reduced) return;
      if (root.classList.contains(PRELOAD_CLASS)) return;
      field.start();
    };

    const watch = new MutationObserver(begin);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
      },
      { rootMargin: '80px' },
    );
    const ro = new ResizeObserver(() => layout());

    const onPointer = (e: PointerEvent) => {
      if (!field) return;
      const r = section.getBoundingClientRect();
      field.pointer.x = e.clientX - r.left;
      field.pointer.y = e.clientY - r.top;
      field.pointer.active = true;
    };
    const onLeave = () => {
      if (field) field.pointer.active = false;
    };
    const onScroll = () => {
      if (!field) return;
      const e = Math.min(1, Math.max(0, window.scrollY / (section.clientHeight * 0.85)));
      field.exit = reduced ? 0 : e;
      if (reduced) field.draw(ctx, dpr, mono);
    };
    const onVisibility = () => play();

    (async () => {
      const display = getComputedStyle(section.querySelector('.hero-l1') ?? section).fontFamily;
      mono = getComputedStyle(section.querySelector('.mono') ?? section).fontFamily;
      try {
        await Promise.race([document.fonts.load(`800 100px ${display}`), new Promise((r) => setTimeout(r, 2500))]);
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
      } catch {
        // Sin la tipografía se mide con la de respaldo; la palabra se arma igual.
      }
      if (disposed) return;
      field = new WordField(words, display);
      field.onPhase = (phase, index) => {
        if (phase === 'build') {
          onWord(index);
          placeHud();
        }
      };
      layout(true);
      if (reduced) {
        field.formNow(0);
        placeHud();
        field.draw(ctx, dpr, mono);
        if (countRef.current) countRef.current.textContent = field.formed.toLocaleString('es-CO');
      }
      section.dataset.ready = 'true';
      watch.observe(root, { attributes: true, attributeFilter: ['class'] });
      io.observe(section);
      ro.observe(section);
      if (fine && !reduced) {
        section.addEventListener('pointermove', onPointer, { passive: true });
        section.addEventListener('pointerleave', onLeave);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      onScroll();
      begin();
      play();
    })();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      watch.disconnect();
      io.disconnect();
      ro.disconnect();
      section.removeEventListener('pointermove', onPointer);
      section.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [words, sectionRef, slotRef, countRef, onWord]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
