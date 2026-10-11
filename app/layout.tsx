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
import Preloader from './components/chrome/preloader';

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

/*
  Enciende la precarga antes del primer cuadro (app/components/chrome/preloader.tsx):
  solo en «/», sin ancla y sin movimiento reducido. Marca también que hay JS, para
  que los revelados al hacer scroll no escondan nada a quien no lo tiene. Si el JS
  no toma la capa en 8 s, la capa se retira sola: la página nunca queda tapada.
*/
const bootScript = `(function(){try{var r=document.documentElement;r.classList.add('js');var l=window.location;if(l.pathname!=='/'||l.hash)return;if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;r.classList.add('is-preloading');if('scrollRestoration' in history)history.scrollRestoration='manual';window.scrollTo(0,0);setTimeout(function(){if(!r.hasAttribute('data-preload-taken')){r.classList.remove('is-preloading');if('scrollRestoration' in history)history.scrollRestoration='auto';}},8000);}catch(e){}})();`;

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
    <html lang="es-CO" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <Preloader />
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
