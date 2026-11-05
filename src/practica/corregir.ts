// Corrige un registro evento a evento, en todas las tablas de la misión.
//
// Lo esperado de cada evento se calcula aplicando la orden a como dejó las tablas
// el propio alumno en el evento anterior (si se pueden leer), para que un fallo no
// arrastre a todos los que vienen detrás.

import { Bloque, EstadoArray, EstadoLista, EventoReg, Inv, Ref, Registro } from './registro';
import { misionDe } from './misiones';
import { aplicar, BORRADA, casillaDe, Clave, cuboDe, HashL, MA, ML, Mundo, nArray, nLista, OCUPADA, Paso, Sonda, TABLAS, VACIA, valoresA } from './tablas';

export interface Fallo {
  titulo: string;
  detalle: string;
}

export interface LecturaL {
  modelo?: ML;
  /** clave -> bloque del nodo */
  ids: Map<Clave, number>;
  alcanzados: Set<number>;
  fallo?: Fallo;
  /** Lo que ya venía mal (para no volver a contarlo en cada evento). */
  repetidas: Set<Clave>;
  mal: Set<Clave>;
  nDif: number;
}
export interface LecturaA {
  modelo?: MA;
  fallo?: Fallo;
  repetidas: Set<Clave>;
  mal: Set<Clave>;
  nDif: number;
}

/** La función hash de C de cada nombre, para las pistas. */
const FN_HASH: Record<HashL, string> = { CLASE: 'la de clase', PLEGAMIENTO: 'hashPlegamiento', MITAD: 'hashMitadCuadrado', POLINOMICO: 'hashPolinomico' };
/** El ejercicio al que pertenece cada función hash y cada sondeo. */
const EJ_HASH: Record<HashL, number | undefined> = { CLASE: undefined, PLEGAMIENTO: 10, MITAD: 11, POLINOMICO: 12 };
const ejDeLista = (m: ML) => EJ_HASH[m.hf];
const ejDeArray = (m: MA) => (m.sonda !== 'LIN' ? 13 : EJ_HASH[m.hf]);

// ------------------------------------------------------------------ leer lo que dejó el alumno

export function leerLista(e: EstadoLista | undefined, hf: HashL = 'CLASE'): LecturaL {
  const r: LecturaL = { ids: new Map(), alcanzados: new Set(), repetidas: new Set(), mal: new Set(), nDif: 0 };
  if (!e || e.struct.k !== 'bloque') return { ...r, fallo: { titulo: 'No está la tabla de listas', detalle: 'El puntero a la tabla de listas no apunta a un bloque vivo.' } };
  if (e.tam === undefined || e.tam < 1) return { ...r, fallo: { titulo: 'tam no vale', detalle: `El tamaño de la tabla de listas vale ${e.tam}.` } };
  if (e.cubosRef?.k !== 'bloque') return { ...r, fallo: { titulo: 'El array de cubos no está', detalle: 'La tabla de listas no se puede leer.' } };
  const m: ML = { tam: e.tam, hf, cubos: Array.from({ length: e.tam }, () => []), valores: new Map() };
  for (const [i, cabeza] of e.cabezas) {
    let cur: Ref = cabeza;
    const vistos = new Set<number>();
    while (cur.k !== 'nulo') {
      if (cur.k !== 'bloque') {
        const que = { liberado: 'un nodo que ya se ha liberado', basura: 'un puntero sin inicializar (basura)', ajeno: 'algo que no salió de malloc' }[cur.k];
        return { ...r, fallo: { titulo: 'Una cadena está rota', detalle: `La lista del cubo ${i} llega a ${que}.${cur.k === 'liberado' ? ' ¿Has liberado un nodo y lo has dejado enganchado?' : cur.k === 'basura' ? ' ¿Te has dejado sin poner el sig de un nodo nuevo?' : ''}` } };
      }
      if (vistos.has(cur.id)) return { ...r, fallo: { titulo: 'Una cadena da vueltas', detalle: `La lista del cubo ${i} vuelve a un nodo que ya ha visitado y no llega nunca a NULL. Pasa al reenganchar un nodo sin haber guardado antes su sig.` } };
      if (r.alcanzados.has(cur.id)) return { ...r, fallo: { titulo: 'Un nodo en dos cubos', detalle: `Hay un nodo al que se llega desde dos cubos distintos (uno es el ${i}).` } };
      vistos.add(cur.id);
      r.alcanzados.add(cur.id);
      const nodo = e.nodos.get(cur.id);
      if (!nodo) return { ...r, fallo: { titulo: 'Una cadena está rota', detalle: `La lista del cubo ${i} llega a un bloque que no es un nodo.` } };
      m.cubos[i]?.push(nodo.clave);
      if (r.ids.has(nodo.clave)) r.repetidas.add(nodo.clave);
      else {
        r.ids.set(nodo.clave, nodo.id);
        m.valores.set(nodo.clave, nodo.valor);
      }
      if (cuboDe(m, nodo.clave) !== i) r.mal.add(nodo.clave);
      cur = nodo.sig;
    }
  }
  r.nDif = (e.n ?? 0) - m.cubos.reduce((s, c) => s + c.length, 0);
  return { ...r, modelo: m };
}

