// Lo que pide cada ejercicio, dicho en claro: qué función se programa en cada
// tabla, qué tiene que hacer y qué devuelve. Es lo mismo que dicen los
// comentarios de TablaDispersaLista.h y TablaDispersaArray.h.

export interface Funcion {
  /** La cabecera tal cual está en el .h */
  firma: string;
  /** Qué hace, en una o dos frases. */
  hace: string;
}

export interface Encargo {
  ej: number;
  titulo: string;
  lista?: Funcion;
  array?: Funcion;
  /** Los detalles en los que es fácil equivocarse. */
  ojo: string[];
}

export const ENCARGOS: Record<number, Encargo> = {
  1: {
    ej: 1,
    titulo: 'El elemento más grande',
    lista: { firma: 'int masAbundanteHashLista(HashLista *hashLista, int *clave, int *elemento)', hace: 'Recorre todos los cubos y deja en *clave y *elemento el par con el elemento más grande. Devuelve 1, o 0 si la tabla está vacía.' },
    array: { firma: 'int masAbundanteHashArray(HashArray *hashArray, int *clave, int *elemento)', hace: 'Lo mismo, mirando solo las casillas OCUPADA. Devuelve 1, o 0 si no hay ninguna.' },
    ojo: ['Si hay empate, gana la clave más pequeña (también si es negativa).', 'Con la tabla vacía no se toca *clave ni *elemento.'],
  },
  2: {
    ej: 2,
    titulo: 'Medir las colisiones',
    lista: { firma: 'int cuboMasLargoHashLista(HashLista *hashLista, int *vacios)', hace: 'Devuelve cuántos nodos tiene la lista más larga y deja en *vacios cuántos cubos están a NULL.' },
    array: { firma: 'int grupoMasLargoHashArray(HashArray *hashArray, int *borradas)', hace: 'Devuelve la longitud del grupo más largo de casillas seguidas que no están VACIA, y deja en *borradas cuántas BORRADA hay.' },
    ojo: ['En el array, las BORRADA cuentan como parte del grupo.', 'El grupo se mira de la casilla 0 a la última, sin dar la vuelta: la 19 y la 0 no se juntan.'],
  },
  3: {
    ej: 3,
    titulo: 'Cambiar la clave',
    lista: { firma: 'int cambiarClaveHashLista(HashLista *hashLista, int vieja, int nueva)', hace: 'Pasa lo de la clave vieja a la nueva. Si la nueva no está, desengancha el MISMO nodo, le cambia la clave y lo engancha al principio del cubo de la nueva. Si la nueva ya está, le suma el elemento y libera el nodo viejo.' },
    array: { firma: 'int cambiarClaveHashArray(HashArray *hashArray, int vieja, int nueva)', hace: 'La casilla de la vieja pasa a BORRADA; la nueva suma el elemento si ya estaba o se inserta como en insertarHashArray.' },
    ojo: ['En la lista no se hace malloc ni free cuando la nueva no estaba: se mueve el nodo.', 'Devuelve 0 si la vieja no está. Si vieja == nueva, no cambia nada y devuelve 1.'],
  },
  4: {
    ej: 4,
    titulo: 'Quitar los que tienen poco',
    lista: { firma: 'int eliminarSiMenorHashLista(HashLista *hashLista, int minimo)', hace: 'Quita y libera todos los nodos cuyo elemento sea menor que minimo. Devuelve cuántos ha quitado.' },
    array: { firma: 'int eliminarSiMenorHashArray(HashArray *hashArray, int minimo)', hace: 'Marca como BORRADA las casillas OCUPADA con elemento menor que minimo. Devuelve cuántas.' },
    ojo: ['En la lista, cuidado con quitar el primer nodo del cubo y con varios seguidos.', 'En el array, BORRADA y no VACIA: una VACIA cortaría las búsquedas de lo que hay detrás.'],
  },
  5: {
    ej: 5,
    titulo: 'Juntar dos tablas',
    lista: { firma: 'int fusionarHashLista(HashLista *destino, HashLista *origen)', hace: 'Pasa todo lo de origen a destino moviendo los nodos: si la clave ya está, suma y libera el nodo de origen; si no, engancha ese nodo al principio de su cubo en destino. Devuelve 1.' },
    array: { firma: 'int fusionarHashArray(HashArray *destino, HashArray *origen)', hace: 'Recorre las OCUPADA de origen de la 0 a la última: suma si la clave ya está en destino o la inserta. Devuelve 1, o 0 si alguna no cabe.' },
    ojo: ['En la lista no hay ningún malloc.', 'Al acabar, origen queda vacío: cubos a NULL (o casillas VACIA) y n = 0.'],
  },
  6: {
    ej: 6,
    titulo: 'Copiar una tabla',
    lista: { firma: 'int copiarHashLista(HashLista *destino, HashLista *origen)', hace: 'Libera primero todo lo que tuviera destino y copia cada cubo de origen en el mismo cubo, en el mismo orden, con nodos nuevos. Devuelve cuántos elementos ha copiado.' },
    array: { firma: 'int copiarHashArray(HashArray *destino, HashArray *origen)', hace: 'Copia casilla a casilla las claves, los elementos y las marcas (BORRADA incluidas), y también n, la función hash y el sondeo. Devuelve cuántas OCUPADA ha copiado.' },
    ojo: ['La copia no puede compartir ni un nodo con el original: cambiar una no cambia la otra.', 'En la lista, copia también la función hash de origen.'],
  },
  7: {
    ej: 7,
    titulo: 'Comparar dos tablas',
    lista: { firma: 'int igualesHashLista(HashLista *a, HashLista *b)', hace: 'Devuelve 1 si las dos tienen exactamente las mismas claves con los mismos elementos, 0 si no.' },
    array: { firma: 'int igualesHashArray(HashArray *a, HashArray *b)', hace: 'Lo mismo para el array.' },
    ojo: ['Dentro de un cubo pueden estar en otro orden, y en el array en otras casillas: siguen siendo iguales.', 'No basta con comparar n: mismo número de claves no quiere decir mismas claves.'],
  },
  8: {
    ej: 8,
    titulo: 'Intersección',
    lista: { firma: 'int interseccionHashLista(HashLista *destino, HashLista *otro)', hace: 'Destino se queda solo con las claves que también están en otro, cada una con el menor de los dos elementos. Los nodos que sobran se liberan. Devuelve cuántos quedan.' },
    array: { firma: 'int interseccionHashArray(HashArray *destino, HashArray *otro)', hace: 'Lo mismo; lo que se quita pasa a BORRADA.' },
    ojo: ['Otro no cambia.', 'Cuidado al quitar el primer nodo de un cubo, o varios seguidos.'],
  },
  9: {
    ej: 9,
    titulo: 'Diferencia (restar)',
    lista: { firma: 'int diferenciaHashLista(HashLista *destino, HashLista *otro)', hace: 'Por cada clave de otro que esté en destino, resta su elemento al de destino; si queda en 0 o menos, ese nodo se quita y se libera. Devuelve cuántos nodos se han quitado.' },
    array: { firma: 'int diferenciaHashArray(HashArray *destino, HashArray *otro)', hace: 'Lo mismo; lo que se queda a 0 o menos pasa a BORRADA.' },
    ojo: ['Las claves de otro que no están en destino no hacen nada.', 'Otro no cambia.'],
  },
  10: {
    ej: 10,
    titulo: 'Hash de plegamiento',
    lista: { firma: 'int hashPlegamientoHashLista(int clave)', hace: 'Parte la clave en trozos de dos cifras empezando por la derecha, los suma y devuelve la suma mod TAM_LISTA (101).' },
    array: { firma: 'int hashPlegamientoHashArray(int clave)', hace: 'Lo mismo, mod TAM (20).' },
    ojo: ['Ejemplo: 12345 → 1 + 23 + 45 = 69.', 'Los trozos se sacan con % 100 y / 100. Las claves de este acto son positivas.'],
  },
  11: {
    ej: 11,
    titulo: 'Hash de la mitad del cuadrado',
    lista: { firma: 'int hashMitadCuadradoHashLista(int clave)', hace: 'Eleva la clave al cuadrado y se queda con las dos cifras del centro: (c / 100) % 100. Devuelve eso mod 101.' },
    array: { firma: 'int hashMitadCuadradoHashArray(int clave)', hace: 'Lo mismo, mod 20.' },
    ojo: ['El cuadrado en un long long: con int se desborda.', 'Ejemplo: 1234 → 1522756 → 27.'],
  },
  12: {
    ej: 12,
    titulo: 'Hash polinómico sobre las cifras',
    lista: { firma: 'int hashPolinomicoHashLista(int clave)', hace: 'h = 0 y, cifra a cifra empezando por la última (clave % 10, luego clave / 10...), h = h * 31 + cifra. Devuelve h mod 101.' },
    array: { firma: 'int hashPolinomicoHashArray(int clave)', hace: 'Lo mismo, mod 20.' },
    ojo: ['h tiene que ser unsigned int: se desborda a propósito y no puede salir negativo.'],
  },
  13: {
    ej: 13,
    titulo: 'Exploración cuadrática y doble hashing',
    array: { firma: 'int hash2HashArray(int clave)  ·  int casillaHashArray(HashArray *hashArray, int clave, int intento)', hace: 'hash2 devuelve 7 - (clave mod 7). casillaHashArray devuelve la casilla del intento número intento según el sondeo de la tabla: lineal (h + i) (ya hecha), cuadrática (h + i·i) o doble (h + i·hash2(clave)), todo mod 20.' },
    ojo: ['h es la casilla que da la función hash de la tabla para esa clave.', 'Insertar, buscar, eliminar y actualizar ya llaman a casillaHashArray: no hay que tocarlas.', 'Con 20 casillas la cuadrática solo pasa por unas pocas: a veces no encuentra sitio aunque sobre.'],
  },
  14: {
    ej: 14,
    titulo: 'Lo que cuesta buscar',
    lista: { firma: 'int costeBuscarHashLista(HashLista *h, int clave)  ·  int costeTotalHashLista(HashLista *h)', hace: 'costeBuscar: cuántos nodos de su cubo se miran hasta el de la clave (incluido), o todos si no está. costeTotal: la suma del coste de cada clave que hay.' },
    array: { firma: 'int costeBuscarHashArray(HashArray *h, int clave)  ·  int costeTotalHashArray(HashArray *h)', hace: 'costeBuscar: cuántas casillas se miran desde el intento 0 hasta la de la clave o la primera VACIA, las dos incluidas (como mucho 20). costeTotal: la suma para cada clave que hay.' },
    ojo: ['En el array se sigue la secuencia de casillaHashArray, no las casillas de una en una.', 'Las BORRADA también cuestan: se miran y se pasa de largo.'],
  },
  15: {
    ej: 15,
    titulo: 'Reorganizar',
    lista: { firma: 'int alFrenteHashLista(HashLista *hashLista, int clave)', hace: 'Si la clave está, mueve SU nodo al principio de su cubo. Devuelve 1, o 0 si no está.' },
    array: { firma: 'int limpiarBorradasHashArray(HashArray *hashArray)', hace: 'Guarda aparte las OCUPADA (de la 0 a la última), deja todas las casillas VACIA y n = 0, y las vuelve a insertar en ese orden. Devuelve cuántas BORRADA había.' },
    ojo: ['alFrente mueve el nodo: sin malloc ni free.', 'limpiarBorradas no cambia el tamaño de la tabla.'],
  },
};

/** Lo que pide cada acto, en una frase. */
export const EN_CLARO: Record<number, string> = {
  1: 'Cinco funciones nuevas, cada una en las dos tablas (la de listas con 101 cubos y la del array con 20 casillas). La de actualizar ya viene hecha.',
  2: 'Cuatro funciones que trabajan con dos tablas a la vez, cada una en la versión de listas y en la de array.',
  3: 'Tres funciones hash nuevas, cada una en las dos tablas. La orden FUNCION de cada misión elige cuál usa cada tabla; las operaciones de clase ya llaman a la que toque.',
  4: 'Dos formas nuevas de buscar sitio en el array, medir lo que cuesta buscar en las dos tablas y reorganizarlas.',
};

/** Los ejercicios de cada acto. */
export const EJERCICIOS_DE: Record<number, number[]> = { 1: [1, 2, 3, 4, 5], 2: [6, 7, 8, 9], 3: [10, 11, 12], 4: [13, 14, 15] };

/** Qué ejercicio programa cada misión (la 16 no tiene uno nuevo: usa los del acto 4). */
export function ejercicioDe(target: string): number | undefined {
  const k = Number(target.replace('mision', ''));
  return k <= 15 ? k : undefined;
}
