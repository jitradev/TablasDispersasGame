// Modelo de referencia de las dos tablas de clase (TablaDispersaLista.c y
// TablaDispersaArray.c) con las funciones de los cuatro actos. Sirve para saber
// qué tenía que salir de cada evento.

export const TAM_LISTA = 101; // los #define de los .h
export const TAM_ARRAY = 20;
export const VACIA = 0;
export const OCUPADA = 1;
export const BORRADA = 2;

export const hash = (clave: number, tam: number) => {
  const i = clave % tam;
  return i < 0 ? i + tam : i;
};

export type Clave = number;

/** Las funciones hash del acto 3 (claves positivas), ya con el mod del tamaño. */
export function plegamiento(c: number, tam: number) {
  let s = 0;
  for (; c > 0; c = Math.floor(c / 100)) s += c % 100;
  return s % tam;
}
export const mitadCuadrado = (c: number, tam: number) => Number((BigInt(c) * BigInt(c)) / 100n % 100n) % tam;
export function polinomico(c: number, tam: number) {
  let h = 0;
  for (; c > 0; c = Math.floor(c / 10)) h = (Math.imul(h, 31) + (c % 10)) >>> 0;
  return h % tam;
}
export const hash2 = (clave: number) => 7 - (clave % 7);

/** La función hash de una tabla (en el mismo orden que HASH_CLASE, HASH_PLEGAMIENTO... del .h). */
export type HashL = 'CLASE' | 'PLEGAMIENTO' | 'MITAD' | 'POLINOMICO';
export const FUNCIONES: HashL[] = ['CLASE', 'PLEGAMIENTO', 'MITAD', 'POLINOMICO'];
/** Cómo busca sitio el array (SONDEO_LINEAL, SONDEO_CUADRATICO, SONDEO_DOBLE). */
export type Sonda = 'LIN' | 'CUA' | 'DOB';
export const SONDEOS: Record<string, Sonda> = { LINEAL: 'LIN', CUADRATICO: 'CUA', DOBLE: 'DOB' };

export function hashDe(hf: HashL, c: number, tam: number) {
  if (hf === 'PLEGAMIENTO') return plegamiento(c, tam);
  if (hf === 'MITAD') return mitadCuadrado(c, tam);
  if (hf === 'POLINOMICO') return polinomico(c, tam);
  return hash(c, tam);
}

// ------------------------------------------------------------------ encadenamiento

export interface ML {
  tam: number;
  hf: HashL;
  /** cubos[i] = claves de la lista del cubo i, de la cabeza al final */
  cubos: Clave[][];
  valores: Map<Clave, number>;
}

export const nLista = (t: ML) => t.cubos.reduce((s, c) => s + c.length, 0);
export const copiaL = (t: ML): ML => ({ tam: t.tam, hf: t.hf, cubos: t.cubos.map((c) => [...c]), valores: new Map(t.valores) });
export const nuevaLista = (tam: number, hf: HashL = 'CLASE'): ML => ({ tam, hf, cubos: Array.from({ length: tam }, () => []), valores: new Map() });
/** El cubo de una clave en una tabla de listas. */
export const cuboDe = (t: { tam: number; hf: HashL }, c: Clave) => hashDe(t.hf, c, t.tam);

export function actualizarL(t: ML, c: Clave, e: number): number {
  const cubo = t.cubos[cuboDe(t, c)];
  if (!cubo.includes(c)) cubo.unshift(c);
  t.valores.set(c, e);
  return 1;
}
export function buscarL(t: ML, c: Clave): [number, number] {
  return t.cubos[cuboDe(t, c)].includes(c) ? [1, t.valores.get(c)!] : [0, 0];
}
export function eliminarL(t: ML, c: Clave): [number, number] {
  const cubo = t.cubos[cuboDe(t, c)];
  const k = cubo.indexOf(c);
  if (k < 0) return [0, 0];
  cubo.splice(k, 1);
  const v = t.valores.get(c)!;
  t.valores.delete(c);
  return [1, v];
}

// ------------------------------------------------------------------ direccionamiento abierto