/** La primera casilla VACIA que corta la búsqueda de la clave de la casilla p, o -1 si se llega bien. */
function corteA(m: MA, clave: number, p: number): number {
  for (let k = 0; k < m.tam; k++) {
    const i = casillaDe(m, clave, k);
    if (i === p) return -1;
    if (m.casillas[i].marca === VACIA) return i;
  }
  return -2; // su secuencia no pasa nunca por p
}

export function leerArray(e: EstadoArray | undefined, sonda: Sonda = 'LIN', hf: HashL = 'CLASE'): LecturaA {
  const r: LecturaA = { repetidas: new Set(), mal: new Set(), nDif: 0 };
  if (!e || e.struct.k !== 'bloque') return { ...r, fallo: { titulo: 'No está la tabla del array', detalle: 'El puntero a la tabla del array no apunta a un bloque vivo.' } };
  if (e.tam === undefined || e.tam < 1) return { ...r, fallo: { titulo: 'tam no vale', detalle: `El tamaño del array vale ${e.tam}.` } };
  const m: MA = { tam: e.tam, hf, sonda, casillas: Array.from({ length: e.tam }, () => ({ marca: VACIA, clave: 0, valor: 0 })) };
  const vistas = new Set<number>();
  for (const [i, c] of e.casillas) {
    if (c.marca !== OCUPADA && c.marca !== BORRADA)
      return { ...r, fallo: { titulo: 'Una marca que no vale', detalle: `La casilla ${i} tiene la marca ${c.marca}, que no es VACIA, OCUPADA ni BORRADA.` } };
    if (c.marca === OCUPADA) {
      if (vistas.has(c.clave)) r.repetidas.add(c.clave);
      vistas.add(c.clave);
    }
    m.casillas[i] = { ...c };
  }
  for (let p = 0; p < m.tam; p++) {
    const s = m.casillas[p];
    if (s.marca === OCUPADA && corteA(m, s.clave, p) !== -1) r.mal.add(s.clave);
  }
  r.nDif = (e.n ?? 0) - nArray(m);
  return { ...r, modelo: m };
}

// ------------------------------------------------------------------ juicio de un evento

/** Un fallo y dónde: en qué tabla y de qué ejercicio. */
export interface FalloEn {
  donde: string;
  ej?: number;
  f: Fallo;
}

export interface Lecturas {
  l?: LecturaL;
  a?: LecturaA;
}

export interface Juicio {
  ok: boolean;
  /** El programa se paró dentro de este evento. */
  cortado?: boolean;
  /** No cuenta para la nota (el evento 0, crear las tablas). */
  inicial?: boolean;
  fallos: FalloEn[];
  esperado: Mundo;
  paso: Paso;
  lec: Partial<Record<Inv, Lecturas>>;
  fantasmas: number[];
  fantasmasNuevos: number[];
}

function diferencias(leido: Map<Clave, number>, quiero: Map<Clave, number>): string {
  const faltan = [...quiero.keys()].filter((k) => !leido.has(k));
  const sobran = [...leido.keys()].filter((k) => !quiero.has(k));
  const cambia = [...quiero.keys()].filter((k) => leido.has(k) && leido.get(k) !== quiero.get(k));
  const t: string[] = [];
  if (faltan.length) t.push(`falta${faltan.length > 1 ? 'n' : ''} ${faltan.slice(0, 4).join(', ')}${faltan.length > 4 ? '…' : ''}`);
  if (sobran.length) t.push(`sobra${sobran.length > 1 ? 'n' : ''} ${sobran.slice(0, 4).join(', ')}${sobran.length > 4 ? '…' : ''}`);
  for (const k of cambia.slice(0, 3)) t.push(`${k} vale ${leido.get(k)} y tenía que valer ${quiero.get(k)}`);
  return t.join('; ');
}

