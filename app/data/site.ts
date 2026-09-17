export const site = {
  name: 'Aragon',
  person: 'Jordan Aragon',
  title: 'Aragon | Software · Digital · Technology',
  description:
    'Diseño y desarrollo de experiencias digitales, software y sistemas alrededor de problemas reales.',
  fallbackUrl: 'https://aragon-jordanaragons-projects.vercel.app',
  calLink: 'jordan-david-micolta-aragon-cognqx/30min',
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  : site.fallbackUrl;

export const siteLastModified = '2026-09-17';
