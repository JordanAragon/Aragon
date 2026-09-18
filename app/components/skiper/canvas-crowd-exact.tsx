'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
};

type Stage = {
  width: number;
  height: number;
};

type Peep = {
  image: HTMLImageElement;
  rect: [number, number, number, number];
  width: number;
  height: number;
  scale: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: 1 | -1;
  walk: gsap.core.Timeline | null;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

export default function CanvasCrowdExact({
  src,
  rows = 15,
  cols = 7,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    const stage: Stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    let ready = false;
    let visible = true;
    let reducedMotion = false;
    let lastWidth = 0;
    let lastHeight = 0;
    let lastDpr = 0;

    const getDpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const syncCanvasSize = () => {
      const width = Math.max(1, Math.round(canvas.clientWidth));
      const height = Math.max(1, Math.round(canvas.clientHeight));
      const ratio = getDpr();
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

    const createPeep = (rect: [number, number, number, number]): Peep => {
      const peep: Peep = {
        image,
        rect,
        width: rect[2],
        height: rect[3],
        scale: 1,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
      };

      return peep;
    };

    const resetPeep = (peep: Peep) => {
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const depth = randomRange(0.15, 1);
      const responsiveScale = clamp(stage.height / 860, 0.62, 1.08);
      const scale = clamp(responsiveScale * randomRange(0.72, 1.1) * (0.78 + depth * 0.22), 0.54, 1.14);
      const offsetY = 96 - 230 * gsap.parseEase('power2.in')(Math.random());
      const startY = stage.height - peep.height * scale + offsetY;

      peep.scale = scale;
      peep.width = peep.rect[2] * scale;
      peep.height = peep.rect[3] * scale;
      peep.y = startY;
      peep.anchorY = startY;
      peep.scaleX = direction;

      if (direction === 1) {
        peep.x = -peep.width - randomRange(0, stage.width * 0.28);
      } else {
        peep.x = stage.width + randomRange(0, stage.width * 0.28);
      }

      return {
        startX: peep.x,
        startY,
        endX: direction === 1 ? stage.width + peep.width : -peep.width,
      };
    };

    const startWalk = (peep: Peep) => {
      const props = resetPeep(peep);
      const xDuration = randomRange(8.8, 12.2);
      const yDuration = 0.25;

      peep.walk?.kill();

      const timeline = gsap.timeline({
        onComplete: () => {
          removePeepFromCrowd(peep);
          addPeepToCrowd();
        },
      });

      timeline.timeScale(randomRange(0.72, 1.28));
      timeline.to(peep, { x: props.endX, duration: xDuration, ease: 'none' }, 0);
      timeline.to(
        peep,
        {
          y: props.startY - randomRange(6, 10),
          duration: yDuration,
          repeat: Math.max(8, Math.round(xDuration / yDuration) - 1),
          yoyo: true,
          ease: 'sine.inOut',
        },
        0,
      );

      peep.walk = timeline;

      if (!visible || reducedMotion) timeline.pause();
      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      const index = crowd.indexOf(peep);
      if (index >= 0) crowd.splice(index, 1);
      availablePeeps.push(peep);
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return null;

      const index = Math.floor(Math.random() * availablePeeps.length);
      const peep = availablePeeps.splice(index, 1)[0];
      startWalk(peep);
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const renderStatic = () => {
      const ratio = getDpr();
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, stage.width, stage.height);

      crowd.forEach((peep) => {
        ctx.save();
        ctx.translate(peep.x, peep.y);
        ctx.scale(peep.scaleX * peep.scale, peep.scale);
        ctx.drawImage(
          image,
          peep.rect[0],
          peep.rect[1],
          peep.rect[2],
          peep.rect[3],
          0,
          0,
          peep.rect[2],
          peep.rect[3],
        );
        ctx.restore();
      });
    };

    const resetCrowd = () => {
      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      if (reducedMotion) {
        const staticCount = Math.min(28, availablePeeps.length);
        for (let index = 0; index < staticCount; index += 1) {
          const peep = availablePeeps.splice(Math.floor(Math.random() * availablePeeps.length), 1)[0];
          const depth = randomRange(0.2, 1);
          const scale = clamp((stage.height / 860) * randomRange(0.72, 1.02) * (0.78 + depth * 0.22), 0.54, 1.08);
          peep.scale = scale;
          peep.width = peep.rect[2] * scale;
          peep.height = peep.rect[3] * scale;
          peep.scaleX = Math.random() > 0.5 ? 1 : -1;
          peep.x = randomRange(-peep.width * 0.2, stage.width - peep.width * 0.8);
          peep.y = stage.height - peep.height + randomRange(-stage.height * 0.28, stage.height * 0.04);
          peep.anchorY = peep.y;
          crowd.push(peep);
        }
        crowd.sort((a, b) => a.anchorY - b.anchorY);
        renderStatic();
        return;
      }

      for (let index = 0; index < allPeeps.length; index += 1) {
        const peep = addPeepToCrowd();
        if (!peep) break;
        peep.walk?.progress(randomRange(0.02, 0.86));
      }
    };

    const render = () => {
      if (!ready || !visible || reducedMotion) return;

      const ratio = getDpr();
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, stage.width, stage.height);

      crowd.forEach((peep) => {
        ctx.save();
        ctx.translate(peep.x, peep.y);
        ctx.scale(peep.scaleX * peep.scale, peep.scale);
        ctx.drawImage(
          image,
          peep.rect[0],
          peep.rect[1],
          peep.rect[2],
          peep.rect[3],
          0,
          0,
          peep.rect[2],
          peep.rect[3],
        );
        ctx.restore();
      });
    };

    const handleResize = () => {
      const changed = syncCanvasSize();
      if (ready && changed) resetCrowd();
    };

    const init = () => {
      if (ready || !image.naturalWidth || !image.naturalHeight) return;

      ready = true;
      reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      syncCanvasSize();

      const rectWidth = image.naturalWidth / rows;
      const rectHeight = image.naturalHeight / cols;

      allPeeps.length = 0;

      for (let index = 0; index < rows * cols; index += 1) {
        const column = index % rows;
        const row = Math.floor(index / rows);
        allPeeps.push(
          createPeep([
            column * rectWidth,
            row * rectHeight,
            rectWidth,
            rectHeight,
          ]),
        );
      }

      resetCrowd();

      if (!reducedMotion) gsap.ticker.add(render);
    };

    image.onload = init;
    image.src = src;

    if (image.complete && image.naturalWidth) init();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', handleResize, { passive: true });

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        crowd.forEach((peep) => peep.walk?.paused(!visible));

        if (visible && reducedMotion) renderStatic();
      },
      { threshold: 0.02 },
    );
    visibilityObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(render);
      allPeeps.forEach((peep) => peep.walk?.kill());
      allPeeps.length = 0;
      crowd.length = 0;
      availablePeeps.length = 0;
      image.onload = null;
      image.src = '';
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className={`canvas-crowd ${className}`.trim()} aria-hidden="true" />;
}
