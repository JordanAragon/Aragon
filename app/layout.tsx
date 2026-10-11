import type { Metadata, Viewport } from 'next';
import './styles/base.css';
import './styles/chrome.css';
import './styles/home.css';
import './styles/pages.css';
import './styles/demos.css';
import { display, mono, sans } from './fonts';
import { services } from './data/services';
import { site, siteUrl } from './data/site';
import SiteHeader from './components/chrome/site-header';
import SiteFooter from './components/chrome/site-footer';
import CommandPalette from './components/chrome/command-palette';
import Interactions from './components/chrome/interactions';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: '%s · Aragon',
  },
  description: site.description,
  applicationName: site.name,
  category: 'technology',
  authors: [{ name: site.founder, url: site.portfolioUrl }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    'agencia de software',
    'desarrollo de software a medida',
    'apps web a medida',
    'automatización de procesos',
    'n8n',
    'agentes de IA',
    'chatbot WhatsApp',
    'infraestructura',
    'Cali',
    'Colombia',
  ],
  alternates: { canonical: '/' },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: site.title,
    description: site.description,
    url: siteUrl,
    siteName: site.name,
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: siteUrl,
  description: site.description,
  email: site.contactEmail,
  areaServed: ['CO', 'Latinoamérica'],
  address: { '@type': 'PostalAddress', addressLocality: 'Cali', addressRegion: 'Valle del Cauca', addressCountry: 'CO' },
  founder: { '@type': 'Person', name: site.founder, url: site.portfolioUrl, sameAs: site.socialLinks.map((l) => l.href) },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, description: s.summary, url: `${siteUrl}/servicios/${s.slug}` },
    })),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
        <CommandPalette />
        <Interactions />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