/** La función del alumno que hace cada orden, en cada tabla. */
const FN: Record<string, string[]> = {
  ACTUALIZAR: ['actualizarHashLista', 'actualizarHashArray'],
  BUSCAR: ['buscarHashLista', 'buscarHashArray'],
  ELIMINAR: ['eliminarElementoHashLista', 'eliminarElementoHashArray'],
  ABUNDANTE: ['masAbundanteHashLista', 'masAbundanteHashArray'],
  COLISIONES: ['cuboMasLargoHashLista', 'grupoMasLargoHashArray'],
  CAMBIAR: ['cambiarClaveHashLista', 'cambiarClaveHashArray'],
  AGOTAR: ['eliminarSiMenorHashLista', 'eliminarSiMenorHashArray'],
  FUSIONAR: ['fusionarHashLista', 'fusionarHashArray'],
  COPIAR: ['copiarHashLista', 'copiarHashArray'],
  IGUALES: ['igualesHashLista', 'igualesHashArray'],
  INTERSECCION: ['interseccionHashLista', 'interseccionHashArray'],
  DIFERENCIA: ['diferenciaHashLista', 'diferenciaHashArray'],
  FUNCION: ['usarHashLista', 'usarHashArray'],
  SONDEO: ['', 'usarSondeoArray'],
  COSTE: ['costeBuscarHashLista', 'costeBuscarHashArray'],
  COSTETOTAL: ['costeTotalHashLista', 'costeTotalHashArray'],
  LIMPIAR: ['', 'limpiarBorradasHashArray'],
  FRENTE: ['alFrenteHashLista', ''],
};
/** De qué ejercicio es cada orden (las que solo colocan claves dependen de la función hash y el sondeo de la tabla). */
const EJ: Record<string, number> = { ABUNDANTE: 1, COLISIONES: 2, CAMBIAR: 3, AGOTAR: 4, FUSIONAR: 5, COPIAR: 6, IGUALES: 7, INTERSECCION: 8, DIFERENCIA: 9, COSTE: 14, COSTETOTAL: 14, LIMPIAR: 15, FRENTE: 15 };
export const ejDe = (orden: string) => EJ[orden];

function resultado(orden: string, got: number[], quiero: number[], fn: string): Fallo | undefined {
  const cuantos = (orden === 'ABUNDANTE' || orden === 'BUSCAR' || orden === 'ELIMINAR') && quiero[0] === 0 ? 1 : quiero.length;
  if (got.length >= cuantos && quiero.slice(0, cuantos).every((q, i) => got[i] === q)) return;
  const txt = (x: number[]) => {
    switch (orden) {
      case 'BUSCAR':
      case 'ELIMINAR':
        return x[0] ? `1 con el elemento ${x[1]}` : '0';
      case 'ABUNDANTE':
        return x[0] ? `1 con la clave ${x[1]} y el elemento ${x[2]}` : '0';
      case 'COLISIONES':
        return `${x[0]} y ${x[1]}`;
      default:
        return String(x[0]);
    }
  };
  const pista: Record<string, string> = {
    ABUNDANTE: ' Si hay empate, gana la clave más pequeña; con la tabla vacía, 0.',
    COLISIONES: fn.includes('Lista') ? ' Devuelve la lista más larga y deja en *vacios los cubos a NULL.' : ' Devuelve el grupo más largo de casillas seguidas que no están VACIA (las BORRADA cuentan) y deja en *borradas cuántas BORRADA hay.',
    CAMBIAR: ' Devuelve 0 solo si la clave vieja no está.',
    RENOMBRAR: ' Devuelve 0 solo si el nombre viejo no está.',
    AGOTAR: ' Tiene que devolver cuántos ha quitado.',
    COPIAR: ' Devuelve cuántos elementos ha copiado.',
    IGUALES: ' 1 si tienen las mismas claves con los mismos elementos, aunque estén en otro orden o en otras casillas.',
    INTERSECCION: ' Devuelve cuántos elementos quedan en destino.',
    DIFERENCIA: ' Devuelve cuántos se han quitado de destino.',
    COSTE: fn.includes('Lista') ? ' En las listas se cuentan los nodos de su cubo hasta el de la clave (incluido), o todos si no está.' : ' En el array se cuentan las casillas que se miran, incluida la de la clave o la primera VACIA, y como mucho TAM.',
    COSTETOTAL: ' Es la suma del coste de buscar cada clave que hay en la tabla.',
    LIMPIAR: ' Devuelve cuántas BORRADA había.',
    FRENTE: ' Devuelve 1 si la clave está (aunque ya fuera la primera) y 0 si no.',
  };
  return { titulo: 'No devuelve lo que toca', detalle: `${fn} ha devuelto ${txt(got)} y tenía que devolver ${txt(quiero)}.${pista[orden] ?? ''}` };
}

