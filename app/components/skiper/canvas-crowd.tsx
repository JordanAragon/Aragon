"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  rows?: number;
  cols?: number;
};

type Peep = {
  image: HTMLImageElement;
  rect: number[];
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  setRect: (rect: number[]) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
};

const SKIPER_SPRITE = "https://assets.codepen.io/721952/all-peeps.png";

export default function CanvasCrowd({ src, rows = 15, cols = 7 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = { src, rows, cols };
    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
    const randomIndex = <T,>(array: T[]) => Math.floor(randomRange(0, array.length));
    const removeRandom = <T,>(array: T[]) => array.splice(randomIndex(array), 1)[0];
    const getRandom = <T,>(array: T[]) => array[randomIndex(array)];

    const resetPeep = ({
      stage,
      peep,
    }: {
      stage: { width: number; height: number };
      peep: Peep;
    }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width : 0;

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      peep.scaleX = direction;

      return { startX, startY, endX };
    };

    const normalWalk = ({
      peep,
      props,
    }: {
      peep: Peep;
      props: ReturnType<typeof resetPeep>;
    }) => {
      const { startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;
      const timeline = gsap.timeline();

      timeline.timeScale(randomRange(0.5, 1.5));
      timeline.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      timeline.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return timeline;
    };

    const createPeep = ({ image, rect }: { image: HTMLImageElement; rect: number[] }): Peep => {
      const peep: Peep = {
        image,
        rect,
        width: rect[2],
        height: rect[3],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (nextRect) => {
          peep.rect = nextRect;
          peep.width = nextRect[2];
          peep.height = nextRect[3];
        },
        render: (context) => {
          context.save();
          context.translate(peep.x, peep.y);
          context.scale(peep.scaleX, 1);
          context.drawImage(
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
          context.restore();
        },
      };

      return peep;
    };

    const img = document.createElement("img");
    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    let fallbackUsed = false;

    const createPeeps = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      const rectWidth = width / config.rows;
      const rectHeight = height / config.cols;

      allPeeps.length = 0;
      for (let i = 0; i < config.rows * config.cols; i += 1) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % config.rows) * rectWidth,
              Math.floor(i / config.rows) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const removePeep = (peep: Peep) => {
      const index = crowd.indexOf(peep);
      if (index >= 0) crowd.splice(index, 1);
      availablePeeps.push(peep);
    };

    const addPeep = () => {
      if (!availablePeeps.length) return;
      const peep = removeRandom(availablePeeps);
      const walk = normalWalk({ peep, props: resetPeep({ stage, peep }) }).eventCallback(
        "onComplete",
        () => {
          removePeep(peep);
          addPeep();
        },
      );

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeep();
        const peep = crowd[crowd.length - 1];
        peep?.walk?.progress(Math.random());
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      crowd.forEach((peep) => peep.render(ctx));
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
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.onerror = () => {
      if (!fallbackUsed && config.src && config.src !== SKIPER_SPRITE) {
        fallbackUsed = true;
        img.src = config.src;
      } else {
        canvas.dataset.error = "true";
      }
    };
    img.src = SKIPER_SPRITE;

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [src, rows, cols]);

  return (
    <>
      <style>{`
        .context-visual:has(.context-crowd-stage .canvas-crowd){
          background:#000!important;
          border-color:#000!important;
          border-radius:0!important;
          box-shadow:none!important;
          min-height:clamp(620px,72svh,840px)!important;
        }
        .context-visual:has(.context-crowd-stage .canvas-crowd) .context-visual-head,
        .context-visual:has(.context-crowd-stage .canvas-crowd) .context-visual-grid,
        .context-visual:has(.context-crowd-stage .canvas-crowd) .context-architecture,
        .context-visual:has(.context-crowd-stage .canvas-crowd) .context-readout,
        .context-visual:has(.context-crowd-stage .canvas-crowd) .context-ground-label,
        .context-visual:has(.context-crowd-stage .canvas-crowd) .context-ground-line{
          display:none!important;
        }
        .context-visual:has(.context-crowd-stage .canvas-crowd)::before{display:none!important;}
        .context-visual:has(.context-crowd-stage .canvas-crowd)::after{
          content:"SKIPER UI · CODEPEN · OPEN PEEPS"!important;
          position:absolute!important;
          left:18px!important;
          right:auto!important;
          top:auto!important;
          bottom:16px!important;
          width:auto!important;
          height:auto!important;
          border:0!important;
          color:rgba(255,255,255,.42)!important;
          font:800 7px/1 var(--body)!important;
          letter-spacing:.13em!important;
          text-transform:uppercase!important;
          background:none!important;
          pointer-events:none!important;
          z-index:50!important;
        }
        .context-visual:has(.context-crowd-stage .canvas-crowd) .context-crowd-stage{
          position:absolute!important;
          inset:0!important;
          height:auto!important;
          border:0!important;
          background:#000!important;
          z-index:20!important;
        }
        .context-visual:has(.context-crowd-stage .canvas-crowd) .canvas-crowd-wrap{
          position:absolute!important;
          inset:0!important;
          width:100%!important;
          height:100%!important;
          z-index:1!important;
        }
        .context-visual:has(.context-crowd-stage .canvas-crowd) .canvas-crowd{
          position:absolute!important;
          inset:0!important;
          width:100%!important;
          height:100%!important;
          display:block!important;
          opacity:1!important;
          filter:none!important;
          mask-image:none!important;
          -webkit-mask-image:none!important;
        }
        @media (max-width:780px){
          .context-visual:has(.context-crowd-stage .canvas-crowd){min-height:520px!important;}
        }
        @media (max-width:520px){
          .context-visual:has(.context-crowd-stage .canvas-crowd){min-height:430px!important;}
        }
      `}</style>
      <canvas ref={canvasRef} className="absolute bottom-0 h-[90vh] w-full" />
    </>
  );
}
