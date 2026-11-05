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
}

export const ENCARGOS: Record<number, Encargo> = {
  1: {
    ej: 1,
    titulo: 'El elemento más grande',
    lista: { firma: 'int masAbundanteHashLista(HashLista *hashLista, int *clave, int *elemento)', hace: 'Recorre todos los cubos y deja en *clave y *elemento el par con el elemento más grande; si hay empate, el de la clave más pequeña. Devuelve 1, o 0 si la tabla está vacía (y entonces no toca *clave ni *elemento).' },
    array: { firma: 'int masAbundanteHashArray(HashArray *hashArray, int *clave, int *elemento)', hace: 'Lo mismo, mirando solo las casillas OCUPADA. Devuelve 1, o 0 si no hay ninguna.' },
  },
  2: {
    ej: 2,
    titulo: 'Medir las colisiones',
    lista: { firma: 'int cuboMasLargoHashLista(HashLista *hashLista, int *vacios)', hace: 'Devuelve cuántos nodos tiene la lista más larga y deja en *vacios cuántos cubos están a NULL.' },
    array: { firma: 'int grupoMasLargoHashArray(HashArray *hashArray, int *borradas)', hace: 'Devuelve la longitud del grupo más largo de casillas seguidas que no están VACIA (OCUPADA o BORRADA), mirando de la casilla 0 a la última sin dar la vuelta, y deja en *borradas cuántas BORRADA hay.' },
  },
  3: {
    ej: 3,
    titulo: 'Cambiar la clave',
    lista: { firma: 'int cambiarClaveHashLista(HashLista *hashLista, int vieja, int nueva)', hace: 'Pasa lo de la clave vieja a la nueva. Si la nueva no está, desengancha el MISMO nodo, le cambia la clave y lo engancha al principio del cubo de la nueva. Si la nueva ya está, le suma el elemento y libera el nodo viejo. Devuelve 1, o 0 si la vieja no está; si vieja == nueva, no hace nada y devuelve 1.' },
    array: { firma: 'int cambiarClaveHashArray(HashArray *hashArray, int vieja, int nueva)', hace: 'La casilla de la vieja pasa a BORRADA; la nueva suma el elemento si ya estaba o se inserta como en insertarHashArray. Devuelve lo mismo que la de listas.' },
  },
  4: {
    ej: 4,
    titulo: 'Quitar los que tienen poco',
    lista: { firma: 'int eliminarSiMenorHashLista(HashLista *hashLista, int minimo)', hace: 'Quita y libera todos los nodos cuyo elemento sea menor que minimo. Devuelve cuántos ha quitado.' },
    array: { firma: 'int eliminarSiMenorHashArray(HashArray *hashArray, int minimo)', hace: 'Marca como BORRADA las casillas OCUPADA con elemento menor que minimo. Devuelve cuántas.' },
  },
  5: {
    ej: 5,
    titulo: 'Juntar dos tablas',
    lista: { firma: 'int fusionarHashLista(HashLista *destino, HashLista *origen)', hace: 'Pasa todo lo de origen a destino moviendo los nodos: si la clave ya está, suma y libera el nodo de origen; si no, engancha ese nodo al principio de su cubo en destino. Origen queda vacío (cubos a NULL y n = 0). Devuelve 1.' },
    array: { firma: 'int fusionarHashArray(HashArray *destino, HashArray *origen)', hace: 'Recorre las OCUPADA de origen de la 0 a la última: suma si la clave ya está en destino o la inserta. Origen queda vacío (casillas VACIA y n = 0). Devuelve 1, o 0 si alguna no cabe.' },
  },
  6: {
    ej: 6,
    titulo: 'Copiar una tabla',
    lista: { firma: 'int copiarHashLista(HashLista *destino, HashLista *origen)', hace: 'Libera primero todo lo que tuviera destino y copia cada cubo de origen en el mismo cubo, en el mismo orden, con nodos nuevos, y copia también su función hash. Destino no comparte ningún nodo con origen. Devuelve cuántos elementos ha copiado.' },
    array: { firma: 'int copiarHashArray(HashArray *destino, HashArray *origen)', hace: 'Copia casilla a casilla las claves, los elementos y las marcas (BORRADA incluidas), y también n, la función hash y el sondeo. Devuelve cuántas OCUPADA ha copiado.' },
  },
  7: {
    ej: 7,
    titulo: 'Comparar dos tablas',
    lista: { firma: 'int igualesHashLista(HashLista *a, HashLista *b)', hace: 'Devuelve 1 si las dos tienen exactamente las mismas claves con los mismos elementos, aunque dentro de un cubo vayan en otro orden; 0 si no. No cambia nada.' },
    array: { firma: 'int igualesHashArray(HashArray *a, HashArray *b)', hace: 'Lo mismo para el array, aunque las claves estén en otras casillas.' },
  },
  8: {
    ej: 8,
    titulo: 'Intersección',
    lista: { firma: 'int interseccionHashLista(HashLista *destino, HashLista *otro)', hace: 'Destino se queda solo con las claves que también están en otro, cada una con el menor de los dos elementos. Los nodos que sobran se liberan y otro no cambia. Devuelve cuántos quedan.' },
    array: { firma: 'int interseccionHashArray(HashArray *destino, HashArray *otro)', hace: 'Lo mismo; lo que se quita pasa a BORRADA.' },
  },
  9: {
    ej: 9,
    titulo: 'Diferencia (restar)',
    lista: { firma: 'int diferenciaHashLista(HashLista *destino, HashLista *otro)', hace: 'Por cada clave de otro que esté en destino, resta su elemento al de destino; si queda en 0 o menos, ese nodo se quita y se libera. Las claves de otro que no están en destino no hacen nada, y otro no cambia. Devuelve cuántos nodos se han quitado.' },
    array: { firma: 'int diferenciaHashArray(HashArray *destino, HashArray *otro)', hace: 'Lo mismo; lo que se queda a 0 o menos pasa a BORRADA.' },
  },
  10: {
    ej: 10,
    titulo: 'Hash de plegamiento',
    lista: { firma: 'int hashPlegamientoHashLista(int clave)', hace: 'Parte la clave en trozos de dos cifras empezando por la derecha, los suma y devuelve la suma mod TAM_LISTA (101). Por ejemplo, 12345 → 1 + 23 + 45 = 69.' },
    array: { firma: 'int hashPlegamientoHashArray(int clave)', hace: 'Lo mismo, mod TAM (20).' },
  },
  11: {
    ej: 11,
    titulo: 'Hash de la mitad del cuadrado',
    lista: { firma: 'int hashMitadCuadradoHashLista(int clave)', hace: 'Eleva la clave al cuadrado en un long long y se queda con las dos cifras del centro: (c / 100) % 100. Devuelve eso mod 101. Por ejemplo, 1234 → 1522756 → 27.' },
    array: { firma: 'int hashMitadCuadradoHashArray(int clave)', hace: 'Lo mismo, mod 20.' },
  },
  12: {
    ej: 12,
    titulo: 'Hash polinómico sobre las cifras',
    lista: { firma: 'int hashPolinomicoHashLista(int clave)', hace: 'h = 0 y, cifra a cifra empezando por la última (clave % 10, luego clave / 10...), h = h * 31 + cifra, con h unsigned int. Devuelve h mod 101.' },
    array: { firma: 'int hashPolinomicoHashArray(int clave)', hace: 'Lo mismo, mod 20.' },
  },
  13: {
    ej: 13,
    titulo: 'Exploración cuadrática y doble hashing',
    array: { firma: 'int hash2HashArray(int clave)  ·  int casillaHashArray(HashArray *hashArray, int clave, int intento)', hace: 'hash2 devuelve 7 - (clave mod 7). casillaHashArray devuelve la casilla del intento número intento según el sondeo de la tabla: lineal (h + i) (ya hecha), cuadrática (h + i·i) o doble (h + i·hash2(clave)), todo mod 20, siendo h la casilla que da la función hash de la tabla. Insertar, buscar, eliminar y actualizar ya la usan.' },
  },
  14: {
    ej: 14,
    titulo: 'Lo que cuesta buscar',
    lista: { firma: 'int costeBuscarHashLista(HashLista *h, int clave)  ·  int costeTotalHashLista(HashLista *h)', hace: 'costeBuscar: cuántos nodos de su cubo se miran hasta el de la clave (incluido), o todos si no está. costeTotal: la suma del coste de cada clave que hay.' },
    array: { firma: 'int costeBuscarHashArray(HashArray *h, int clave)  ·  int costeTotalHashArray(HashArray *h)', hace: 'costeBuscar: cuántas casillas se miran siguiendo casillaHashArray desde el intento 0 hasta la de la clave o la primera VACIA, las dos incluidas (como mucho 20). costeTotal: la suma para cada clave que hay.' },
  },
  15: {
    ej: 15,
    titulo: 'Reorganizar',
    lista: { firma: 'int alFrenteHashLista(HashLista *hashLista, int clave)', hace: 'Si la clave está, mueve SU nodo al principio de su cubo, sin malloc ni free. Devuelve 1, o 0 si no está.' },
    array: { firma: 'int limpiarBorradasHashArray(HashArray *hashArray)', hace: 'Guarda aparte las OCUPADA (de la 0 a la última), deja todas las casillas VACIA y n = 0, y las vuelve a insertar en ese orden, sin cambiar el tamaño. Devuelve cuántas BORRADA había.' },
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
