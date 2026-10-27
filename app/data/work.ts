/**
 * Trabajo real. Nada de clientes inventados: productos propios, infraestructura
 * propia y proyectos para clientes con su estado tal cual.
 */

export type WorkItem = {
  slug: string;
  title: string;
  kind: string;
  status: string;
  year: string;
  /** El servicio que muestra el caso. Aragon-Server no tiene: es infraestructura propia, no un servicio que se ofrezca. */
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
    slug: 'aragon-server',
    title: 'Aragon-Server',
    kind: 'Infraestructura propia',
    status: 'Operando',
    year: '2026',
    summary: 'Nuestro propio servidor: diez servicios en producción con Docker, certificados y acceso privado.',
    problem:
      'Antes de ofrecer infraestructura a un cliente, la operamos nosotros: archivos, música, bases de datos, monitoreo y automatizaciones en un servidor propio.',
    built: [
      { title: 'Servicios en contenedores', body: 'Nextcloud, Navidrome, PostgreSQL, Redis, Uptime Kuma y Portainer, cada uno aislado y con su configuración versionada.' },
      { title: 'Proxy con certificados', body: 'Caddy publica cada servicio con su nombre y certificado.' },
      { title: 'Acceso privado', body: 'Todo el acceso de administración pasa por Tailscale; nada queda expuesto sin necesidad.' },
      { title: 'Monitoreo', body: 'Uptime Kuma vigila cada servicio y avisa si alguno deja de responder.' },
    ],
    decisions: [
      { title: 'Red privada antes que puertos abiertos', body: 'Lo administrativo solo se alcanza por Tailscale; lo público pasa por un único proxy.' },
      { title: 'Secretos fuera del código', body: 'Las credenciales viven en un archivo de entorno fuera del repositorio de configuración.' },
    ],
    stack: ['Ubuntu Server', 'Docker', 'Caddy', 'Tailscale', 'PostgreSQL', 'Uptime Kuma'],
    bar: 'aragon-server — btop',
    shot: {
      src: '/media/trabajo/aragon-server.webp',
      width: 1440,
      height: 877,
      alt: 'Monitor del servidor en btop: memoria, discos, tráfico de red y la lista de procesos con Docker, PostgreSQL y Samba corriendo.',
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
