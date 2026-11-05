// Lee el registro que escribe el proyecto base (ver registro.c y los volcados
// de las dos tablas).

export type Ref = { k: 'nulo' } | { k: 'bloque'; id: number } | { k: 'liberado'; id: number } | { k: 'basura' } | { k: 'ajeno' };

export interface NodoReg {
  id: number;
  clave: number;
  valor: number;
  sig: Ref;
}

export interface EstadoLista {
  struct: Ref;
  tam?: number;
  n?: number;
  cubosRef?: Ref;
  /** cubo -> referencia a su primer nodo (solo los cubos no vacíos) */
  cabezas: Map<number, Ref>;
  nodos: Map<number, NodoReg>;
}

export interface Casilla {
  marca: number;
  clave: number;
  valor: number;
}

export interface EstadoArray {
  struct: Ref;
  tam?: number;
  n?: number;
  refs?: [Ref, Ref, Ref];
  /** casilla -> contenido (solo las que no están VACIA) */
  casillas: Map<number, Casilla>;
}

export type Orden = 'CREAR' | 'ACTUALIZAR' | 'BUSCAR' | 'ELIMINAR' | 'ABUNDANTE' | 'COLISIONES' | 'CAMBIAR' | 'AGOTAR' | 'FUSIONAR' | 'LIBERAR';

/** El inventario principal (H) o el botín (B). */
export type Inv = 'H' | 'B';

export interface Bloque {
  id: number;
  bytes: number;
  fich: string;
  linea: number;
}

export interface EventoReg {
  n: number;
  orden: Orden;
  /** A qué inventario va la orden. */
  quien: Inv;
  /** En este evento se ha creado el botín. */
  creaB: boolean;
  a: number;
  b: number;
  textoOrden: string;
  texto: string;
  mallocs: Bloque[];
  frees: { id: number; fich: string; linea: number }[];
  errores: string[];
  rl: number[];
  ra: number[];
  auto: { tabla: 'L' | 'A'; inv: Inv; viejo: number; nuevo: number }[];
  listas: Partial<Record<Inv, EstadoLista>>;
  arrays: Partial<Record<Inv, EstadoArray>>;
  vivos: Map<number, number>;
  /** El programa terminó este evento (si no, se cortó dentro). */
  completo: boolean;
}

export interface Registro {
  fichero: string;
  alumno: string;
  mision: string;
  eventos: EventoReg[];
  /** Todos los malloc que hubo, por número de bloque. */
  bloques: Map<number, Bloque>;
  fin: boolean;
}

export class ErrorRegistro extends Error {}

export function ref(t: string | undefined): Ref {
  if (t === undefined) return { k: 'ajeno' };
  if (t === '0') return { k: 'nulo' };
  if (t === '?') return { k: 'basura' };
  if (t === '!') return { k: 'ajeno' };
  if (t.startsWith('L')) return { k: 'liberado', id: Number(t.slice(1)) };
  const n = Number(t);
  return Number.isInteger(n) && n > 0 ? { k: 'bloque', id: n } : { k: 'ajeno' };
}

