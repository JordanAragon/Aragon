/*
  Relevo entre la precarga y el campo del hero. Mientras la precarga corre, el
  hero monta su campo pero no lo arranca: lo ofrece aquí. Al terminar, la
  precarga le entrega la posición de cada pieza (la palabra de marca) y el
  hero sigue desde ahí en el mismo cuadro: son las mismas piezas.

  La clase de <html> la pone el script en línea de app/layout.tsx antes del
  primer cuadro, solo en «/», sin ancla y sin movimiento reducido.
*/

export const PRELOAD_CLASS = 'is-preloading';

/** Cuántas piezas tiene el hero: la precarga dibuja exactamente esas. */
export const HERO_COUNT = 3800;

export function fieldCount(count: number) {
  if (typeof window === 'undefined') return count;
  return Math.round(window.matchMedia('(max-width: 760px)').matches ? count * 0.42 : count);
}

export type FieldOffer = {
  n: number;
  canvas: HTMLCanvasElement;
  /** Recibe las piezas en coordenadas de la ventana (o nada, si la precarga no llegó a entregarlas) y arranca. */
  receive: (points: Float32Array | null, alpha: number) => void;
};

let offer: FieldOffer | null = null;
const listeners = new Set<() => void>();

export function isPreloading() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains(PRELOAD_CLASS);
}

export function offerField(next: FieldOffer) {
  offer = next;
  listeners.forEach((listener) => listener());
  return () => {
    if (offer === next) offer = null;
  };
}

export function offeredField() {
  return offer;
}

export function onFieldOffered(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
