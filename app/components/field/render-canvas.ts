/* Respaldo en Canvas 2D: el mismo dibujo que WebGPU, para equipos sin WebGPU. */

export type FieldRenderer = {
  kind: 'webgpu' | 'canvas';
  resize(width: number, height: number, dpr: number): void;
  draw(data: Float32Array, count: number): void;
  dispose(): void;
};

const BUCKETS = 6;

export function createCanvasRenderer(canvas: HTMLCanvasElement, color: [number, number, number]): FieldRenderer {
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  let w = 1;
  let h = 1;
  const rgb = `${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}`;
  // Agrupar por brillo evita cambiar el estilo de relleno miles de veces por cuadro.
  const styles = Array.from({ length: BUCKETS }, (_, i) => `rgba(${rgb}, ${((i + 1) / BUCKETS).toFixed(3)})`);
  const lists: number[][] = Array.from({ length: BUCKETS }, () => []);

  return {
    kind: 'canvas',
    resize(width, height, ratio) {
      dpr = ratio;
      w = width;
      h = height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
    },
    draw(data, count) {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const list of lists) list.length = 0;
      for (let i = 0; i < count; i++) {
        const a = data[i * 4 + 2];
        if (a <= 0.02) continue;
        const b = Math.min(BUCKETS - 1, Math.floor(a * BUCKETS));
        lists[b].push(i);
      }
      for (let b = 0; b < BUCKETS; b++) {
        const list = lists[b];
        if (!list.length) continue;
        ctx.fillStyle = styles[b];
        ctx.beginPath();
        for (const i of list) {
          const s = data[i * 4 + 3];
          ctx.rect(data[i * 4] - s / 2, data[i * 4 + 1] - s / 2, s, s);
        }
        ctx.fill();
      }
    },
    dispose() {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
