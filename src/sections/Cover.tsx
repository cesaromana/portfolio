import { useState } from 'react';
import type { Cover as CoverData } from '../data/media';

type Props = { item: CoverData; className?: string };

/**
 * Una portada. Si hay imagen local (la de un tomo concreto) se usa esa y, si
 * falta el archivo, cae en silencio a la portada de la serie.
 */
export default function Cover({ item, className = '' }: Props) {
  const [src, setSrc] = useState(item.local ?? item.cover);
  return (
    <img
      className={className}
      src={src}
      alt={item.title}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setSrc(item.cover)}
    />
  );
}
