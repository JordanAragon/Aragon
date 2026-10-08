
'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  rows?: number;
  cols?: number;
  density?: number;
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
const randomIndex = (array: unknown[]) => Math.floor(Math.random() * array.length);

export default function CanvasCrowdExact({
  src,
  rows = 15,
  cols = 7,
  density = 1,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const img = document.createElement('img');
    img.decoding = 'async';

    const stage = { width: 0, height: 0, dpr: 1 };
    const allPeeps: Peep[] = [];
    const available: Peep[] = [];
    const crowd: Peep[] = [];

    let initialized = false;
    let active = false;
    let reduced = false;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduced = media.matches;

    const createPeep = (rect: [number, number, number, number]) => {
      const peep: Peep = {
        image: img,
        rect,
        width: rect[2],
        height: rect[3],
        drawArgs: [img, ...rect, 0, 0, rect[2], rect[3]],
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
        render: (ctx) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(...peep.drawArgs);
          ctx.restore();
        },
      };
      return peep;
    };

    const pauseCrowd = () => {
      crowd.forEach((peep) => peep.walk?.pause());
    };

    const resumeCrowd = () => {
      crowd.forEach((peep) => peep.walk?.resume());
    };

    const render = () => {
      context.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
      context.clearRect(0, 0, stage.width, stage.height);
      crowd.forEach((peep) => peep.render(context));
    };

    const stopTicker = () => {
      pauseCrowd();
      if (!active) return;
      active = false;
      gsap.ticker.remove(render);
    };

    const startTicker = () => {
      if (!initialized || reduced || active) return;
      if (!document.hidden && canvas.dataset.visible === 'true') {
        resumeCrowd();
        active = true;
        gsap.ticker.add(render);
      }
    };

    const resetPeep = (peep: Peep) => {
      const direction: 1 | -1 = Math.random() > .5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width + peep.width : -peep.width;

      peep.scaleX = direction;
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const createWalk = (peep: Peep, values: ReturnType<typeof resetPeep>) => {
      const duration = randomRange(8, 13);
      const bob = randomRange(7, 12);
      const timeline = gsap.timeline();
      timeline.timeScale(randomRange(.55, 1.35));
      timeline.to(peep, { duration, x: values.endX, ease: 'none' }, 0);
      timeline.to(peep, {
        duration: .25,
        repeat: Math.max(1, Math.round(duration / .25)),
        yoyo: true,
        y: values.startY - bob,
        ease: 'sine.inOut',
      }, 0);
      timeline.eventCallback('onComplete', () => {
        if (!crowd.includes(peep)) return;
        removePeep(peep);
        addPeep();
      });
      return timeline;
    };

    const removePeep = (peep: Peep) => {
      const index = crowd.indexOf(peep);
      if (index >= 0) crowd.splice(index, 1);
      peep.walk?.kill();
      peep.walk = null;
      if (!available.includes(peep)) available.push(peep);
    };

    const addPeep = () => {
      if (!available.length) return;
      const peep = available.splice(randomIndex(available), 1)[0];
      const values = resetPeep(peep);
      peep.walk = reduced ? null : createWalk(peep, values);
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      if (!active && !reduced) peep.walk.pause();
    };

    const initCrowd = () => {
      stopTicker();
      available.length = 0;
      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;

      const amount = Math.max(8, Math.round(allPeeps.length * Math.min(1, Math.max(.32, density))));
      available.push(...[...allPeeps].sort(() => Math.random() - .5).slice(0, amount));

      while (available.length) {
        addPeep();
        if (reduced) break;
      }

      if (reduced) {
        const staticCrowd = allPeeps.slice(0, Math.min(16, allPeeps.length));
        crowd.length = 0;
        crowd.push(...staticCrowd);
        crowd.forEach((peep) => {
          peep.scaleX = Math.random() > .5 ? 1 : -1;
          peep.x = randomRange(0, Math.max(0, stage.width - peep.width));
          peep.y = randomRange(
            Math.max(0, stage.height - peep.height - 180),
            Math.max(0, stage.height - peep.height + 20),
          );
          peep.anchorY = peep.y;
        });
        crowd.sort((a, b) => a.anchorY - b.anchorY);
        render();
      } else {
        startTicker();
      }
    };

    const resize = () => {
      stage.width = Math.max(1, canvas.clientWidth);
      stage.height = Math.max(1, canvas.clientHeight);
      stage.dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

      const pixelWidth = Math.round(stage.width * stage.dpr);
      const pixelHeight = Math.round(stage.height * stage.dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      if (initialized) initCrowd();
      if (reduced) render();
    };

    const init = () => {
      if (initialized || !img.naturalWidth || !img.naturalHeight) return;

      const frameWidth = img.naturalWidth / rows;
      const frameHeight = img.naturalHeight / cols;

      for (let index = 0; index < rows * cols; index += 1) {
        allPeeps.push(createPeep([
          (index % rows) * frameWidth,
          Math.floor(index / rows) * frameHeight,
          frameWidth,
          frameHeight,
        ]));
      }

      initialized = true;
      resize();
    };

    const setViewportState = (visible: boolean) => {
      canvas.dataset.visible = String(visible);
      if (visible) startTicker();
      else stopTicker();
    };

    const onVisibility = () => {
      if (document.hidden) stopTicker();
      else startTicker();
    };

    const onMotionPreference = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      initCrowd();
      if (!reduced) startTicker();
    };

    canvas.dataset.visible = 'false';
    img.onload = init;
    img.onerror = () => {
      canvas.dataset.error = 'true';
      stopTicker();
    };
    img.src = src;

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    intersectionObserver = new IntersectionObserver(
      (entries) => setViewportState(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: '160px 0px' },
    );
    intersectionObserver.observe(canvas);

    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', onMotionPreference);

    return () => {
      stopTicker();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', onMotionPreference);
      crowd.forEach((peep) => peep.walk?.kill());
      allPeeps.forEach((peep) => peep.walk?.kill());
      allPeeps.length = 0;
      available.length = 0;
      crowd.length = 0;
      img.onload = null;
      img.onerror = null;
      img.src = '';
    };
  }, [src, rows, cols, density]);

  return <canvas ref={canvasRef} className={('canvas-crowd ' + className).trim()} aria-hidden="true" />;
}
