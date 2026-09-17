'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
};

type Stage = { width: number; height: number };
type Peep = {
  image: HTMLImageElement;
  rect: [number, number, number, number];
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: 1 | -1;
  walk: gsap.core.Timeline | null;
};

const randomIndex = (length: number) => Math.floor(Math.random() * length);
const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

export default function CanvasCrowdExact({ src, rows = 15, cols = 7, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    const stage: Stage = { width: 0, height: 0 };
    const sceneMode = rows === 1 && cols === 1;
    const peeps: Peep[] = [];
    const available: Peep[] = [];
    const crowd: Peep[] = [];
    let ready = false;
    let sceneRender: (() => void) | null = null;

    const sizeCanvas = () => {
      stage.width = Math.max(1, canvas.clientWidth);
      stage.height = Math.max(1, canvas.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(stage.width * dpr));
      canvas.height = Math.max(1, Math.round(stage.height * dpr));
      return dpr;
    };

    const drawScene = () => {
      if (!ready) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const ratio = image.naturalHeight / image.naturalWidth;
      const drawWidth = stage.width * 1.14;
      const drawHeight = ratio * drawWidth;
      const drawX = (stage.width - drawWidth) / 2;
      const lift = Math.sin(performance.now() / 2600) * 4;
      const drawY = stage.height - drawHeight + lift;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
    };

    const resetPeep = (peep: Peep) => {
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width + peep.width : -peep.width;
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      peep.scaleX = direction;
      return { startY, endX };
    };

    const spawn = () => {
      if (!available.length) return;
      const peep = available.splice(randomIndex(available.length), 1)[0];
      const { startY, endX } = resetPeep(peep);
      const walk = gsap.timeline({
        onComplete: () => {
          const index = crowd.indexOf(peep);
          if (index >= 0) crowd.splice(index, 1);
          available.push(peep);
          spawn();
        },
      });
      walk.timeScale(randomRange(0.55, 1.35));
      walk.to(peep, { duration: 10, x: endX, ease: 'none' }, 0);
      walk.to(peep, { duration: 0.25, repeat: 40, yoyo: true, y: startY - 10, ease: 'sine.inOut' }, 0);
      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
    };

    const drawCrowd = () => {
      if (!ready || sceneMode) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      for (const peep of crowd) {
        ctx.save();
        ctx.translate(peep.x, peep.y);
        ctx.scale(peep.scaleX, 1);
        ctx.drawImage(image, peep.rect[0], peep.rect[1], peep.rect[2], peep.rect[3], 0, 0, peep.width, peep.height);
        ctx.restore();
      }
      ctx.restore();
    };

    const init = () => {
      if (ready || !image.naturalWidth || !image.naturalHeight) return;
      ready = true;
      sizeCanvas();

      if (sceneMode) {
        sceneRender = drawScene;
        gsap.ticker.add(sceneRender);
        drawScene();
        return;
      }

      const rectWidth = image.naturalWidth / rows;
      const rectHeight = image.naturalHeight / cols;
      peeps.length = 0;
      for (let i = 0; i < rows * cols; i += 1) {
        peeps.push({
          image,
          rect: [(i % rows) * rectWidth, Math.floor(i / rows) * rectHeight, rectWidth, rectHeight],
          width: rectWidth,
          height: rectHeight,
          x: 0, y: 0, anchorY: 0, scaleX: 1, walk: null,
        });
      }
      available.push(...peeps);
      while (available.length) {
        spawn();
        crowd[crowd.length - 1]?.walk?.progress(Math.random());
      }
      gsap.ticker.add(drawCrowd);
      drawCrowd();
    };

    const handleResize = () => {
      sizeCanvas();
      if (!ready) return;
      if (sceneMode) {
        drawScene();
        return;
      }
      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      available.length = 0;
      available.push(...peeps);
      while (available.length) {
        spawn();
        crowd[crowd.length - 1]?.walk?.progress(Math.random());
      }
      drawCrowd();
    };

    const onError = () => canvas.dataset.error = 'true';
    image.addEventListener('load', init, { once: true });
    image.addEventListener('error', onError, { once: true });
    image.src = src;
    if (image.complete && image.naturalWidth) init();

    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      ready = false;
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(drawCrowd);
      if (sceneRender) gsap.ticker.remove(sceneRender);
      crowd.forEach((peep) => peep.walk?.kill());
      peeps.length = 0;
      available.length = 0;
      crowd.length = 0;
      image.removeEventListener('error', onError);
      image.src = '';
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className={`canvas-crowd ${className}`} aria-hidden="true" />;
}
