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
  /** Qué ejercicio se pone a prueba (una etiqueta corta). */
  ejercicio: string;
  /** La misión contada como parte de la historia. */
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
  { n: 1, titulo: 'El Gremio', lugar: 'La aldea y su cripta', ficheros: ['TablaDispersaLista.c', 'TablaDispersaArray.c'], resumen: 'La fiesta de la cosecha parece un día como otro cualquiera, hasta que en la cripta del Gremio algo empieza a moverse. Aquí se forma la compañía.' },
  { n: 2, titulo: 'Las caravanas', lugar: 'El camino de comercio', ficheros: ['TablaDispersaLista.c', 'TablaDispersaArray.c'], resumen: 'Con la cripta en calma, el Gremio envía una caravana por el camino de comercio. Ahora hay que llevar las cuentas de dos inventarios a la vez: copiarlos, compararlos, pactar y pagar peajes.' },
  { n: 3, titulo: 'Crear distintos hash', lugar: 'La torre del nigromante', ficheros: ['TablaDispersaLista.c', 'TablaDispersaArray.c'], resumen: 'Los números del reino caen siempre en los mismos cubos, y la culpa es de Vorhal, que lo maneja todo desde su torre. Para vencerle hay que aprender a repartir de otras formas.' },
  { n: 4, titulo: 'Juego con colisiones', lugar: 'La montaña del dragón', ficheros: ['TablaDispersaLista.c', 'TablaDispersaArray.c'], resumen: 'Más allá de la torre se alza la montaña del dragón. Allí dentro las colisiones lo llenan todo: hay que buscar sitio de otras maneras, medir lo que cuesta encontrar y poner orden.' },
];

/** Las órdenes de un fichero de eventos, normalizadas como las escribe el registro. */
export function ordenesDe(texto: string): string[] {
  return texto
    .split(/\r?\n/)
    .map((l) => l.split('|')[0].trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/).join(' '));
}

