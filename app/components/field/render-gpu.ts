/*
  Render con WebGPU usando vgpu (Vercel Labs, MIT). Una sola llamada instanciada:
  cada instancia es un cuadrado de dos triángulos, y su posición, alfa y tamaño
  se leen de un buffer de almacenamiento que la simulación escribe en cada cuadro.

  Este módulo se carga en diferido y solo si el navegador tiene WebGPU; si algo
  falla, el campo vuelve al respaldo en Canvas 2D.
*/

import { draw, frame, init, storage, surface } from 'vgpu';
import type { FieldRenderer } from './render-canvas';

const SHADER = /* wgsl */ `
struct Vista {
  tam: vec4f,
  color: vec4f,
};
@group(0) @binding(0) var<uniform> vista: Vista;
@group(0) @binding(1) var<storage, read> piezas: array<vec4f>;

struct Salida {
  @builtin(position) posicion: vec4f,
  @location(0) uv: vec2f,
  @location(1) alfa: f32,
};

const ESQUINAS = array<vec2f, 6>(
  vec2f(-0.5, -0.5), vec2f(0.5, -0.5), vec2f(0.5, 0.5),
  vec2f(-0.5, -0.5), vec2f(0.5, 0.5), vec2f(-0.5, 0.5),
);

@vertex fn vs_main(@builtin(vertex_index) v: u32, @builtin(instance_index) i: u32) -> Salida {
  let p = piezas[i];
  let esquina = ESQUINAS[v];
  let px = p.xy + esquina * p.w;
  let clip = vec2f(px.x / vista.tam.x * 2.0 - 1.0, 1.0 - px.y / vista.tam.y * 2.0);
  var out: Salida;
  out.posicion = vec4f(clip, 0.0, 1.0);
  out.uv = esquina;
  out.alfa = p.z;
  return out;
}

@fragment fn fs_main(entrada: Salida) -> @location(0) vec4f {
  // Un brillo suave alrededor de las piezas más encendidas: la luz del orden.
  let a = clamp(entrada.alfa, 0.0, 1.0) * vista.color.a;
  return vec4f(vista.color.rgb * a, a);
}
`;

export async function createGpuRenderer(
  canvas: HTMLCanvasElement,
  capacity: number,
  color: [number, number, number],
  onFail: (error: unknown) => void,
): Promise<FieldRenderer> {
  const gpu = await init({ powerPreference: 'high-performance' });
  let failed = false;
  const fail = (error: unknown) => {
    if (failed) return;
    failed = true;
    onFail(error);
  };
  gpu.onError?.((error) => {
    const cause = (error as { cause?: { message?: string } })?.cause?.message;
    console.warn('[aragon] WebGPU no disponible, se usa Canvas 2D.', cause ?? error);
    fail(error);
  });

  const target = surface(gpu, canvas, { dpr: [1, 2], alphaMode: 'premultiplied', clearColor: [0, 0, 0, 0] });
  const buffer = storage(gpu, capacity * 16, 'read');
  const points = draw(gpu, {
    label: 'piezas',
    shader: SHADER,
    vertices: 6,
    instances: capacity,
    blend: 'premultiplied',
    set: { piezas: buffer, vista: { tam: [canvas.clientWidth || 1, canvas.clientHeight || 1, 1, 0], color: [color[0], color[1], color[2], 1] } },
  });
  let width = canvas.clientWidth || 1;
  let height = canvas.clientHeight || 1;
  let disposed = false;

  return {
    kind: 'webgpu',
    resize(w, h) {
      width = w;
      height = h;
    },
    draw(data, count) {
      if (disposed || failed) return;
      buffer.write(data.subarray(0, count * 4) as Float32Array<ArrayBuffer>);
      points.set({ vista: { tam: [width, height, 1, 0], color: [color[0], color[1], color[2], 1] } });
      frame(gpu, (f) => f.pass({ target, clear: [0, 0, 0, 0] }, (p) => p.draw(points, { instances: count })));
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