/** La orden cambia la clave de un nodo: CAMBIAR en el acto 1, RENOMBRAR en el 4. */
const cambioDeClave = (ev: EventoReg): [Clave, Clave] | undefined => (ev.orden === 'CAMBIAR' ? [ev.a, ev.b] : undefined);

function juzgarLista(ev: EventoReg, inv: Inv, e: EstadoLista | undefined, quiero: ML, lecAntes: LecturaL | undefined, lecOrigen?: LecturaL): [Fallo | undefined, LecturaL] {
  const lec = leerLista(e, quiero.hf);
  if (lec.fallo || !lec.modelo) return [lec.fallo, lec];
  const m = lec.modelo;
  const tabla = 'la tabla de listas';
  const rep = [...lec.repetidas].find((k) => !lecAntes?.repetidas.has(k));
  if (rep !== undefined)
    return [{ titulo: 'Clave repetida', detalle: `La clave ${rep} está dos veces en ${tabla}.${ev.orden === 'FUSIONAR' ? ' Al fusionar, si la clave ya está en destino, se suma a su nodo: no se engancha otro.' : ev.orden === 'RENOMBRAR' || ev.orden === 'CAMBIAR' ? ' Si la clave nueva ya estaba, se suma a su nodo y el viejo se libera.' : ''}` }, lec];
  for (let i = 0; i < m.tam; i++)
    for (const c of m.cubos[i])
      if (cuboDe(m, c) !== i && !lecAntes?.mal.has(c)) {
        const hf = quiero.hf !== 'CLASE' ? `${FN_HASH[quiero.hf]}HashLista` : '';
        return [
          {
            titulo: 'Un objeto en el cubo equivocado',
            detalle: `La clave ${c} está en el cubo ${i}, y le toca el ${cuboDe(m, c)}.${hf ? ` La tabla usa ${hf}: con ${c} tiene que dar ${cuboDe(m, c)}.` : ''}${ev.orden === 'CAMBIAR' ? ' Al cambiar la clave, el nodo se engancha en el cubo de la clave NUEVA.' : ''}${ev.orden === 'FUSIONAR' ? ' Al fusionar, cada nodo va al cubo que le da la función hash del DESTINO.' : ''}`,
          },
          lec,
        ];
      }
  if (lec.nDif !== 0 && lec.nDif !== (lecAntes?.nDif ?? 0)) return [{ titulo: 'n no cuadra', detalle: `El campo n vale ${e?.n} y en ${tabla} hay ${nLista(m)} nodos.` }, lec];
  const dif = diferencias(m.valores, quiero.valores);
  if (dif) {
    if (ev.orden === 'FUSIONAR' && inv === 'B') return [{ titulo: 'El origen no queda vacío', detalle: `Después de fusionar, el botín tiene que quedar sin nodos (cubos a NULL y n = 0): ${dif}.` }, lec];
    if (inv === 'B' && ['IGUALES', 'INTERSECCION', 'DIFERENCIA'].includes(ev.orden)) return [{ titulo: 'Has cambiado el otro', detalle: `${ev.orden.toLowerCase()} no cambia la segunda tabla, solo la mira: ${dif}.` }, lec];
    const pista: Record<string, string> = {
      AGOTAR: ' ¿Se te escapa un nodo cuando hay dos seguidos que quitar, o el primero del cubo?',
      COPIAR: ' La copia tiene que quedar con lo mismo que el original, y sin lo que tuviera antes.',
      INTERSECCION: ' Se queda lo que está en los dos, con el menor de los dos elementos; lo demás se quita.',
      DIFERENCIA: ' A cada clave que esté en los dos se le resta lo del otro; si queda en 0 o menos, se quita.',
    };
    return [{ titulo: 'Las listas no cuadran', detalle: `Comparada con lo que tenía que quedar: ${dif}.${pista[ev.orden] ?? ''}` }, lec];
  }
  if (lecAntes?.modelo) {
    if (ev.orden === 'ACTUALIZAR' && lecAntes.ids.has(ev.a) && lecAntes.ids.get(ev.a) !== lec.ids.get(ev.a)) return [{ titulo: 'Has cambiado el nodo', detalle: `La clave ${ev.a} ya estaba: actualizar tiene que cambiar el valor de su nodo, sin crear otro.` }, lec];
    const cc = cambioDeClave(ev);
    if (cc && inv !== 'B') {
      const [vieja, nueva] = cc;
      if (vieja !== nueva && lecAntes.ids.has(vieja) && !lecAntes.ids.has(nueva) && lec.ids.get(nueva) !== lecAntes.ids.get(vieja))
        return [{ titulo: 'Nodo nuevo al cambiar la clave', detalle: `La clave ${nueva} está en un nodo nuevo. Se mueve el MISMO nodo de ${vieja}: se desengancha, cambia su clave y se engancha en su cubo nuevo, sin malloc ni free.` }, lec];
    }
  }
  if (ev.orden === 'FRENTE' && inv === ev.quien && quiero.valores.has(ev.a)) {
    const i = cuboDe(m, ev.a);
    if (m.cubos[i][0] !== ev.a) return [{ titulo: 'No está delante', detalle: `La clave ${ev.a} tenía que quedar la primera de su cubo (el ${i}), y la primera es ${m.cubos[i][0]}.` }, lec];
    if (lecAntes?.ids.has(ev.a) && lecAntes.ids.get(ev.a) !== lec.ids.get(ev.a)) return [{ titulo: 'Nodo nuevo al ponerla delante', detalle: `La clave ${ev.a} está en un nodo nuevo. Se mueve el MISMO nodo: se desengancha y se engancha al principio del cubo, sin malloc ni free.` }, lec];
  }
  if (ev.orden === 'FUSIONAR' && inv === 'H' && lecOrigen?.modelo) {
    const copiada = [...lecOrigen.ids].find(([k, id]) => !lecAntes?.ids.has(k) && lec.ids.has(k) && lec.ids.get(k) !== id);
    if (copiada) return [{ titulo: 'Nodos nuevos en la fusión', detalle: `La clave ${copiada[0]} ha llegado al inventario en un nodo nuevo. Al fusionar se mueven los nodos del botín, sin malloc: el mismo nodo pasa a su cubo de destino.` }, lec];
  }
  return [undefined, lec];
}

