import Image from 'next/image';
import type { WorkItem } from '../../data/work';

/* La captura real de un proyecto. Sin texto alternativo cuando acompaña a un enlace que ya lo nombra. */
export default function WorkShot({
  item,
  sizes,
  priority = false,
  decorative = false,
}: {
  item: WorkItem;
  sizes: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  return (
    <span className="work-shot">
      <Image
        src={item.shot.src}
        width={item.shot.width}
        height={item.shot.height}
        alt={decorative ? '' : item.shot.alt}
        sizes={sizes}
        priority={priority}
        draggable={false}
      />
    </span>
  );
}
