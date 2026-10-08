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
const randomIndex = (items: unknown[]) => Math.floor(Math.random() * items.length);
const removeFromArray = <T,>(items: T[], index: number) => items.splice(index, 1)[0];
const removeRandomFromArray = <T,>(items: T[]) => removeFromArray(items, randomIndex(items));

export default function CanvasCrowdExact({ src, rows = 15, cols = 7, density = 0.68, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const image = document.createElement('img');
    const stage = { width: 0, height: 0, dpr: 1 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let initialized = false;
    let active = false;
    let tickerAttached = false;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;

    const setTicker = (enabled: boolean) => {
      if (enabled && !tickerAttached) {
        gsap.ticker.add(render);
        tickerAttached = true;
      } else if (!enabled && tickerAttached) {
        gsap.ticker.remove(render);
        tickerAttached = false;
      }
    };

    const createPeep = ({ image: source, rect }: { image: HTMLImageElement; rect: [number, number, number, number] }): Peep => {
      const peep = {
        image: source,
        rect,
        width: rect[2],
        height: rect[3],
        drawArgs: [source, ...rect, 0, 0, rect[2], rect[3]] as Peep['drawArgs'],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1 as 1 | -1,
        walk: null,
        setRect(nextRect: [number, number, number, number]) {
          peep.rect = nextRect;
          peep.width = nextRect[2];
          peep.height = nextRect[3];
          peep.drawArgs = [peep.image, ...nextRect, 0, 0, peep.width, peep.height];
        },
        render(renderContext: CanvasRenderingContext2D) {
          renderContext.save();
          renderContext.translate(peep.x, peep.y);
          renderContext.scale(peep.scaleX, 1);
          renderContext.drawImage(...peep.drawArgs);
          renderContext.restore();
        },
      } as Peep;

      return peep;
    };

    const resetPeep = (peep: Peep) => {
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const depth = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
      const startY = stage.height - peep.height + depth;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width + peep.width : -peep.width;
      peep.scaleX = direction;
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      return { startY, endX };
    };

    const startWalk = (peep: Peep) => {
      const props = resetPeep(peep);
      const xDuration = randomRange(9, 14);
      const yDuration = 0.25;
      const timeline = gsap.timeline({
        onComplete: () => {
          availablePeeps.push(peep);
          crowd.splice(crowd.indexOf(peep), 1);
          if (active && !reducedMotion.matches) addPeep();
        },
      });

      timeline.timeScale(randomRange(0.7, 1.15));
      timeline.to(peep, { duration: xDuration, x: props.endX, ease: 'none' }, 0);
      timeline.to(
        peep,
        { duration: yDuration, repeat: Math.round(xDuration / yDuration), yoyo: true, y: props.startY - 8, ease: 'sine.inOut' },
        0,
      );
      peep.walk = timeline;
      timeline.progress(Math.random());
    };

    const addPeep = () => {
      if (!availablePeeps.length) return;
      const peep = removeRandomFromArray(availablePeeps);
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      startWalk(peep);
    };

    function render() {
      if (!active || !stage.width || !stage.height) return;
      context.clearRect(0, 0, stage.width, stage.height);
      crowd.forEach((peep) => peep.render(context));
    }

    const drawStatic = () => {
      context.clearRect(0, 0, stage.width, stage.height);
      crowd.forEach((peep, index) => {
        const spread = stage.width / Math.max(2, crowd.length - 1);
        peep.x = index * spread;
        peep.y = stage.height - peep.height - (index % 4) * 6;
        peep.anchorY = peep.y;
        peep.scaleX = index % 2 ? -1 : 1;
        peep.render(context);
      });
    };

    const initCrowd = () => {
      availablePeeps.length = 0;
      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;

      const count = Math.max(12, Math.round(allPeeps.length * Math.min(1, Math.max(0.35, density))));
      const shuffled = [...allPeeps].sort(() => Math.random() - 0.5);
      availablePeeps.push(...shuffled.slice(0, count));

      if (reducedMotion.matches) {
        crowd.push(...availablePeeps.splice(0));
        crowd.sort((a, b) => a.anchorY - b.anchorY);
        drawStatic();
        return;
      }

      while (availablePeeps.length) addPeep();
    };

    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

      if (width === stage.width && height === stage.height && dpr === stage.dpr) return;

      stage.width = width;
      stage.height = height;
      stage.dpr = dpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (initialized) initCrowd();
    };

    const setActive = (next: boolean) => {
      active = next;
      if (reducedMotion.matches) {
        drawStatic();
        return;
      }

      crowd.forEach((peep) => peep.walk?.paused(!active));
      setTicker(active && !document.hidden);
    };

    const onVisibility = () => setActive(active);

    const initialize = () => {
      if (initialized || !image.naturalWidth || !image.naturalHeight) return;

      const frameWidth = image.naturalWidth / rows;
      const frameHeight = image.naturalHeight / cols;

      for (let index = 0; index < rows * cols; index += 1) {
        allPeeps.push(createPeep({
          image,
          rect: [
            (index % rows) * frameWidth,
            Math.floor(index / rows) * frameHeight,
            frameWidth,
            frameHeight,
          ],
        }));
      }

      initialized = true;
      resize();
      if (visibilityObserver) setActive(active);
    };

    const onReducedMotionChange = () => {
      if (!initialized) return;
      initCrowd();
      setActive(active);
    };

    image.onload = initialize;
    image.onerror = () => { canvas.dataset.error = 'true'; };
    image.src = src;

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    visibilityObserver = new IntersectionObserver(
      (entries) => setActive(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: '160px 0px' },
    );
    visibilityObserver.observe(canvas);

    document.addEventListener('visibilitychange', onVisibility);
    reducedMotion.addEventListener('change', onReducedMotionChange);

    return () => {
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener('change', onReducedMotionChange);
      setTicker(false);
      allPeeps.forEach((peep) => peep.walk?.kill());
      allPeeps.length = 0;
      availablePeeps.length = 0;
      crowd.length = 0;
      image.onload = null;
      image.onerror = null;
      image.src = '';
    };
  }, [src, rows, cols, density]);

  return <canvas ref={canvasRef} className={['canvas-crowd', className].filter(Boolean).join(' ')} aria-hidden="true" />;
}
