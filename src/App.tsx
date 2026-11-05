import { useEffect, useMemo, useRef, useState } from 'react';
import { urlSprite } from './juego/sprites';
import { leerRegistro, ErrorRegistro } from './practica/registro';
import { corregir, Correccion } from './practica/corregir';
import { MISIONES } from './practica/misiones';
import { COMPANIA, MERLA } from './practica/personajes';
import { Visor } from './practica/Visor';

// ------------------------------------------------------------------ registros guardados

interface Subido {
  fichero: string;
  texto: string;
}
const CLAVE = 'cofres-dispersos-registros-v2';
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

function Inicio({
  correcciones,
  errores,
  subir,
  ver,
  borrar,
}: {
  correcciones: Record<string, Correccion>;
  errores: Record<string, string[]>;
  subir: (fs: FileList | File[], mision: string) => void;
  ver: (id: string) => void;
  borrar: () => void;
}) {
  const cofre = useMemo(() => urlSprite('cofre', 6), []);
  const buho = useMemo(() => urlSprite('buho', 6), []);
  const fantasma = useMemo(() => urlSprite('fantasma', 5), []);
  const gloton = useMemo(() => urlSprite('gloton', 3), []);
  const [encima, setEncima] = useState<string | null>(null);
  const hechas = MISIONES.map((m) => correcciones[m.id]);
  const nota = hechas.reduce((s, c) => s + (c && c.conocida ? c.bien / c.total : 0), 0) / MISIONES.length;
  const alumnos = [...new Set(hechas.filter(Boolean).map((c) => c!.reg.alumno))];
  return (
    <div className="pantalla inicio">
      <div className="sprites-portada">
        <img src={cofre} alt="" />
        <img src={buho} alt="" className="flota" />
        <img src={fantasma} alt="" className="flota lento" />
      </div>
      <h1>Cofres Dispersos</h1>
      <div className="sub">PRÁCTICA DE LISTAS DISPERSAS · ESTRUCTURA DE DATOS</div>

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
          El Gremio guarda su inventario en las dos <b>tablas de dispersión</b> de clase a la vez: la de <b>listas</b> (encadenamiento, cada cubo es una lista enlazada) y la del <b>array</b> (direccionamiento abierto con exploración lineal). Cada objeto tiene su número, que es la clave, y se guarda cuántos hay.
        </p>
        <p>
          Partes del proyecto <code>Listas_Dispersas</code> de clase, tal cual, y haces cinco ejercicios en las dos tablas: <b>el objeto con más unidades</b>, <b>medir las colisiones</b>, <b>cambiar la clave</b> de un objeto, <b>quitar los agotados</b> y <b>juntar dos inventarios</b>. Tu programa juega cinco misiones, una por ejercicio, y deja un registro de lo que ha hecho con la memoria. Después de cada misión subes aquí su registro y ves la animación de las dos tablas, evento a evento: a qué cubo va cada clave, qué casillas mira la exploración... y cada fantasma que se te escapa.
        </p>
      </section>

      <ol className="pasos">
        <li>
          <span className="num">1</span>
          <div>
            <b>Descarga el proyecto base</b> y ábrelo en CLion (File &gt; Open, la carpeta entera).
            <a className="boton grande" href="/proyecto-base.zip" download="listas-dispersas-practica.zip">
              DESCARGAR PROYECTO BASE
            </a>
          </div>
        </li>
        <li>
          <span className="num">2</span>
          <div>
            <b>Escribe tu nombre</b> en <code>alumno.h</code> y haz los cinco ejercicios al final de <code>TablaDispersaLista.c</code> y de <code>TablaDispersaArray.c</code>.
          </div>
        </li>
        <li>
          <span className="num">3</span>
          <div>
            <b>Ejecuta la misión</b> de ese ejercicio: el target <code>mision1</code>, <code>mision2</code>... (desplegable de arriba a la derecha). Cada una escribe su registro en <code>registros/</code>.
          </div>
        </li>
        <li>
          <span className="num">4</span>
          <div>
            <b>Sube el registro de esa misión</b> en su tarjeta, mira la animación y corrige lo que falle. Ve de misión en misión hasta tener todas las estrellas.
          </div>
        </li>
      </ol>


      <div className="misiones">
        {MISIONES.map((m, i) => {
          const c = correcciones[m.id];
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
                MISIÓN {i + 1} · target <code>{m.target}</code>
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
                  <button className="grande" onClick={() => ver(m.id)}>
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

      {hechas.some(Boolean) && (
        <section className="resumen">
          <div className="ram-tit">RESUMEN</div>
          <div className="res-fila">
            <span>Alumno</span>
            <b>{alumnos.join(' / ')}</b>
          </div>
          {alumnos.some((a) => a.startsWith(NOMBRE_PLANTILLA)) && <div className="aviso mal">Todavía no has puesto tu nombre en alumno.h.</div>}
          {alumnos.length > 1 && <div className="aviso mal">Los registros llevan nombres distintos: vuelve a ejecutar las cinco misiones con tu código.</div>}
          {MISIONES.map((m) => {
            const c = correcciones[m.id];
            return (
              <div key={m.id} className="res-fila">
                <span>{m.titulo}</span>
                <b>{c ? `${c.bien}/${c.total}${c.conocida ? '' : ' (no cuenta)'}` : 'sin subir'}</b>
              </div>
            );
          })}
          <div className="res-fila gorda">
            <span>Nota orientativa</span>
            <b>{(nota * 10).toFixed(1)} / 10</b>
          </div>
          <p className="pie">
            Para entregar: comprime la carpeta del proyecto entera (código y registros de las cinco misiones) y sube el zip a la PDU. La nota final la pone el profesor leyendo el código; esta es solo la de los registros.{' '}
            <button className="enlace" onClick={borrar}>
              borrar los registros subidos
            </button>
          </p>
        </section>
      )}

      <Enunciado />
    </div>
  );
}

function Enunciado() {
  return (
    <section className="enunciado">
      <h2>EL ENUNCIADO</h2>
      <p>
        El proyecto base es el <code>Listas_Dispersas</code> de clase tal cual, con sus tablas de 101 cubos y 20 casillas. Además viene hecha <code>actualizar</code>: si la clave ya está, cambia su elemento; si no, la inserta. Los cinco ejercicios van al final de cada <code>.c</code>, en las dos tablas.
      </p>
      <h3>Ejercicio 1 · El objeto con más unidades (misión 1)</h3>
      <p>
        <code>masAbundante(h, &amp;clave, &amp;elemento)</code>: recorrer toda la tabla y quedarse con el elemento más grande; si hay empate, la clave más pequeña. Devuelve 0 si la tabla está vacía.
      </p>
      <h3>Ejercicio 2 · Medir las colisiones (misión 2)</h3>
      <p>
        En la de listas, <code>cuboMasLargo(h, &amp;vacios)</code>: la lista más larga y cuántos cubos están a NULL. En la del array, <code>grupoMasLargo(h, &amp;borradas)</code>: el grupo más largo de casillas seguidas que no están VACIA (las BORRADA cuentan), de la 0 a la última, y cuántas BORRADA hay.
      </p>
      <h3>Ejercicio 3 · Cambiar la clave (misión 3)</h3>
      <p>
        <code>cambiarClave(h, vieja, nueva)</code>. En la de listas se desengancha el MISMO nodo, cambia su clave y se engancha en el cubo de la nueva (si la nueva ya está, se suma y el nodo viejo se libera). En la del array, la casilla vieja pasa a BORRADA y la nueva se suma o se inserta. Devuelve 0 si la vieja no está.
      </p>
      <h3>Ejercicio 4 · Quitar los agotados (misión 4)</h3>
      <p>
        <code>eliminarSiMenor(h, minimo)</code> quita todo lo que tenga menos de <code>minimo</code> y devuelve cuántos ha quitado. En la de listas, cada nodo se desengancha y se libera, aunque sea el primero o vayan varios seguidos; en la del array, BORRADA (no VACIA, que cortaría la exploración).
      </p>
      <h3>Ejercicio 5 · Juntar dos inventarios (misión 5)</h3>
      <p>
        <code>fusionar(destino, origen)</code>: si la clave ya está en el destino, se suma; si no, se mete. En la de listas se mueven los nodos, sin malloc; en la del array se reinserta. El origen queda vacío.
      </p>
      <h3>Cómo repartir las 2 horas</h3>
      <ul>
        <li>
          <b>10 min.</b> Abre el proyecto, pon tu nombre, ejecuta <code>mision1</code> tal cual y sube su registro: casi todo saldrá mal, y es lo esperado.
        </li>
        <li>
          <b>15 min.</b> Ejercicio 1, con la misión 1. <b>20 min.</b> Ejercicio 2, con la misión 2.
        </li>
        <li>
          <b>25 min.</b> Ejercicio 3, con la misión 3. <b>25 min.</b> Ejercicio 4, con la misión 4.
        </li>
        <li>
          <b>25 min.</b> Ejercicio 5, con la misión 5, la del jefe, que lo junta todo.
        </li>
      </ul>
      <h3>Qué mira la corrección</h3>
      <p>En cada evento y en cada tabla: claves y valores, sin repetidas; que cada nodo esté en su cubo y que la exploración encuentre cada clave; que cambiar la clave y fusionar muevan los mismos nodos; que el origen quede vacío; lo que devuelve cada función; y que no haya fugas ni dobles free. Cada fallo dice de qué ejercicio es. Si tu programa se corta, la web te dice en qué evento y en qué función mirar.</p>
    </section>
  );
}

// ------------------------------------------------------------------ app

export default function App() {
  const [subidos, setSubidosR] = useState<Record<string, Subido>>(cargar);
  const [errores, setErrores] = useState<Record<string, string[]>>({});
  const [viendo, setViendo] = useState<string | null>(null);
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
      } catch (e) {
        errs.push(e instanceof ErrorRegistro ? e.message : `No se ha podido leer «${f.name}».`);
      }
    }
    setErrores({ ...errores, [esperada]: errs });
    setSubidos(nuevos);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viendo]);

  const mision = MISIONES.find((m) => m.id === viendo);
  if (viendo && correcciones[viendo] && mision) return <Visor key={viendo + correcciones[viendo].reg.eventos.length} c={correcciones[viendo]} mision={mision} volver={() => setViendo(null)} />;
  return <Inicio correcciones={correcciones} errores={errores} subir={subir} ver={setViendo} borrar={() => setSubidos({})} />;
}
