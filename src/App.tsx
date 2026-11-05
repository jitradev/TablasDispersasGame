import { useEffect, useMemo, useRef, useState } from 'react';
import { urlSprite } from './juego/sprites';
import { sonar } from './juego/sonido';
import { BotonSonido } from './juego/BotonSonido';
import { leerRegistro, ErrorRegistro } from './practica/registro';
import { corregir, Correccion } from './practica/corregir';
import { ACTOS, MISIONES } from './practica/misiones';
import { COMPANIA, MERLA } from './practica/personajes';
import { Visor } from './practica/Visor';

// ------------------------------------------------------------------ registros guardados

interface Subido {
  fichero: string;
  texto: string;
}
const CLAVE = 'cofres-dispersos-campana-v2';
const CLAVE_ACTO = 'cofres-dispersos-campana-acto';
function cargar(): Record<string, Subido> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? '{}') ?? {};
  } catch {
    return {};
  }
}
function guardar(r: Record<string, Subido>) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(r));
  } catch {
    /* sin almacenamiento: se trabaja igual */
  }
}
const NOMBRE_PLANTILLA = 'Escribe aqui tu nombre y apellidos';

// ------------------------------------------------------------------ piezas

function Estrellas({ n, tam = 3 }: { n: number; tam?: number }) {
  const llena = useMemo(() => urlSprite('estrella', tam), [tam]);
  const vacia = useMemo(() => urlSprite('estrellaVacia', tam), [tam]);
  return (
    <span className="estrellas" aria-label={`${n} de 3 estrellas`}>
      {[0, 1, 2].map((i) => (
        <img key={i} src={i < n ? llena : vacia} alt="" />
      ))}
    </span>
  );
}

// ------------------------------------------------------------------ subir ficheros

function SubirRegistro({ fichero, subir, otra }: { fichero: string; subir: (fs: FileList | File[]) => void; otra: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={input}
        type="file"
        accept=".txt,text/plain"
        hidden
        onChange={(e) => {
          if (e.target.files) subir(e.target.files);
          e.target.value = '';
        }}
      />
      <button className={otra ? 'enlace t-resubir' : 'grande t-subir'} onClick={() => input.current?.click()}>
        {otra ? `volver a subir ${fichero}` : '⬆ SUBIR REGISTRO'}
      </button>
    </>
  );
}

// ------------------------------------------------------------------ inicio

/** Para abrir un acto hay que sacar al menos estas estrellas en el jefe del anterior. Con 0 (como ahora) están todos abiertos. */
const ESTRELLAS_PARA_ABRIR: number = 0;
/** Con ?profesor en la dirección (por ejemplo https://.../?profesor) se ven todos los actos abiertos. */
const PROFESOR = (() => {
  try {
    return new URLSearchParams(window.location.search).has('profesor');
  } catch {
    return false;
  }
})();

