/**
 * Trabajo real. Nada de clientes inventados: un producto propio y proyectos
 * para clientes, con su estado tal cual. Los que muestra la web los eligió
 * David (2026-11-01): AiDEN, CHILA y el portafolio de Leidy.
 */

export type WorkItem = {
  slug: string;
  title: string;
  kind: string;
  status: string;
  year: string;
  /** El servicio que muestra el caso. */
  service?: string;
  summary: string;
  problem: string;
  built: { title: string; body: string }[];
  decisions: { title: string; body: string }[];
  stack: string[];
  href?: string;
  hrefLabel?: string;
  /** Título de la barra de la ventana en la vista previa. */
  bar: string;
  /** Captura real del proyecto (public/media/trabajo). */
  shot: { src: string; width: number; height: number; alt: string };
};

export const work: WorkItem[] = [
  {
    slug: 'aiden',
    title: 'AiDEN',
    kind: 'Producto propio',
    status: 'En producción, en mejora continua',
    year: '2026',
    service: 'Software a la medida',
    summary: 'Gestión de viveros e invernaderos con el vivero completo dibujado en 3D en el navegador.',
    problem:
      'En muchos viveros el estado de cada lote vive en cuadernos, mensajes y la memoria de quien lo cuida. Cuando esa persona falta, nadie sabe qué riego, trasplante o plaga está pendiente.',
    built: [
      { title: 'Operación por roles', body: 'Vistas distintas para administración, supervisión y operarios, cada una con lo que necesita para su trabajo.' },
      { title: 'El vivero en 3D', body: 'Cada planta viva es un punto de la escena, dibujado con WebGPU y con respaldo para equipos sin ella.' },
      { title: 'Trazabilidad', body: 'La historia de cada lote, de la siembra al despacho, en una línea de tiempo.' },
      { title: 'Asistente', body: 'Responde preguntas sobre la operación con la fuente de cada respuesta a la vista.' },
    ],
    decisions: [
      { title: 'vgpu en vez de Spline', body: 'Licencia MIT y carga diferida, sin abrir la política de seguridad del sitio ni pagar un plan.' },
      { title: 'Técnicas, no copias', body: 'Los efectos de librerías con licencia restrictiva se reescribieron en código propio.' },
    ],
    stack: ['React', 'Vite', 'WebGPU (vgpu)', 'PWA'],
    href: 'https://aidencol.vercel.app/',
    hrefLabel: 'Abrir AiDEN',
    bar: 'aidencol.vercel.app',
    shot: {
      src: '/media/trabajo/aiden.webp',
      width: 1440,
      height: 900,
      alt: 'Portada de AiDEN: el titular «Pasado mañana salen 400 plantas de tomate hacia Timbío», el isotipo hecho con las 4.894 plantas del vivero y la ficha del lote.',
    },
  },
  {
    slug: 'chila',
    title: 'CHILA',
    kind: 'Proyecto para clienta',
    status: 'Publicado',
    year: '2026',
    service: 'Software a la medida',
    summary: 'Web a medida para CHILA the studio, un estudio creativo de Washington DC, con un panel donde la dueña edita textos, casos y fotos sin tocar código.',
    problem:
      'El estudio vendía diseño, fotografía y video para marcas, pero su web hablaba casi solo de bodas y cada cambio dependía de una plantilla. Necesitaba presentarse como estudio creativo y poder actualizarse sola.',
    built: [
      { title: 'Diseño propio', body: 'Una web hecha sobre la marca nueva del estudio, en inglés, para su público en el área de Washington DC.' },
      { title: 'Panel de edición', body: 'Textos, casos y fotos se cambian desde un panel; la web se actualiza sin pasar por nosotros.' },
      { title: 'La C en movimiento', body: 'El símbolo del estudio se dibuja con color líquido en WebGPU, con respaldo para equipos que no la tienen.' },
      { title: 'Contacto por pasos', body: 'Un formulario en cuatro pasos para que cada cliente llegue con lo necesario para cotizar.' },
    ],
    decisions: [
      { title: 'El panel va incluido', body: 'Si la clienta depende de nosotros para cambiar una foto, la web envejece. El panel es parte del trabajo, no un extra.' },
      { title: 'Su voz, no la nuestra', body: 'Se partió de los textos que el estudio ya tenía; lo nuevo se escribió en el mismo tono.' },
    ],
    stack: ['Next.js', 'Sanity', 'WebGPU (vgpu)', 'Vercel'],
    href: 'https://chila-iota.vercel.app/',
    hrefLabel: 'Abrir CHILA',
    bar: 'chila-iota.vercel.app',
    shot: {
      src: '/media/trabajo/chila.webp',
      width: 1440,
      height: 900,
      alt: 'Portada de CHILA: el titular «Ideas worth seeing. Stories worth telling.» junto al símbolo C del estudio, rodeado por un anillo con sus disciplinas.',
    },
  },
  {
    slug: 'portafolio-leidy',
    title: 'Portafolio de Leidy',
    kind: 'Proyecto para clienta',
    status: 'Publicado',
    year: '2026',
    service: 'Software a la medida',
    summary: 'Portafolio web para una profesional, con SEO local y revisión de rendimiento y accesibilidad antes de publicar.',
    problem: 'La clienta necesitaba presentar su trabajo con claridad y aparecer en búsquedas locales, sin depender de una plantilla genérica.',
    built: [
      { title: 'Diseño propio', body: 'Una identidad visual hecha para su trabajo, con tipografía y marcos cuidados.' },
      { title: 'SEO local', body: 'Datos estructurados, metadatos y contenido pensados para búsquedas en su ciudad.' },
      { title: 'Revisión antes de publicar', body: 'Rendimiento, accesibilidad y buenas prácticas revisadas con Lighthouse.' },
    ],
    decisions: [{ title: 'Velocidad primero', body: 'Imágenes optimizadas y nada de librerías que no aporten a la lectura.' }],
    stack: ['React', 'Vercel', 'SEO local'],
    bar: 'leidymicolta.vercel.app',
    shot: {
      src: '/media/trabajo/leidy.webp',
      width: 1440,
      height: 900,
      alt: 'Portada del portafolio de Leidy Micolta Aragón: su nombre en serif itálica sobre una escena de lectura junto a una ventana.',
    },
  },
];

export function getWorkItem(slug: string) {
  return work.find((item) => item.slug === slug);
}