function juzgarArray(ev: EventoReg, inv: Inv, e: EstadoArray | undefined, quiero: MA, lecAntes: LecturaA | undefined): [Fallo | undefined, LecturaA] {
  const lec = leerArray(e, quiero.sonda, quiero.hf);
  if (lec.fallo || !lec.modelo) return [lec.fallo, lec];
  const m = lec.modelo;
  const rep = [...lec.repetidas].find((k) => !lecAntes?.repetidas.has(k));
  if (rep !== undefined) return [{ titulo: 'Clave repetida', detalle: `La clave ${rep} está dos veces en el array.${ev.orden === 'FUSIONAR' ? ' Al fusionar, si la clave ya está en destino, se suma a su casilla.' : ''}` }, lec];
  for (let p = 0; p < m.tam; p++) {
    const s = m.casillas[p];
    if (s.marca !== OCUPADA || !lec.mal.has(s.clave) || lecAntes?.mal.has(s.clave)) continue;
    const corte = corteA(m, s.clave, p);
    const sec = Array.from({ length: Math.min(m.tam, 7) }, (_, k) => casillaDe(m, s.clave, k)).join(', ');
    const revisa = quiero.sonda !== 'LIN' ? ` Revisa casillaHashArray${quiero.sonda === 'DOB' ? ' y hash2HashArray' : ''}.` : quiero.hf !== 'CLASE' ? ` La tabla usa ${FN_HASH[quiero.hf]}HashArray: revísala.` : '';
    if (corte === -2)
      return [{ titulo: 'Una clave fuera de su secuencia', detalle: `La clave ${s.clave} está en la casilla ${p}, pero su secuencia de búsqueda (${sec}…) no pasa nunca por ahí: buscándola no se encontraría.${revisa}` }, lec];
    return [
      {
        titulo: 'Una clave que no se encontraría',
        detalle: `La clave ${s.clave} está en la casilla ${p}, pero buscándola (${sec}…) se llega antes a la casilla ${corte}, que está VACIA, y la búsqueda para ahí.${['AGOTAR', 'CAMBIAR', 'INTERSECCION', 'DIFERENCIA'].includes(ev.orden) ? ' Al quitar se marca BORRADA, no VACIA: una VACIA corta la exploración.' : revisa}`,
      },
      lec,
    ];
  }
  if (lec.nDif !== 0 && lec.nDif !== (lecAntes?.nDif ?? 0)) return [{ titulo: 'n no cuadra', detalle: `El campo n vale ${e?.n} y hay ${nArray(m)} casillas OCUPADA.${ev.orden === 'LIMPIAR' ? ' Al limpiar, n se pone a 0 antes de volver a insertar.' : ''}` }, lec];
  const dif = diferencias(valoresA(m), valoresA(quiero));
  if (dif) {
    if (ev.orden === 'FUSIONAR' && inv === 'B') return [{ titulo: 'El origen no queda vacío', detalle: `Después de fusionar, el botín tiene que quedar con todas sus casillas VACIA y n = 0: ${dif}.` }, lec];
    if (inv === 'B' && ['IGUALES', 'INTERSECCION', 'DIFERENCIA'].includes(ev.orden)) return [{ titulo: 'Has cambiado el otro', detalle: `${ev.orden.toLowerCase()} no cambia la segunda tabla, solo la mira: ${dif}.` }, lec];
    return [{ titulo: 'El array no cuadra', detalle: `Comparado con lo que tenía que quedar: ${dif}.${ev.orden === 'ACTUALIZAR' && quiero.sonda !== 'LIN' ? ' Con la cuadrática o el doble, una clave puede no caber aunque queden casillas libres: depende de por dónde pase su secuencia. Revisa casillaHashArray.' : ''}` }, lec];
  }
  if (ev.orden === 'ACTUALIZAR' && lecAntes?.modelo) {
    const p0 = lecAntes.modelo.casillas.findIndex((s) => s.marca === OCUPADA && s.clave === ev.a);
    if (p0 >= 0 && m.casillas.findIndex((s) => s.marca === OCUPADA && s.clave === ev.a) !== p0) return [{ titulo: 'Has movido la clave', detalle: `La clave ${ev.a} ya estaba en la casilla ${p0}: actualizar cambia su valor ahí mismo.` }, lec];
  }
  // Al actualizar y al limpiar, cada clave tiene que estar en la primera casilla libre de su secuencia
  if (ev.orden === 'ACTUALIZAR' || ev.orden === 'LIMPIAR') {
    const p = m.casillas.findIndex((s, i) => s.marca === OCUPADA && quiero.casillas[i].marca !== OCUPADA);
    if (p >= 0) {
      const c = m.casillas[p].clave;
      const q = quiero.casillas.findIndex((s) => s.marca === OCUPADA && s.clave === c);
      if (q >= 0)
        return [{ titulo: 'Una clave en otra casilla', detalle: `La clave ${c} está en la casilla ${p} y le tocaba la ${q}: la primera de su secuencia (${Array.from({ length: 6 }, (_, k) => casillaDe(quiero, c, k)).join(', ')}…) que no estaba OCUPADA.${ev.orden === 'LIMPIAR' ? ' Al limpiar, se reinsertan en el orden de las casillas, de la 0 a la última, con todo VACIA.' : quiero.sonda !== 'LIN' ? ' Revisa casillaHashArray.' : quiero.hf !== 'CLASE' ? ` La tabla usa ${FN_HASH[quiero.hf]}HashArray: revísala.` : ''}` }, lec];
    }
  }
  if (ev.orden === 'LIMPIAR') {
    const NOM = ['VACIA', 'OCUPADA', 'BORRADA'];
    const p = m.casillas.findIndex((s, i) => s.marca !== quiero.casillas[i].marca);
    if (p >= 0)
      return [
        {
          titulo: ev.orden === 'LIMPIAR' && m.casillas[p].marca === BORRADA ? 'Quedan BORRADA' : 'Una casilla con otra marca',
          detalle: `La casilla ${p} está ${NOM[m.casillas[p].marca]} y tenía que quedar ${NOM[quiero.casillas[p].marca]}.${ev.orden === 'LIMPIAR' ? ' Al limpiar, TODAS las casillas pasan a VACIA antes de volver a insertar.' : ''}`,
        },
        lec,
      ];
  }
  return [undefined, lec];
}

