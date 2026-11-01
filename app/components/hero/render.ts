/*
  Render de las piezas del hero, con paleta. Cada pieza llega como
  (x, y, color * 2 + alfa, tamaño). Canvas 2D desde el primer cuadro; WebGPU
  (vgpu) se intenta después, en diferido, y si falla vuelve el Canvas 2D.
*/

export type Rgb = [number, number, number];

export type PieceRenderer = {
  kind: 'webgpu' | 'canvas';
  resize(width: number, height: number, dpr: number): void;
  draw(data: Float32Array, count: number): void;
  dispose(): void;
};

const BUCKETS = 4;

export function createCanvasRenderer(canvas: HTMLCanvasElement, palette: Rgb[]): PieceRenderer {
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  let w = 1;
  let h = 1;
  // Un estilo por color y nivel de alfa: así no se cambia el relleno miles de veces por cuadro.
  const styles = palette.map((c) => {
    const rgb = `${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}`;
    return Array.from({ length: BUCKETS }, (_, i) => `rgba(${rgb}, ${((i + 1) / BUCKETS).toFixed(3)})`);
  });
  const lists: number[][] = Array.from({ length: palette.length * BUCKETS }, () => []);

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
        const z = data[i * 4 + 2];
        const col = Math.min(palette.length - 1, Math.floor(z / 2));
        const a = z - col * 2;
        if (a <= 0.02) continue;
        const b = Math.min(BUCKETS - 1, Math.floor(a * BUCKETS - 1e-6));
        lists[col * BUCKETS + b].push(i);
      }
      for (let col = 0; col < palette.length; col++) {
        for (let b = 0; b < BUCKETS; b++) {
          const list = lists[col * BUCKETS + b];
          if (!list.length) continue;
          ctx.fillStyle = styles[col][b];
          ctx.beginPath();
          for (const i of list) {
            const s = data[i * 4 + 3];
            ctx.rect(data[i * 4] - s / 2, data[i * 4 + 1] - s / 2, s, s);
          }
          ctx.fill();
        }
      }
    },
    dispose() {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}

const SHADER = /* wgsl */ `
struct Vista {
  tam: vec4f,
  c0: vec4f,
  c1: vec4f,
  c2: vec4f,
  c3: vec4f,
};
@group(0) @binding(0) var<uniform> vista: Vista;
@group(0) @binding(1) var<storage, read> piezas: array<vec4f>;

struct Salida {
  @builtin(position) posicion: vec4f,
  @location(0) color: vec4f,
};

const ESQUINAS = array<vec2f, 6>(
  vec2f(-0.5, -0.5), vec2f(0.5, -0.5), vec2f(0.5, 0.5),
  vec2f(-0.5, -0.5), vec2f(0.5, 0.5), vec2f(-0.5, 0.5),
);

@vertex fn vs_main(@builtin(vertex_index) v: u32, @builtin(instance_index) i: u32) -> Salida {
  let p = piezas[i];
  let px = p.xy + ESQUINAS[v] * p.w;
  let clip = vec2f(px.x / vista.tam.x * 2.0 - 1.0, 1.0 - px.y / vista.tam.y * 2.0);
  let indice = floor(p.z / 2.0);
  let alfa = clamp(p.z - indice * 2.0, 0.0, 1.0);
  var color = vista.c0;
  if (indice >= 3.0) { color = vista.c3; } else if (indice >= 2.0) { color = vista.c2; } else if (indice >= 1.0) { color = vista.c1; }
  var out: Salida;
  out.posicion = vec4f(clip, 0.0, 1.0);
  out.color = vec4f(color.rgb * alfa, alfa);
  return out;
}

@fragment fn fs_main(entrada: Salida) -> @location(0) vec4f {
  return entrada.color;
}
`;

export async function createGpuRenderer(
  canvas: HTMLCanvasElement,
  capacity: number,
  palette: Rgb[],
  onFail: (error: unknown) => void,
): Promise<PieceRenderer> {
  const { draw, frame, init, storage, surface } = await import('vgpu');
  const gpu = await init({ powerPreference: 'high-performance' });
  let failed = false;
  const fail = (error: unknown) => {
    if (failed) return;
    failed = true;
    onFail(error);
  };
  gpu.onError?.((error) => {
    const cause = (error as { cause?: { message?: string } })?.cause?.message;
    console.warn('[aragon] WebGPU no disponible en el hero, se usa Canvas 2D.', cause ?? error);
    fail(error);
  });

  const colors = [0, 1, 2, 3].map((i) => {
    const c = palette[Math.min(i, palette.length - 1)];
    return [c[0], c[1], c[2], 1] as [number, number, number, number];
  });
  let width = canvas.clientWidth || 1;
  let height = canvas.clientHeight || 1;
  const vista = () => ({ tam: [width, height, 1, 0], c0: colors[0], c1: colors[1], c2: colors[2], c3: colors[3] });

  const target = surface(gpu, canvas, { dpr: [1, 2], alphaMode: 'premultiplied', clearColor: [0, 0, 0, 0] });
  const buffer = storage(gpu, capacity * 16, 'read');
  const pieces = draw(gpu, {
    label: 'piezas-hero',
    shader: SHADER,
    vertices: 6,
    instances: capacity,
    blend: 'premultiplied',
    set: { piezas: buffer, vista: vista() },
  });
  let disposed = false;

  return {
    kind: 'webgpu',
    resize(w, h) {
      width = w;
      height = h;
    },
    draw(data, count) {
      if (disposed || failed) return;
      const n = Math.min(count, capacity);
      buffer.write(data.subarray(0, n * 4) as Float32Array<ArrayBuffer>);
      pieces.set({ vista: vista() });
      frame(gpu, (f) => f.pass({ target, clear: [0, 0, 0, 0] }, (p) => p.draw(pieces, { instances: n })));
    },
    dispose() {
      disposed = true;
      try {
        target.dispose?.();
        gpu.dispose?.();
      } catch {
        // La GPU pudo haberse liberado antes: no queda nada que soltar.
      }
    },
  };
}

export function supportsGpu() {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && /(^|-)2g|3g/.test(connection.effectiveType)) return false;
  return true;
}
