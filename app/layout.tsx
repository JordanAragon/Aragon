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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
