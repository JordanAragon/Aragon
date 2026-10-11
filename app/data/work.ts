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
  service: string;
  summary: string;
  problem: string;
  built: { title: string; body: string }[];
  decisions: { title: string; body: string }[];
  stack: string[];
  href?: string;
  hrefLabel?: string;
  visual: 'vivero' | 'servidor' | 'portafolio' | 'finanzas' | 'calendario';
};

export const work: WorkItem[] = [
  {
    slug: 'aiden',
    title: 'AiDEN',
    kind: 'Producto propio',
    status: 'En producción, en mejora continua',
    year: '2026',
    service: 'Apps web a medida',
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
    visual: 'vivero',
  },
  {
    slug: 'aragon-server',
    title: 'Aragon-Server',
    kind: 'Infraestructura propia',
    status: 'Operando',
    year: '2026',
    service: 'Infraestructura y servidores',
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
    visual: 'servidor',
  },
  {
    slug: 'portafolio-leidy',
    title: 'Portafolio de Leidy',
    kind: 'Proyecto para clienta',
    status: 'Publicado',
    year: '2026',
    service: 'Apps web a medida',
    summary: 'Portafolio web para una profesional, con SEO local y revisión de rendimiento y accesibilidad antes de publicar.',
    problem: 'La clienta necesitaba presentar su trabajo con claridad y aparecer en búsquedas locales, sin depender de una plantilla genérica.',
    built: [
      { title: 'Diseño propio', body: 'Una identidad visual hecha para su trabajo, con tipografía y marcos cuidados.' },
      { title: 'SEO local', body: 'Datos estructurados, metadatos y contenido pensados para búsquedas en su ciudad.' },
      { title: 'Revisión antes de publicar', body: 'Rendimiento, accesibilidad y buenas prácticas revisadas con Lighthouse.' },
    ],
    decisions: [{ title: 'Velocidad primero', body: 'Imágenes optimizadas y nada de librerías que no aporten a la lectura.' }],
    stack: ['React', 'Vercel', 'SEO local'],
    visual: 'portafolio',
  },
  {
    slug: 'aragon-finance',
    title: 'Aragon-Finance',
    kind: 'Producto propio',
    status: 'En desarrollo',
    year: '2026',
    service: 'Agentes de IA',
    summary: 'Finanzas personales con patrimonio, flujo mensual y presupuestos, con un asistente por WhatsApp en camino.',
    problem: 'Entender a dónde se va el dinero cada mes sin pelear con hojas de cálculo.',
    built: [
      { title: 'Patrimonio y flujo', body: 'Cuentas, movimientos y presupuestos en una lectura clara del mes.' },
      { title: 'Asistente por WhatsApp', body: 'En desarrollo: registrar gastos y consultar el mes desde un chat, con un flujo de n8n.' },
    ],
    decisions: [{ title: 'El chat como entrada', body: 'Registrar un gasto debe costar lo mismo que mandar un mensaje.' }],
    stack: ['Next.js', 'Supabase', 'n8n', 'WhatsApp'],
    visual: 'finanzas',
  },
  {
    slug: 'calendar',
    title: 'Calendar',
    kind: 'App con IA',
    status: 'Prototipo funcional',
    year: '2026',
    service: 'Agentes de IA',
    summary: 'App de calendario con IA conectada a Google Calendar.',
    problem: 'Organizar la agenda conversando, en lugar de llenar formularios de eventos.',
    built: [
      { title: 'Conexión con Google Calendar', body: 'Lee y crea eventos en el calendario de la persona, con su autorización.' },
      { title: 'Asistente', body: 'Interpreta lo que la persona escribe y lo convierte en eventos.' },
    ],
    decisions: [{ title: 'Permisos mínimos', body: 'Solo se piden los permisos de calendario necesarios.' }],
    stack: ['React', 'Google Calendar API', 'IA'],
    href: 'https://github.com/JordanAragon/Calendar_App',
    hrefLabel: 'Ver el repositorio',
    visual: 'calendario',
  },
];

export function getWorkItem(slug: string) {
  return work.find((item) => item.slug === slug);
}
