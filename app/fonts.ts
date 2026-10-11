import localFont from 'next/font/local';

/* Tipografías auto-alojadas (SIL OFL, ver app/fonts/LICENSE-*): Inter Tight para titulares,
   Inter para el texto y JetBrains Mono para datos y etiquetas del sistema. */

export const display = localFont({
  src: './fonts/inter-tight-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-display',
  display: 'swap',
  fallback: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const sans = localFont({
  src: './fonts/inter-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-sans',
  display: 'swap',
  fallback: ['ui-sans-serif', '-apple-system', 'Segoe UI', 'system-ui', 'sans-serif'],
});

export const mono = localFont({
  src: './fonts/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
});
