type Props = {
  position: 'top' | 'bottom';
  backgroundColor: string;
  height?: number;
  blurAmount?: number;
  className?: string;
};

export default function ProgressiveBlur({
  position,
  backgroundColor,
  height = 120,
  blurAmount = 6,
  className,
}: Props) {
  const edge = position === 'top' ? { top: 0 } : { bottom: 0 };
  const gradient = position === 'top'
    ? `linear-gradient(to bottom, ${backgroundColor} 0%, transparent 100%)`
    : `linear-gradient(to top, ${backgroundColor} 0%, transparent 100%)`;
  const mask = position === 'top'
    ? 'linear-gradient(to bottom, #000 0%, transparent 100%)'
    : 'linear-gradient(to top, #000 0%, transparent 100%)';

  return (
    <div
      className={`progressive-blur ${className ?? ''}`}
      style={{
        ...edge,
        height,
        background: gradient,
        maskImage: mask,
        WebkitMaskImage: mask,
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
      }}
      aria-hidden="true"
    />
  );
}
