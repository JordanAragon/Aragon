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
};

export function IconBox({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`icon-box ${className}`}>{children}</span>;
}