function bloquesUsados(ev: EventoReg, lec: Partial<Record<Inv, Lecturas>>): Set<number> {
  const u = new Set<number>();
  const mete = (r: Ref | undefined) => r?.k === 'bloque' && u.add(r.id);
  for (const inv of TABLAS) {
    const l = ev.listas[inv];
    const a = ev.arrays[inv];
    mete(l?.struct);
    mete(l?.cubosRef);
    lec[inv]?.l?.alcanzados.forEach((id) => u.add(id));
    mete(a?.struct);
    a?.refs?.forEach(mete);
  }
  return u;
}

export function describirBloque(b: Bloque | undefined): string {
  if (!b) return 'Un bloque';
  const pista = b.fich.includes('Lista') && b.bytes === 16 ? ' (un nodo)' : '';
  return `Un bloque de ${b.bytes} bytes reservado en ${b.fich}, línea ${b.linea}${pista},`;
}

export interface Correccion {
  reg: Registro;
  conocida: boolean;
  aviso?: string;
  juicios: Juicio[];
  total: number;
  bien: number;
  estrellas: number;
}

/** El nombre de una tabla en los fallos: «Listas», «Botín · Array», «Cuadrática»... */
export function dondeTabla(inv: Inv, tabla: 'L' | 'A'): string {
  return (inv === 'B' ? 'Botín · ' : '') + (tabla === 'L' ? 'Listas' : 'Array');
}