export interface CasillaM {
  marca: number;
  clave: number;
  valor: number;
}
export interface MA {
  tam: number;
  hf: HashL;
  sonda: Sonda;
  casillas: CasillaM[];
}

export const nArray = (t: MA) => t.casillas.filter((c) => c.marca === OCUPADA).length;
export const copiaA = (t: MA): MA => ({ tam: t.tam, hf: t.hf, sonda: t.sonda, casillas: t.casillas.map((c) => ({ ...c })) });
export const nuevoArray = (tam: number, sonda: Sonda = 'LIN', hf: HashL = 'CLASE'): MA => ({ tam, hf, sonda, casillas: Array.from({ length: tam }, () => ({ marca: VACIA, clave: 0, valor: 0 })) });

/** La casilla que se mira en el intento i para la clave c. */
export function casillaDe(t: { tam: number; hf: HashL; sonda: Sonda }, c: number, i: number): number {
  const h = hashDe(t.hf, c, t.tam);
  if (t.sonda === 'CUA') return (h + i * i) % t.tam;
  if (t.sonda === 'DOB') return (h + i * hash2(c)) % t.tam;
  return (h + i) % t.tam;
}

export function posicionA(t: MA, c: number): number {
  for (let p = 0; p < t.tam; p++) {
    const i = casillaDe(t, c, p);
    const s = t.casillas[i];
    if (s.marca === VACIA) return -1;
    if (s.marca === OCUPADA && s.clave === c) return i;
  }
  return -1;
}
/** Casillas que mira la búsqueda de la clave c, hasta donde para. */
export function recorridoA(t: MA, c: number): number[] {
  const r: number[] = [];
  for (let p = 0; p < t.tam; p++) {
    const i = casillaDe(t, c, p);
    r.push(i);
    const s = t.casillas[i];
    if (s.marca === VACIA || (s.marca === OCUPADA && s.clave === c)) break;
  }
  return r;
}
export function insertarA(t: MA, c: number, e: number): number {
  if (nArray(t) >= t.tam) return 0;
  if (posicionA(t, c) >= 0) return 0;
  for (let p = 0; p < t.tam; p++) {
    const i = casillaDe(t, c, p);
    if (t.casillas[i].marca !== OCUPADA) {
      t.casillas[i] = { marca: OCUPADA, clave: c, valor: e };
      return 1;
    }
  }
  return 0;
}
export function actualizarA(t: MA, c: number, e: number): number {
  const i = posicionA(t, c);
  if (i >= 0) {
    t.casillas[i].valor = e;
    return 1;
  }
  return insertarA(t, c, e);
}
export function buscarA(t: MA, c: number): [number, number] {
  const i = posicionA(t, c);
  return i < 0 ? [0, 0] : [1, t.casillas[i].valor];
}
export function eliminarA(t: MA, c: number): [number, number] {
  const i = posicionA(t, c);
  if (i < 0) return [0, 0];
  t.casillas[i].marca = BORRADA;
  return [1, t.casillas[i].valor];
}

// ------------------------------------------------------------------ los cinco ejercicios

/** Ejercicio 1: el elemento más grande; si empatan, la clave más pequeña. */
export function masAbundante(pares: [number, number][]): number[] {
  if (!pares.length) return [0, 0, 0];
  const [k, v] = pares.reduce((m, x) => (x[1] > m[1] || (x[1] === m[1] && x[0] < m[0]) ? x : m));
  return [1, k, v];
}
export const paresL = (t: ML) => [...t.valores.entries()] as [number, number][];
export const paresA = (t: MA) => t.casillas.filter((c) => c.marca === OCUPADA).map((c) => [c.clave, c.valor] as [number, number]);

/** Ejercicio 2. */
export function cuboMasLargo(t: ML): number[] {
  return [Math.max(0, ...t.cubos.map((c) => c.length)), t.cubos.filter((c) => !c.length).length];
}
export function grupoMasLargo(t: MA): number[] {
  let max = 0;
  let seg = 0;
  for (const c of t.casillas) {
    seg = c.marca === VACIA ? 0 : seg + 1;
    max = Math.max(max, seg);
  }
  return [max, t.casillas.filter((c) => c.marca === BORRADA).length];
}

