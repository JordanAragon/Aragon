import type { ReactNode } from 'react';

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {path}
  </svg>
);

export const icons = {
  arrow: icon(<path d="M5 19 19 5M8 5h11v11" />),
  plus: icon(<path d="M12 5v14M5 12h14" />),
  dot: icon(<circle cx="12" cy="12" r="2.5" />),
  code: icon(<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />),
  system: icon(
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8M8 12h5M8 16h3" />
    </>,
  ),
  spark: icon(
    <>
      <path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
      <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    </>,
  ),
  mail: icon(<path d="m22 7-8.99 5.73a2 2 0 0 1-2.01 0L2 7m0 0V5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2m-20 0v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7" />),
  github: icon(
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.18-3.37-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03A9.55 9.55 0 0 1 12 7.06c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />,
  ),
  linkedin: icon(
    <path d="M6.5 8.5A1.5 1.5 0 1 0 6.5 5.5a1.5 1.5 0 0 0 0 3ZM5 10h3v9H5v-9Zm5 0h2.9v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.03 0 3.59 2 3.59 4.61V19h-3v-4.2c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.08-1.6 2.21V19h-3v-9Z" />,
  ),
  instagram: icon(
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.35" cy="6.65" r="1" fill="currentColor" stroke="none" />
    </>,
  ),
};

export function IconBox({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`icon-box ${className}`}>{children}</span>;
}
