export type SocialLink = {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'instagram';
};

export const site = {
  name: 'Aragon',
  person: 'Jordan David Aragon',
  title: 'Aragon | Software & Technology Studio',
  description:
    'Aragon es un estudio de software y tecnología que diseña y construye experiencias digitales, productos y sistemas para problemas reales.',
  fallbackUrl: 'https://aragon-two.vercel.app',
  calLink: 'jordan-david-micolta-aragon-cognqx/30min',
  contactEmail: 'jordandavidaragon@outlook.com',
  portfolioUrl: 'https://jordanaragon.vercel.app/',
  location: 'Cali, Colombia',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/JordanAragon', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jordanaragon/', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://instagram.com/jordan__aragon', icon: 'instagram' },
  ] satisfies SocialLink[],
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  : site.fallbackUrl;

export const siteLastModified = '2026-09-21';
