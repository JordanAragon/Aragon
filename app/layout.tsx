import type { Metadata } from 'next';
import './globals.css';
import './polish.css';

const siteUrl = 'https://jordanaragon.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aragon | Software · Digital · Technology',
    template: '%s | Aragon',
  },
  description:
    'Aragon diseña y desarrolla experiencias digitales, software y sistemas para convertir problemas reales en productos que la gente puede entender y usar.',
  applicationName: 'Aragon',
  authors: [{ name: 'Jordan Aragon', url: siteUrl }],
  creator: 'Jordan Aragon',
  publisher: 'Jordan Aragon',
  keywords: ['Aragon', 'Jordan Aragon', 'software', 'desarrollo web', 'productos digitales', 'sistemas', 'UX', 'frontend', 'Cali', 'Colombia'],
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Aragon | Software · Digital · Technology',
    description: 'Experiencias digitales, software y sistemas construidos con intención.',
    url: siteUrl,
    siteName: 'Aragon',
    locale: 'es_CO',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Aragon · Software · Digital · Technology' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aragon | Software · Digital · Technology',
    description: 'Experiencias digitales, software y sistemas construidos con intención.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: { icon: '/icon.svg' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jordan Aragon',
  url: siteUrl,
  jobTitle: 'Software Developer',
  homeLocation: { '@type': 'Place', name: 'Cali, Colombia' },
  sameAs: ['https://github.com/JordanAragon', 'https://www.linkedin.com/in/jordanaragon/'],
};

const calBootstrap = `(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal;
    let ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const script = d.createElement('script');
      script.src = A;
      script.async = true;
      script.dataset.calScript = 'aragon';
      script.addEventListener('load', function () { script.dataset.calLoaded = 'true'; });
      d.head.appendChild(script);
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === 'string') {
        cal.ns[namespace] = cal.ns[namespace] || api;
        p(cal.ns[namespace], ar);
        p(cal, ['initNamespace', namespace]);
      } else {
        p(cal, ar);
      }
      return;
    }
    p(cal, ar);
  };
})(window, 'https://app.cal.com/embed/embed.js', 'init');`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: calBootstrap }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
