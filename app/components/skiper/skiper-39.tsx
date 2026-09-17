'use client';

import CanvasCrowdExact from './canvas-crowd-exact';

type Skiper39Props = {
  src?: string;
  rows?: number;
  cols?: number;
  className?: string;
};

const DEFAULT_SPRITE = '/images/peeps/aragon-crowd-sprite.svg';

export default function Skiper39({
  src = DEFAULT_SPRITE,
  rows = 15,
  cols = 7,
  className = '',
}: Skiper39Props) {
  return (
    <section className={`skiper39 relative h-full min-h-[620px] w-full overflow-hidden bg-white text-black ${className}`} aria-label="Crowd Canvas">
      <div className="absolute left-1/2 top-8 z-10 grid -translate-x-1/2 justify-items-center gap-2 text-center text-black/40" aria-hidden="true">
        <span className="relative max-w-[12ch] text-[10px] uppercase leading-tight tracking-[0.04em]">
          Crowd<br />Canvas
        </span>
        <span className="h-12 w-px bg-gradient-to-b from-black/10 to-black/50" />
      </div>
      <CanvasCrowdExact src={src} rows={rows} cols={cols} />
      <span className="absolute bottom-3 left-4 z-10 text-[7px] font-black uppercase tracking-[0.13em] text-black/30" aria-hidden="true">
        SKIPER UI · CROWD CANVAS · ARAGON
      </span>
    </section>
  );
}

export { CanvasCrowdExact };