export function leerRegistro(texto: string, fichero = 'registro.txt'): Registro {
  const lineas = texto.replace(/^﻿/, '').split(/\r?\n/);
  if (!lineas[0]?.startsWith('COFRES ')) throw new ErrorRegistro(`«${fichero}» no es un registro de la práctica: tiene que empezar por «COFRES». Sube los ficheros de la carpeta registros/.`);
  if (lineas[0].trim() !== 'COFRES 4') throw new ErrorRegistro(`«${fichero}» es de otra versión del proyecto base. Descarga el proyecto de esta web y vuelve a ejecutar las misiones.`);
  const reg: Registro = { fichero, alumno: '', mision: '', eventos: [], bloques: new Map(), fin: false };
  let ev: EventoReg | undefined;
  let pendientes: Bloque[] = [];
  const cerrar = () => {
    if (ev) ev.completo = true;
  };
  for (const l of lineas.slice(1)) {
    if (!l) continue;
    const esp = l.indexOf(' ');
    const tipo = esp < 0 ? l : l.slice(0, esp);
    const resto = esp < 0 ? '' : l.slice(esp + 1);
    const p = resto.split(' ');
    switch (tipo) {
      case 'ALUMNO':
        reg.alumno = resto.trim();
        break;
      case 'MISION':
        reg.mision = resto.trim();
        break;
      case 'EV': {
        cerrar();
        const barra = resto.indexOf(' | ');
        const izq = (barra < 0 ? resto : resto.slice(0, barra)).split(' ');
        const enB = izq[2] === 'B';
        const args = izq.slice(enB ? 3 : 2);
        ev = {
          n: Number(izq[0]),
          orden: izq[1] as Orden,
          quien: enB ? 'B' : 'H',
          creaB: false,
          a: Number(args[0] ?? 0),
          b: Number(args[1] ?? 0),
          textoOrden: izq.slice(1).join(' '),
          texto: barra < 0 ? '' : resto.slice(barra + 3),
          mallocs: pendientes,
          frees: [],
          errores: [],
          rl: [],
          ra: [],
          auto: [],
          listas: {},
          arrays: {},
          vivos: new Map(),
          completo: false,
        };
        pendientes = [];
        reg.eventos.push(ev);
        break;
      }
      case 'M': {
        const b = { id: Number(p[0]), bytes: Number(p[1]), fich: p[2], linea: Number(p[3]) };
        reg.bloques.set(b.id, b);
        if (ev) ev.mallocs.push(b);
        else pendientes.push(b);
        break;
      }
      case 'F':
        ev?.frees.push({ id: Number(p[0]), fich: p[1], linea: Number(p[2]) });
        break;
      case 'E':
        ev?.errores.push(resto);
        break;
      case 'RL':
        ev?.rl.push(...p.map(Number));
        break;
      case 'RA':
        ev?.ra.push(...p.map(Number));
        break;
      case 'CREAR':
        if (ev) ev.creaB = true;
        break;
      case 'AUTO':
        ev?.auto.push({ tabla: p[0] as 'L' | 'A', inv: p[1] as Inv, viejo: Number(p[2]), nuevo: Number(p[3]) });
        break;
      case 'TL':
        if (ev) ev.listas[p[0] as Inv] = { struct: ref(p[1]), tam: p[2] ? Number(p[2]) : undefined, n: p[3] ? Number(p[3]) : undefined, cubosRef: p[4] ? ref(p[4]) : undefined, cabezas: new Map(), nodos: new Map() };
        break;
      case 'CL':
        ev?.listas[p[0] as Inv]?.cabezas.set(Number(p[1]), ref(p[2]));
        break;
      case 'NL': {
        const t = ev?.listas[p[0] as Inv];
        const r = ref(p[1]);
        if (t && r.k === 'bloque') t.nodos.set(r.id, { id: r.id, clave: Number(p[2]), valor: Number(p[3]), sig: ref(p[4]) });
        break;
      }
      case 'TA':
        if (ev)
          ev.arrays[p[0] as Inv] = {
            struct: ref(p[1]),
            tam: p[2] ? Number(p[2]) : undefined,
            n: p[3] ? Number(p[3]) : undefined,
            refs: p[4] ? [ref(p[4]), ref(p[5]), ref(p[6])] : undefined,
            casillas: new Map(),
          };
        break;
      case 'CA':
        ev?.arrays[p[0] as Inv]?.casillas.set(Number(p[1]), { marca: Number(p[2]), clave: Number(p[3]), valor: Number(p[4]) });
        break;
      case 'V':
        ev?.vivos.set(Number(p[0]), Number(p[1]));
        break;
      case 'FIN':
        cerrar();
        reg.fin = true;
        break;
    }
  }
  if (!reg.mision) throw new ErrorRegistro(`«${fichero}» no dice de qué misión es: ¿está cortado?`);
  return reg;
}
