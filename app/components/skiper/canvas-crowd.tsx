'use client';

import type { ComponentProps } from 'react';
import CanvasCrowdExact from './canvas-crowd-exact';

type Props = ComponentProps<typeof CanvasCrowdExact>;

export default function CanvasCrowd(props: Props) {
  return <CanvasCrowdExact {...props} className={`canvas-crowd ${props.className ?? ''}`} />;
}
