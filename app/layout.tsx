import type { Metadata, Viewport } from 'next';
import './globals.css';
import './polish.css';
import './audit.css';
import './skiper.css';
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
  category: 'portfolio',
  authors: [{ name: site.person, url: siteUrl }],
  creator: site.person,
  publisher: site.person,
  keywords: ['Aragon', 'Jordan Aragon', 'software', 'desarrollo web', 'productos digitales', 'sistemas', 'UX', 'frontend', 'Colombia'],
  alternates: { canonical: siteUrl },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: site.title,
    description: site.description,
    url: siteUrl,
    siteName: site.name,
    locale: 'es_CO',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Aragon · Jordan Aragon · Software · Digital · Technology' }],
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
    '@type': 'ProfilePage',
    name: `${site.person} · ${site.name}`,
    url: siteUrl,
    mainEntity: {
      '@type': 'Person',
      name: site.person,
      url: siteUrl,
      jobTitle: 'Software Developer',
      homeLocation: { '@type': 'Place', name: 'Colombia' },
      sameAs: ['https://github.com/JordanAragon', 'https://www.linkedin.com/in/jordanaragon/'],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: siteUrl,
    description: site.description,
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
