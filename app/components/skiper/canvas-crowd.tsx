'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  rows?: number;
  cols?: number;
};

type TweenHandle = { kill: () => void };

type Peep = {
  frame: number;
  x: number;
  y: number;
  anchorY: number;
  scale: number;
  scaleX: 1 | -1;
  startX: number;
  endX: number;
  walk: TweenHandle | null;
  bob: TweenHandle | null;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function CanvasCrowd({ src, rows = 15, cols = 7 }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const image = new window.Image();
    image.decoding = 'async';

    let ready = false;
    let running = false;
    let intersecting = false;
    let pageVisible = document.visibilityState === 'visible';
    let width = 1;
    let height = 1;
    let dpr = 1;
    let rectWidth = 0;
    let rectHeight = 0;
    let targetActive = 18;
    let spawnTimer: TweenHandle | null = null;

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const activePeeps: Peep[] = [];

    const createPeeps = () => {
      allPeeps.length = 0;
      availablePeeps.length = 0;
      activePeeps.length = 0;

      const total = rows * cols;
      for (let i = 0; i < total; i += 1) {
        allPeeps.push({
          frame: i,
          x: 0,
          y: 0,
          anchorY: 0,
          scale: 0.5,
          scaleX: Math.random() > 0.5 ? 1 : -1,
          startX: 0,
          endX: 0,
          walk: null,
          bob: null,
        });
      }

      availablePeeps.push(...allPeeps);
    };

    const killPeepTweens = (peep: Peep) => {
      peep.walk?.kill();
      peep.bob?.kill();
      peep.walk = null;
      peep.bob = null;
    };

    const resetPeep = (peep: Peep) => {
      killPeepTweens(peep);

      const compact = width < 640;
      const scaleMin = compact ? 0.46 : 0.54;
      const scaleMax = compact ? 0.64 : 0.84;
      const travelPadding = Math.max(rectWidth * 0.52, width * 0.1);
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const scale = scaleMin + Math.random() * (scaleMax - scaleMin);
      const anchorY = height * (0.68 + Math.random() * 0.27);

      peep.scale = scale;
      peep.scaleX = direction === 1 ? 1 : -1;
      peep.anchorY = anchorY;
      peep.startX = direction === 1 ? -travelPadding : width + travelPadding;
      peep.endX = direction === 1 ? width + travelPadding : -travelPadding;
      peep.x = peep.startX;
      peep.y = anchorY;
    };

    const resetCrowd = () => {
      if (spawnTimer) {
        spawnTimer.kill();
        spawnTimer = null;
      }

      for (const peep of allPeeps) killPeepTweens(peep);
      activePeeps.length = 0;
      availablePeeps.length = 0;

      for (const peep of allPeeps) {
        resetPeep(peep);
        availablePeeps.push(peep);
      }
    };

    const render = () => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      activePeeps.sort((a, b) => a.anchorY - b.anchorY);

      for (const peep of activePeeps) {
        const frameX = peep.frame % rows;
        const frameY = Math.floor(peep.frame / rows);
        const sourceX = frameX * rectWidth;
        const sourceY = frameY * rectHeight;
        const drawWidth = rectWidth * peep.scale;
        const drawHeight = rectHeight * peep.scale;

        context.save();
        context.globalAlpha = 0.86;
        context.translate(peep.x, peep.y - drawHeight);
        context.scale(peep.scaleX, 1);
        context.drawImage(
          image,
          sourceX,
          sourceY,
          rectWidth,
          rectHeight,
          -drawWidth / 2,
          0,
          drawWidth,
          drawHeight,
        );
        context.restore();
      }
    };

    const activatePeep = (peep: Peep, progress = Math.random()) => {
      const distance = Math.abs(peep.endX - peep.startX);
      const totalDuration = clamp(distance / (68 + Math.random() * 38), 8, 17);
      const clampedProgress = clamp(progress, 0, 0.98);
      const remainingDuration = Math.max(2.5, totalDuration * (1 - clampedProgress));
      const bobHeight = Math.max(3, rectHeight * peep.scale * 0.05);

      peep.x = peep.startX + (peep.endX - peep.startX) * clampedProgress;
      peep.y = peep.anchorY;
      activePeeps.push(peep);

      peep.bob = gsap.to(peep, {
        y: peep.anchorY - bobHeight,
        duration: 0.22 + Math.random() * 0.08,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      peep.walk = gsap.to(peep, {
        x: peep.endX,
        duration: remainingDuration,
        ease: 'none',
        onComplete: () => {
          const activeIndex = activePeeps.indexOf(peep);
          if (activeIndex >= 0) activePeeps.splice(activeIndex, 1);
          killPeepTweens(peep);
          resetPeep(peep);
          availablePeeps.push(peep);
          scheduleSpawn();
        },
      });
    };

    const fillCrowd = () => {
      const count = Math.min(targetActive, availablePeeps.length);
      for (let i = 0; i < count; i += 1) {
        const index = Math.floor(Math.random() * availablePeeps.length);
        const peep = availablePeeps.splice(index, 1)[0];
        activatePeep(peep, 0.04 + Math.random() * 0.92);
      }
    };

    const scheduleSpawn = () => {
      if (!running || reducedMotion || spawnTimer || activePeeps.length >= targetActive) return;

      const delay = 0.14 + Math.random() * 0.4;
      spawnTimer = gsap.delayedCall(delay, () => {
        spawnTimer = null;
        if (!running || availablePeeps.length === 0 || activePeeps.length >= targetActive) {
          scheduleSpawn();
          return;
        }

        const index = Math.floor(Math.random() * availablePeeps.length);
        const peep = availablePeeps.splice(index, 1)[0];
        activatePeep(peep, 0);
        scheduleSpawn();
      });
    };

    const placeStaticCrowd = () => {
      const count = clamp(Math.round(width / 68), 5, 10);
      for (let i = 0; i < count && availablePeeps.length; i += 1) {
        const peep = availablePeeps.splice(Math.floor(Math.random() * availablePeeps.length), 1)[0];
        const progress = (i + 1) / (count + 1);
        peep.x = progress * width;
        peep.y = peep.anchorY;
        activePeeps.push(peep);
      }
    };

    const start = () => {
      if (!ready || running || !intersecting || !pageVisible) return;
      running = true;
      resetCrowd();

      if (reducedMotion) {
        placeStaticCrowd();
        render();
        return;
      }

      gsap.ticker.add(render);
      fillCrowd();
      scheduleSpawn();
    };

    const stop = () => {
      if (!running) return;
      running = false;
      if (spawnTimer) {
        spawnTimer.kill();
        spawnTimer = null;
      }
      gsap.ticker.remove(render);
      resetCrowd();
      render();
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      rectWidth = image.naturalWidth / rows;
      rectHeight = image.naturalHeight / cols;
      const compact = width < 640;
      targetActive = clamp(
        Math.round(width / (compact ? 34 : 33)),
        compact ? 8 : 18,
        compact ? 14 : 38,
      );

      if (!ready || !rectWidth || !rectHeight) return;
      resetCrowd();
      if (running) {
        if (reducedMotion) placeStaticCrowd();
        else fillCrowd();
      }
      render();
      if (running && !reducedMotion) scheduleSpawn();
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        if (intersecting) start();
        else stop();
      },
      { rootMargin: '280px 0px', threshold: 0.01 },
    );

    const handleVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
      if (pageVisible) start();
      else stop();
    };

    const handleImageError = () => {
      ready = false;
      canvas.dataset.error = 'true';
    };

    image.onload = () => {
      rectWidth = image.naturalWidth / rows;
      rectHeight = image.naturalHeight / cols;
      if (!rectWidth || !rectHeight) return;
      createPeeps();
      ready = true;
      canvas.dataset.error = 'false';
      resize();
      if (intersecting) start();
    };
    image.onerror = handleImageError;
    image.src = src;

    intersection.observe(stage);
    document.addEventListener('visibilitychange', handleVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      image.onload = null;
      image.onerror = null;
    };
  }, [cols, rows, src]);

  return (
    <div ref={stageRef} className="canvas-crowd-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="canvas-crowd" />
    </div>
  );
}