export const MISIONES: Mision[] = [
  { acto: 1, id: 'mision1-camino', target: 'mision1', titulo: 'La fiesta de la cosecha', ejercicio: 'Ejercicio 1 · el objeto con más unidades', resumen: 'Es la mañana de la fiesta y Hilda necesita manos para los preparativos. Todo lo que llega va a la mochila, y ella quiere saber en cada momento qué es lo que más hay, aunque haya empates o aparezca algún objeto maldito.', ordenes: ordenesDe(m1), quien: 'hilda' },
  { acto: 1, id: 'mision2-mapa', target: 'mision2', titulo: 'El mapa de las colisiones', ejercicio: 'Ejercicio 2 · medir las colisiones', resumen: 'Bajo el Gremio hay una cripta que nadie ha cartografiado. Bastián quiere dibujarla antes de bajar más: dónde se amontonan los hallazgos, qué rincones siguen vacíos y qué huecos ha dejado el polvo.', ordenes: ordenesDe(m2), quien: 'bastian' },
  { acto: 1, id: 'mision3-mercado', target: 'mision3', titulo: 'El mercado de los trueques', ejercicio: 'Ejercicio 3 · cambiar la clave', resumen: 'Llega el mercado a la plaza y Rina monta su puesto de hierbas. Aquí todo se cambia por otra cosa, y hay que hacerlo sin perder nada por el camino y sin dejarse engañar por los pícaros.', ordenes: ordenesDe(m3), quien: 'rina' },
  { acto: 1, id: 'mision4-cripta-encantada', target: 'mision4', titulo: 'La cripta encantada', ejercicio: 'Ejercicio 4 · quitar los agotados', resumen: 'Ulf os guía hasta lo más hondo de la cripta. Una niebla verde sale de las tumbas y se lleva todo lo que tenga pocas unidades. Hay que saber qué sigue en pie y no perder el rastro de lo que queda.', ordenes: ordenesDe(m4), quien: 'ulf' },
  { acto: 1, id: 'mision5-rey-cripta', target: 'mision5', titulo: 'Odric, el Rey de la Cripta', ejercicio: 'Ejercicio 5 · juntar dos inventarios · jefe del acto 1', resumen: 'En la última sala, un rey muerto se levanta de su sarcófago. Odric no deja de reclamar objetos para su tesoro, y su aliento helado consume lo que tienes en poca cantidad. Lis tendrá que arrebatarle el tesoro una y otra vez, hasta que no le quede nada.', ordenes: ordenesDe(m5), jefe: true, quien: 'lis' },

  { acto: 2, id: 'mision6-escriba', target: 'mision6', titulo: 'El escriba de la caravana', ejercicio: 'Ejercicio 6 · copiar', resumen: 'La caravana del Gremio sale hacia el este, y un anciano escriba lo apunta todo en su libro. Su copia tiene que ser exacta y solo suya: si se le escapa un borrón, la caravana no puede cambiar por ello.', ordenes: ordenesDe(m6), quien: 'rina' },
  { acto: 2, id: 'mision7-balanza', target: 'mision7', titulo: 'La balanza del mercader', ejercicio: 'Ejercicio 7 · comparar', resumen: 'En el mercado del cruce, Ulf negocia con un mercader de sedas. La balanza solo se queda quieta si los dos ponen lo mismo, aunque lo pongan en otro orden. Y el mercader tiene la mano muy rápida.', ordenes: ordenesDe(m7), quien: 'ulf' },
  { acto: 2, id: 'mision8-pacto', target: 'mision8', titulo: 'El pacto de las caravanas', ejercicio: 'Ejercicio 8 · lo que tienen los dos', resumen: 'Dos caravanas coinciden en un oasis y sellan un pacto: cada una se queda solo con lo que tienen las dos, y en la cantidad menor. A Bastián no le convence nada.', ordenes: ordenesDe(m8), quien: 'bastian' },
  { acto: 2, id: 'mision9-recaudador', target: 'mision9', titulo: 'Grumak, el troll del puente', ejercicio: 'Ejercicio 9 · restar inventarios · jefe del acto 2', resumen: 'El camino acaba en un puente de piedra, y bajo el puente vive Grumak. Cobra peaje por todo, apunta lo que llevas, vuelve a cobrar y solo deja pasar lo que él también tiene. Lis tendrá que pagarle sin quedarse con deudas ni con fantasmas.', ordenes: ordenesDe(m9), jefe: true, quien: 'lis' },

  { acto: 3, id: 'mision10-pergamino', target: 'mision10', titulo: 'El pergamino plegado', ejercicio: 'Ejercicio 10 · el hash de plegamiento', resumen: 'Desde que Vorhal ocupó la torre, los números del Gremio caen siempre en los mismos cubos. Merla le da a Bastián un pergamino antiguo con otra forma de repartirlos: plegar cada número en trozos y sumarlos.', ordenes: ordenesDe(m10), quien: 'bastian' },
  { acto: 3, id: 'mision11-cuadrado', target: 'mision11', titulo: 'El espejo del cuadrado', ejercicio: 'Ejercicio 11 · el hash de la mitad del cuadrado', resumen: 'Al pie de la torre, Hilda encuentra un espejo de bronce que devuelve cada número al cuadrado. Reparte mejor que la función de siempre, salvo con los números redondos, que no le gustan nada.', ordenes: ordenesDe(m11), quien: 'hilda' },
  { acto: 3, id: 'mision12-hechicero', target: 'mision12', titulo: 'Vorhal, el nigromante de las cifras', ejercicio: 'Ejercicio 12 · el hash polinómico · jefe del acto 3', resumen: 'En lo alto de la torre espera Vorhal, que reparte su botín con su propia función hash. Lis tendrá que responder con el conjuro de las cifras, resistir los hechizos que retuercen las claves y quedarse con todo lo que guarda.', ordenes: ordenesDe(m12), jefe: true, quien: 'lis' },

  { acto: 4, id: 'mision13-escalera', target: 'mision13', titulo: 'La escalera de la atalaya', ejercicio: 'Ejercicio 13 · exploración cuadrática y doble hashing', resumen: 'Desde la vieja atalaya se ve el humo de la montaña de Ascuaferro. Para subir hay dos caminos: de cuadrado en cuadrado o a saltos. Uno de los dos se queda sin escalones antes de llegar arriba.', ordenes: ordenesDe(m13), quien: 'bastian' },
  { acto: 4, id: 'mision14-espejos', target: 'mision14', titulo: 'La sala de los espejos', ejercicio: 'Ejercicio 14 · lo que cuesta buscar', resumen: 'Dentro de la montaña, una sala cubierta de espejos lo repite todo. Hilda quiere saber cuánto cuesta encontrar cada cosa ahí dentro, y si su reflejo la encuentra antes que ella.', ordenes: ordenesDe(m14), quien: 'hilda' },
  { acto: 4, id: 'mision15-golem', target: 'mision15', titulo: 'El gólem de polvo', ejercicio: 'Ejercicio 15 · reorganizar', resumen: 'En las galerías vive el guardián del dragón, un gólem que lo convierte todo en polvo. Ulf tendrá que barrerlo para que nadie tropiece al buscar, y tener a mano lo que más usa en la oscuridad.', ordenes: ordenesDe(m15), quien: 'ulf' },
  { acto: 4, id: 'mision16-dragon', target: 'mision16', titulo: 'Ascuaferro, el dragón de las colisiones', ejercicio: 'Ejercicios 13, 14 y 15 · jefe final', resumen: 'La cueva del tesoro. Ascuaferro duerme sobre su oro, y cada moneda está en su sitio. Lis tendrá que esconder lo suyo con todo lo aprendido, robarle mientras dormita y aguantar su fuego hasta quedarse con el tesoro.', ordenes: ordenesDe(m16), jefe: true, quien: 'lis' },
];

export const misionDe = (id: string) => MISIONES.find((m) => m.id === id);
export const actoDe = (m: Mision) => ACTOS[m.acto - 1];
