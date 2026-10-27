export type SocialLink = {
  label: string;
  href: string;
};

export const site = {
  name: 'Aragon',
  founder: 'Jordan Aragon',
  founderLegal: 'Jordan David Micolta Aragón',
  title: 'Aragon · Agencia de automatización e IA: agentes, software a la medida y prototipos en 48 horas',
  shortTitle: 'Aragon',
  description:
    'Aragon es una agencia de automatización e inteligencia artificial en Cali, Colombia: desarrollo agéntico, software a la medida e infraestructura web de alta velocidad para eliminar procesos manuales. Prototipos en 48 horas y agentes de IA para WhatsApp.',
  fallbackUrl: 'https://aragon-two.vercel.app',
  calLink: 'jordan-david-micolta-aragon-cognqx/30min',
  contactEmail: 'jordandavidaragon@outlook.com',
  whatsapp: 'https://wa.me/573158154915',
  whatsappDisplay: '+57 315 815 4915',
  portfolioUrl: 'https://jordanaragon.vercel.app/',
  city: 'Cali',
  location: 'Cali, Colombia',
  timeZone: 'America/Bogota',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/JordanAragon' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jordanaragon/' },
    { label: 'Instagram', href: 'https://instagram.com/jordan__aragon' },
  ] satisfies SocialLink[],
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  : site.fallbackUrl;

export const siteLastModified = '2026-10-26';

export const calUrl = `https://cal.com/${site.calLink}`;

export const nav = [
  { label: 'Servicios', href: '/servicios' },
  { label: 'Cómo trabajamos', href: '/como-trabajamos' },
  { label: 'Trabajo', href: '/trabajo' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Preguntas', href: '/preguntas' },
];

/**
 * La narrativa del sitio en capítulos, en el mismo orden que el inicio al
 * hacer scroll. Quien navega solo desde la barra recorre la misma historia:
 * cada página termina invitando al capítulo siguiente.
 */
export const chapters = [
  { href: '/', label: 'Inicio', title: 'Del desorden al sistema.', teaser: 'Qué le pasa a un negocio que crece con chats y hojas sueltas, y cómo se pone en orden.' },
  { href: '/servicios', label: 'Servicios', title: 'Tres formas de quitarle el trabajo manual a tu operación.', teaser: 'Agentes de IA, automatización y software a la medida, cada uno con su demo.' },
  { href: '/como-trabajamos', label: 'Cómo trabajamos', title: 'Un prototipo funcionando en 48 horas.', teaser: 'Aprobado el alcance, lo tocas antes de comprometer el proyecto completo.' },
  { href: '/trabajo', label: 'Trabajo', title: 'Lo que hemos construido, con su estado tal cual.', teaser: 'AiDEN, Aragon-Server y el portafolio de Leidy.' },
  { href: '/nosotros', label: 'Nosotros', title: 'Una agencia pequeña a propósito.', teaser: 'Quien diseña tu sistema es quien lo construye y lo mantiene.' },
  { href: '/preguntas', label: 'Preguntas', title: 'Lo que casi todos preguntan antes de empezar.', teaser: 'Costos, tiempos, código y datos, en lenguaje claro.' },
  { href: '/contacto', label: 'Contacto', title: '¿Qué parte de tu operación debería estar hecha en software?', teaser: 'Una llamada de 30 minutos o tu caso por escrito.' },
] as const;
