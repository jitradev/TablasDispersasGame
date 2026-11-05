// El visor de un registro: la banda con el personaje que camina hasta hash(clave),
// el array con su exploración lineal y la tabla de listas con sus cubos, evento a
// evento, con la corrección al lado.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Ico } from '../juego/Icono';
import { PAL, pintar, sprite, urlSprite } from '../juego/sprites';
import { iconoDe } from '../juego/mision1';
import { Correccion, describirBloque, dondeTabla, Fallo } from './corregir';
import { BORRADA, Clave, cuboDe, hash2, HashL, MA, ML, mundoInicial, OCUPADA, recorridoA, Sonda, TAM_ARRAY, TAM_LISTA } from './tablas';
import { Mision } from './misiones';
import { COMPANIA, JEFES, MERLA } from './personajes';
import { sonar } from '../juego/sonido';
import { BotonSonido } from '../juego/BotonSonido';
import { EventoReg, Inv } from './registro';

const FUENTE = '"Press Start 2P", monospace';
const W = 560;
const H = 150;

// ------------------------------------------------------------------ iconos

const iconos = new Map<string, string>();
const icono = (clave: Clave) => {
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
  titulo: string;
  quien: string;
  jefe?: { total: number; quedan: number; golpe: number; sprite: string };
  /** Cuándo acabó el último evento y si salió bien: chispas doradas o rojas. */
  efecto?: { t: number; ok: boolean };
}

interface Particula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
  color: string;
}

function Banda(props: PropsBanda) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p$ = useRef(props);
  p$.current = props;
  const x$ = useRef(30);
  const llego$ = useRef(0);
  const efecto$ = useRef(0);
  const parts$ = useRef<Particula[]>([]);
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
        const sj = sprite(p.jefe.sprite);
        const ej = 3;
        const yj = Math.max(14, 86 - sj.height * ej);
        pintar(g, p.jefe.sprite, W / 2 - (sj.width * ej) / 2 + sac, yj + Math.round(Math.sin(t / 400) * 2), ej, p.jefe.quedan === 0 ? 0.35 : 1);
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
      if (p.destino !== null) {
        const pulso = 2 + Math.round((Math.sin(t / 150) + 1) * 1.5);
        g.fillStyle = PAL['4'];
        g.fillRect(Math.round(xc(p.destino)) - pulso, 104, pulso * 2 + 1, 2);
      }
      texto(g, '0', xc(0), 113, PAL.e, 'center');
      texto(g, String(p.tam - 1), xc(p.tam - 1), 113, PAL.e, 'center');
      // el personaje camina hasta el cubo
      const objetivo = p.destino === null ? 30 : xc(p.destino);
      const dx = objetivo - x$.current;
      const anda = Math.abs(dx) > 1;
      if (!anda) x$.current = objetivo;
      if (anda) {
        // rápido cuando está lejos y suave al final: llega en unos 300 ms
        x$.current += Math.sign(dx) * Math.min(Math.abs(dx), Math.max(3, Math.abs(dx) * 0.16));
        llego$.current = t;
        // polvo de los pies
        if (Math.random() < 0.35) parts$.current.push({ x: x$.current, y: 99, vx: -Math.sign(dx) * Math.random(), vy: -Math.random() * 0.6, vida: 22, color: PAL.f });
      }
      // un saltito al llegar
      const tras = t - llego$.current;
      const salto = !anda && tras < 320 ? Math.round(Math.sin((tras / 320) * Math.PI) * 6) : 0;
      // al acabar un evento, chispas: doradas si sale bien, rojas si no
      if (p.efecto && p.efecto.t !== efecto$.current) {
        efecto$.current = p.efecto.t;
        const ok = p.efecto.ok;
        for (let k = 0; k < (ok ? 18 : 12); k++) {
          const ang = (Math.PI * 2 * k) / (ok ? 18 : 12) + Math.random() * 0.3;
          parts$.current.push({
            x: x$.current,
            y: 78,
            vx: Math.cos(ang) * (1 + Math.random() * 1.5),
            vy: Math.sin(ang) * (1 + Math.random() * 1.5) - (ok ? 1.2 : 0),
            vida: ok ? 40 : 30,
            color: ok ? (k % 2 ? PAL['4'] : PAL['5']) : k % 2 ? '#ff4d4d' : PAL['2'],
          });
        }
      }
      const temblor = p.efecto && !p.efecto.ok && t - p.efecto.t < 350 ? Math.round(Math.sin(t / 25) * 2) : 0;
      const fr = `${p.quien}-${anda && Math.floor(t / 140) % 2 ? 'heroe2' : 'heroe1'}`;
      pintar(g, fr, x$.current - 12 + temblor, 68 - salto, 2);
      for (const q of parts$.current) {
        q.x += q.vx;
        q.y += q.vy;
        q.vy += 0.06;
        q.vida--;
        g.fillStyle = q.color;
        g.globalAlpha = Math.max(0, Math.min(1, q.vida / 20));
        g.fillRect(Math.round(q.x), Math.round(q.y), 2, 2);
      }
      g.globalAlpha = 1;
      parts$.current = parts$.current.filter((q) => q.vida > 0);
      if (!p.jefe) texto(g, p.titulo, 8, 8, PAL.d);
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

