import type { Metadata, Viewport } from 'next';
import './globals.css';
import './premium.css';
import { site, siteUrl } from './data/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: '%s | Aragon',
  },
  description: site.description,
  applicationName: site.name,
  category: 'technology',
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  keywords: ['Aragon', 'software studio', 'technology studio', 'desarrollo web', 'productos digitales', 'sistemas', 'UX', 'frontend', 'Colombia'],
  alternates: { canonical: siteUrl },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: site.title,
    description: site.description,
    url: siteUrl,
    siteName: site.name,
    locale: 'es_CO',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Aragon · Software & Technology Studio · Colombia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4f4f0',
  colorScheme: 'light',
};

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: siteUrl,
    description: site.description,
    founder: {
      '@type': 'Person',
      name: site.person,
      jobTitle: 'Founder · Software Developer · Builder',
      url: site.portfolioUrl,
      sameAs: [site.portfolioUrl, ...site.socialLinks.map((link) => link.href)],
    },
    sameAs: site.socialLinks.map((link) => link.href),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: siteUrl,
    description: site.description,
    publisher: { '@type': 'Organization', name: site.name, url: siteUrl },
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        {children}
        <script id="aragon-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
