import type { Metadata } from 'next';
import { Archivo, Inter } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jordanaragon.vercel.app'),
  title: 'Aragon | Tecnología que toma forma',
  description:
    'Aragon crea sitios web, software y soluciones digitales para convertir ideas en productos útiles y funcionales.',
  openGraph: {
    title: 'Aragon | Tecnología que toma forma',
    description:
      'Desarrollo web, software y soluciones digitales desde Popayán, Colombia.',
    type: 'website',
    locale: 'es_CO',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${archivo.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