function Inicio({
  correcciones,
  errores,
  subir,
  ver,
  borrar,
  acto,
  setActo,
}: {
  correcciones: Record<string, Correccion>;
  errores: Record<string, string[]>;
  subir: (fs: FileList | File[], mision: string) => void;
  ver: (id: string) => void;
  borrar: () => void;
  acto: number;
  setActo: (n: number) => void;
}) {
  const cofre = useMemo(() => urlSprite('cofre', 6), []);
  const buho = useMemo(() => urlSprite('buho', 6), []);
  const fantasma = useMemo(() => urlSprite('fantasma', 5), []);
  const gloton = useMemo(() => urlSprite('gloton', 3), []);
  const candado = useMemo(() => urlSprite('llave', 4), []);
  const [encima, setEncima] = useState<string | null>(null);
  const hechas = MISIONES.map((m) => correcciones[m.id]);
  const alumnos = [...new Set(hechas.filter(Boolean).map((c) => c!.reg.alumno))];
  /** Los nombres de verdad: el texto de ejemplo de alumno.h no se enseña. */
  const nombres = alumnos.filter((a) => a && !a.startsWith(NOMBRE_PLANTILLA));
  const notaDe = (n: number) => {
    const ms = MISIONES.filter((m) => m.acto === n);
    return ms.reduce((s, m) => s + (correcciones[m.id]?.conocida ? correcciones[m.id].bien / correcciones[m.id].total : 0), 0) / ms.length;
  };
  const abierto = (n: number): boolean => {
    if (n === 1 || ESTRELLAS_PARA_ABRIR === 0 || PROFESOR) return true;
    const jefe = MISIONES.find((m) => m.acto === n - 1 && m.jefe)!;
    const c = correcciones[jefe.id];
    return !!c && c.conocida && c.estrellas >= ESTRELLAS_PARA_ABRIR && abierto(n - 1);
  };
  const actual = ACTOS[acto - 1];
  const misiones = MISIONES.filter((m) => m.acto === acto);
  return (
    <div className="pantalla inicio">
      <div className="sprites-portada">
        <img src={cofre} alt="" />
        <img src={buho} alt="" className="flota" />
        <img src={fantasma} alt="" className="flota lento" />
      </div>
      <div className="boton-sonido-portada">
        <BotonSonido />
      </div>
      <h1 className="titulo-juego">Lord of EDA</h1>
      <div className="sub">LOS COFRES DISPERSOS · LA CAMPAÑA DE LAS LISTAS DISPERSAS · ESTRUCTURA DE DATOS</div>

      <div className="compania">
        {[MERLA, ...Object.values(COMPANIA)].map((p) => (
          <figure key={p.id}>
            <img src={urlSprite(p.id, 5)} alt="" />
            <figcaption>{p.nombre}</figcaption>
          </figure>
        ))}
      </div>

      <section className="intro">
        <p>
          El Gremio guarda su inventario en <b>tablas de dispersión</b>. Cada objeto tiene su número, que es la clave, y se guarda cuántos hay. La campaña tiene <b>cuatro actos</b>, uno por sesión de 2 horas, todos abiertos desde el principio, y se juega entera sobre <b>un solo proyecto base</b>: el <code>Listas_Dispersas</code> de clase, con sus dos tablas, la de listas y la del array.
        </p>
        <p>
          Cada ejercicio tiene su misión. Tu programa juega la misión y deja un registro de lo que ha hecho con la memoria; lo subes aquí y ves la animación de las tablas, evento a evento: a qué cubo va cada clave, qué casillas mira cada búsqueda... y cada fantasma que se te escapa. Cada acto termina con su jefe.
        </p>
      </section>

      <ol className="pasos">
        <li>
          <span className="num">1</span>
          <div>
            <b>Descarga el proyecto base</b> el primer día y ábrelo en CLion (File &gt; Open, la carpeta entera). Es el mismo para los cuatro actos: guárdalo y sigue con él.
            <a className="boton grande" href="/proyecto-base.zip" download="listas-dispersas-campana.zip">
              DESCARGAR PROYECTO BASE
            </a>
          </div>
        </li>
        <li>
          <span className="num">2</span>
          <div>
            <b>Ejecuta la misión</b> de cada ejercicio: el target <code>mision1</code>, <code>mision2</code>... (desplegable de arriba a la derecha). Cada una escribe su registro en <code>registros/</code>.
          </div>
        </li>
        <li>
          <span className="num">3</span>
          <div>
            <b>Sube el registro</b> en la tarjeta de su misión, mira la animación y corrige lo que falle. Al acabar la sesión, comprime el proyecto y entrégalo en la PDU.
          </div>
        </li>
      </ol>

      <div className="mapa-actos">
        {ACTOS.map((a) => {
          const ms = MISIONES.filter((m) => m.acto === a.n);
          const estrellas = ms.reduce((s, m) => s + (correcciones[m.id]?.conocida ? correcciones[m.id].estrellas : 0), 0);
          const abre = abierto(a.n);
          return (
            <button key={a.n} className={`acto ${a.n === acto ? 'elegido' : ''} ${abre ? '' : 'cerrado'}`} onClick={() => {
                sonar('click');
                setActo(a.n);
              }}>
              <span className="a-num">ACTO {a.n}</span>
              <span className="a-tit">{a.titulo}</span>
              <span className="a-lugar">{a.lugar}</span>
              <span className="a-est">
                {abre ? (
                  <>
                    ★ {estrellas}/{ms.length * 3}
                  </>
                ) : (
                  <>
                    <img src={candado} alt="" /> cerrado
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <section className="acto-cab">
        <h2>
          ACTO {actual.n} · {actual.titulo.toUpperCase()}
        </h2>
        <p>
          {actual.resumen} Se programa en{' '}
          {actual.ficheros.map((f, k) => (
            <span key={f}>
              {k ? ' y ' : ''}
              <code>{f}</code>
            </span>
          ))}
          .
        </p>
        {!abierto(acto) && (
          <div className="aviso neutro">
            Este acto se abre al sacar al menos {ESTRELLAS_PARA_ABRIR} estrellas en el jefe del acto {acto - 1} ({MISIONES.find((m) => m.acto === acto - 1 && m.jefe)!.titulo}). Si ya lo hiciste en otro ordenador, vuelve a subir aquí su registro.
          </div>
        )}
      </section>

      {abierto(acto) && (
        <div className="misiones">
          {misiones.map((m) => {
            const c = correcciones[m.id];
            const num = MISIONES.indexOf(m) + 1;
            return (
              <div
                key={m.id}
                className={`tarjeta ${c ? (c.bien === c.total && c.conocida ? 'hecha' : 'subida-ok') : ''} ${m.jefe ? 'jefe' : ''} ${encima === m.id ? 'encima' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setEncima(m.id);
                }}
                onDragLeave={() => setEncima(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setEncima(null);
                  subir(e.dataTransfer.files, m.id);
                }}
              >
                <div className="iconos">
                  <img src={urlSprite(m.quien, 4)} alt="" />
                  {m.jefe && <img src={gloton} alt="" />}
                </div>
                <div className="t-num">
                  MISIÓN {num} · target <code>{m.target}</code>
                </div>
                <div className="t-tit">{m.titulo}</div>
                <div className="t-res">{m.resumen}</div>
                <div className="t-quien">Te acompaña {COMPANIA[m.quien].nombre.split(',')[0].toLowerCase().replace(/^./, (x) => x.toUpperCase())}</div>
                {c ? (
                  <>
                    <div className="t-estado">
                      <Estrellas n={c.conocida ? c.estrellas : 0} />
                      <span>
                        {c.bien}/{c.total} eventos bien
                      </span>
                    </div>
                    {!c.reg.fin && <div className="t-aviso">El programa se cortó en el evento {c.reg.eventos.length}.</div>}
                    {c.aviso && <div className="t-aviso">{c.aviso}</div>}
                    <button
                      className="grande"
                      onClick={() => {
                        sonar('click');
                        ver(m.id);
                      }}
                    >
                      ▶ VER ANIMACIÓN
                    </button>
                    <SubirRegistro fichero={`${m.id}.txt`} subir={(fs) => subir(fs, m.id)} otra />
                  </>
                ) : (
                  <>
                    <div className="t-falta">
                      Ejecuta <code>{m.target}</code> y sube <code>registros/{m.id}.txt</code> (o arrástralo a esta tarjeta).
                    </div>
                    <SubirRegistro fichero={`${m.id}.txt`} subir={(fs) => subir(fs, m.id)} otra={false} />
                  </>
                )}
                {(errores[m.id] ?? []).map((e, k) => (
                  <div key={k} className="t-aviso">
                    {e}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {hechas.some(Boolean) && (
        <section className="resumen">
          <div className="ram-tit">RESUMEN DE LA CAMPAÑA</div>
          {nombres.length > 0 && (
            <div className="res-fila">
              <span>Alumno</span>
              <b>{nombres.join(' / ')}</b>
            </div>
          )}
          {nombres.length > 1 && <div className="aviso mal">Los registros llevan nombres distintos: vuelve a ejecutar las misiones con tu código.</div>}
          {ACTOS.map((a) => (
            <div key={a.n} className="res-fila">
              <span>
                Acto {a.n} · {a.titulo}{' '}
                <small>
                  ({MISIONES.filter((m) => m.acto === a.n)
                    .map((m) => (correcciones[m.id] ? `${correcciones[m.id].bien}/${correcciones[m.id].total}` : '–'))
                    .join(' · ')}
                  )
                </small>
              </span>
              <b>{(notaDe(a.n) * 10).toFixed(1)} / 10</b>
            </div>
          ))}
          <div className="res-fila gorda">
            <span>Nota orientativa de la campaña</span>
            <b>{((ACTOS.reduce((s, a) => s + notaDe(a.n), 0) / ACTOS.length) * 10).toFixed(1)} / 10</b>
          </div>
          <p className="pie">
            Para entregar cada acto: al acabar la sesión, comprime la carpeta del proyecto entera (código y registros) y sube el zip a la PDU. La nota final la pone el profesor leyendo el código; esta es solo la de los registros.{' '}
            <button className="enlace" onClick={borrar}>
              borrar los registros subidos
            </button>
          </p>
        </section>
      )}

      <Enunciado acto={acto} />
    </div>
  );
}

function Enunciado({ acto }: { acto: number }) {
  const ej = (n: number, titulo: string, mision: number, cuerpo: React.ReactNode) => (
    <>
      <h3>
        Ejercicio {n} · {titulo} (misión {mision})
      </h3>
      <p>{cuerpo}</p>
    </>
  );
  return (
    <section className="enunciado">
      <h2>EL ENUNCIADO DEL ACTO {acto}</h2>
      {acto === 1 && (
        <>
          <p>
            Las dos tablas de clase, tal cual: la de listas con 101 cubos y la del array con 20 casillas. Ya viene hecha <code>actualizar</code>: si la clave ya está, cambia su elemento; si no, la inserta. Cada ejercicio va en las dos tablas.
          </p>
          {ej(1, 'El objeto con más unidades', 1, <><code>masAbundante(h, &amp;clave, &amp;elemento)</code>: recorrer toda la tabla y quedarse con el elemento más grande; si hay empate, la clave más pequeña. Devuelve 0 si la tabla está vacía.</>)}
          {ej(2, 'Medir las colisiones', 2, <>En la de listas, <code>cuboMasLargo(h, &amp;vacios)</code>: la lista más larga y cuántos cubos están a NULL. En la del array, <code>grupoMasLargo(h, &amp;borradas)</code>: el grupo más largo de casillas seguidas que no están VACIA (las BORRADA cuentan), de la 0 a la última, y cuántas BORRADA hay.</>)}
          {ej(3, 'Cambiar la clave', 3, <><code>cambiarClave(h, vieja, nueva)</code>. En la de listas se desengancha el MISMO nodo, cambia su clave y se engancha en el cubo de la nueva (si la nueva ya está, se suma y el nodo viejo se libera). En la del array, la casilla vieja pasa a BORRADA y la nueva se suma o se inserta. Devuelve 0 si la vieja no está.</>)}
          {ej(4, 'Quitar los agotados', 4, <><code>eliminarSiMenor(h, minimo)</code> quita todo lo que tenga menos de <code>minimo</code> y devuelve cuántos ha quitado. En la de listas, cada nodo se desengancha y se libera, aunque sea el primero o vayan varios seguidos; en la del array, BORRADA (no VACIA, que cortaría la exploración).</>)}
          {ej(5, 'Juntar dos inventarios', 5, <><code>fusionar(destino, origen)</code>: si la clave ya está en el destino, se suma; si no, se mete. En la de listas se mueven los nodos, sin malloc; en la del array se reinserta. El origen queda vacío.</>)}
        </>
      )}
      {acto === 2 && (
        <>
          <p>
            Las mismas dos tablas, ahora con dos inventarios: el principal y el botín (las órdenes con <code>B</code>). Al final de <code>TablaDispersaLista.c</code> y <code>TablaDispersaArray.c</code>, en el bloque del acto 2.
          </p>
          {ej(6, 'Copiar un inventario', 6, <><code>copiar(destino, origen)</code>: destino queda igual que origen. En la de listas, primero se liberan los nodos que tuviera destino y después se copia cada cubo con nodos NUEVOS, en el mismo orden: la copia no puede compartir ni un nodo. En la del array, casilla a casilla, con sus marcas. Devuelve cuántos elementos ha copiado.</>)}
          {ej(7, 'Comparar dos inventarios', 7, <><code>iguales(a, b)</code>: 1 si tienen las mismas claves con los mismos elementos, aunque dentro de un cubo vayan en otro orden o en el array estén en otras casillas.</>)}
          {ej(8, 'Lo que tienen los dos', 8, <><code>interseccion(destino, otro)</code>: destino se queda solo con las claves que también están en otro, cada una con el menor de los dos elementos. Lo que se quita se libera (listas) o pasa a BORRADA (array). Devuelve cuántos quedan.</>)}
          {ej(9, 'Pagar con lo que tiene el otro', 9, <><code>diferencia(destino, otro)</code>: a cada clave de destino que esté en otro se le resta su elemento; si queda en 0 o menos, se quita. Devuelve cuántos se han quitado. La misión 9 es el jefe del acto: usa los cuatro ejercicios.</>)}
        </>
      )}
      {acto === 3 && (
        <>
          <p>
            Las mismas dos tablas, pero cada una puede usar otra función hash: la orden <code>FUNCION</code> la elige (con la tabla vacía) y todas las operaciones de clase la usan. En cada misión, tu inventario usa la función nueva y el botín la de clase, para comparar las colisiones. Las claves de este acto son positivas, y cada función va en las dos tablas (mod 101 en la de listas, mod 20 en la del array).
          </p>
          {ej(10, 'Plegamiento', 10, <><code>hashPlegamiento(clave)</code>: parte la clave en trozos de dos cifras empezando por la derecha y los suma (12345: 1 + 23 + 45 = 69), mod el tamaño.</>)}
          {ej(11, 'Mitad del cuadrado', 11, <><code>hashMitadCuadrado(clave)</code>: eleva la clave al cuadrado en un <code>long long</code> y se queda con las dos cifras del centro, <code>(c / 100) % 100</code>, mod el tamaño.</>)}
          {ej(12, 'Polinómico sobre las cifras', 12, <><code>hashPolinomico(clave)</code>: <code>h = h * 31 + cifra</code>, de la última cifra a la primera, con <code>unsigned int</code>, mod el tamaño. La misión 12 es el jefe del acto: dos inventarios con funciones distintas que se acaban fusionando.</>)}
        </>
      )}
      {acto === 4 && (
        <>
          <p>
            Las mismas dos tablas, jugando con las colisiones. La orden <code>SONDEO</code> elige cómo busca sitio el array (con la tabla vacía): la lineal de clase, la cuadrática o el doble hashing. Insertar, buscar, eliminar y actualizar ya usan tu <code>casillaHashArray</code>. Las claves de este acto son positivas.
          </p>
          {ej(13, 'Otras formas de buscar sitio', 13, <><code>casillaHashArray(h, clave, intento)</code>: la casilla del intento i. Lineal (hecha): <code>(h + i) mod 20</code>. Cuadrática: <code>(h + i²) mod 20</code>. Doble: <code>(h + i·h2) mod 20</code>, con <code>hash2HashArray(x) = 7 - x mod 7</code>. Con 20 casillas, que no es primo, la cuadrática solo pasa por 6: a veces no encuentra sitio aunque sobre.</>)}
          {ej(14, 'Lo que cuesta buscar', 14, <><code>costeBuscar(h, clave)</code>: en las listas, los nodos de su cubo hasta el de la clave (todos si no está); en el array, las casillas que se miran hasta la de la clave o la primera VACIA. <code>costeTotal(h)</code>: la suma del coste de cada clave que hay.</>)}
          {ej(15, 'Reorganizar', 15, <><code>limpiarBorradasHashArray(h)</code>: guarda las OCUPADA, deja todo VACIA y n = 0 y las vuelve a insertar, sin cambiar el tamaño. <code>alFrenteHashLista(h, clave)</code>: mueve el MISMO nodo de la clave al principio de su cubo. La misión 16, el dragón, es el jefe final.</>)}
        </>
      )}
      <h3>Cómo repartir las 2 horas</h3>
      <p>
        {acto === 1
          ? '10 minutos para abrir el proyecto y subir la misión 1 sin tocar nada (saldrá casi todo mal, y es lo esperado); después, unos 20 minutos por ejercicio, cada uno con su misión.'
          : acto === 2
            ? 'Unos 25 minutos por ejercicio, cada uno con su misión, y el resto para el recaudador.'
            : acto === 3
              ? 'Unos 30 minutos por función hash, cada una con su misión (calcula a mano un par de claves antes de programarla), y el resto para el hechicero.'
              : 'El ejercicio 13 primero, con la misión 13. Después, unos 25 minutos para el 14 y otros 25 para el 15, y el resto para el dragón.'}
      </p>
      <h3>Qué mira la corrección</h3>
      <p>
        En cada evento y en cada tabla: claves y valores, sin repetidas; que cada nodo esté en el cubo que le da la función hash de su tabla y que cada búsqueda encuentre su clave siguiendo su secuencia; que las operaciones que mueven nodos muevan los mismos y que las copias no compartan ninguno; lo que devuelve cada función; y que no haya fugas ni dobles free. Cada fallo dice de qué ejercicio es. Si tu programa se corta, la web te dice en qué evento y en qué función mirar.
      </p>
    </section>
  );
}

// ------------------------------------------------------------------ app

export default function App() {
  const [subidos, setSubidosR] = useState<Record<string, Subido>>(cargar);
  const [errores, setErrores] = useState<Record<string, string[]>>({});
  const [viendo, setViendo] = useState<string | null>(null);
  const [acto, setActoR] = useState<number>(() => {
    try {
      return Math.min(4, Math.max(1, Number(localStorage.getItem(CLAVE_ACTO)) || 1));
    } catch {
      return 1;
    }
  });
  const setActo = (n: number) => {
    setActoR(n);
    try {
      localStorage.setItem(CLAVE_ACTO, String(n));
    } catch {
      /* sin almacenamiento */
    }
  };
  const setSubidos = (s: Record<string, Subido>) => {
    setSubidosR(s);
    guardar(s);
  };

  const correcciones = useMemo(() => {
    const r: Record<string, Correccion> = {};
    for (const [id, s] of Object.entries(subidos)) {
      try {
        r[id] = corregir(leerRegistro(s.texto, s.fichero));
      } catch {
        /* se avisó al subirlo */
      }
    }
    return r;
  }, [subidos]);

  const subir = async (lista: FileList | File[], esperada: string) => {
    const nuevos = { ...subidos };
    const errs: string[] = [];
    const titulo = (id: string) => MISIONES.find((m) => m.id === id)?.titulo;
    for (const f of Array.from(lista)) {
      try {
        const texto = await f.text();
        const reg = leerRegistro(texto, f.name);
        if (reg.mision !== esperada) {
          errs.push(
            titulo(reg.mision)
              ? `«${f.name}» es el registro de «${titulo(reg.mision)}». Aquí va registros/${esperada}.txt; ese súbelo en su tarjeta.`
              : `«${f.name}» es de la misión «${reg.mision}», que no es de esta práctica.`,
          );
          continue;
        }
        corregir(reg);
        nuevos[reg.mision] = { fichero: f.name, texto };
        const cc = corregir(reg);
        sonar(cc.conocida && cc.bien === cc.total ? 'victoria' : 'sube');
      } catch (e) {
        errs.push(e instanceof ErrorRegistro ? e.message : `No se ha podido leer «${f.name}».`);
      }
    }
    if (errs.length) sonar('fallo');
    setErrores({ ...errores, [esperada]: errs });
    setSubidos(nuevos);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viendo]);

  const mision = MISIONES.find((m) => m.id === viendo);
  if (viendo && correcciones[viendo] && mision) return <Visor key={viendo + correcciones[viendo].reg.eventos.length} c={correcciones[viendo]} mision={mision} volver={() => setViendo(null)} />;
  return <Inicio correcciones={correcciones} errores={errores} subir={subir} ver={setViendo} borrar={() => setSubidos({})} acto={acto} setActo={setActo} />;
}