/** Ejercicio 3 (y el 15, con texto). */
export function cambiarL(t: ML, vieja: Clave, nueva: Clave): number {
  const cv = t.cubos[cuboDe(t, vieja)];
  if (!cv.includes(vieja)) return 0;
  if (vieja === nueva) return 1;
  cv.splice(cv.indexOf(vieja), 1);
  const v = t.valores.get(vieja)!;
  t.valores.delete(vieja);
  if (t.valores.has(nueva)) t.valores.set(nueva, t.valores.get(nueva)! + v);
  else {
    t.cubos[cuboDe(t, nueva)].unshift(nueva);
    t.valores.set(nueva, v);
  }
  return 1;
}
export function cambiarA(t: MA, vieja: number, nueva: number): number {
  const i = posicionA(t, vieja);
  if (i < 0) return 0;
  if (vieja === nueva) return 1;
  const v = t.casillas[i].valor;
  t.casillas[i].marca = BORRADA;
  const j = posicionA(t, nueva);
  if (j >= 0) {
    t.casillas[j].valor += v;
    return 1;
  }
  return insertarA(t, nueva, v);
}

/** Ejercicio 4. */
export function eliminarSiMenorL(t: ML, minimo: number): number {
  let q = 0;
  t.cubos = t.cubos.map((cubo) =>
    cubo.filter((k) => {
      if (t.valores.get(k)! < minimo) {
        t.valores.delete(k);
        q++;
        return false;
      }
      return true;
    }),
  );
  return q;
}
export function eliminarSiMenorA(t: MA, minimo: number): number {
  let q = 0;
  for (const s of t.casillas)
    if (s.marca === OCUPADA && s.valor < minimo) {
      s.marca = BORRADA;
      q++;
    }
  return q;
}

/** Ejercicio 5. */
export function fusionarL(d: ML, o: ML): number {
  for (const cubo of o.cubos)
    for (const k of cubo) {
      const v = o.valores.get(k)!;
      if (d.valores.has(k)) d.valores.set(k, d.valores.get(k)! + v);
      else {
        d.cubos[cuboDe(d, k)].unshift(k);
        d.valores.set(k, v);
      }
    }
  o.cubos = o.cubos.map(() => []);
  o.valores = new Map();
  return 1;
}
export function fusionarA(d: MA, o: MA): number {
  let bien = 1;
  for (const s of o.casillas) {
    if (s.marca !== OCUPADA) continue;
    const i = posicionA(d, s.clave);
    if (i >= 0) d.casillas[i].valor += s.valor;
    else if (!insertarA(d, s.clave, s.valor)) bien = 0;
  }
  o.casillas = o.casillas.map(() => ({ marca: VACIA, clave: 0, valor: 0 }));
  return bien;
}

// ------------------------------------------------------------------ acto 2

