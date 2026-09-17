import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jordanaragon.vercel.app'),
  title: 'Aragon | Software · Digital · Technology',
  description: 'Aragon diseña y desarrolla experiencias digitales, software y sistemas para convertir problemas reales en productos que la gente puede entender y usar.',
  openGraph: {
    title: 'Aragon | Software · Digital · Technology',
    description: 'Experiencias digitales, software y sistemas construidos con intención.',
    type: 'website',
    locale: 'es_CO',
  },
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
      d.head.appendChild(d.createElement('script')).src = A;
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
})(window, 'https://app.cal.com/embed/embed.js', 'init');

Cal('init', 'aragon30min', { origin: 'https://app.cal.com' });
Cal.ns['aragon30min']('inline', {
  elementOrSelector: '#my-cal-inline',
  calLink: 'jordan-david-micolta-aragon-cognqx/30min',
  config: { layout: 'month_view', theme: 'dark' }
});
Cal.ns['aragon30min']('ui', {
  theme: 'dark',
  styles: { branding: { brandColor: '#f6f6f2' } },
  hideEventTypeDetails: false,
  layout: 'month_view'
});`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: calBootstrap }} />
      </body>
    </html>
  );
}
