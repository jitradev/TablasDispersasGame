import { useEffect, useMemo, useRef, useState } from 'react';
import { Ico } from './juego/Icono';
import { urlSprite } from './juego/sprites';
import { musicaPrologo, pararMusica, sonar } from './juego/sonido';
import { BotonSonido } from './juego/BotonSonido';
import { leerRegistro, ErrorRegistro } from './practica/registro';
import { corregir, Correccion } from './practica/corregir';
import { ACTOS, MISIONES } from './practica/misiones';
import { COMPANIA, JEFES, MERLA, PROLOGO } from './practica/personajes';
import { Visor } from './practica/Visor';
import { Entrada } from './practica/Entrada';

// ------------------------------------------------------------------ registros guardados

interface Subido {
  fichero: string;
  texto: string;
}
const CLAVE = 'cofres-dispersos-campana-v2';
/** Las misiones cuya animación ya se ha visto entera: solo de esas se enseña la nota. */
const CLAVE_VISTAS = 'cofres-dispersos-campana-vistas';
function cargarVistas(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_VISTAS) ?? '{}') ?? {};
  } catch {
    return {};
  }
}
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

// ------------------------------------------------------------------ la intro: el prólogo, una sola vez

const CLAVE_PROLOGO = 'lord-of-eda-prologo-visto';
function prologoVisto(): boolean {
  try {
    return localStorage.getItem(CLAVE_PROLOGO) === 'si';
  } catch {
    return false;
  }
}

/** El prólogo a pantalla completa: cada frase aparece despacio, se queda y se
 * funde con la siguiente. Se puede saltar. */
function Intro({ alAcabar }: { alAcabar: () => void }) {
  // antes del prólogo, un «pulsa para empezar»: ese clic deja sonar la música
  // (sin un gesto, los navegadores, Safari el primero, no dejan reproducir nada)
  const [empezado, setEmpezado] = useState(false);
  if (!empezado)
    return (
      <div
        className="intro-cine puerta"
        onClick={() => {
          musicaPrologo();
          setEmpezado(true);
        }}
      >
        <div className="puerta-texto">PULSA PARA EMPEZAR</div>
        <div className="puerta-sub">mejor con sonido</div>
      </div>
    );
  return <Prologo alAcabar={alAcabar} />;
}