export function corregir(reg: Registro): Correccion {
  const mision = misionDe(reg.mision);
  const ordenes = reg.eventos.filter((e) => e.orden !== 'CREAR').map((e) => e.textoOrden);
  let conocida = !!mision;
  let aviso: string | undefined;
  if (!mision) aviso = `La misión «${reg.mision}» no es ninguna de las de la práctica: se anima y se corrige, pero no cuenta.`;
  else if (ordenes.some((o, i) => o !== mision.ordenes[i]) || (reg.fin && ordenes.length !== mision.ordenes.length)) {
    conocida = false;
    aviso = 'Los eventos de este registro no son los del fichero original de la misión (¿se ha cambiado algo en eventos/?): se anima y se corrige, pero no cuenta.';
  }

  const juicios: Juicio[] = [];
  let base: Mundo = {};
  let lecAntes: Partial<Record<Inv, Lecturas>> = {};
  let prevFan = new Set<number>();

  for (const ev of reg.eventos) {
    const { mundo: quiero, paso } = aplicar(ev, base);
    const j: Juicio = { ok: false, fallos: [], esperado: quiero, paso, lec: {}, fantasmas: [], fantasmasNuevos: [], inicial: ev.orden === 'CREAR' };
    const ejEv = ejDe(ev.orden);
    const fns = FN[ev.orden];
    if (!ev.completo) {
      j.cortado = true;
      j.fallos.push({
        donde: '',
        ej: ejEv,
        f: {
          titulo: 'El programa se cortó aquí',
          detalle: `${ev.errores.length ? `Antes de pararse: ${ev.errores.join('. ')}. ` : ''}Tu programa se paró durante este evento${fns ? `, dentro de ${fns.filter(Boolean).join(' o ')}` : ''}. Lo más habitual: leer ->sig o ->clave de un puntero que vale NULL o de un nodo ya liberado, salirse de un array o un bucle que no avanza. Pon un punto de ruptura ahí y ejecuta con el depurador de CLion.`,
        },
      });
      juicios.push(j);
      break;
    }

    if (ev.orden !== 'LIBERAR') {
      for (const inv of TABLAS) {
        const q = quiero[inv];
        if (!q) continue;
        const lecs: Lecturas = {};
        if (q.l) {
          const [fl, ll] = juzgarLista(ev, inv, ev.listas[inv], q.l, lecAntes[inv]?.l, inv === 'H' ? lecAntes.B?.l : undefined);
          lecs.l = ll;
          if (fl) j.fallos.push({ donde: dondeTabla(inv, 'L'), ej: ejEv ?? ejDeLista(q.l), f: fl });
        }
        if (q.a) {
          const [fa, la] = juzgarArray(ev, inv, ev.arrays[inv], q.a, lecAntes[inv]?.a);
          lecs.a = la;
          if (fa) j.fallos.push({ donde: dondeTabla(inv, 'A'), ej: ejEv ?? ejDeArray(q.a), f: fa });
        }
        j.lec[inv] = lecs;
      }
      // copiar: la copia no puede compartir nodos con el original
      if (ev.orden === 'COPIAR' && j.lec.H?.l && j.lec.B?.l && !j.fallos.length) {
        const compartidos = [...j.lec.B.l.alcanzados].filter((id) => j.lec.H!.l!.alcanzados.has(id));
        if (compartidos.length)
          j.fallos.push({ donde: 'Botín · Listas', ej: ejEv, f: { titulo: 'La copia comparte nodos', detalle: `El botín y el inventario apuntan a los mismos nodos (${compartidos.length}). Copiar es reservar un nodo NUEVO con malloc por cada nodo del original: si no, cambiar uno cambia el otro, y al liberar se liberan dos veces.` } });
      }
      if (fns && !j.fallos.length) {
        const q = quiero[ev.quien];
        const fl = paso.rl.length ? resultado(ev.orden, ev.rl, paso.rl, fns[0]) : undefined;
        const fa = paso.ra.length ? resultado(ev.orden, ev.ra, paso.ra, fns[1]) : undefined;
        if (fl) j.fallos.push({ donde: 'Listas', ej: ejEv ?? (q?.l && ejDeLista(q.l)), f: fl });
        if (fa) j.fallos.push({ donde: 'Array', ej: ejEv ?? (q?.a && ejDeArray(q.a)), f: fa });
      }
    }

    const usados = bloquesUsados(ev, j.lec);
    const legible = TABLAS.every((inv) => !j.lec[inv] || ((!j.lec[inv]!.l || j.lec[inv]!.l!.modelo) && (!j.lec[inv]!.a || j.lec[inv]!.a!.modelo)));
    const fan = [...ev.vivos.keys()].filter((id) => !usados.has(id));
    j.fantasmas = fan;
    j.fantasmasNuevos = legible ? fan.filter((id) => !prevFan.has(id)) : [];
    if (ev.errores.length) j.fallos.push({ donde: '', ej: ejEv, f: { titulo: 'Error de memoria', detalle: ev.errores.join('. ') + '. Un bloque solo se libera una vez, y solo lo que salió de malloc.' } });
    else if (j.fantasmasNuevos.length)
      j.fallos.push({
        donde: '',
        ej: ejEv,
        f: {
          titulo: j.fantasmasNuevos.length > 1 ? `¡${j.fantasmasNuevos.length} fantasmas!` : '¡Un fantasma!',
          detalle: `${describirBloque(reg.bloques.get(j.fantasmasNuevos[0]))} sigue vivo y ya no lo apunta nadie: es una fuga de memoria.${j.fantasmasNuevos.length > 1 ? ' Y hay más.' : ''}`,
        },
      });

    j.ok = j.fallos.length === 0;
    juicios.push(j);
    base = Object.fromEntries(
      TABLAS
        .filter((k) => quiero[k])
        .map((k) => [k, { l: quiero[k]!.l && (j.lec[k]?.l?.modelo ?? quiero[k]!.l), a: quiero[k]!.a && (j.lec[k]?.a?.modelo ?? quiero[k]!.a) }]),
    );
    lecAntes = j.lec;
    prevFan = new Set(fan);
  }

  const contados = juicios.filter((j) => !j.inicial);
  const total = mision && conocida ? mision.ordenes.length : reg.eventos.filter((e) => e.orden !== 'CREAR').length;
  const bien = contados.filter((j) => j.ok).length;
  const pc = total ? bien / total : 0;
  const estrellas = pc === 1 ? 3 : pc >= 0.8 ? 2 : pc >= 0.5 ? 1 : 0;
  return { reg, conocida, aviso, juicios, total, bien, estrellas };
}
