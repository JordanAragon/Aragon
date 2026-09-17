export const site = {
  name: 'Aragon',
  person: 'Jordan Aragon',
  title: 'Aragon | Software · Digital · Technology',
  description:
    'Aragon es el espacio de Jordan Aragon para diseñar y desarrollar experiencias digitales, software y sistemas alrededor de problemas reales.',
  fallbackUrl: 'https://aragon-jordanaragons-projects.vercel.app',
  calLink: 'jordan-david-micolta-aragon-cognqx/30min',
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : site.fallbackUrl;

export const siteLastModified = '2026-09-17';
