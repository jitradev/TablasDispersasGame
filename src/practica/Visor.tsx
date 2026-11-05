// El visor de un registro: la banda con el personaje que camina hasta hash(clave),
// el array con su exploración lineal y la tabla de listas con sus cubos, evento a
// evento, con la corrección al lado.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PAL, pintar, sprite, urlSprite } from '../juego/sprites';
import { iconoDe } from '../juego/mision1';
<<<<<<< HEAD
import { Correccion, describirBloque, dondeTabla, Fallo } from './corregir';
import { BORRADA, Clave, cuboDe, hash2, HashL, MA, ML, mundoInicial, OCUPADA, recorridoA, Sonda, TAM_ARRAY, TAM_LISTA } from './tablas';
=======
import { Correccion, describirBloque, Fallo } from './corregir';
import { BORRADA, hash, MA, ML, OCUPADA, recorridoA, TAM_ARRAY, TAM_LISTA, nuevaLista, nuevoArray } from './tablas';
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
import { Mision } from './misiones';
import { COMPANIA, MERLA } from './personajes';
import { EventoReg, Inv } from './registro';

const FUENTE = '"Press Start 2P", monospace';
const W = 560;
const H = 150;

// ------------------------------------------------------------------ iconos

const iconos = new Map<string, string>();
<<<<<<< HEAD
const icono = (clave: Clave) => {
=======
const icono = (clave: number) => {
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
  const n = iconoDe(Math.abs(clave));
  if (!iconos.has(n)) iconos.set(n, urlSprite(n, 2));
  return iconos.get(n)!;
};

// ------------------------------------------------------------------ banda (canvas)

function texto(g: CanvasRenderingContext2D, t: string, x: number, y: number, color = PAL.c, alin: CanvasTextAlign = 'left') {
  g.font = `8px ${FUENTE}`;
  g.textAlign = alin;
  g.textBaseline = 'top';
  g.fillStyle = PAL['0'];
  g.fillText(t, x + 1, y + 1);
  g.fillStyle = color;
  g.fillText(t, x, y);
}

function montes(g: CanvasRenderingContext2D, base: number, alto: number, color: string, semilla: number) {
  g.fillStyle = color;
  for (let x = 0; x < W; x += 2) {
    const h = alto * (0.55 + 0.45 * Math.sin(x / 37 + semilla) * Math.sin(x / 13 + semilla / 3));
    g.fillRect(x, Math.round(base - h), 2, Math.round(h) + 1);
  }
}

interface PropsBanda {
  tam: number;
  /** longitud de la lista de cada cubo */
  largos: number[];
  destino: number | null;
  rotulo: string;
<<<<<<< HEAD
  titulo: string;
=======
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
  quien: string;
  jefe?: { total: number; quedan: number; golpe: number };
}

function Banda(props: PropsBanda) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p$ = useRef(props);
  p$.current = props;
  const x$ = useRef(30);
  useEffect(() => {
    const cv = ref.current!;
    let vivo = true;
    sprite('gema');
    const tick = (t: number) => {
      if (!vivo) return;
      const p = p$.current;
      const k = (cv.clientWidth * (window.devicePixelRatio || 1)) / W;
      if (cv.width !== Math.round(W * k)) {
        cv.width = Math.round(W * k);
        cv.height = Math.round(H * k);
      }
      const g = cv.getContext('2d')!;
      g.setTransform(k, 0, 0, k, 0, 0);
      g.imageSmoothingEnabled = false;
      const xc = (i: number) => 24 + ((i + 0.5) * (W - 48)) / Math.max(1, p.tam);
      // fondo
      g.fillStyle = PAL['0'];
      g.fillRect(0, 0, W, H);
      if (p.jefe) {
        g.fillStyle = PAL['1'];
        for (let y = 0; y < 100; y += 8) for (let x = (y / 8) % 2 ? 0 : 8; x < W; x += 16) g.fillRect(x, y, 15, 7);
        g.fillStyle = 'rgba(28,23,18,0.6)';
        g.fillRect(0, 0, W, 100);
        const sac = p.jefe.golpe > t - 400 ? Math.round(Math.sin(t / 20) * 3) : 0;
        pintar(g, 'gloton', W / 2 - 36 + sac, 16 + Math.round(Math.sin(t / 400) * 2), 3, p.jefe.quedan === 0 ? 0.35 : 1);
        for (let i = 0; i < p.jefe.total; i++) pintar(g, i < p.jefe.quedan ? 'corazon' : 'corazonVacio', W / 2 - (p.jefe.total * 18) / 2 + i * 18, 2, 2);
      } else {
        g.fillStyle = PAL['8'];
        g.fillRect(0, 30, W, 70);
        montes(g, 100, 40, PAL.f, 11);
        montes(g, 100, 22, PAL['7'], 3);
      }
      g.fillStyle = PAL['6'];
      g.fillRect(0, 100, W, 3);
      g.fillStyle = PAL['0'];
      g.fillRect(0, 103, W, H - 103);
      // los cubos: una marca por cubo, y una pila de cofres en los que tienen algo
      for (let i = 0; i < p.tam; i++) {
        const x = Math.round(xc(i));
        g.fillStyle = i === p.destino ? PAL['4'] : PAL.f;
        g.fillRect(x, 104, 1, i % 10 === 0 ? 6 : 3);
        const n = p.largos[i] ?? 0;
        for (let k2 = 0; k2 < Math.min(n, 5); k2++) {
          g.fillStyle = k2 === 0 ? PAL['4'] : PAL['3'];
          g.fillRect(x - 1, 98 - k2 * 4, 3, 3);
        }
      }
      texto(g, '0', xc(0), 113, PAL.e, 'center');
      texto(g, String(p.tam - 1), xc(p.tam - 1), 113, PAL.e, 'center');
      // el personaje camina hasta el cubo
      const objetivo = p.destino === null ? 30 : xc(p.destino);
      const dx = objetivo - x$.current;
      const anda = Math.abs(dx) > 1;
      if (anda) x$.current += Math.sign(dx) * Math.min(Math.abs(dx), 3);
      const fr = `${p.quien}-${anda && Math.floor(t / 140) % 2 ? 'heroe2' : 'heroe1'}`;
      pintar(g, fr, x$.current - 12, p.jefe ? 68 : 68, 2);
<<<<<<< HEAD
      if (!p.jefe) texto(g, p.titulo, 8, 8, PAL.d);
=======
      if (!p.jefe) texto(g, `LISTAS: ${p.tam} CUBOS`, 8, 8, PAL.d);
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
      texto(g, p.rotulo, W - 8, 130, PAL['4'], 'right');
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      vivo = false;
    };
  }, []);
  return <canvas ref={ref} className="escena" style={{ aspectRatio: `${W} / ${H}` }} aria-label="Los cubos de la tabla de listas y el personaje" />;
}

