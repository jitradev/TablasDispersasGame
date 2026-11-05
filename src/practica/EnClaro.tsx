// La traducción del pergamino: lo que se pide de verdad, sin historia. Se abre
// en una ventana desde el botón «El pergamino, en claro».
import { ReactNode, useEffect, useState } from 'react';
import { Ico } from '../juego/Icono';
import { sonar } from '../juego/sonido';
import { ENCARGOS, EJERCICIOS_DE, EN_CLARO, Encargo } from './encargos';
import { MISIONES } from './misiones';

const BLOQUE: Record<number, string> = { 1: 'ACTO 1: EL GREMIO', 2: 'ACTO 2: LAS CARAVANAS', 3: 'ACTO 3: LA SOMBRA DE LA TORRE', 4: 'ACTO 4: EL TESORO DEL DRAGON' };

function Funciones({ e }: { e: Encargo }) {
  const una = (donde: string, f: { firma: string; hace: string }) => (
    <div className="ec-fun">
      <div className="ec-donde">{donde}</div>
      {f.firma.split('  ·  ').map((x) => (
        <code key={x} className="ec-firma">
          {x};
        </code>
      ))}
      <p>{f.hace}</p>
    </div>
  );
  return (
    <div className="ec-funciones">
      {e.lista && una('TablaDispersaLista.c', e.lista)}
      {e.array && una('TablaDispersaArray.c', e.array)}
    </div>
  );
}

/** El botón y su ventana. */
function Pergamino({ children, ancho = false }: { children: ReactNode; ancho?: boolean }) {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', tecla);
    document.body.classList.add('sin-scroll');
    return () => {
      window.removeEventListener('keydown', tecla);
      document.body.classList.remove('sin-scroll');
    };
  }, [abierto]);
  return (
    <>
      <div className={`ec-boton ${ancho ? 'ancho' : ''}`}>
        <button
          className="grande pergamino"
          onClick={() => {
            sonar('sube');
            setAbierto(true);
          }}
        >
          <Ico n="pergamino" />
          EL PERGAMINO, EN CLARO
        </button>
      </div>
      {abierto && (
        <div className="ventana-fondo" onClick={() => setAbierto(false)}>
          <div className={`ventana en-claro ${ancho ? 'ancho' : ''}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="mini cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar">
              <Ico n="cerrar" />
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

/** Todo el acto: los pasos y cada ejercicio con sus funciones. */
export function EnClaroActo({ acto }: { acto: number }) {
  const ms = MISIONES.filter((m) => m.acto === acto);
  return (
    <Pergamino>
      <div className="ec-tit">EL PERGAMINO, EN CLARO · ACTO {acto}</div>
      <p className="ec-intro">{EN_CLARO[acto]}</p>
      <div className="ec-sub">Los pasos</div>
      <ol className="ec-pasos">
        <li>Descarga el proyecto base (solo el primer día) y ábrelo en CLion con File &gt; Open, la carpeta entera. Es el mismo para los cuatro actos.</li>
        <li>
          Programa las funciones de este acto en <code>TablaDispersaLista.c</code> y <code>TablaDispersaArray.c</code>, en el bloque <code>{BLOQUE[acto]}</code>.
        </li>
        <li>
          Para probar un ejercicio, ejecuta el target de su misión ({ms.map((m, k) => (
            <span key={m.id}>
              {k ? ', ' : ''}
              <code>{m.target}</code>
            </span>
          ))}
          ). Cada una escribe su fichero en <code>registros/</code>.
        </li>
        <li>En la web, entra en la misión y sube ese fichero. Se anima evento a evento y la nota sale al final.</li>
        <li>Al acabar la sesión, comprime la carpeta del proyecto entera y súbela a la PDU.</li>
      </ol>
      {EJERCICIOS_DE[acto].map((n) => {
        const e = ENCARGOS[n];
        return (
          <div key={n} className="ec-ej">
            <div className="ec-ej-tit">
              Ejercicio {n} · {e.titulo} <span>(misión {n})</span>
            </div>
            <Funciones e={e} />
          </div>
        );
      })}
    </Pergamino>
  );
}

/** Una misión: los pasos y su ejercicio. */
export function EnClaroMision({ ej, jefe, acto, target, fichero }: { ej?: number; jefe: boolean; acto: number; target: string; fichero: string }) {
  const e = ej === undefined ? undefined : ENCARGOS[ej];
  return (
    <Pergamino ancho>
      <div className="ec-tit">EL PERGAMINO, EN CLARO · {e ? `EJERCICIO ${ej}` : 'JEFE FINAL'}</div>
      {e ? (
        <>
          <div className="ec-ej-tit">{e.titulo}</div>
          {jefe && <p className="ec-intro">Esta misión es el jefe del acto: además de este ejercicio, usa todos los anteriores del acto {acto}.</p>}
          <Funciones e={e} />
        </>
      ) : (
        <p className="ec-intro">Esta misión no tiene una función nueva: usa a la vez las de los ejercicios 13, 14 y 15, junto con las de los actos anteriores.</p>
      )}
      <div className="ec-sub">Los pasos</div>
      <ol className="ec-pasos">
        <li>
          {e ? 'Programa estas funciones' : 'Ten programadas esas funciones'} en{' '}
          {e && !e.lista ? (
            <code>TablaDispersaArray.c</code>
          ) : e && !e.array ? (
            <code>TablaDispersaLista.c</code>
          ) : (
            <>
              <code>TablaDispersaLista.c</code> y <code>TablaDispersaArray.c</code>
            </>
          )}
          , en el bloque <code>{BLOQUE[acto]}</code>.
        </li>
        <li>
          En CLion, elige el target <code>{target}</code> en el desplegable de arriba a la derecha y ejecútalo.
        </li>
        <li>
          Sube aquí <code>{fichero}</code>. La misión se anima evento a evento y la nota sale al final.
        </li>
      </ol>
    </Pergamino>
  );
}
