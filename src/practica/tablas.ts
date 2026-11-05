// Modelo de referencia de las dos tablas de clase (TablaDispersaLista.c y
// TablaDispersaArray.c) con las funciones de la práctica. Sirve para saber
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


// ------------------------------------------------------------------ encadenamiento

export interface ML {
  tam: number;
  /** cubos[i] = claves de la lista del cubo i, de la cabeza al final */
  cubos: number[][];
  valores: Map<number, number>;
}

export const nLista = (t: ML) => t.cubos.reduce((s, c) => s + c.length, 0);
export const copiaL = (t: ML): ML => ({ tam: t.tam, cubos: t.cubos.map((c) => [...c]), valores: new Map(t.valores) });
export const nuevaLista = (tam: number): ML => ({ tam, cubos: Array.from({ length: tam }, () => []), valores: new Map() });

export function actualizarL(t: ML, c: number, e: number): number {
  const cubo = t.cubos[hash(c, t.tam)];
  if (!cubo.includes(c)) cubo.unshift(c);
  t.valores.set(c, e);
  return 1;
}
export function buscarL(t: ML, c: number): [number, number] {
  return t.cubos[hash(c, t.tam)].includes(c) ? [1, t.valores.get(c)!] : [0, 0];
}
export function eliminarL(t: ML, c: number): [number, number] {
  const cubo = t.cubos[hash(c, t.tam)];
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
  casillas: CasillaM[];
}

export const nArray = (t: MA) => t.casillas.filter((c) => c.marca === OCUPADA).length;
export const copiaA = (t: MA): MA => ({ tam: t.tam, casillas: t.casillas.map((c) => ({ ...c })) });
export const nuevoArray = (tam: number): MA => ({ tam, casillas: Array.from({ length: tam }, () => ({ marca: VACIA, clave: 0, valor: 0 })) });

export function posicionA(t: MA, c: number): number {
  let i = hash(c, t.tam);
  for (let p = 0; p < t.tam; p++) {
    const s = t.casillas[i];
    if (s.marca === VACIA) return -1;
    if (s.marca === OCUPADA && s.clave === c) return i;
    i = (i + 1) % t.tam;
  }
  return -1;
}
/** Casillas que mira la exploración lineal para la clave c, hasta donde para. */
export function recorridoA(t: MA, c: number): number[] {
  const r: number[] = [];
  let i = hash(c, t.tam);
  for (let p = 0; p < t.tam; p++) {
    r.push(i);
    const s = t.casillas[i];
    if (s.marca !== OCUPADA || s.clave === c) break;
    i = (i + 1) % t.tam;
  }
  return r;
}
export function insertarA(t: MA, c: number, e: number): number {
  if (nArray(t) >= t.tam) return 0;
  if (posicionA(t, c) >= 0) return 0;
  let i = hash(c, t.tam);
  while (t.casillas[i].marca === OCUPADA) i = (i + 1) % t.tam;
  t.casillas[i] = { marca: OCUPADA, clave: c, valor: e };
  return 1;
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
export const paresL = (t: ML) => [...t.valores.entries()];
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

/** Ejercicio 3. */
export function cambiarL(t: ML, vieja: number, nueva: number): number {
  const cv = t.cubos[hash(vieja, t.tam)];
  if (!cv.includes(vieja)) return 0;
  if (vieja === nueva) return 1;
  cv.splice(cv.indexOf(vieja), 1);
  const v = t.valores.get(vieja)!;
  t.valores.delete(vieja);
  if (t.valores.has(nueva)) t.valores.set(nueva, t.valores.get(nueva)! + v);
  else {
    t.cubos[hash(nueva, t.tam)].unshift(nueva);
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
        d.cubos[hash(k, d.tam)].unshift(k);
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

// ------------------------------------------------------------------ una orden, como main_mision.c

export type InvT = 'H' | 'B';
export interface Par {
  l: ML;
  a: MA;
}
export type Mundo = Partial<Record<InvT, Par>>;
export interface Paso {
  rl: number[];
  ra: number[];
  auto: { tabla: 'L' | 'A'; inv: InvT; viejo: number; nuevo: number }[];
}

const copiaMundo = (m: Mundo): Mundo => Object.fromEntries(Object.entries(m).map(([k, p]) => [k, { l: copiaL(p!.l), a: copiaA(p!.a) }]));
export const parNuevo = (): Par => ({ l: nuevaLista(TAM_LISTA), a: nuevoArray(TAM_ARRAY) });

/** Aplica una orden sobre copias y dice qué tenía que devolver. */
export function aplicar(ev: { orden: string; quien: InvT; a: number; b: number }, base: Mundo): { mundo: Mundo; paso: Paso } {
  const paso: Paso = { rl: [], ra: [], auto: [] };
  if (ev.orden === 'CREAR') return { mundo: { H: parNuevo() }, paso };
  if (ev.orden === 'LIBERAR') return { mundo: {}, paso };
  const m = copiaMundo(base);
  if (!m.H) return { mundo: m, paso };
  if ((ev.quien === 'B' || ev.orden === 'FUSIONAR') && !m.B) m.B = parNuevo();
  const p = m[ev.quien]!;
  switch (ev.orden) {
    case 'ACTUALIZAR':
      paso.rl = [actualizarL(p.l, ev.a, ev.b)];
      paso.ra = [actualizarA(p.a, ev.a, ev.b)];
      break;
    case 'BUSCAR':
      paso.rl = buscarL(p.l, ev.a);
      paso.ra = buscarA(p.a, ev.a);
      break;
    case 'ELIMINAR':
      paso.rl = eliminarL(p.l, ev.a);
      paso.ra = eliminarA(p.a, ev.a);
      break;
    case 'ABUNDANTE':
      paso.rl = masAbundante(paresL(p.l));
      paso.ra = masAbundante(paresA(p.a));
      break;
    case 'COLISIONES':
      paso.rl = cuboMasLargo(p.l);
      paso.ra = grupoMasLargo(p.a);
      break;
    case 'CAMBIAR':
      paso.rl = [cambiarL(p.l, ev.a, ev.b)];
      paso.ra = [cambiarA(p.a, ev.a, ev.b)];
      break;
    case 'AGOTAR':
      paso.rl = [eliminarSiMenorL(p.l, ev.a)];
      paso.ra = [eliminarSiMenorA(p.a, ev.a)];
      break;
    case 'FUSIONAR':
      paso.rl = [fusionarL(m.H!.l, m.B!.l)];
      paso.ra = [fusionarA(m.H!.a, m.B!.a)];
      break;
  }
  return { mundo: m, paso };
}