// ------------------------------------------------------------------ paneles

<<<<<<< HEAD
function PanelArray({ m, antes, recorrido, error, titulo = '', nombre = 'ARRAY · DIRECCIONAMIENTO ABIERTO' }: { m?: MA; antes?: MA; recorrido: number[]; error?: Fallo; titulo?: string; nombre?: string }) {
  if (!m) return <div className="panel"><div className="panel-tit">{titulo}{nombre}</div><div className="aviso mal">{error?.detalle ?? 'No se puede leer.'}</div></div>;
=======
function PanelArray({ m, antes, recorrido, error, titulo = '' }: { m?: MA; antes?: MA; recorrido: number[]; error?: Fallo; titulo?: string }) {
  if (!m) return <div className="panel"><div className="panel-tit">{titulo}ARRAY</div><div className="aviso mal">{error?.detalle ?? 'No se puede leer.'}</div></div>;
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
  const ocup = m.casillas.filter((c) => c.marca === OCUPADA).length;
  return (
    <div className="panel">
      <div className="panel-tit">
<<<<<<< HEAD
        {titulo}{nombre} <span>tam {m.tam} · n {ocup} · factor {(ocup / m.tam).toFixed(2).replace('.', ',')}</span>
=======
        {titulo}ARRAY · DIRECCIONAMIENTO ABIERTO <span>tam {m.tam} · n {ocup} · factor {(ocup / m.tam).toFixed(2).replace('.', ',')}</span>
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
      </div>
      <div className="casillas">
        {m.casillas.map((c, i) => {
          const a = antes && antes.tam === m.tam ? antes.casillas[i] : undefined;
          const cambia = antes && (antes.tam !== m.tam || !a || a.marca !== c.marca || a.clave !== c.clave || a.valor !== c.valor);
          const paso = recorrido.indexOf(i);
          return (
            <div key={i} className={`casilla ${c.marca === OCUPADA ? 'ocupada' : c.marca === BORRADA ? 'borrada' : 'vacia'} ${cambia ? 'cambia' : ''} ${paso >= 0 ? 'explora' : ''}`}>
              <span className="idx">{i}</span>
              {paso >= 0 && <span className="paso">{paso + 1}</span>}
              {c.marca === OCUPADA ? (
                <>
                  <img src={icono(c.clave)} alt="" />
                  <span className="kv">
                    {c.clave}:{c.valor}
                  </span>
                </>
              ) : c.marca === BORRADA ? (
                <span className="kv">BORRADA</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

<<<<<<< HEAD
function PanelLista({ m, antes, cubo, nuevos, error, titulo = '', nombre = 'LISTAS · ENCADENAMIENTO' }: { m?: ML; antes?: ML; cubo: number | null; nuevos: Set<Clave>; error?: Fallo; titulo?: string; nombre?: string }) {
=======
function PanelLista({ m, antes, cubo, nuevos, error, titulo = '' }: { m?: ML; antes?: ML; cubo: number | null; nuevos: Set<number>; error?: Fallo; titulo?: string }) {
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
  const fila = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fila.current?.scrollIntoView({ block: 'nearest' });
  }, [cubo, m]);
<<<<<<< HEAD
  if (!m) return <div className="panel"><div className="panel-tit">{titulo}{nombre}</div><div className="aviso mal">{error?.detalle ?? 'No se puede leer.'}</div></div>;
=======
  if (!m) return <div className="panel"><div className="panel-tit">{titulo}LISTAS</div><div className="aviso mal">{error?.detalle ?? 'No se puede leer.'}</div></div>;
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
  const n = m.cubos.reduce((s, c) => s + c.length, 0);
  const llenos = m.cubos.map((c, i) => [i, c] as const).filter(([i, c]) => c.length || i === cubo);
  return (
    <div className="panel">
      <div className="panel-tit">
<<<<<<< HEAD
        {titulo}{nombre} <span>tam {m.tam} · n {n} · factor {(n / m.tam).toFixed(2).replace('.', ',')}</span>
=======
        {titulo}LISTAS · ENCADENAMIENTO <span>tam {m.tam} · n {n} · factor {(n / m.tam).toFixed(2).replace('.', ',')}</span>
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
      </div>
      <div className="cubos">
        {llenos.length === 0 && <div className="vacio">Todos los cubos están a NULL.</div>}
        {llenos.map(([i, claves]) => (
          <div key={i} ref={i === cubo ? fila : undefined} className={`cubo ${i === cubo ? 'destino' : ''}`}>
            <span className="idx">[{i}]</span>
            {claves.map((k, p) => {
<<<<<<< HEAD
              const cambia = antes && (antes.valores.get(k) !== m.valores.get(k) || antes.tam !== m.tam || cuboDe(antes, k) !== i || !antes.cubos[i]?.includes(k));
=======
              const cambia = antes && (antes.valores.get(k) !== m.valores.get(k) || antes.tam !== m.tam || hash(k, antes.tam) !== i);
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
              return (
                <span key={p} className="cadena">
                  <span className={`nodo ${cambia ? 'cambia' : ''} ${nuevos.has(k) ? 'nuevo' : ''}`}>
                    <img src={icono(k)} alt="" />
                    {k}:{m.valores.get(k)}
                  </span>
                  <span className="flecha">→</span>
                </span>
              );
            })}
            <span className="null">NULL</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ visor

function Archivera({ quien, titulo, children }: { quien: string; titulo?: string; children: React.ReactNode }) {
  const r = useMemo(() => urlSprite(quien, 4), [quien]);
  return (
    <div className="dialogo">
      <img className="retrato" src={r} alt="" />
      <div>
        <div className="quien">
          {COMPANIA[quien]?.nombre ?? MERLA.nombre}
          {titulo ? ` · ${titulo}` : ''}
        </div>
        <div className="relato">{children}</div>
      </div>
    </div>
  );
}

interface Foto {
  ev: number;
  fase: 'antes' | 'despues';
}


<<<<<<< HEAD
const NOMBRE_HASH: Record<HashL, string> = { CLASE: '', PLEGAMIENTO: 'PLEGAMIENTO', MITAD: 'MITAD DEL CUADRADO', POLINOMICO: 'POLINÓMICO' };
const NOMBRE_SONDA: Record<Sonda, string> = { LIN: 'EXPLORACIÓN LINEAL', CUA: 'EXPLORACIÓN CUADRÁTICA', DOB: 'DOBLE HASHING' };
const nombreLista = (m?: ML) => `LISTAS · ${m && m.hf !== 'CLASE' ? `HASH DE ${NOMBRE_HASH[m.hf]}` : 'ENCADENAMIENTO'}`;
const nombreArray = (m?: MA) => `ARRAY · ${m ? NOMBRE_SONDA[m.sonda] : 'DIRECCIONAMIENTO ABIERTO'}${m && m.hf !== 'CLASE' ? ` · HASH DE ${NOMBRE_HASH[m.hf]}` : ''}`;
const nombreFuncion: Record<HashL, string> = { CLASE: 'hash', PLEGAMIENTO: 'plegamiento', MITAD: 'mitadCuadrado', POLINOMICO: 'polinomico' };

export function Visor({ c, mision, volver }: { c: Correccion; mision: Mision; volver: () => void }) {
  const evs = c.reg.eventos;
  const fotos = useMemo(() => {
    const r: Foto[] = [];
    evs.forEach((e, i) => {
      if (i < c.juicios.length) {
        if (e.orden !== 'CREAR') r.push({ ev: i, fase: 'antes' });
        r.push({ ev: i, fase: 'despues' });
      }
    });
    return r;
=======
export function Visor({ c, mision, volver }: { c: Correccion; mision: Mision; volver: () => void }) {
  const evs = c.reg.eventos;
  const fotos = useMemo(() => {
    const f: Foto[] = [];
    evs.forEach((e, i) => {
      if (i < c.juicios.length) {
        if (e.orden !== 'CREAR') f.push({ ev: i, fase: 'antes' });
        f.push({ ev: i, fase: 'despues' });
      }
    });
    return f;
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
  }, [c]);
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(true);
  const [vel, setVel] = useState(1);
  const [parar, setParar] = useState(true);
  const [golpe, setGolpe] = useState(-1e9);
  const lista = useRef<HTMLOListElement>(null);
  const foto = fotos[Math.min(i, fotos.length - 1)];
  const ev: EventoReg = evs[foto.ev];
  const j = c.juicios[foto.ev];
  const visto = foto.fase === 'despues';

  // el estado de las tablas tal y como las dejó el alumno al final de cada evento
  type Est = { l?: ML; a?: MA; existe: boolean };
<<<<<<< HEAD
  const inicial = useMemo(() => mundoInicial(), []);
  const estado = (k: number, inv: Inv): Est => {
    if (k < 0) return inicial[inv] ? { ...inicial[inv], existe: true } : { existe: false };
=======
  const estado = (k: number, inv: Inv): Est => {
    if (k < 0) return inv === 'H' ? { l: nuevaLista(TAM_LISTA), a: nuevoArray(TAM_ARRAY), existe: true } : { existe: false };
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
    const x = c.juicios[k]?.lec[inv];
    return { l: x?.l?.modelo, a: x?.a?.modelo, existe: !!x };
  };
  const antesH = estado(foto.ev - 1, 'H');
  const antesB = estado(foto.ev - 1, 'B');
  const ahoraH = visto ? estado(foto.ev, 'H') : antesH;
  const ahoraB = visto ? estado(foto.ev, 'B') : antesB;
  const q: Inv = ev.quien;
  const antes = q === 'B' ? antesB : antesH;
  const ahora = q === 'B' ? ahoraB : ahoraH;
<<<<<<< HEAD
  const conClave = ['ACTUALIZAR', 'BUSCAR', 'ELIMINAR', 'COSTE', 'FRENTE'].includes(ev.orden);
  const clave: Clave | null = conClave ? ev.a : ev.orden === 'CAMBIAR' ? (visto ? ev.b : ev.a) : null;
  const tablaL = ahora.l ?? antes.l;
  const tamL = tablaL?.tam ?? TAM_LISTA;
  const hfL: HashL = tablaL?.hf ?? 'CLASE';
  const cubo = clave === null ? null : cuboDe({ tam: tamL, hf: hfL }, clave);
  const arrRec = visto ? ahora.a : antes.a ?? ahora.a;
  const recorrido = clave !== null && arrRec ? recorridoA(arrRec, clave) : [];
  const nuevosNodos = useMemo(() => {
    const s = new Set<Clave>();
=======
  const clave = ev.orden === 'ACTUALIZAR' || ev.orden === 'BUSCAR' || ev.orden === 'ELIMINAR' ? ev.a : ev.orden === 'CAMBIAR' ? (visto ? ev.b : ev.a) : null;
  const tamL = ahora.l?.tam ?? antes.l?.tam ?? TAM_LISTA;
  const cubo = clave === null ? null : hash(clave, tamL);
  const arrRec = visto ? ahora.a : antes.a ?? ahora.a;
  const recorrido = clave !== null && arrRec ? recorridoA(arrRec, clave) : [];
  const nuevosNodos = useMemo(() => {
    const s = new Set<number>();
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
    if (!visto) return s;
    const ids = new Set(ev.mallocs.map((m) => m.id));
    j?.lec[q]?.l?.ids.forEach((id, k) => ids.has(id) && s.add(k));
    return s;
<<<<<<< HEAD
    // eslint-disable-next-line react-hooks/exhaustive-deps
=======
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
  }, [foto, c]);
  const hayBotin = ahoraB.existe || antesB.existe;

  useEffect(() => {
    if (!visto || !j || j.inicial) return;
    if (j.ok) setGolpe(performance.now());
    else if (parar && play) setPlay(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);
  useEffect(() => {
    if (!play) return;
    if (i >= fotos.length - 1) {
      setPlay(false);
      return;
    }
    const t = setTimeout(() => setI((x) => x + 1), (visto ? 1100 : 800) / vel);
    return () => clearTimeout(t);
  }, [play, i, vel, fotos, visto]);
  useEffect(() => {
    lista.current?.querySelector('.actual')?.scrollIntoView({ block: 'nearest' });
  }, [foto.ev]);
  const irEvento = useCallback(
    (k: number) => {
      const p = fotos.findIndex((x) => x.ev === k);
      if (p >= 0) setI(p);
    },
    [fotos],
  );
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setPlay((p) => !p);
      } else if (e.key === 'ArrowRight') setI((x) => Math.min(fotos.length - 1, x + 1));
      else if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [fotos]);

  const bienHasta = c.juicios.slice(0, foto.ev + (visto ? 1 : 0)).filter((x) => x.ok && !x.inicial).length;
  const jefe = mision.jefe ? { total: 10, quedan: 10 - Math.floor((10 * bienHasta) / c.total), golpe } : undefined;
  const faltan = c.total - c.juicios.filter((x) => !x.inicial).length;
<<<<<<< HEAD
  const sonda = arrRec?.sonda ?? 'LIN';
  const rotulo =
    clave === null
      ? ev.orden
      : `${hfL === 'CLASE' ? `hash(${clave}) = ${clave} mod ${tamL}` : `${nombreFuncion[hfL]}(${clave})`} = ${cubo}${sonda === 'DOB' ? ` · h2 = ${hash2(clave)}` : ''}`;
  const devuelven = (ev.rl.length > 0 || ev.ra.length > 0) && [ev.rl.length ? `listas ${fmt(ev.rl, ev.orden)}` : '', ev.ra.length ? `array ${fmt(ev.ra, ev.orden)}` : ''].filter(Boolean).join(' · ');
  const errorDe = (inv: Inv, t: 'L' | 'A') => j?.fallos.find((x) => x.donde === dondeTabla(inv, t))?.f;
  const antesTexto =
    clave === null
      ? `Antes de ${ev.textoOrden}.`
      : `Antes de ${ev.orden.toLowerCase()} la clave ${clave}: en las listas va al cubo ${cubo}; en el array se mira desde la casilla ${recorrido[0] ?? '-'}.`;
=======
  const rotulo = clave === null ? ev.orden : `hash(${clave}) = ${clave} mod ${tamL} = ${cubo}`;
  const autos = visto ? ev.auto : [];
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd

  return (
    <div className="pantalla visor">
      <header className="barra-sup">
        <button className="mini" onClick={volver}>
          ← VOLVER
        </button>
        <div className={`titulo-ev ${mision.jefe ? 'jefe' : ''}`}>{mision.titulo}</div>
        <div className="pts">
          {c.bien}/{c.total} bien · {c.reg.alumno}
        </div>
      </header>
      <div className="visor-arriba">
        <div className="col-izq">
<<<<<<< HEAD
          <Banda tam={tamL} largos={tablaL?.cubos.map((x) => x.length) ?? []} destino={cubo} rotulo={(q === 'B' ? 'BOTÍN · ' : '') + rotulo} titulo={`LISTAS: ${tamL} CUBOS`} quien={mision.quien} jefe={jefe} />
=======
          <Banda tam={tamL} largos={(ahora.l ?? antes.l)?.cubos.map((x) => x.length) ?? []} destino={cubo} rotulo={(q === 'B' ? 'BOTÍN · ' : '') + rotulo} quien={mision.quien} jefe={jefe} />
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
          <div className="controles">
            <button className="mini" onClick={() => irEvento(Math.max(0, foto.ev - 1))} aria-label="Evento anterior">
              ⏮
            </button>
            <button className="mini" onClick={() => setI(Math.max(0, i - 1))} aria-label="Paso anterior">
              ◀
            </button>
            <button className="mini" onClick={() => (i >= fotos.length - 1 ? (setI(0), setPlay(true)) : setPlay(!play))} aria-label={play ? 'Pausa' : 'Reproducir'}>
              {play ? '❚❚' : '▶'}
            </button>
            <button className="mini" onClick={() => setI(Math.min(fotos.length - 1, i + 1))} aria-label="Paso siguiente">
              ▶|
            </button>
            <button className="mini" onClick={() => irEvento(Math.min(evs.length - 1, foto.ev + 1))} aria-label="Evento siguiente">
              ⏭
            </button>
            <button className="mini" onClick={() => setVel([1, 2, 4][([1, 2, 4].indexOf(vel) + 1) % 3])} aria-label="Velocidad">
              ×{vel}
            </button>
            <label className="check">
              <input type="checkbox" checked={parar} onChange={(e) => setParar(e.target.checked)} /> parar en los fallos
            </label>
          </div>
          <Archivera quien={ev.texto.startsWith('Merla') ? 'buho' : mision.quien} titulo={`EVENTO ${ev.n}`}>
            {foto.ev === 0 && <p className="presenta">«{COMPANIA[mision.quien].presentacion}»</p>}
            <p>{ev.texto}</p>
            <p className="orden">
              ▸ <code>{ev.textoOrden}</code>
<<<<<<< HEAD
              {visto && devuelven && <span className="dev"> devuelven: {devuelven}</span>}
=======
              {visto && ev.rl.length > 0 && (
                <span className="dev">
                  {' '}
                  devuelven: listas {fmt(ev.rl, ev.orden)} · array {fmt(ev.ra, ev.orden)}
                </span>
              )}
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
            </p>
          </Archivera>
        </div>
        <div className="col-der">
          {j && visto ? (
            j.inicial ? (
              <div className="aviso neutro">Las dos tablas recién creadas: {TAM_LISTA} cubos a NULL y {TAM_ARRAY} casillas VACIA.</div>
            ) : j.ok ? (
              <div className="aviso bien">
                <b>✓ Bien</b>
                <br />
<<<<<<< HEAD
                Las tablas quedan como tenían que quedar{devuelven ? ' y devuelven lo que toca' : ''}.
=======
                Las dos tablas quedan como tenían que quedar{ev.rl.length ? ' y devuelven lo que toca' : ''}.
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
              </div>
            ) : (
              j.fallos.map((x, k) => (
                <div key={k} className="aviso mal">
                  {x.ej && <span className="ej">EJERCICIO {x.ej}</span>}
                  <b>
                    {x.donde ? `${x.donde}: ` : ''}
                    {x.f.titulo}
                  </b>
                  <br />
                  {x.f.detalle}
                </div>
              ))
            )
          ) : (
<<<<<<< HEAD
            <div className="aviso neutro">{antesTexto}</div>
          )}
=======
            <div className="aviso neutro">
              {clave !== null ? `Antes de ${ev.orden.toLowerCase()} la clave ${clave}: en las listas va al cubo ${cubo}; en el array se mira desde la casilla ${recorrido[0] ?? '-'}.` : `Antes de ${ev.textoOrden}.`}
            </div>
          )}
          {autos.map((x, k) => (
            <div key={k} className="aviso rehash">
              REHASH · {x.tabla === 'L' ? 'las listas' : 'el array'} {x.inv === 'B' ? 'del botín ' : ''}{x.tabla === 'L' ? 'pasan' : 'pasa'} de {x.viejo} a {x.nuevo} {x.tabla === 'L' ? 'cubos' : 'casillas'}
              {ev.orden === 'FUSIONAR' ? ': lo que va a entrar del botín pasaría de 0,8.' : ': el factor de carga ha superado 0,8.'}
            </div>
          ))}
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
          {visto && j && j.fantasmas.length > 0 && (
            <div className="fantasmas">
              <img src={urlSprite('fantasma', 3)} alt="" />
              <div>
<<<<<<< HEAD
                <b>
                  {j.fantasmas.length} bloque{j.fantasmas.length > 1 ? 's' : ''} perdido{j.fantasmas.length > 1 ? 's' : ''}
                </b>
=======
                <b>{j.fantasmas.length} bloque{j.fantasmas.length > 1 ? 's' : ''} perdido{j.fantasmas.length > 1 ? 's' : ''}</b>
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
                {j.fantasmas.slice(0, 3).map((id) => (
                  <div key={id}>{describirBloque(c.reg.bloques.get(id)).replace(/,$/, '')}</div>
                ))}
              </div>
            </div>
          )}
          <div className="ram-tit eventos-tit">EVENTOS</div>
          <ol className="eventos" ref={lista}>
            {evs.slice(0, c.juicios.length).map((e, k) => {
              const jj = c.juicios[k];
              return (
<<<<<<< HEAD
                <li key={k} className={`${k === foto.ev ? 'actual' : ''} ${jj.inicial ? '' : jj.ok ? 'ok' : 'ko'}`} title={jj.fallos.map((x) => (x.ej ? `Ej. ${x.ej}: ` : '') + x.f.titulo).join('\n')}>
=======
                <li key={k} className={`${k === foto.ev ? 'actual' : ''} ${jj.inicial ? '' : jj.ok ? 'ok' : 'ko'}`} title={jj.fallos.map((f) => (f.ej ? `Ej. ${f.ej}: ` : '') + f.f.titulo).join('\n')}>
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
                  <button onClick={() => irEvento(k)}>
                    <span className="marca">{jj.inicial ? '·' : jj.ok ? '✓' : '✗'}</span>
                    <span className="n">{e.n}</span>
                    <code>{e.textoOrden}</code>
                  </button>
                </li>
              );
            })}
            {faltan > 0 && <li className="falta">… y {faltan} eventos a los que el programa no llegó</li>}
          </ol>
          {c.aviso && <div className="aviso mal">{c.aviso}</div>}
        </div>
      </div>
      <div className="tablas">
<<<<<<< HEAD
        <PanelArray m={ahoraH.a} antes={visto ? antesH.a : undefined} recorrido={q === 'H' ? recorrido : []} error={errorDe('H', 'A')} titulo={hayBotin ? 'INVENTARIO · ' : ''} nombre={nombreArray(ahoraH.a ?? antesH.a)} />
        <PanelLista m={ahoraH.l} antes={visto ? antesH.l : undefined} cubo={q === 'H' ? cubo : null} nuevos={q === 'H' ? nuevosNodos : new Set()} error={errorDe('H', 'L')} titulo={hayBotin ? 'INVENTARIO · ' : ''} nombre={nombreLista(ahoraH.l ?? antesH.l)} />
      </div>
      {hayBotin && (
        <div className="tablas botin">
          <PanelArray m={ahoraB.a} antes={visto ? antesB.a : undefined} recorrido={q === 'B' ? recorrido : []} error={errorDe('B', 'A')} titulo="BOTÍN · " nombre={nombreArray(ahoraB.a ?? antesB.a)} />
          <PanelLista m={ahoraB.l} antes={visto ? antesB.l : undefined} cubo={q === 'B' ? cubo : null} nuevos={q === 'B' ? nuevosNodos : new Set()} error={errorDe('B', 'L')} titulo="BOTÍN · " nombre={nombreLista(ahoraB.l ?? antesB.l)} />
=======
        <PanelArray m={ahoraH.a} antes={visto ? antesH.a : undefined} recorrido={q === 'H' ? recorrido : []} error={j?.fallos.find((f) => f.donde === 'Array')?.f} titulo={hayBotin ? 'INVENTARIO · ' : ''} />
        <PanelLista m={ahoraH.l} antes={visto ? antesH.l : undefined} cubo={q === 'H' ? cubo : null} nuevos={q === 'H' ? nuevosNodos : new Set()} error={j?.fallos.find((f) => f.donde === 'Listas')?.f} titulo={hayBotin ? 'INVENTARIO · ' : ''} />
      </div>
      {hayBotin && (
        <div className="tablas botin">
          <PanelArray m={ahoraB.a} antes={visto ? antesB.a : undefined} recorrido={q === 'B' ? recorrido : []} error={j?.fallos.find((f) => f.donde === 'Botín · Array')?.f} titulo="BOTÍN · " />
          <PanelLista m={ahoraB.l} antes={visto ? antesB.l : undefined} cubo={q === 'B' ? cubo : null} nuevos={q === 'B' ? nuevosNodos : new Set()} error={j?.fallos.find((f) => f.donde === 'Botín · Listas')?.f} titulo="BOTÍN · " />
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
        </div>
      )}
    </div>
  );
}

function fmt(x: number[], orden: string) {
<<<<<<< HEAD
  if (!x.length) return '-';
=======
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
  if (orden === 'BUSCAR' || orden === 'ELIMINAR') return x[0] ? `1 (${x[1]})` : '0';
  if (orden === 'ABUNDANTE') return x[0] ? `1 (${x[1]}:${x[2]})` : '0';
  if (orden === 'COLISIONES') return `${x[0]} y ${x[1]}`;
  return String(x[0]);
}
