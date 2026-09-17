'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  rows?: number;
  cols?: number;
};

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

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const randomIndex = <T,>(array: T[]) => (randomRange(0, array.length) | 0);

export default function CanvasCrowdExact({ src, rows = 15, cols = 7 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const resetPeep = (peep: Peep) => {
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width : 0;

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      peep.scaleX = direction;

      return { startX, startY, endX };
    };

    const createPeep = (rect: [number, number, number, number]): Peep => ({
      image: img,
      rect,
      width: rect[2],
      height: rect[3],
      x: 0,
      y: 0,
      anchorY: 0,
      scaleX: 1,
      walk: null,
    });

    const drawPeep = (peep: Peep) => {
      ctx.save();
      ctx.translate(peep.x, peep.y);
      ctx.scale(peep.scaleX, 1);
      ctx.drawImage(
        peep.image,
        peep.rect[0],
        peep.rect[1],
        peep.rect[2],
        peep.rect[3],
        0,
        0,
        peep.width,
        peep.height,
      );
      ctx.restore();
    };

    const removePeepFromCrowd = (peep: Peep) => {
      const index = crowd.indexOf(peep);
      if (index >= 0) crowd.splice(index, 1);
      availablePeeps.push(peep);
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return null;

      const peep = availablePeeps.splice(randomIndex(availablePeeps), 1)[0];
      const props = resetPeep(peep);
      const walk = gsap.timeline();

      walk.timeScale(randomRange(0.5, 1.5));
      walk.to(peep, { duration: 10, x: props.endX, ease: 'none' }, 0);
      walk.to(
        peep,
        {
          duration: 0.25,
          repeat: 40,
          yoyo: true,
          y: props.startY - 10,
        },
        0,
      );
      walk.eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd()?.walk?.progress(Math.random());
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      crowd.forEach(drawPeep);
      ctx.restore();
    };

    const resize = () => {
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(stage.width * dpr));
      canvas.height = Math.max(1, Math.round(stage.height * dpr));

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);
      initCrowd();
      render();
    };

    const init = () => {
      const rectWidth = img.naturalWidth / rows;
      const rectHeight = img.naturalHeight / cols;

      allPeeps.length = 0;
      for (let i = 0; i < rows * cols; i += 1) {
        allPeeps.push(
          createPeep([
            (i % rows) * rectWidth,
            Math.floor(i / rows) * rectHeight,
            rectWidth,
            rectHeight,
          ]),
        );
      }

      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = src;
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className="absolute bottom-0 left-0 h-full w-full" />;
}
