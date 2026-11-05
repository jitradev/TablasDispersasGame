// La traducción del pergamino: lo que se pide de verdad, sin historia.
import { ENCARGOS, EJERCICIOS_DE, EN_CLARO, Encargo } from './encargos';

function Funciones({ e }: { e: Encargo }) {
  return (
    <div className="ec-funciones">
      {e.lista && (
        <div className="ec-fun">
          <div className="ec-donde">TablaDispersaLista.c</div>
          {e.lista.firma.split('  ·  ').map((f) => (
            <code key={f} className="ec-firma">
              {f};
            </code>
          ))}
          <p>{e.lista.hace}</p>
        </div>
      )}
      {e.array && (
        <div className="ec-fun">
          <div className="ec-donde">TablaDispersaArray.c</div>
          {e.array.firma.split('  ·  ').map((f) => (
            <code key={f} className="ec-firma">
              {f};
            </code>
          ))}
          <p>{e.array.hace}</p>
        </div>
      )}
    </div>
  );
}

/** Todo el acto: cada ejercicio con sus funciones. */
export function EnClaroActo({ acto }: { acto: number }) {
  return (
    <section className="en-claro">
      <div className="ec-tit">EL PERGAMINO, EN CLARO</div>
      <p className="ec-intro">{EN_CLARO[acto]}</p>
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
    </section>
  );
}

/** Una misión: su ejercicio entero, con los detalles en los que es fácil fallar. */
export function EnClaroMision({ ej, jefe, acto }: { ej?: number; jefe: boolean; acto: number }) {
  if (ej === undefined)
    return (
      <section className="en-claro">
        <div className="ec-tit">EN CLARO: LO QUE SE PIDE</div>
        <p className="ec-intro">
          Esta misión no tiene una función nueva. Usa a la vez todo lo del acto {acto}: la exploración cuadrática y el doble hashing (ejercicio 13), el coste de buscar (14) y la reorganización (15), junto con el plegamiento y la fusión de antes. Si las misiones 13, 14 y 15 te salen bien, esta debería salir también; si no, el fallo dice de qué ejercicio es.
        </p>
      </section>
    );
  const e = ENCARGOS[ej];
  return (
    <section className="en-claro">
      <div className="ec-tit">EN CLARO: LO QUE SE PIDE</div>
      <div className="ec-ej-tit">
        Ejercicio {ej} · {e.titulo}
      </div>
      <Funciones e={e} />
      <ul className="ec-ojo">
        {e.ojo.map((o, k) => (
          <li key={k}>{o}</li>
        ))}
        {jefe && <li>Es el jefe del acto: además de este ejercicio, la misión vuelve a usar todos los anteriores del acto.</li>}
      </ul>
    </section>
  );
}