function Prologo({ alAcabar }: { alAcabar: () => void }) {
  const [k, setK] = useState(0);
  const [saliendo, setSaliendo] = useState(false);
  const fin = useRef(false);
  const acabar = () => {
    if (fin.current) return;
    fin.current = true;
    try {
      localStorage.setItem(CLAVE_PROLOGO, 'si');
    } catch {
      /* sin almacenamiento */
    }
    setSaliendo(true);
    pararMusica(2.5);
    setTimeout(alAcabar, 1400);
  };
  const siguiente = () => (k < PROLOGO.length - 1 ? setK(k + 1) : acabar());
  useEffect(() => {
    const espera = 3200 + PROLOGO[k].length * 45 + (k === PROLOGO.length - 1 ? 1500 : 0);
    const t = setTimeout(siguiente, espera);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);
  useEffect(() => {
    document.body.classList.add('sin-scroll');
    return () => document.body.classList.remove('sin-scroll');
  }, []);
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') acabar();
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') siguiente();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  });
  return (
    <div className={`intro-cine ${saliendo ? 'saliendo' : ''}`} onClick={siguiente}>
      {PROLOGO.map((l, i) => (
        <p key={i} className={`cine-frase ${i === k ? 'visible' : ''} ${i === PROLOGO.length - 1 ? 'tu' : ''} ${i === 0 ? 'primera' : ''}`} aria-hidden={i !== k}>
          {l}
        </p>
      ))}
      <button
        className="saltar"
        onClick={(e) => {
          e.stopPropagation();
          sonar('click');
          acabar();
        }}
      >
        SALTAR <Ico n="evento" detras />
      </button>
    </div>
  );
}

// ------------------------------------------------------------------ la portada: elegir el acto


function Inicio({
  correcciones,
  pendientes,
  ver,
  borrar,
  acto,
  setActo,
  animarTitulo,
  verPrologo,
}: {
  correcciones: Record<string, Correccion>;
  /** Misiones con registro subido pero cuya animación aún no se ha visto. */
  pendientes: Record<string, boolean>;
  ver: (id: string) => void;
  borrar: () => void;
  acto: number | null;
  setActo: (n: number | null) => void;
  animarTitulo: boolean;
  verPrologo: () => void;
}) {
  const candado = useMemo(() => urlSprite('llave', 4), []);
  const hechas = MISIONES.map((m) => correcciones[m.id]);
  const alumnos = [...new Set(hechas.filter(Boolean).map((c) => c!.reg.alumno))];
  /** Los nombres de verdad: el texto de ejemplo de alumno.h no se enseña. */
  const nombres = alumnos.filter((a) => a && !a.startsWith(NOMBRE_PLANTILLA));
  const notaDe = (n: number) => {
    const ms = MISIONES.filter((m) => m.acto === n);
    return ms.reduce((s, m) => s + (correcciones[m.id]?.conocida ? correcciones[m.id].bien / correcciones[m.id].total : 0), 0) / ms.length;
  };
  const estrellasDe = (n: number) => MISIONES.filter((m) => m.acto === n).reduce((s, m) => s + (correcciones[m.id]?.conocida ? correcciones[m.id].estrellas : 0), 0);
  const abierto = (n: number): boolean => {
    if (n === 1 || ESTRELLAS_PARA_ABRIR === 0 || PROFESOR) return true;
    const jefe = MISIONES.find((m) => m.acto === n - 1 && m.jefe)!;
    const c = correcciones[jefe.id];
    return !!c && c.conocida && c.estrellas >= ESTRELLAS_PARA_ABRIR && abierto(n - 1);
  };

  if (acto !== null) return <PantallaActo n={acto} correcciones={correcciones} pendientes={pendientes} ver={ver} volver={() => setActo(null)} estrellas={estrellasDe(acto)} abierto={abierto(acto)} />;

  return (
    <div className={`pantalla inicio ${animarTitulo ? 'con-entrada' : ''}`}>
      <div className="boton-sonido-portada">
        <BotonSonido />
      </div>
      <h1 className="titulo-juego">Lord of EDA</h1>
      <div className="tras-titulo">
        <div className="elige">ELIGE TU ACTO</div>
        <div className="mapa-actos grande">
          {ACTOS.map((a) => {
            const ms = MISIONES.filter((m) => m.acto === a.n);
            const abre = abierto(a.n);
            return (
              <button
                key={a.n}
                className={`acto ${abre ? '' : 'cerrado'}`}
                onClick={() => {
                  sonar(abre ? 'sube' : 'fallo');
                  if (abre) setActo(a.n);
                }}
              >
                <img src={urlSprite(JEFES[a.n].id, 3)} alt="" className="a-jefe" />
                <span className="a-num">ACTO {a.n}</span>
                <span className="a-tit">{a.titulo}</span>
                <span className="a-lugar">{a.lugar}</span>
                <span className="a-est">
                  {abre ? (
                    <>
                      ★ {estrellasDe(a.n)}/{ms.length * 3}
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

        <details className="ordenes" onToggle={() => sonar('click')}>
          <summary className="ordenes-cab">
            <img src={urlSprite(MERLA.id, 4)} alt="" />
            <div>
              <div className="ordenes-tit">LAS ÓRDENES DE MERLA</div>
              <div className="ordenes-sub">«Escucha bien, que no lo repetiré»</div>
            </div>
            <span className="ordenes-flecha" aria-hidden="true">▼</span>
          </summary>
          <ol>
            <li>
              El primer día en el Gremio, recoge el Libro de los Cofres, que es el <b>proyecto base</b>. Ábrelo en CLion (<i>File &gt; Open</i>, la carpeta entera) y guárdalo bien: te servirá para los cuatro actos.
            </li>
            <li>
              Cada acto tiene sus conjuros, y se escriben en <code>TablaDispersaLista.c</code> y <code>TablaDispersaArray.c</code>, en el bloque de su acto. El pergamino del Gremio cuenta qué tiene que hacer cada uno.
            </li>
            <li>
              Con un conjuro listo, ejecuta el target de su misión (<code>mision1</code>, <code>mision2</code>...) desde el desplegable de arriba a la derecha. Tu programa juega la misión y deja su registro en <code>registros/</code>.
            </li>
            <li>Entra en la misión y entrégale ese registro. La misión se juega sola, evento a evento; cómo te ha ido lo sabrás al final.</li>
            <li>
              Antes de que acabe el <b>viernes 11 de diciembre a las 23:59</b>, comprime el proyecto entero y llévalo a la PDU. Puedes llevarlo al caer la noche de cada sesión y volver a llevarlo después: vale el último.
            </li>
          </ol>
          <div className="ordenes-botones">
            <a className="boton grande" href="/proyecto-base.zip" download="listas-dispersas-campana.zip" onClick={() => sonar('click')}>
              RECOGER EL LIBRO (PROYECTO BASE)
            </a>
            <a className="boton grande secundario" href="/enunciado-lord-of-eda.pdf" target="_blank" rel="noreferrer" onClick={() => sonar('click')}>
              LEER EL PERGAMINO (ENUNCIADO)
            </a>
          </div>
        </details>

        <div className="compania">
          {[MERLA, ...Object.values(COMPANIA)].map((p) => (
            <figure key={p.id}>
              <img src={urlSprite(p.id, 5)} alt="" />
              <figcaption>
                {p.nombre}
                <small>{p.raza}</small>
              </figcaption>
            </figure>
          ))}
        </div>

        {hechas.some(Boolean) && (
          <section className="resumen">
            <div className="res-cab">
              <div className="ram-tit">RESUMEN DE LA CAMPAÑA</div>
              {nombres.length > 0 && <div className="res-alumno">{nombres.join(' / ')}</div>}
            </div>
            {nombres.length > 1 && <div className="aviso mal">Los registros llevan nombres distintos: vuelve a ejecutar las misiones con tu código.</div>}
            {ACTOS.map((a) => {
              const nota = notaDe(a.n) * 10;
              return (
                <div key={a.n} className="res-acto">
                  <div className="res-acto-cab">
                    <span className="res-acto-tit">
                      <small>ACTO {a.n}</small> {a.titulo}
                    </span>
                    <b>{nota.toFixed(1).replace('.', ',')}</b>
                  </div>
                  <div className="res-barra" aria-hidden="true">
                    <span style={{ width: `${nota * 10}%` }} />
                  </div>
                  <div className="res-misiones">
                    {MISIONES.filter((m) => m.acto === a.n).map((m) => {
                      const c = correcciones[m.id];
                      const num = MISIONES.indexOf(m) + 1;
                      const estado = !c ? (pendientes[m.id] ? 'pendiente' : 'nada') : c.conocida && c.bien === c.total ? 'hecha' : 'parcial';
                      return (
                        <div key={m.id} className={`res-mision ${estado} ${m.jefe ? 'jefe' : ''}`} title={m.titulo}>
                          <span className="rm-num">M{num}</span>
                          <span className="rm-est">{[0, 1, 2].map((k) => (c && c.conocida && k < c.estrellas ? '★' : '☆')).join('')}</span>
                          <span className="rm-ev">{c ? `${c.bien}/${c.total}` : pendientes[m.id] ? 'sin ver' : 'sin subir'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="res-total">
              <span>Nota orientativa de la campaña</span>
              <b>{((ACTOS.reduce((s, a) => s + notaDe(a.n), 0) / ACTOS.length) * 10).toFixed(1).replace('.', ',')} / 10</b>
            </div>
            <p className="pie">
              La nota final la pone el profesor leyendo el código; esta es solo la de los registros.{' '}
              <button className="enlace" onClick={borrar}>
                borrar los registros subidos
              </button>
            </p>
          </section>
        )}

        <p className="pie-portada">
          <button className="enlace" onClick={verPrologo}>
            volver a ver el prólogo
          </button>
        </p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ dentro de un acto

function PantallaActo({
  n,
  correcciones,
  pendientes,
  ver,
  volver,
  estrellas,
  abierto,
}: {
  n: number;
  correcciones: Record<string, Correccion>;
  pendientes: Record<string, boolean>;
  ver: (id: string) => void;
  volver: () => void;
  estrellas: number;
  abierto: boolean;
}) {
  const a = ACTOS[n - 1];
  const misiones = MISIONES.filter((m) => m.acto === n);
  const jefe = JEFES[n];
  return (
    <div className="pantalla acto-pantalla">
      <header className="barra-sup">
        <button
          className="mini"
          onClick={() => {
            sonar('click');
            volver();
          }}
        >
          <Ico n="volver" />
          VOLVER
        </button>
        <div className="titulo-ev">
          ACTO {n} · {a.titulo}
        </div>
        <div className="pts">
          ★ {estrellas}/{misiones.length * 3}
        </div>
        <BotonSonido />
      </header>

      <section className="relato-acto">
        <div className="relato-lugar">{a.lugar.toUpperCase()}</div>
        <p>{a.resumen}</p>
      </section>

      <div className="jefe-acto">
        <img src={urlSprite(jefe.id, 3)} alt="" />
        <div>
          <div className="jefe-nombre">TE ESPERA: {jefe.nombre}</div>
          <p>{jefe.amenaza}</p>
        </div>
      </div>


      {!abierto ? (
        <div className="aviso neutro">
          Este acto se abre al sacar al menos {ESTRELLAS_PARA_ABRIR} estrellas en el jefe del acto {n - 1}. Si ya lo hiciste en otro ordenador, vuelve a subir aquí su registro.
        </div>
      ) : (
        <div className="misiones">
          {misiones.map((m) => {
            const c = correcciones[m.id];
            const num = MISIONES.indexOf(m) + 1;
            return (
              <div key={m.id} className={`tarjeta ${c ? (c.bien === c.total && c.conocida ? 'hecha' : 'subida-ok') : ''} ${m.jefe ? 'jefe' : ''}`}>
                <div className="iconos">
                  <img src={urlSprite(m.quien, 4)} alt="" />
                  {m.jefe && <img src={urlSprite(JEFES[m.acto].id, 3)} alt="" />}
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
                  </>
                ) : pendientes[m.id] ? (
                  <div className="t-falta">Ya le has entregado el registro. Entra a ver cómo sale.</div>
                ) : null}
                <button
                  className="grande t-entrar"
                  onClick={() => {
                    sonar('click');
                    ver(m.id);
                  }}
                >
                  <Ico n="play" />
                  {c ? 'VOLVER A LA MISIÓN' : pendientes[m.id] ? 'VER CÓMO SALE' : 'ENTRAR EN LA MISIÓN'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [subidos, setSubidosR] = useState<Record<string, Subido>>(cargar);
  const [errores, setErrores] = useState<Record<string, string[]>>({});
  const [viendo, setViendo] = useState<string | null>(null);
  const [vistas, setVistasR] = useState<Record<string, boolean>>(cargarVistas);
  const setVistas = (v: Record<string, boolean>) => {
    setVistasR(v);
    try {
      localStorage.setItem(CLAVE_VISTAS, JSON.stringify(v));
    } catch {
      /* sin almacenamiento */
    }
  };
  // se empieza siempre en la portada, eligiendo acto
  const [acto, setActo] = useState<number | null>(null);
  // el prólogo sale una vez; el título sube a su sitio la primera vez que se ve la portada
  const [intro, setIntro] = useState<boolean>(() => !prologoVisto());
  const [animarTitulo, setAnimarTitulo] = useState(true);
  useEffect(() => {
    if (intro || !animarTitulo) return;
    document.body.classList.add('sin-scroll');
    const t = setTimeout(() => setAnimarTitulo(false), 4600);
    return () => {
      clearTimeout(t);
      document.body.classList.remove('sin-scroll');
    };
  }, [intro, animarTitulo]);
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
              ? `«${f.name}» es el registro de «${titulo(reg.mision)}». Aquí va registros/${esperada}.txt; ese súbelo en su misión.`
              : `«${f.name}» es de la misión «${reg.mision}», que no es de esta práctica.`,
          );
          continue;
        }
        corregir(reg);
        nuevos[reg.mision] = { fichero: f.name, texto };
        // registro nuevo: su animación hay que volver a verla para saber la nota
        const v = { ...vistas };
        delete v[reg.mision];
        setVistas(v);
        sonar('sube');
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
  const volver = () => {
    setErrores({});
    setViendo(null);
  };
  // la misión que va después: se entra en ella (y en su acto) sin pasar por la portada
  const siguienteDe = (m: (typeof MISIONES)[number]) => {
    const sig = MISIONES[MISIONES.indexOf(m) + 1];
    if (!sig) return undefined;
    return {
      titulo: sig.titulo,
      ir: () => {
        setErrores({});
        setActo(sig.acto);
        setViendo(sig.id);
        window.scrollTo(0, 0);
      },
    };
  };
  if (viendo && mision && correcciones[viendo])
    return (
      <Visor
        key={viendo + subidos[viendo].texto.length + subidos[viendo].fichero}
        c={correcciones[viendo]}
        mision={mision}
        volver={volver}
        estreno={!vistas[viendo]}
        alTerminar={() => setVistas({ ...cargarVistas(), [viendo]: true })}
        resubir={(fs) => subir(fs, viendo)}
        errores={errores[viendo] ?? []}
        siguiente={siguienteDe(mision)}
      />
    );
  if (viendo && mision) return <Entrada mision={mision} num={MISIONES.indexOf(mision) + 1} volver={volver} subir={(fs) => subir(fs, viendo)} errores={errores[viendo] ?? []} />;
  const vistasC = Object.fromEntries(Object.entries(correcciones).filter(([id]) => vistas[id]));
  const pendientes = Object.fromEntries(Object.keys(correcciones).filter((id) => !vistas[id]).map((id) => [id, true]));
  if (intro)
    return (
      <Intro
        alAcabar={() => {
          setIntro(false);
          setAnimarTitulo(true);
        }}
      />
    );
  return (
    <Inicio
      correcciones={vistasC}
      pendientes={pendientes}
      ver={setViendo}
      borrar={() => (setSubidos({}), setVistas({}))}
      acto={acto}
      setActo={(n) => {
        setAnimarTitulo(false);
        setActo(n);
      }}
      animarTitulo={animarTitulo}
      verPrologo={() => setIntro(true)}
    />
  );
}
