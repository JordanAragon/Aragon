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
    const randomIndex = (array: unknown[]) => randomRange(0, array.length) | 0;
    const removeFromArray = <T,>(array: T[], index: number) => array.splice(index, 1)[0];
    const removeItemFromArray = <T,>(array: T[], item: T) => {
      const index = array.indexOf(item);
      if (index >= 0) removeFromArray(array, index);
    };
    const removeRandomFromArray = <T,>(array: T[]) => removeFromArray(array, randomIndex(array));
    const getRandomFromArray = <T,>(array: T[]) => array[randomIndex(array)];

    const resetPeep = ({ stage, peep }: { stage: { width: number; height: number }; peep: Peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const normalWalk = ({ peep, props }: { peep: Peep; props: ReturnType<typeof resetPeep> }) => {
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

    const walks = [normalWalk];

    const createPeep = ({ image, rect }: { image: HTMLImageElement; rect: number[] }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
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

      peep.setRect(rect);
      return peep;
    };

    const img = document.createElement("img");
    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows: sheetRows, cols: sheetCols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const rectWidth = width / sheetRows;
      const rectHeight = height / sheetCols;

      allPeeps.length = 0;
      for (let i = 0; i < sheetRows * sheetCols; i += 1) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % sheetRows) * rectWidth,
              Math.floor(i / sheetRows) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return null;

      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({ peep, props: resetPeep({ peep, stage }) }).eventCallback(
        "onComplete",
        () => {
          removePeepFromCrowd(peep);
          addPeepToCrowd();
        },
      );

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        const peep = addPeepToCrowd();
        peep?.walk?.progress(Math.random());
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);
      crowd.forEach((peep) => peep.render(ctx));
      ctx.restore();
    };

    const resize = () => {
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

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
      canvas.dataset.error = "true";
    };

    // Keep the public component API, but use the exact sprite used by the Skiper 39 reference.
    img.src = SKIPER_SPRITE || config.src;

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [src, rows, cols]);

  return (
    <>
      <style>{`
        .context-visual{background:#000!important;border-color:#000!important;border-radius:0!important;box-shadow:none!important;aspect-ratio:auto!important;min-height:clamp(620px,72svh,840px)!important;}
        .context-crowd-layer{position:absolute!important;inset:0!important;z-index:30!important;background:#000!important;overflow:hidden!important;}
        .context-crowd-canvas{position:absolute!important;inset:0!important;z-index:1!important;overflow:hidden!important;}
        .context-crowd-canvas .progressive-blur{display:none!important;}
        .context-visual-head,.context-visual-grid,.context-architecture,.context-readout,.context-ground-label,.context-ground-line{display:none!important;}
        .context-visual::before{display:none!important;}
        .context-visual::after{content:"SKIPER UI · CODEPEN · OPEN PEEPS"!important;position:absolute!important;left:18px!important;right:auto!important;top:auto!important;bottom:16px!important;z-index:50!important;border:0!important;width:auto!important;height:auto!important;color:rgba(255,255,255,.42)!important;font:800 7px/1 var(--body)!important;letter-spacing:.13em!important;text-transform:uppercase!important;pointer-events:none!important;background:none!important;}
        .context-crowd-canvas .canvas-crowd{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;opacity:1!important;filter:none!important;mask-image:none!important;-webkit-mask-image:none!important;}
        @media (max-width:780px){
          .context-visual{min-height:480px!important;}
          .context-visual::after{left:14px!important;bottom:13px!important;font-size:6px!important;}
        }
        @media (max-width:520px){.context-visual{min-height:420px!important;}}
      `}</style>
      <canvas ref={canvasRef} className="absolute bottom-0 h-full w-full" aria-hidden="true" />
    </>
  );
}
