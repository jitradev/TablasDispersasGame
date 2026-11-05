// Las misiones son los ficheros de eventos del proyecto base, tal cual.
import m1 from '../../proyecto-base/eventos/mision1-camino.txt?raw';
import m2 from '../../proyecto-base/eventos/mision2-mapa.txt?raw';
import m3 from '../../proyecto-base/eventos/mision3-mercado.txt?raw';
import m4 from '../../proyecto-base/eventos/mision4-cripta-encantada.txt?raw';
import m5 from '../../proyecto-base/eventos/mision5-cofre-gloton.txt?raw';

export interface Mision {
  id: string;
  target: string;
  titulo: string;
  resumen: string;
  ordenes: string[];
  jefe?: boolean;
  /** El acompañante de la misión (ver personajes.ts). */
  quien: string;
}

/** Las órdenes de un fichero de eventos, normalizadas como las escribe el registro. */
export function ordenesDe(texto: string): string[] {
  return texto
    .split(/\r?\n/)
    .map((l) => l.split('|')[0].trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/).join(' '));
}

export const MISIONES: Mision[] = [
  { id: 'mision1-camino', target: 'mision1', titulo: 'El camino del Gremio', resumen: 'Ejercicio 1, el objeto con más unidades: la mochila vacía, empates, claves negativas y un objeto que se adelanta.', ordenes: ordenesDe(m1), quien: 'hilda' },
  { id: 'mision2-mapa', target: 'mision2', titulo: 'El mapa de las colisiones', resumen: 'Ejercicio 2, medir las colisiones: un cubo con cuatro nodos, un grupo que crece, una BORRADA en medio y la vuelta del array.', ordenes: ordenesDe(m2), quien: 'bastian' },
  { id: 'mision3-mercado', target: 'mision3', titulo: 'El mercado de los trueques', resumen: 'Ejercicio 3, cambiar la clave: el nodo del medio, el primero, a una clave que ya está, a una que no existe y a sí misma.', ordenes: ordenesDe(m3), quien: 'rina' },
  { id: 'mision4-cripta-encantada', target: 'mision4', titulo: 'La cripta encantada', resumen: 'Ejercicio 4, quitar los agotados: ninguno, el primero, varios seguidos y todos, y después buscar e insertar con las BORRADA.', ordenes: ordenesDe(m4), quien: 'ulf' },
  { id: 'mision5-cofre-gloton', target: 'mision5', titulo: 'El Cofre Glotón', resumen: `Ejercicio 5, el jefe: ${ordenesDe(m5).length} eventos con dos inventarios, el de Lis y el botín, que se fusionan una y otra vez.`, ordenes: ordenesDe(m5), jefe: true, quien: 'lis' },
];

export const misionDe = (id: string) => MISIONES.find((m) => m.id === id);