/** Ejercicio 6: destino igual que origen. */
export function copiarL(d: ML, o: ML): number {
  d.hf = o.hf;
  d.cubos = o.cubos.map((c) => [...c]);
  d.valores = new Map(o.valores);
  return nLista(d);
}
export function copiarA(d: MA, o: MA): number {
  d.hf = o.hf;
  d.sonda = o.sonda;
  d.casillas = o.casillas.map((c) => ({ ...c }));
  return nArray(d);
}
/** Ejercicio 7. */
const iguales = (a: Map<Clave, number>, b: Map<Clave, number>) => (a.size === b.size && [...a].every(([k, v]) => b.get(k) === v) ? 1 : 0);
export const valoresA = (t: MA) => new Map<Clave, number>(t.casillas.filter((c) => c.marca === OCUPADA).map((c) => [c.clave, c.valor]));
export const igualesL = (a: ML, b: ML) => iguales(a.valores, b.valores);
export const igualesA = (a: MA, b: MA) => iguales(valoresA(a), valoresA(b));
/** Ejercicio 8. */
export function interseccionL(d: ML, o: ML): number {
  d.cubos = d.cubos.map((cubo) =>
    cubo.filter((k) => {
      if (!o.valores.has(k)) {
        d.valores.delete(k);
        return false;
      }
      d.valores.set(k, Math.min(d.valores.get(k)!, o.valores.get(k)!));
      return true;
    }),
  );
  return nLista(d);
}
export function interseccionA(d: MA, o: MA): number {
  for (const s of d.casillas) {
    if (s.marca !== OCUPADA) continue;
    const [esta, suyo] = buscarA(o, s.clave);
    if (esta) s.valor = Math.min(s.valor, suyo);
    else s.marca = BORRADA;
  }
  return nArray(d);
}
/** Ejercicio 9. */
export function diferenciaL(d: ML, o: ML): number {
  let q = 0;
  d.cubos = d.cubos.map((cubo) =>
    cubo.filter((k) => {
      const v = d.valores.get(k)! - (o.valores.get(k) ?? 0);
      if (v <= 0) {
        d.valores.delete(k);
        q++;
        return false;
      }
      d.valores.set(k, v);
      return true;
    }),
  );
  return q;
}
export function diferenciaA(d: MA, o: MA): number {
  let q = 0;
  for (const s of d.casillas) {
    if (s.marca !== OCUPADA) continue;
    const [esta, suyo] = buscarA(o, s.clave);
    if (esta) s.valor -= suyo;
    if (s.valor <= 0) {
      s.marca = BORRADA;
      q++;
    }
  }
  return q;
}

// ------------------------------------------------------------------ acto 4

/** Ejercicio 14. */
export function costeL(t: ML, c: Clave): number {
  const cubo = t.cubos[cuboDe(t, c)];
  const k = cubo.indexOf(c);
  return k < 0 ? cubo.length : k + 1;
}
export const costeTotalL = (t: ML) => t.cubos.reduce((s, cubo) => s + (cubo.length * (cubo.length + 1)) / 2, 0);
export const costeA = (t: MA, c: number) => recorridoA(t, c).length;
export const costeTotalA = (t: MA) => t.casillas.reduce((s, x) => s + (x.marca === OCUPADA ? costeA(t, x.clave) : 0), 0);
/** Ejercicio 15. */
export function limpiarA(t: MA): number {
  const borradas = t.casillas.filter((c) => c.marca === BORRADA).length;
  const ocupadas = t.casillas.filter((c) => c.marca === OCUPADA).map((c) => ({ ...c }));
  t.casillas = t.casillas.map(() => ({ marca: VACIA, clave: 0, valor: 0 }));
  for (const c of ocupadas) insertarA(t, c.clave, c.valor);
  return borradas;
}
export function frenteL(t: ML, c: Clave): number {
  const cubo = t.cubos[cuboDe(t, c)];
  const k = cubo.indexOf(c);
  if (k < 0) return 0;
  cubo.splice(k, 1);
  cubo.unshift(c);
  return 1;
}

// ------------------------------------------------------------------ una orden, como los main del proyecto

export type InvT = string;
export interface Par {
  l?: ML;
  a?: MA;
}
export type Mundo = Partial<Record<InvT, Par>>;
export interface Paso {
  rl: number[];
  ra: number[];
  auto: { tabla: 'L' | 'A'; inv: InvT; viejo: number; nuevo: number }[];
}

export const TABLAS = ['H', 'B'];
const copiaPar = (p: Par): Par => ({ l: p.l && copiaL(p.l), a: p.a && copiaA(p.a) });
const copiaMundo = (m: Mundo): Mundo => Object.fromEntries(Object.entries(m).map(([k, p]) => [k, copiaPar(p!)]));
export const parNuevo = (): Par => ({ l: nuevaLista(TAM_LISTA), a: nuevoArray(TAM_ARRAY) });
export const mundoInicial = (): Mundo => ({ H: parNuevo() });
const DOS = ['FUSIONAR', 'COPIAR', 'IGUALES', 'INTERSECCION', 'DIFERENCIA'];

