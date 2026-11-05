// Las misiones son los ficheros de eventos del proyecto base, tal cual.
import m1 from '../../proyecto-base/eventos/mision1-camino.txt?raw';
import m2 from '../../proyecto-base/eventos/mision2-mapa.txt?raw';
import m3 from '../../proyecto-base/eventos/mision3-mercado.txt?raw';
import m4 from '../../proyecto-base/eventos/mision4-cripta-encantada.txt?raw';
import m5 from '../../proyecto-base/eventos/mision5-rey-cripta.txt?raw';
import m6 from '../../proyecto-base/eventos/mision6-escriba.txt?raw';
import m7 from '../../proyecto-base/eventos/mision7-balanza.txt?raw';
import m8 from '../../proyecto-base/eventos/mision8-pacto.txt?raw';
import m9 from '../../proyecto-base/eventos/mision9-recaudador.txt?raw';
import m10 from '../../proyecto-base/eventos/mision10-pergamino.txt?raw';
import m11 from '../../proyecto-base/eventos/mision11-cuadrado.txt?raw';
import m12 from '../../proyecto-base/eventos/mision12-hechicero.txt?raw';
import m13 from '../../proyecto-base/eventos/mision13-escalera.txt?raw';
import m14 from '../../proyecto-base/eventos/mision14-espejos.txt?raw';
import m15 from '../../proyecto-base/eventos/mision15-golem.txt?raw';
import m16 from '../../proyecto-base/eventos/mision16-dragon.txt?raw';

export interface Mision {
  id: string;
  target: string;
  titulo: string;
  resumen: string;
  ordenes: string[];
  jefe?: boolean;
  /** El acompañante de la misión (ver personajes.ts). */
  quien: string;
  acto: number;
}

export interface Acto {
  n: number;
  titulo: string;
  lugar: string;
  /** Los ficheros que se tocan en este acto. */
  ficheros: string[];
  resumen: string;
}

export const ACTOS: Acto[] = [
  { n: 1, titulo: 'El Gremio', lugar: 'La aldea y su cripta', ficheros: ['TablaDispersaLista.c', 'TablaDispersaArray.c'], resumen: 'Las dos tablas de clase: el objeto con más unidades, medir las colisiones, cambiar la clave, quitar los agotados y juntar dos inventarios.' },
  { n: 2, titulo: 'Las caravanas', lugar: 'El camino de comercio', ficheros: ['TablaDispersaLista.c', 'TablaDispersaArray.c'], resumen: 'Dos inventarios a la vez: copiarlos, compararlos, quedarse con lo común y pagar con lo del otro.' },
  { n: 3, titulo: 'Crear distintos hash', lugar: 'La torre del nigromante', ficheros: ['TablaDispersaLista.c', 'TablaDispersaArray.c'], resumen: 'Las mismas dos tablas con otras funciones hash: plegamiento, mitad del cuadrado y polinómico sobre las cifras, comparadas con la de clase.' },
  { n: 4, titulo: 'Juego con colisiones', lugar: 'La montaña del dragón', ficheros: ['TablaDispersaLista.c', 'TablaDispersaArray.c'], resumen: 'Las mismas dos tablas jugando con las colisiones: exploración cuadrática y doble hashing, lo que cuesta buscar, barrer las BORRADA y poner delante lo que más se busca.' },
];

/** Las órdenes de un fichero de eventos, normalizadas como las escribe el registro. */
export function ordenesDe(texto: string): string[] {
  return texto
    .split(/\r?\n/)
    .map((l) => l.split('|')[0].trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/).join(' '));
}

const n = (t: string) => ordenesDe(t).length;

