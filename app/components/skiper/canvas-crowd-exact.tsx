'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
};

type Peep = {
  image: HTMLImageElement;
  rect: [number, number, number, number];
  width: number;
  height: number;
  drawArgs: [CanvasImageSource, number, number, number, number, number, number, number, number];
  x: number;
  y: number;
  anchorY: number;
  scaleX: 1 | -1;
  walk: gsap.core.Timeline | null;
  setRect: (rect: [number, number, number, number]) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
};

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const randomIndex = (array: unknown[]) => randomRange(0, array.length) | 0;
const removeFromArray = <T,>(array: T[], index: number) => array.splice(index, 1)[0];
const removeItemFromArray = <T,>(array: T[], item: T) => removeFromArray(array, array.indexOf(item));
const removeRandomFromArray = <T,>(array: T[]) => removeFromArray(array, randomIndex(array));
const getRandomFromArray = <T,>(array: T[]) => array[randomIndex(array) | 0];

export default function CanvasCrowdExact({ src, rows = 15, cols = 7, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = document.createElement('img');
    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    let initialized = false;

    const createPeep = ({ image, rect }: { image: HTMLImageElement; rect: [number, number, number, number] }): Peep => {
      const peep: Peep = {
        image,
        rect,
        width: rect[2],
        height: rect[3],
        drawArgs: [image, ...rect, 0, 0, rect[2], rect[3]],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (nextRect) => {
          peep.rect = nextRect;
          peep.width = nextRect[2];
          peep.height = nextRect[3];
          peep.drawArgs = [peep.image, ...nextRect, 0, 0, peep.width, peep.height];
        },
        render: (renderCtx) => {
          renderCtx.save();
          renderCtx.translate(peep.x, peep.y);
          renderCtx.scale(peep.scaleX, 1);
          renderCtx.drawImage(...peep.drawArgs);
          renderCtx.restore();
        },
      };

      return peep;
    };

    const resetPeep = (peep: Peep) => {
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width : 0;

      peep.scaleX = direction;
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const normalWalk = (peep: Peep, props: ReturnType<typeof resetPeep>) => {
      const xDuration = 10;
      const yDuration = 0.25;
      const timeline = gsap.timeline();

      timeline.timeScale(randomRange(0.5, 1.5));
      timeline.to(peep, { duration: xDuration, x: props.endX, ease: 'none' }, 0);
      timeline.to(peep, {
        duration: yDuration,
        repeat: xDuration / yDuration,
        yoyo: true,
        y: props.startY - 10,
      }, 0);

      return timeline;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return null;

      const peep = removeRandomFromArray(availablePeeps);
      const walk = normalWalk(peep, resetPeep(peep)).eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const createPeeps = () => {
      const rectWidth = img.naturalWidth / rows;
      const rectHeight = img.naturalHeight / cols;

      for (let index = 0; index < rows * cols; index += 1) {
        allPeeps.push(createPeep({
          image: img,
          rect: [
            (index % rows) * rectWidth,
            Math.floor(index / rows) * rectHeight,
            rectWidth,
            rectHeight,
          ],
        }));
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd()?.walk?.progress(Math.random());
      }
    };

    const resize = () => {
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * window.devicePixelRatio;
      canvas.height = stage.height * window.devicePixelRatio;

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);
      if (initialized) initCrowd();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      crowd.forEach((peep) => peep.render(ctx));
      ctx.restore();
    };

    const init = () => {
      if (initialized || !img.naturalWidth || !img.naturalHeight) return;
      initialized = true;
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = src;

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      gsap.ticker.remove(render);
      allPeeps.forEach((peep) => peep.walk?.kill());
      allPeeps.length = 0;
      availablePeeps.length = 0;
      crowd.length = 0;
      img.onload = null;
      img.src = '';
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className={`canvas-crowd ${className}`.trim()} aria-hidden="true" />;
}
