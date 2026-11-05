import { useEffect, useState } from 'react';
import { alCambiar, silenciado, silenciar, sonar } from './sonido';

/** El botón para quitar o poner el sonido (se recuerda en el navegador). */
export function BotonSonido() {
  const [mudo, setMudo] = useState(silenciado());
  useEffect(() => {
    const quitar = alCambiar(setMudo);
    return () => {
      quitar();
    };
  }, []);
  return (
    <button
      className="mini boton-sonido"
      aria-label={mudo ? 'Poner el sonido' : 'Quitar el sonido'}
      title={mudo ? 'Poner el sonido' : 'Quitar el sonido'}
      onClick={() => {
        silenciar(!mudo);
        if (mudo) sonar('click');
      }}
    >
      {mudo ? '🔇' : '🔊'}
    </button>
  );
}