export const MISIONES: Mision[] = [
  { acto: 1, id: 'mision1-camino', target: 'mision1', titulo: 'El camino del Gremio', resumen: 'Ejercicio 1, el objeto con más unidades: la mochila vacía, empates, claves negativas y un objeto que se adelanta.', ordenes: ordenesDe(m1), quien: 'hilda' },
  { acto: 1, id: 'mision2-mapa', target: 'mision2', titulo: 'El mapa de las colisiones', resumen: 'Ejercicio 2, medir las colisiones: un cubo con cuatro nodos, un grupo que crece, una BORRADA en medio y la vuelta del array.', ordenes: ordenesDe(m2), quien: 'bastian' },
  { acto: 1, id: 'mision3-mercado', target: 'mision3', titulo: 'El mercado de los trueques', resumen: 'Ejercicio 3, cambiar la clave: el nodo del medio, el primero, a una clave que ya está, a una que no existe y a sí misma.', ordenes: ordenesDe(m3), quien: 'rina' },
  { acto: 1, id: 'mision4-cripta-encantada', target: 'mision4', titulo: 'La cripta encantada', resumen: 'Ejercicio 4, quitar los agotados: ninguno, el primero, varios seguidos y todos, y después buscar e insertar con las BORRADA.', ordenes: ordenesDe(m4), quien: 'ulf' },
  { acto: 1, id: 'mision5-rey-cripta', target: 'mision5', titulo: 'Odric, el Rey de la Cripta', resumen: `Ejercicio 5, el jefe del acto 1: ${n(m5)} eventos con dos inventarios, el de Lis y el tesoro del rey muerto, que se fusionan una y otra vez.`, ordenes: ordenesDe(m5), jefe: true, quien: 'lis' },

  { acto: 2, id: 'mision6-escriba', target: 'mision6', titulo: 'El escriba de la caravana', resumen: 'Ejercicio 6, copiar: nodos nuevos en el mismo orden, una copia que no comparte nada, copiar encima de otra copia y copiar lo vacío.', ordenes: ordenesDe(m6), quien: 'rina' },
  { acto: 2, id: 'mision7-balanza', target: 'mision7', titulo: 'La balanza del mercader', resumen: 'Ejercicio 7, comparar: lo mismo en otro orden, un valor distinto, un objeto de más y el mismo número de objetos pero distintos.', ordenes: ordenesDe(m7), quien: 'ulf' },
  { acto: 2, id: 'mision8-pacto', target: 'mision8', titulo: 'El pacto de las caravanas', resumen: 'Ejercicio 8, lo que tienen los dos: quedarse con el menor, quitar los dos primeros de un cubo y hacer un pacto con una caravana vacía.', ordenes: ordenesDe(m8), quien: 'bastian' },
  { acto: 2, id: 'mision9-recaudador', target: 'mision9', titulo: 'Grumak, el troll del puente', resumen: `Ejercicio 9 y todo el acto 2, el jefe: ${n(m9)} eventos de peajes del troll, copias, comparaciones y pactos.`, ordenes: ordenesDe(m9), jefe: true, quien: 'lis' },

  { acto: 3, id: 'mision10-pergamino', target: 'mision10', titulo: 'El pergamino plegado', resumen: 'Ejercicio 10, el plegamiento: claves con las mismas cifras cambiadas de sitio, trozos de dos y tres cifras, y la de clase al lado para comparar.', ordenes: ordenesDe(m10), quien: 'bastian' },
  { acto: 3, id: 'mision11-cuadrado', target: 'mision11', titulo: 'El espejo del cuadrado', resumen: 'Ejercicio 11, la mitad del cuadrado: separa lo que la de clase amontona, pero los números redondos caen todos en el mismo cubo.', ordenes: ordenesDe(m11), quien: 'hilda' },
  { acto: 3, id: 'mision12-hechicero', target: 'mision12', titulo: 'Vorhal, el nigromante de las cifras', resumen: `Ejercicio 12 y todo el acto 3, el jefe: ${n(m12)} eventos con dos inventarios con funciones hash distintas, que al final se fusionan.`, ordenes: ordenesDe(m12), jefe: true, quien: 'lis' },

  { acto: 4, id: 'mision13-escalera', target: 'mision13', titulo: 'La escalera de la atalaya', resumen: 'Ejercicio 13, la cuadrática y el doble hashing: siete claves con la misma casilla, una que no cabe aunque sobra sitio, y las BORRADA.', ordenes: ordenesDe(m13), quien: 'bastian' },
  { acto: 4, id: 'mision14-espejos', target: 'mision14', titulo: 'La sala de los espejos', resumen: 'Ejercicio 14, lo que cuesta buscar: en las listas y en el array, lineal contra doble, claves que están, que no y después de borrar.', ordenes: ordenesDe(m14), quien: 'hilda' },
  { acto: 4, id: 'mision15-golem', target: 'mision15', titulo: 'El gólem de polvo', resumen: 'Ejercicio 15, reorganizar: el gólem del dragón llena el array de BORRADA y hay que barrerlas; en las listas, lo que más se busca pasa delante.', ordenes: ordenesDe(m15), quien: 'ulf' },
  { acto: 4, id: 'mision16-dragon', target: 'mision16', titulo: 'Ascuaferro, el dragón de las colisiones', resumen: `El jefe final: ${n(m16)} eventos con plegamiento, cuadrática y doble hashing, costes, barridos y el tesoro del dragón.`, ordenes: ordenesDe(m16), jefe: true, quien: 'lis' },
];

export const misionDe = (id: string) => MISIONES.find((m) => m.id === id);
export const actoDe = (m: Mision) => ACTOS[m.acto - 1];
