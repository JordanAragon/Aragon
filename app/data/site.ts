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
