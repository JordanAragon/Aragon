export type SocialLink = {
  label: string;
  href: string;
};

export const site = {
  name: 'Aragon',
  founder: 'Jordan Aragon',
  founderLegal: 'Jordan David Micolta Aragón',
  title: 'Aragon · Software a la medida: apps web, automatización y agentes de IA',
  shortTitle: 'Aragon',
  description:
    'Aragon es un estudio de software en Cali, Colombia. Diseñamos y construimos apps web, automatizaciones y agentes de IA a la medida de cómo trabaja tu negocio.',
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

export const siteLastModified = '2026-10-11';

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
  { href: '/servicios', label: 'Servicios', title: 'Cuatro formas de poner tu operación en orden.', teaser: 'Apps web, automatización, agentes de IA e infraestructura, cada una con su demo.' },
  { href: '/como-trabajamos', label: 'Cómo trabajamos', title: 'Ves algo funcionando antes de comprometer el proyecto.', teaser: 'Cuatro fases, cada una con algo concreto que recibes.' },
  { href: '/trabajo', label: 'Trabajo', title: 'Lo que hemos construido, con su estado tal cual.', teaser: 'AiDEN, Aragon-Server y el portafolio de Leidy.' },
  { href: '/nosotros', label: 'Nosotros', title: 'Un estudio pequeño a propósito.', teaser: 'Quien diseña tu sistema es quien lo construye y lo mantiene.' },
  { href: '/preguntas', label: 'Preguntas', title: 'Lo que casi todos preguntan antes de empezar.', teaser: 'Costos, tiempos, código y datos, en lenguaje claro.' },
  { href: '/contacto', label: 'Contacto', title: '¿Qué parte de tu operación debería estar hecha en software?', teaser: 'Una llamada de 30 minutos o tu caso por escrito.' },
] as const;
