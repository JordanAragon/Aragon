export type SocialLink = {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'instagram';
};

export const site = {
  name: 'Aragon',
  person: 'Jordan Aragon',
  title: 'Aragon | Software · Digital · Technology',
  description:
    'Diseño y desarrollo de experiencias digitales, software y sistemas alrededor de problemas reales.',
  fallbackUrl: 'https://aragon-two.vercel.app',
  calLink: 'jordan-david-micolta-aragon-cognqx/30min',
  contactEmail: 'jordandavidaragon@outlook.com',
  portfolioUrl: 'https://jordanaragon.vercel.app/',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/JordanAragon', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jordanaragon/', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://instagram.com/jordan__aragon', icon: 'instagram' },
  ] satisfies SocialLink[],
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  : site.fallbackUrl;

export const siteLastModified = '2026-09-18';
