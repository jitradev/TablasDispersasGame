import { useMemo } from 'react';
import { urlSprite } from './sprites';

/** Un icono de píxeles para poner dentro de un botón, al lado del texto. */
export function Ico({ n, detras = false }: { n: string; detras?: boolean }) {
  const src = useMemo(() => urlSprite(`ic-${n}`, 2), [n]);
  return <img src={src} alt="" aria-hidden="true" className={`ico ${detras ? 'detras' : ''}`} />;
}