function PanelArray({ m, antes, recorrido, error, titulo = '', nombre = 'ARRAY · DIRECCIONAMIENTO ABIERTO' }: { m?: MA; antes?: MA; recorrido: number[]; error?: Fallo; titulo?: string; nombre?: string }) {
  if (!m) return <div className="panel"><div className="panel-tit">{titulo}{nombre}</div><div className={`aviso ${error?.titulo === '' ? 'libre' : 'mal'}`}>{error?.detalle ?? 'No se puede leer.'}</div></div>;
  const ocup = m.casillas.filter((c) => c.marca === OCUPADA).length;
  return (
    <div className="panel">
      <div className="panel-tit">
        {titulo}{nombre} <span>tam {m.tam} · n {ocup} · factor {(ocup / m.tam).toFixed(2).replace('.', ',')}</span>
      </div>
      <div className="casillas">
        {m.casillas.map((c, i) => {
          const a = antes && antes.tam === m.tam ? antes.casillas[i] : undefined;
          const cambia = antes && (antes.tam !== m.tam || !a || a.marca !== c.marca || a.clave !== c.clave || a.valor !== c.valor);
          const paso = recorrido.indexOf(i);
          return (
            <div
              key={`${i}-${c.marca}-${c.clave}-${c.valor}`}
              className={`casilla ${c.marca === OCUPADA ? 'ocupada' : c.marca === BORRADA ? 'borrada' : 'vacia'} ${cambia ? 'cambia' : ''} ${paso >= 0 ? 'explora' : ''}`}
              style={paso >= 0 ? { animationDelay: `${paso * 140}ms` } : undefined}
            >
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

function PanelLista({ m, antes, cubo, nuevos, error, titulo = '', nombre = 'LISTAS · ENCADENAMIENTO' }: { m?: ML; antes?: ML; cubo: number | null; nuevos: Set<Clave>; error?: Fallo; titulo?: string; nombre?: string }) {
  const fila = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fila.current?.scrollIntoView({ block: 'nearest' });
  }, [cubo, m]);
  if (!m) return <div className="panel"><div className="panel-tit">{titulo}{nombre}</div><div className={`aviso ${error?.titulo === '' ? 'libre' : 'mal'}`}>{error?.detalle ?? 'No se puede leer.'}</div></div>;
  const n = m.cubos.reduce((s, c) => s + c.length, 0);
  const llenos = m.cubos.map((c, i) => [i, c] as const).filter(([i, c]) => c.length || i === cubo);
  return (
    <div className="panel">
      <div className="panel-tit">
        {titulo}{nombre} <span>tam {m.tam} · n {n} · factor {(n / m.tam).toFixed(2).replace('.', ',')}</span>
      </div>
      <div className="cubos">
        {llenos.length === 0 && <div className="vacio">Todos los cubos están a NULL.</div>}
        {llenos.map(([i, claves]) => (
          <div key={i} ref={i === cubo ? fila : undefined} className={`cubo ${i === cubo ? 'destino' : ''}`}>
            <span className="idx">[{i}]</span>
            {claves.map((k) => {
              const cambia = antes && (antes.valores.get(k) !== m.valores.get(k) || antes.tam !== m.tam || cuboDe(antes, k) !== i || !antes.cubos[i]?.includes(k));
              return (
                <span key={`${k}-${m.valores.get(k)}-${i}`} className="cadena">
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

/** Quién cuenta el evento: Merla, el jefe del acto (si el texto empieza por su nombre) o el acompañante. */
const NOMBRE_CORTO: Record<number, string[]> = { 1: ['El Cofre', 'El cofre'], 2: ['Grumak'], 3: ['Vorhal'], 4: ['Ascuaferro'] };
function hablante(texto: string, quien: string, acto: number): string {
  if (texto.startsWith('Merla')) return MERLA.id;
  if ((NOMBRE_CORTO[acto] ?? []).some((n) => texto.startsWith(n))) return JEFES[acto].id;
  return quien;
}

export function Archivera({ quien, titulo, children }: { quien: string; titulo?: string; children: React.ReactNode }) {
  const r = useMemo(() => urlSprite(quien, quien in COMPANIA || quien === MERLA.id ? 4 : 2), [quien]);
  const jefe = Object.values(JEFES).find((x) => x.id === quien);
  return (
    <div className="dialogo">
      <img className="retrato" src={r} alt="" />
      <div>
        <div className="quien">
          {COMPANIA[quien]?.nombre ?? jefe?.nombre ?? MERLA.nombre}
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


const NOMBRE_HASH: Record<HashL, string> = { CLASE: '', PLEGAMIENTO: 'PLEGAMIENTO', MITAD: 'MITAD DEL CUADRADO', POLINOMICO: 'POLINÓMICO' };
const NOMBRE_SONDA: Record<Sonda, string> = { LIN: 'EXPLORACIÓN LINEAL', CUA: 'EXPLORACIÓN CUADRÁTICA', DOB: 'DOBLE HASHING' };
const nombreLista = (m?: ML) => `LISTAS · ${m && m.hf !== 'CLASE' ? `HASH DE ${NOMBRE_HASH[m.hf]}` : 'ENCADENAMIENTO'}`;
const nombreArray = (m?: MA) => `ARRAY · ${m ? NOMBRE_SONDA[m.sonda] : 'DIRECCIONAMIENTO ABIERTO'}${m && m.hf !== 'CLASE' ? ` · HASH DE ${NOMBRE_HASH[m.hf]}` : ''}`;
const nombreFuncion: Record<HashL, string> = { CLASE: 'hash', PLEGAMIENTO: 'plegamiento', MITAD: 'mitadCuadrado', POLINOMICO: 'polinomico' };

export function Visor({
  c,
  mision,
  volver,
  estreno = false,
  alTerminar,
  resubir,
  errores = [],
  siguiente,
}: {
  c: Correccion;
  mision: Mision;
  volver: () => void;
  /** La primera vez que se ve un registro: la nota y los ✓/✗ se descubren al avanzar. */
  estreno?: boolean;
  alTerminar?: () => void;
  resubir?: (fs: FileList | File[]) => void;
  errores?: string[];
  /** La misión que va después, para el botón del final. */
  siguiente?: { titulo: string; ir: () => void };
}) {
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
  }, [c]);
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(true);
  const [vel, setVel] = useState(1);
  const [parar, setParar] = useState(true);
  // la ventana que salta al pararse en un fallo o al terminar la misión
  const [popup, setPopup] = useState<null | 'fallo' | 'fin'>(null);
  const [golpe, setGolpe] = useState(-1e9);
  const lista = useRef<HTMLOListElement>(null);
  const foto = fotos[Math.min(i, fotos.length - 1)];
  const ev: EventoReg = evs[foto.ev];
  const j = c.juicios[foto.ev];
  const visto = foto.fase === 'despues';
  // hasta qué evento se ha visto ya el resultado; en el estreno se va descubriendo
  const ultimo = c.juicios.length - 1;
  const [alcanzado, setAlcanzado] = useState(estreno ? -1 : Infinity);
  const hasta = visto ? foto.ev : foto.ev - 1;
  if (hasta > alcanzado) setAlcanzado(hasta);
  const terminado = alcanzado >= ultimo;
  const revelado = (k: number) => k <= alcanzado;
  const avisado = useRef(false);
  useEffect(() => {
    if (terminado && estreno && !avisado.current) {
      avisado.current = true;
      alTerminar?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminado]);
  const subirInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!popup) return;
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setPopup(null);
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [popup]);
  // la trompa: empieza la misión (solo la primera vez que se ve este registro)
  useEffect(() => {
    if (estreno) sonar('inicio');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // el estado de las tablas tal y como las dejó el alumno al final de cada evento
  type Est = { l?: ML; a?: MA; existe: boolean };
  const inicial = useMemo(() => mundoInicial(), []);
  const estado = (k: number, inv: Inv): Est => {
    if (k < 0) return inicial[inv] ? { ...inicial[inv], existe: true } : { existe: false };
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
    if (!visto) return s;
    const ids = new Set(ev.mallocs.map((m) => m.id));
    j?.lec[q]?.l?.ids.forEach((id, k) => ids.has(id) && s.add(k));
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foto, c]);
  const hayBotin = ahoraB.existe || antesB.existe;

  const [efecto, setEfecto] = useState<{ t: number; ok: boolean } | undefined>();
  useEffect(() => {
    if (!visto) {
      if (i > 0 && ev.orden !== 'CREAR') sonar('paso');
      return;
    }
    if (!j || j.inicial) return;
    setEfecto({ t: performance.now(), ok: j.ok });
    if (j.ok) {
      setGolpe(performance.now());
      sonar(mision.jefe ? 'golpe' : 'bien');
    } else {
      sonar(j.fallos.some((f) => f.f.titulo.includes('fantasma')) ? 'fantasma' : 'fallo');
      if (parar && play) {
        setPlay(false);
        setPopup('fallo');
      }
    }
    if (i === fotos.length - 1) setTimeout(() => setPopup('fin'), 650);
    if (i === fotos.length - 1 && c.bien === c.total && c.conocida) setTimeout(() => sonar('victoria'), 450);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);
  useEffect(() => {
    if (mision.jefe) sonar('jefe');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  const jefe = mision.jefe ? { total: 10, quedan: 10 - Math.floor((10 * bienHasta) / c.total), golpe, sprite: JEFES[mision.acto].id } : undefined;
  const habla = hablante(ev.texto, mision.quien, mision.acto);
  const botonSiguiente = (
            <div className="siguiente-mision">
              {siguiente ? (
                <button
                  className="grande"
                  onClick={() => {
                    sonar('sube');
                    siguiente.ir();
                  }}
                >
                  SIGUIENTE MISIÓN
                  <Ico n="evento" detras />
                  <small>{siguiente.titulo}</small>
                </button>
              ) : (
                <button className="grande" onClick={volver}>
                  <Ico n="volver" />
                  VOLVER A LOS ACTOS
                </button>
              )}
            </div>
  );
  const faltan = c.total - c.juicios.filter((x) => !x.inicial).length;
  const sonda = arrRec?.sonda ?? 'LIN';
  const rotulo =
    clave === null
      ? ev.orden
      : `${hfL === 'CLASE' ? `hash(${clave}) = ${clave} mod ${tamL}` : `${nombreFuncion[hfL]}(${clave})`} = ${cubo}${sonda === 'DOB' ? ` · h2 = ${hash2(clave)}` : ''}`;
  const devuelven = (ev.rl.length > 0 || ev.ra.length > 0) && [ev.rl.length ? `listas ${fmt(ev.rl, ev.orden)}` : '', ev.ra.length ? `array ${fmt(ev.ra, ev.orden)}` : ''].filter(Boolean).join(' · ');
  const liberada = visto && ev.orden === 'LIBERAR' && j?.ok;
  const errorDe = (inv: Inv, t: 'L' | 'A') =>
    liberada ? { titulo: '', detalle: 'Liberada: toda su memoria ha vuelto al sistema, sin fantasmas.' } : j?.fallos.find((x) => x.donde === dondeTabla(inv, t))?.f;
  const antesTexto =
    clave === null
      ? `Antes de ${ev.textoOrden}.`
      : `Antes de ${ev.orden.toLowerCase()} la clave ${clave}: en las listas va al cubo ${cubo}; en el array se mira desde la casilla ${recorrido[0] ?? '-'}.`;

  return (
    <div className="pantalla visor">
      <header className="barra-sup">
        <button className="mini" onClick={volver}>
          <Ico n="volver" />
          VOLVER
        </button>
        <div className={`titulo-ev ${mision.jefe ? 'jefe' : ''}`}>{mision.titulo}</div>
        <div className="pts">
          {terminado ? `${c.bien}/${c.total} bien` : `evento ${foto.ev} de ${ultimo}`}
        </div>
        {resubir && (
          <>
            <input
              ref={subirInput}
              type="file"
              accept=".txt,text/plain"
              hidden
              onChange={(e) => {
                if (e.target.files) resubir(e.target.files);
                e.target.value = '';
              }}
            />
            <button className="mini" onClick={() => subirInput.current?.click()} title="Subir otra versión del registro de esta misión">
              <Ico n="subir" />
              OTRO REGISTRO
            </button>
          </>
        )}
        <BotonSonido />
      </header>
      {errores.map((e, k) => (
        <div key={k} className="aviso mal">
          {e}
        </div>
      ))}
      <div className="visor-arriba">
        <div className="col-izq">
          <Banda tam={tamL} largos={tablaL?.cubos.map((x) => x.length) ?? []} destino={cubo} rotulo={(q === 'B' ? 'BOTÍN · ' : '') + rotulo} titulo={`LISTAS: ${tamL} CUBOS`} quien={mision.quien} jefe={jefe} efecto={efecto} />
          <div className="controles">
            <button className="mini icono" onClick={() => irEvento(Math.max(0, foto.ev - 1))} aria-label="Evento anterior" title="Evento anterior">
              <img src={urlSprite('ic-evento-atras', 2)} alt="" />
            </button>
            <button className="mini icono" onClick={() => setI(Math.max(0, i - 1))} aria-label="Paso anterior" title="Paso anterior">
              <img src={urlSprite('ic-paso-atras', 2)} alt="" />
            </button>
            <button className="mini icono principal" onClick={() => (i >= fotos.length - 1 ? (setI(0), setPlay(true)) : setPlay(!play))} aria-label={play ? 'Pausa' : 'Reproducir'} title={play ? 'Pausa' : 'Reproducir'}>
              <img src={urlSprite(play ? 'ic-pausa' : 'ic-play', 2)} alt="" />
            </button>
            <button className="mini icono" onClick={() => setI(Math.min(fotos.length - 1, i + 1))} aria-label="Paso siguiente" title="Paso siguiente">
              <img src={urlSprite('ic-paso', 2)} alt="" />
            </button>
            <button className="mini icono" onClick={() => irEvento(Math.min(evs.length - 1, foto.ev + 1))} aria-label="Evento siguiente" title="Evento siguiente">
              <img src={urlSprite('ic-evento', 2)} alt="" />
            </button>
            <button className="mini icono vel" onClick={() => setVel([1, 2, 4][([1, 2, 4].indexOf(vel) + 1) % 3])} aria-label="Velocidad" title="Velocidad">
              ×{vel}
            </button>
            <label className="check">
              <input type="checkbox" checked={parar} onChange={(e) => setParar(e.target.checked)} /> parar en los fallos
            </label>
          </div>
          <Archivera quien={habla} titulo={`EVENTO ${ev.n}`}>
            {foto.ev === 0 && <p className="presenta">«{COMPANIA[mision.quien].presentacion}»</p>}
            {foto.ev === 0 && mision.jefe && <p className="presenta amenaza">{JEFES[mision.acto].nombre}. {JEFES[mision.acto].amenaza}</p>}
            <p>{ev.texto}</p>
            <p className="orden">
              ▸ <code>{ev.textoOrden}</code>
              {visto && devuelven && <span className="dev"> devuelven: {devuelven}</span>}
            </p>
          </Archivera>
        </div>
        <div className="col-der">
          <div className="estado">
          {terminado && visto && i === fotos.length - 1 ? (
            <div className={`estado-corto ${c.bien === c.total && c.conocida ? 'bien' : 'fin'}`}>
              <div className="ec-cab">{c.bien === c.total && c.conocida ? (mision.jefe ? '¡JEFE VENCIDO!' : '¡MISIÓN SUPERADA!') : 'MISIÓN TERMINADA'}</div>
              <div className="ec-est">{[0, 1, 2].map((k) => (k < (c.conocida ? c.estrellas : 0) ? '★' : '☆')).join(' ')}</div>
              <div>
                {c.bien} de {c.total} eventos bien
              </div>
              <button className="grande" onClick={() => setPopup('fin')}>
                VER EL RESULTADO
              </button>
            </div>
          ) : j && visto ? (
            j.inicial ? (
              <div className="estado-corto neutro">Las dos tablas recién creadas: {TAM_LISTA} cubos a NULL y {TAM_ARRAY} casillas VACIA.</div>
            ) : j.ok ? (
              <div key={`bien-${i}`} className="estado-corto bien">
                <div className="ec-cab">✓ BIEN</div>
                <div>Las tablas quedan como tenían que quedar{devuelven ? ' y devuelven lo que toca' : ''}.</div>
              </div>
            ) : (
              <div key={`mal-${i}`} className="estado-corto mal">
                <div className="ec-cab">✗ FALLO EN EL EVENTO {ev.n}</div>
                <div>
                  {[...new Set(j.fallos.map((x) => x.ej).filter(Boolean))].map((e) => `Ejercicio ${e} · `)}
                  {j.fallos.length} fallo{j.fallos.length > 1 ? 's' : ''}
                  {j.fantasmas.length > 0 ? ` · ${j.fantasmas.length} bloque${j.fantasmas.length > 1 ? 's' : ''} perdido${j.fantasmas.length > 1 ? 's' : ''}` : ''}
                </div>
                <button className="grande" onClick={() => setPopup('fallo')}>
                  VER EL FALLO
                </button>
              </div>
            )
          ) : (
            <div className="estado-corto neutro">{antesTexto}</div>
          )}
          </div>
          <div className="ram-tit eventos-tit">EVENTOS</div>
          <ol className="eventos" ref={lista}>
            {evs.slice(0, c.juicios.length).map((e, k) => {
              const jj = c.juicios[k];
              const ve = revelado(k);
              return (
                <li key={k} className={`${k === foto.ev ? 'actual' : ''} ${jj.inicial || !ve ? '' : jj.ok ? 'ok' : 'ko'} ${!terminado && k > alcanzado + 1 ? 'oculto' : ''}`} title={ve ? jj.fallos.map((x) => (x.ej ? `Ej. ${x.ej}: ` : '') + x.f.titulo).join('\n') : ''}>
                  <button onClick={() => irEvento(k)} disabled={!terminado && k > alcanzado + 1}>
                    <span className="marca">{jj.inicial || !ve ? '·' : jj.ok ? '✓' : '✗'}</span>
                    <span className="n">{e.n}</span>
                    <code>{e.textoOrden}</code>
                  </button>
                </li>
              );
            })}
            {terminado && faltan > 0 && <li className="falta">… y {faltan} eventos a los que el programa no llegó</li>}
          </ol>
          {terminado && c.aviso && <div className="aviso mal">{c.aviso}</div>}
        </div>
      </div>
      {popup && (
        <div className="ventana-fondo" onClick={() => setPopup(null)}>
          <div className={`ventana aviso-pop ${popup}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="mini cerrar" onClick={() => setPopup(null)} aria-label="Cerrar">
              <Ico n="cerrar" />
            </button>
            {popup === 'fin' ? (
              <>
          {terminado && visto && i === fotos.length - 1 && !(c.bien === c.total && c.conocida) && (
                  <div className="resultado">
                    <div className="res-tit">{c.reg.fin ? 'MISIÓN TERMINADA' : 'EL PROGRAMA SE CORTÓ'}</div>
                    <div className="res-est">{[0, 1, 2].map((k) => (k < (c.conocida ? c.estrellas : 0) ? '★' : '☆')).join(' ')}</div>
                    <div>
                      {c.bien} de {c.total} eventos bien. Los ✗ de la lista te dicen qué ejercicio revisar; arréglalo, vuelve a ejecutar <code>{mision.target}</code> y sube el registro otra vez.
                    </div>
                  </div>
                )}
                {visto && i === fotos.length - 1 && c.bien === c.total && c.conocida && (
                  <div className="victoria">
                    <span>★</span> {mision.jefe ? '¡JEFE VENCIDO!' : '¡MISIÓN SUPERADA!'} <span>★</span>
                    {mision.jefe && <small className="derrota">{JEFES[mision.acto].derrota}</small>}
                  </div>
                )}
                {terminado && botonSiguiente}
                {c.aviso && <div className="aviso mal">{c.aviso}</div>}
              </>
            ) : (
              <>
                <div className="pop-tit">FALLO EN EL EVENTO {ev.n}</div>
                <div className="pop-orden">
                  <code>{ev.textoOrden}</code>
                </div>
                {j?.fallos.map((x, k) => (
                  <div key={k} className="aviso mal">
                    {x.ej && <span className="ej">EJERCICIO {x.ej}</span>}
                    <b>
                      {x.donde ? `${x.donde}: ` : ''}
                      {x.f.titulo}
                    </b>
                    <br />
                    {x.f.detalle}
                  </div>
                ))}
              </>
            )}
            {j && j.fantasmas.length > 0 && (
              <div className="fantasmas">
                <img src={urlSprite('fantasma', 3)} alt="" />
                <div>
                  <b>
                    {j.fantasmas.length} bloque{j.fantasmas.length > 1 ? 's' : ''} perdido{j.fantasmas.length > 1 ? 's' : ''}
                  </b>
                  {j.fantasmas.slice(0, 3).map((id) => (
                    <div key={id}>{describirBloque(c.reg.bloques.get(id)).replace(/,$/, '')}</div>
                  ))}
                </div>
              </div>
            )}
            <button className="grande pop-seguir" onClick={() => setPopup(null)}>
              {popup === 'fin' ? 'VER LA MISIÓN' : 'SEGUIR'}
            </button>
          </div>
        </div>
      )}
      <div className="tablas">
        <PanelArray m={ahoraH.a} antes={visto ? antesH.a : undefined} recorrido={q === 'H' ? recorrido : []} error={errorDe('H', 'A')} titulo={hayBotin ? 'INVENTARIO · ' : ''} nombre={nombreArray(ahoraH.a ?? antesH.a)} />
        <PanelLista m={ahoraH.l} antes={visto ? antesH.l : undefined} cubo={q === 'H' ? cubo : null} nuevos={q === 'H' ? nuevosNodos : new Set()} error={errorDe('H', 'L')} titulo={hayBotin ? 'INVENTARIO · ' : ''} nombre={nombreLista(ahoraH.l ?? antesH.l)} />
      </div>
      {hayBotin && (
        <div className="tablas botin">
          <PanelArray m={ahoraB.a} antes={visto ? antesB.a : undefined} recorrido={q === 'B' ? recorrido : []} error={errorDe('B', 'A')} titulo="BOTÍN · " nombre={nombreArray(ahoraB.a ?? antesB.a)} />
          <PanelLista m={ahoraB.l} antes={visto ? antesB.l : undefined} cubo={q === 'B' ? cubo : null} nuevos={q === 'B' ? nuevosNodos : new Set()} error={errorDe('B', 'L')} titulo="BOTÍN · " nombre={nombreLista(ahoraB.l ?? antesB.l)} />
        </div>
      )}
    </div>
  );
}

function fmt(x: number[], orden: string) {
  if (!x.length) return '-';
  if (orden === 'BUSCAR' || orden === 'ELIMINAR') return x[0] ? `1 (${x[1]})` : '0';
  if (orden === 'ABUNDANTE') return x[0] ? `1 (${x[1]}:${x[2]})` : '0';
  if (orden === 'COLISIONES') return `${x[0]} y ${x[1]}`;
  return String(x[0]);
}
