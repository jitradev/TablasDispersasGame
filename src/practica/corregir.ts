// Corrige un registro evento a evento, en las dos tablas.
//
// Lo esperado de cada evento se calcula aplicando la orden a como dejó las tablas
// el propio alumno en el evento anterior (si se pueden leer), para que un fallo no
// arrastre a todos los que vienen detrás.

import { Bloque, EstadoArray, EstadoLista, EventoReg, Inv, Ref, Registro } from './registro';
import { misionDe } from './misiones';
import { aplicar, BORRADA, hash, MA, ML, Mundo, nArray, nLista, OCUPADA, Paso, VACIA } from './tablas';

export interface Fallo {
  titulo: string;
  detalle: string;
}

export interface LecturaL {
  modelo?: ML;
  /** clave -> bloque del nodo */
  ids: Map<number, number>;
  alcanzados: Set<number>;
  fallo?: Fallo;
  /** Lo que ya venía mal (para no volver a contarlo en cada evento). */
  repetidas: Set<number>;
  mal: Set<number>;
  nDif: number;
}
export interface LecturaA {
  modelo?: MA;
  fallo?: Fallo;
  repetidas: Set<number>;
  mal: Set<number>;
  nDif: number;
}


// ------------------------------------------------------------------ leer lo que dejó el alumno