export interface OrdenM {
  orden: string;
  quien: InvT;
  a: number;
  b: number;
  args: string[];
}

/** Aplica una orden sobre copias y dice qué tenía que devolver. */
export function aplicar(ev: OrdenM, base: Mundo): { mundo: Mundo; paso: Paso } {
  const paso: Paso = { rl: [], ra: [], auto: [] };
  if (ev.orden === 'CREAR') return { mundo: mundoInicial(), paso };
  if (ev.orden === 'LIBERAR') return { mundo: {}, paso };
  const m = copiaMundo(base);
  if (!m.H) return { mundo: m, paso };
  if ((ev.quien === 'B' || DOS.includes(ev.orden)) && !m.B) m.B = parNuevo();
  const p = m[ev.quien]!;
  const [hl, ha, bl, ba] = [m.H.l!, m.H.a!, m.B?.l, m.B?.a];
  const l = p.l!;
  const a = p.a!;
  const nombre = ev.args[ev.args.length - 1];
  switch (ev.orden) {
    case 'FUNCION': {
      const hf = nombre as HashL;
      const vacia = nLista(l) === 0;
      if (vacia) l.hf = hf;
      paso.rl = [vacia ? 1 : 0];
      const vaciaA = nArray(a) === 0;
      if (vaciaA) a.hf = hf;
      paso.ra = [vaciaA ? 1 : 0];
      break;
    }
    case 'SONDEO': {
      const vaciaA = nArray(a) === 0;
      if (vaciaA) a.sonda = SONDEOS[nombre];
      paso.ra = [vaciaA ? 1 : 0];
      break;
    }
    case 'ACTUALIZAR':
      paso.rl = [actualizarL(l, ev.a, ev.b)];
      paso.ra = [actualizarA(a, ev.a, ev.b)];
      break;
    case 'BUSCAR':
      paso.rl = buscarL(l, ev.a);
      paso.ra = buscarA(a, ev.a);
      break;
    case 'ELIMINAR':
      paso.rl = eliminarL(l, ev.a);
      paso.ra = eliminarA(a, ev.a);
      break;
    case 'ABUNDANTE':
      paso.rl = masAbundante(paresL(l));
      paso.ra = masAbundante(paresA(a));
      break;
    case 'COLISIONES':
      paso.rl = cuboMasLargo(l);
      paso.ra = grupoMasLargo(a);
      break;
    case 'CAMBIAR':
      paso.rl = [cambiarL(l, ev.a, ev.b)];
      paso.ra = [cambiarA(a, ev.a, ev.b)];
      break;
    case 'AGOTAR':
      paso.rl = [eliminarSiMenorL(l, ev.a)];
      paso.ra = [eliminarSiMenorA(a, ev.a)];
      break;
    case 'FUSIONAR':
      paso.rl = [fusionarL(hl, bl!)];
      paso.ra = [fusionarA(ha, ba!)];
      break;
    case 'COPIAR':
      paso.rl = [copiarL(bl!, hl)];
      paso.ra = [copiarA(ba!, ha)];
      break;
    case 'IGUALES':
      paso.rl = [igualesL(hl, bl!)];
      paso.ra = [igualesA(ha, ba!)];
      break;
    case 'INTERSECCION':
      paso.rl = [interseccionL(hl, bl!)];
      paso.ra = [interseccionA(ha, ba!)];
      break;
    case 'DIFERENCIA':
      paso.rl = [diferenciaL(hl, bl!)];
      paso.ra = [diferenciaA(ha, ba!)];
      break;
    case 'COSTE':
      paso.rl = [costeL(l, ev.a)];
      paso.ra = [costeA(a, ev.a)];
      break;
    case 'COSTETOTAL':
      paso.rl = [costeTotalL(l)];
      paso.ra = [costeTotalA(a)];
      break;
    case 'LIMPIAR':
      paso.ra = [limpiarA(a)];
      break;
    case 'FRENTE':
      paso.rl = [frenteL(l, ev.a)];
      break;
  }
  return { mundo: m, paso };
}
