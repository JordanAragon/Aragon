'use client';

import { gsap } from 'gsap';
import type { MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
  progress?: MotionValue<number>;
};

type Stage = { width: number; height: number };
type Peep = {
  image: HTMLImageElement;
  rect: [number, number, number, number];
  width: number;
  height: number;
  scale: number;
  x: number;
  y: number;
  anchorY: number;
  direction: 1 | -1;
  walk: gsap.core.Timeline | null;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const random = (min: number, max: number) => min + Math.random() * (max - min);

export default function CanvasCrowdExact({ src, rows = 15, cols = 7, className = '', progress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const storyProgress = useRef(progress?.get() ?? 0);
  const phaseRef = useRef(-1);

  useEffect(() => {
    if (!progress) return undefined;
    storyProgress.current = progress.get();
    return progress.on('change', (value) => {
      storyProgress.current = value;
    });
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    const stage: Stage = { width: 0, height: 0 };
    const peeps: Peep[] = [];
    let ready = false;
    let currentDirection: 1 | -1 = 1;
    let lastWidth = 0;
    let lastHeight = 0;
    let lastDpr = 0;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      const width = Math.max(1, Math.round(canvas.clientWidth));
      const height = Math.max(1, Math.round(canvas.clientHeight));
      const ratio = dpr();
      const changed = width !== lastWidth || height !== lastHeight || ratio !== lastDpr;
      stage.width = width;
      stage.height = height;
      if (!changed) return false;
      lastWidth = width;
      lastHeight = height;
      lastDpr = ratio;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      return true;
    };

    const directionFor = (value: number): 1 | -1 => {
      const phase = clamp(Math.floor(value * 4), 0, 3);
      return phase % 2 === 0 ? 1 : -1;
    };

    const placePeep = (peep: Peep, direction: 1 | -1, fromEdge = true) => {
      const base = stage.height * 0.9;
      const depth = random(0.2, 1);
      const scale = (stage.height / 900) * random(0.62, 1.12) * (0.74 + depth * 0.32);
      peep.scale = clamp(scale, 0.48, 1.2);
      peep.width = peep.rect[2] * peep.scale;
      peep.height = peep.rect[3] * peep.scale;
      const verticalSpread = stage.height * 0.26;
      peep.y = base - peep.height + random(-verticalSpread, verticalSpread * 0.14);
      peep.anchorY = peep.y;
      peep.direction = direction;
      if (fromEdge) peep.x = direction === 1 ? -peep.width - random(0, stage.width * 0.3) : stage.width + random(0, stage.width * 0.3);
    };

    const makeWalk = (peep: Peep, direction: 1 | -1, duration = random(7.8, 13.5)) => {
      peep.walk?.kill();
      peep.direction = direction;
      const endX = direction === 1 ? stage.width + peep.width * 1.5 : -peep.width * 1.5;
      const tl = gsap.timeline({
        onComplete: () => {
          placePeep(peep, direction, true);
          makeWalk(peep, direction, random(7.8, 13.5));
        },
      });
      tl.timeScale(random(0.75, 1.35));
      tl.to(peep, { x: endX, duration, ease: 'none' }, 0);
      tl.to(peep, { y: peep.anchorY - random(5, 10), duration: 0.28, yoyo: true, repeat: Math.max(8, Math.round(duration / 0.28) - 1), ease: 'sine.inOut' }, 0);
      peep.walk = tl;
    };

    const rebuild = (direction: 1 | -1) => {
      currentDirection = direction;
      for (const peep of peeps) {
        peep.walk?.kill();
        const target = direction === 1 ? stage.width + peep.width * 1.5 : -peep.width * 1.5;
        const delta = Math.abs(target - peep.x);
        const duration = clamp(delta / Math.max(220, stage.width * 0.5) * 3.2, 2.4, 6.6);
        const tl = gsap.timeline({
          onComplete: () => {
            placePeep(peep, direction, true);
            makeWalk(peep, direction, random(7.8, 13.5));
          },
        });
        tl.timeScale(random(0.9, 1.15));
        tl.to(peep, { x: target, duration, ease: 'power2.inOut' }, 0);
        tl.to(peep, { y: peep.anchorY - random(5, 9), duration: 0.27, yoyo: true, repeat: Math.max(6, Math.round(duration / 0.27) - 1), ease: 'sine.inOut' }, 0);
        peep.walk = tl;
      }
    };

    const checkStoryDirection = () => {
      const phase = clamp(Math.floor(storyProgress.current * 4), 0, 3);
      if (phase === phaseRef.current) return;
      phaseRef.current = phase;
      const next = directionFor(storyProgress.current);
      if (next === currentDirection && peeps.length) return;
      rebuild(next);
    };

    const draw = () => {
      if (!ready) return;
      resizeCanvas();
      checkStoryDirection();
      const ratio = dpr();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(ratio, ratio);
      ctx.imageSmoothingEnabled = true;
      for (const peep of peeps) {
        ctx.save();
        ctx.translate(peep.x, peep.y);
        ctx.scale(peep.direction * peep.scale, peep.scale);
        ctx.drawImage(image, peep.rect[0], peep.rect[1], peep.rect[2], peep.rect[3], -peep.width / peep.scale / 2, 0, peep.rect[2], peep.rect[3]);
        ctx.restore();
      }
      ctx.restore();
    };

    const init = () => {
      if (ready || !image.naturalWidth || !image.naturalHeight) return;
      ready = true;
      resizeCanvas();
      const rectWidth = image.naturalWidth / rows;
      const rectHeight = image.naturalHeight / cols;
      peeps.length = 0;
      for (let index = 0; index < rows * cols; index += 1) {
        const row = Math.floor(index / rows);
        const col = index % rows;
        peeps.push({
          image,
          rect: [col * rectWidth, row * rectHeight, rectWidth, rectHeight],
          width: rectWidth,
          height: rectHeight,
          scale: 1,
          x: 0,
          y: 0,
          anchorY: 0,
          direction: 1,
          walk: null,
        });
      }
      const initial = directionFor(storyProgress.current);
      currentDirection = initial;
      phaseRef.current = clamp(Math.floor(storyProgress.current * 4), 0, 3);
      const lanes = [...peeps].sort(() => Math.random() - 0.5);
      lanes.forEach((peep, index) => {
        placePeep(peep, initial, true);
        peep.x += initial === 1 ? Math.min(stage.width * 0.9, (index / lanes.length) * stage.width * 1.1) : -Math.min(stage.width * 0.9, (index / lanes.length) * stage.width * 1.1);
        makeWalk(peep, initial, random(7.8, 13.5));
        peep.walk?.progress(random(0.02, 0.86));
      });
      peeps.sort((a, b) => a.anchorY - b.anchorY);
      gsap.ticker.add(draw);
    };

    const handleResize = () => {
      const changed = resizeCanvas();
      if (!ready || !changed) return;
      const direction = directionFor(storyProgress.current);
      rebuild(direction);
    };

    image.onload = init;
    image.src = src;
    if (image.complete && image.naturalWidth) init();

    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      ready = false;
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(draw);
      peeps.forEach((peep) => peep.walk?.kill());
      peeps.length = 0;
      image.onload = null;
      image.src = '';
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className={`canvas-crowd ${className}`} aria-hidden="true" />;
}