export function leerLista(e: EstadoLista | undefined): LecturaL {
  const r: LecturaL = { ids: new Map(), alcanzados: new Set(), repetidas: new Set(), mal: new Set(), nDif: 0 };
  if (!e || e.struct.k !== 'bloque') return { ...r, fallo: { titulo: 'No está la tabla de listas', detalle: 'El puntero a la tabla de listas no apunta a un bloque vivo.' } };
  if (e.tam === undefined || e.tam < 1) return { ...r, fallo: { titulo: 'tam no vale', detalle: `El campo tam de la tabla de listas vale ${e.tam}.` } };
  if (e.cubosRef?.k !== 'bloque')
    return {
      ...r,
      fallo: {
        titulo: 'El array de cubos no está',
        detalle:
          e.cubosRef?.k === 'liberado'
            ? 'cubos apunta a un array que ya se ha liberado. En el rehash hay que hacer free del array viejo DESPUÉS de pasar los nodos y apuntar cubos al nuevo.'
            : 'cubos no apunta a un array reservado con malloc, o el array es más pequeño que tam (¿has actualizado tam sin reservar el array nuevo?).',
      },
    };
  const m: ML = { tam: e.tam, cubos: Array.from({ length: e.tam }, () => []), valores: new Map() };
  for (const [i, cabeza] of e.cabezas) {
    let cur: Ref = cabeza;
    const vistos = new Set<number>();
    while (cur.k !== 'nulo') {
      if (cur.k !== 'bloque') {
        const que = { liberado: 'un nodo que ya se ha liberado', basura: 'un puntero sin inicializar (basura)', ajeno: 'algo que no salió de malloc' }[cur.k];
        return { ...r, fallo: { titulo: 'Una cadena está rota', detalle: `La lista del cubo ${i} llega a ${que}.${cur.k === 'liberado' ? ' ¿Has liberado nodos en el rehash? Se mueven, no se liberan.' : ''}` } };
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
      if (hash(nodo.clave, e.tam) !== i) r.mal.add(nodo.clave);
      cur = nodo.sig;
    }
  }
  r.nDif = (e.n ?? 0) - [...m.cubos].reduce((s, c) => s + c.length, 0);
  return { ...r, modelo: m };
}

export function leerArray(e: EstadoArray | undefined): LecturaA {
  const r: LecturaA = { repetidas: new Set(), mal: new Set(), nDif: 0 };
  if (!e || e.struct.k !== 'bloque') return { ...r, fallo: { titulo: 'No está la tabla del array', detalle: 'El puntero a la tabla del array no apunta a un bloque vivo.' } };
  if (e.tam === undefined || e.tam < 1) return { ...r, fallo: { titulo: 'tam no vale', detalle: `El campo tam de la tabla del array vale ${e.tam}.` } };
  if (!e.refs || e.refs.some((x) => x.k !== 'bloque'))
    return {
      ...r,
      fallo: {
        titulo: 'Faltan los arrays',
        detalle: e.refs?.some((x) => x.k === 'liberado')
          ? 'claves, valores o marca apuntan a un array que ya se ha liberado. En el rehash, los viejos se liberan después de copiar, y los punteros pasan a los nuevos.'
          : 'claves, valores o marca no apuntan a un array del tamaño de tam (¿has cambiado tam sin reservar los arrays nuevos?).',
      },
    };
  const m: MA = { tam: e.tam, casillas: Array.from({ length: e.tam }, () => ({ marca: VACIA, clave: 0, valor: 0 })) };
  const vistas = new Set<number>();
  for (const [i, c] of e.casillas) {
    if (c.marca !== OCUPADA && c.marca !== BORRADA)
      return { ...r, fallo: { titulo: 'Una marca sin inicializar', detalle: `La casilla ${i} tiene la marca ${c.marca}, que no es VACIA, OCUPADA ni BORRADA. Al reservar los arrays nuevos hay que poner todas las marcas a VACIA.` } };
    if (c.marca === OCUPADA) {
      if (vistas.has(c.clave)) r.repetidas.add(c.clave);
      vistas.add(c.clave);
    }
    m.casillas[i] = { ...c };
  }
  // claves que la exploración lineal no encontraría
  for (let p = 0; p < m.tam; p++) {
    const s = m.casillas[p];
    if (s.marca !== OCUPADA) continue;
    for (let i = hash(s.clave, m.tam); i !== p; i = (i + 1) % m.tam)
      if (m.casillas[i].marca === VACIA) {
        r.mal.add(s.clave);
        break;
      }
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

function diferencias(leido: Map<number, number>, quiero: Map<number, number>): string {
  const faltan = [...quiero.keys()].filter((k) => !leido.has(k));
  const sobran = [...leido.keys()].filter((k) => !quiero.has(k));
  const cambia = [...quiero.keys()].filter((k) => leido.has(k) && leido.get(k) !== quiero.get(k));
  const t: string[] = [];
  if (faltan.length) t.push(`falta${faltan.length > 1 ? 'n' : ''} ${faltan.slice(0, 4).join(', ')}${faltan.length > 4 ? '…' : ''}`);
  if (sobran.length) t.push(`sobra${sobran.length > 1 ? 'n' : ''} ${sobran.slice(0, 4).join(', ')}${sobran.length > 4 ? '…' : ''}`);
  for (const k of cambia.slice(0, 3)) t.push(`la ${k} vale ${leido.get(k)} y tenía que valer ${quiero.get(k)}`);
  return t.join('; ');
}

const NOMBRE_FN: Record<string, [string, string]> = {
  ACTUALIZAR: ['actualizarHashLista', 'actualizarHashArray'],
  BUSCAR: ['buscarHashLista', 'buscarHashArray'],
  ELIMINAR: ['eliminarElementoHashLista', 'eliminarElementoHashArray'],
  ABUNDANTE: ['masAbundanteHashLista', 'masAbundanteHashArray'],
  COLISIONES: ['cuboMasLargoHashLista', 'grupoMasLargoHashArray'],
  CAMBIAR: ['cambiarClaveHashLista', 'cambiarClaveHashArray'],
  AGOTAR: ['eliminarSiMenorHashLista', 'eliminarSiMenorHashArray'],
  FUSIONAR: ['fusionarHashLista', 'fusionarHashArray'],
};
const EJ_ORDEN: Record<string, number> = { ABUNDANTE: 1, COLISIONES: 2, CAMBIAR: 3, AGOTAR: 4, FUSIONAR: 5 };
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
    AGOTAR: ' Tiene que devolver cuántos ha quitado.',
  };
  return { titulo: 'No devuelve lo que toca', detalle: `${fn} ha devuelto ${txt(got)} y tenía que devolver ${txt(quiero)}.${pista[orden] ?? ''}` };
}

function juzgarLista(ev: EventoReg, inv: Inv, e: EstadoLista | undefined, quiero: ML, lecAntes: LecturaL | undefined, lecOrigen?: LecturaL): [Fallo | undefined, LecturaL] {
  const lec = leerLista(e);
  if (lec.fallo || !lec.modelo) return [lec.fallo, lec];
  const m = lec.modelo;
  const rep = [...lec.repetidas].find((k) => !lecAntes?.repetidas.has(k));
  if (rep !== undefined) return [{ titulo: 'Clave repetida', detalle: `La clave ${rep} está dos veces en la tabla de listas.${ev.orden === 'FUSIONAR' ? ' Al fusionar, si la clave ya está en destino, se suma a su nodo: no se engancha otro.' : ''}` }, lec];
  for (let i = 0; i < m.tam; i++)
    for (const c of m.cubos[i])
      if (hash(c, m.tam) !== i && !lecAntes?.mal.has(c))
        return [{ titulo: 'Un objeto en el cubo equivocado', detalle: `La clave ${c} está en el cubo ${i}, y le toca el ${hash(c, m.tam)}.${ev.orden === 'CAMBIAR' ? ' Al cambiar la clave, el nodo se engancha en el cubo de la clave NUEVA.' : ''}` }, lec];
  if (lec.nDif !== 0 && lec.nDif !== (lecAntes?.nDif ?? 0)) return [{ titulo: 'n no cuadra', detalle: `El campo n vale ${e?.n} y en las listas hay ${nLista(m)} nodos.` }, lec];
  const dif = diferencias(m.valores, quiero.valores);
  if (dif) {
    if (ev.orden === 'FUSIONAR' && inv === 'B') return [{ titulo: 'El origen no queda vacío', detalle: `Después de fusionar, el botín tiene que quedar sin nodos (cubos a NULL y n = 0): ${dif}.` }, lec];
    return [{ titulo: 'Las listas no cuadran', detalle: `Comparadas con lo que tenía que quedar: ${dif}.${ev.orden === 'AGOTAR' ? ' ¿Se te escapa un nodo cuando hay dos seguidos que quitar, o el primero del cubo?' : ''}` }, lec];
  }
  if (lecAntes?.modelo) {
    if (ev.orden === 'ACTUALIZAR' && lecAntes.ids.has(ev.a) && lecAntes.ids.get(ev.a) !== lec.ids.get(ev.a)) return [{ titulo: 'Has cambiado el nodo', detalle: `La clave ${ev.a} ya estaba: actualizar tiene que cambiar el valor de su nodo, sin crear otro.` }, lec];
    if (ev.orden === 'CAMBIAR' && ev.a !== ev.b && lecAntes.ids.has(ev.a) && !lecAntes.ids.has(ev.b) && lec.ids.get(ev.b) !== lecAntes.ids.get(ev.a))
      return [{ titulo: 'Nodo nuevo al cambiar la clave', detalle: `La clave ${ev.b} está en un nodo nuevo. Al cambiar la clave se mueve el MISMO nodo de ${ev.a}: se desengancha, cambia su clave y se engancha en su cubo nuevo, sin malloc ni free.` }, lec];
  }
  if (ev.orden === 'FUSIONAR' && inv === 'H' && lecOrigen?.modelo) {
    const copiada = [...lecOrigen.ids].find(([k, id]) => !lecAntes?.ids.has(k) && lec.ids.has(k) && lec.ids.get(k) !== id);
    if (copiada) return [{ titulo: 'Nodos nuevos en la fusión', detalle: `La clave ${copiada[0]} ha llegado al inventario en un nodo nuevo. Al fusionar se mueven los nodos del botín, sin malloc: el mismo nodo pasa a su cubo de destino.` }, lec];
  }
  return [undefined, lec];
}

function juzgarArray(ev: EventoReg, inv: Inv, e: EstadoArray | undefined, quiero: MA, lecAntes: LecturaA | undefined): [Fallo | undefined, LecturaA] {
  const lec = leerArray(e);
  if (lec.fallo || !lec.modelo) return [lec.fallo, lec];
  const m = lec.modelo;
  const rep = [...lec.repetidas].find((k) => !lecAntes?.repetidas.has(k));
  if (rep !== undefined) return [{ titulo: 'Clave repetida', detalle: `La clave ${rep} está dos veces en el array.${ev.orden === 'FUSIONAR' ? ' Al fusionar, si la clave ya está en destino, se suma a su casilla.' : ''}` }, lec];
  for (let p = 0; p < m.tam; p++) {
    const s = m.casillas[p];
    if (s.marca !== OCUPADA || !lec.mal.has(s.clave) || lecAntes?.mal.has(s.clave)) continue;
    let i = hash(s.clave, m.tam);
    while (i !== p && m.casillas[i].marca !== VACIA) i = (i + 1) % m.tam;
    return [
      {
        titulo: 'Una clave que no se encontraría',
        detalle: `La clave ${s.clave} está en la casilla ${p}, pero buscándola desde hash = ${hash(s.clave, m.tam)} se llega antes a la casilla ${i}, que está VACIA, y la búsqueda para ahí.${ev.orden === 'AGOTAR' || ev.orden === 'CAMBIAR' ? ' Al quitar se marca BORRADA, no VACIA: una VACIA corta la exploración.' : ''}`,
      },
      lec,
    ];
  }
  if (lec.nDif !== 0 && lec.nDif !== (lecAntes?.nDif ?? 0)) return [{ titulo: 'n no cuadra', detalle: `El campo n vale ${e?.n} y hay ${nArray(m)} casillas OCUPADA.` }, lec];
  const vals = (t: MA) => new Map(t.casillas.filter((c) => c.marca === OCUPADA).map((c) => [c.clave, c.valor]));
  const dif = diferencias(vals(m), vals(quiero));
  if (dif) {
    if (ev.orden === 'FUSIONAR' && inv === 'B') return [{ titulo: 'El origen no queda vacío', detalle: `Después de fusionar, el botín tiene que quedar con todas sus casillas VACIA y n = 0: ${dif}.` }, lec];
    return [{ titulo: 'El array no cuadra', detalle: `Comparado con lo que tenía que quedar: ${dif}.` }, lec];
  }
  if (ev.orden === 'ACTUALIZAR' && lecAntes?.modelo) {
    const p0 = lecAntes.modelo.casillas.findIndex((s) => s.marca === OCUPADA && s.clave === ev.a);
    if (p0 >= 0 && m.casillas.findIndex((s) => s.marca === OCUPADA && s.clave === ev.a) !== p0) return [{ titulo: 'Has movido la clave', detalle: `La clave ${ev.a} ya estaba en la casilla ${p0}: actualizar cambia su valor ahí mismo.` }, lec];
  }
  return [undefined, lec];
}

function bloquesUsados(ev: EventoReg, lec: Partial<Record<Inv, Lecturas>>): Set<number> {
  const u = new Set<number>();
  const mete = (r: Ref | undefined) => r?.k === 'bloque' && u.add(r.id);
  for (const inv of ['H', 'B'] as Inv[]) {
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
  const pista =
    b.fich.includes('Lista') && b.bytes === 16
      ? ' (un nodo)'
      : b.fich.includes('Lista') && b.bytes > 16
        ? ` (un array de ${b.bytes / 8} cubos: ¿el viejo del rehash?)`
        : b.fich.includes('Array') && b.bytes > 32
          ? ` (un array de ${b.bytes / 4} int: ¿uno de los viejos del rehash?)`
          : '';
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

const NOMBRE_INV: Record<Inv, string> = { H: '', B: 'Botín · ' };

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
    const ejEv = EJ_ORDEN[ev.orden];
    if (!ev.completo) {
      j.cortado = true;
      const [fl, fa] = NOMBRE_FN[ev.orden] ?? ['', ''];
      j.fallos.push({
        donde: '',
        ej: ejEv,
        f: {
          titulo: 'El programa se cortó aquí',
          detalle: `${ev.errores.length ? `Antes de pararse: ${ev.errores.join('. ')}. ` : ''}Tu programa se paró durante este evento${fl ? `, dentro de ${fl} o ${fa}` : ''}. Lo más habitual: leer ->sig o ->clave de un puntero que vale NULL o de un nodo ya liberado, salirse de un array o un bucle que no avanza. Pon un punto de ruptura ahí y ejecuta con el depurador de CLion.`,
        },
      });
      juicios.push(j);
      break;
    }

    if (ev.orden !== 'LIBERAR') {
      for (const inv of ['H', 'B'] as Inv[]) {
        const q = quiero[inv];
        if (!q) continue;
        const [fL, lL] = juzgarLista(ev, inv, ev.listas[inv], q.l, lecAntes[inv]?.l, inv === 'H' ? lecAntes.B?.l : undefined);
        const [fA, lA] = juzgarArray(ev, inv, ev.arrays[inv], q.a, lecAntes[inv]?.a);
        j.lec[inv] = { l: lL, a: lA };
        for (const [tabla, f] of [
          ['L', fL],
          ['A', fA],
        ] as const) {
          if (f) j.fallos.push({ donde: NOMBRE_INV[inv] + (tabla === 'L' ? 'Listas' : 'Array'), ej: ejEv, f });
        }
      }
      const fn = NOMBRE_FN[ev.orden];
      if (fn && !j.fallos.length) {
        const fl = resultado(ev.orden, ev.rl, paso.rl, fn[0]);
        const fa = resultado(ev.orden, ev.ra, paso.ra, fn[1]);
        if (fl) j.fallos.push({ donde: 'Listas', ej: ejEv, f: fl });
        if (fa) j.fallos.push({ donde: 'Array', ej: ejEv, f: fa });
      }
    }

    const usados = bloquesUsados(ev, j.lec);
    const legible = Object.values(j.lec).every((x) => x?.l?.modelo && x?.a?.modelo);
    const fan = [...ev.vivos.keys()].filter((id) => !usados.has(id));
    j.fantasmas = fan;
    j.fantasmasNuevos = legible ? fan.filter((id) => !prevFan.has(id)) : [];
    const ejMem = ejEv;
    if (ev.errores.length) j.fallos.push({ donde: '', ej: ejMem, f: { titulo: 'Error de memoria', detalle: ev.errores.join('. ') + '. Un bloque solo se libera una vez, y solo lo que salió de malloc.' } });
    else if (j.fantasmasNuevos.length)
      j.fallos.push({
        donde: '',
        ej: ejMem,
        f: {
          titulo: j.fantasmasNuevos.length > 1 ? `¡${j.fantasmasNuevos.length} fantasmas!` : '¡Un fantasma!',
          detalle: `${describirBloque(reg.bloques.get(j.fantasmasNuevos[0]))} sigue vivo y ya no lo apunta nadie: es una fuga de memoria.${j.fantasmasNuevos.length > 1 ? ' Y hay más.' : ''}`,
        },
      });

    j.ok = j.fallos.length === 0;
    juicios.push(j);
    base = Object.fromEntries((['H', 'B'] as Inv[]).filter((k) => quiero[k]).map((k) => [k, { l: j.lec[k]?.l?.modelo ?? quiero[k]!.l, a: j.lec[k]?.a?.modelo ?? quiero[k]!.a }]));
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
