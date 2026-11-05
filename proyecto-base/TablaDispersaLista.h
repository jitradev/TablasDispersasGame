#ifndef LISTAS_DISPERSAS_TABLADISPERSALISTA_H
#define LISTAS_DISPERSAS_TABLADISPERSALISTA_H

#define TAM_LISTA 101

<<<<<<< HEAD
/* Las funciones hash que puede usar la tabla (acto 3). Por defecto, HASH_CLASE:
 * clave mod TAM, la de clase. */
#define HASH_CLASE 0
#define HASH_PLEGAMIENTO 1
#define HASH_MITAD_CUADRADO 2
#define HASH_POLINOMICO 3

=======
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
typedef struct HashLista HashLista;


HashLista * crearHashLista();
int insertarHashLista(HashLista * hashLista, int clave, int elemento);
int buscarHashLista(HashLista * hashLista, int clave, int *elemento);
int eliminarElementoHashLista(HashLista * hashLista, int clave, int *elemento);
void eliminarHashLista(HashLista * hashLista);
void mostrarHashLista(HashLista * hashLista);

/* Ya hecha: si la clave ya esta, cambia su elemento en su nodo (sin crear
 * otro); si no, la inserta como insertarHashLista. Devuelve 1, o 0 si malloc falla. */
int actualizarHashLista(HashLista * hashLista, int clave, int elemento);

<<<<<<< HEAD
/* Ya hecha: elige la funcion hash de la tabla (HASH_CLASE, HASH_PLEGAMIENTO...).
 * Solo con la tabla vacia: devuelve 0 si ya tiene algo y no cambia nada. */
int usarHashLista(HashLista * hashLista, int funcion);

/* ===================== ACTO 1: EL GREMIO ===================== */
=======
/* ===================== LO QUE TIENES QUE PROGRAMAR ===================== */
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd

/* ---- EJERCICIO 1: el objeto con mas unidades ---- */

/* Busca en toda la tabla el elemento mas grande y deja en *clave y *elemento
 * su clave y su elemento. Si hay empate, el de la clave mas pequena.
 * Devuelve 1, o 0 si la tabla esta vacia (y entonces no toca *clave ni *elemento). */
int masAbundanteHashLista(HashLista * hashLista, int *clave, int *elemento);

/* ---- EJERCICIO 2: medir las colisiones ---- */

/* Devuelve la longitud de la lista mas larga de la tabla y deja en *vacios
 * cuantos cubos estan a NULL. */
int cuboMasLargoHashLista(HashLista * hashLista, int *vacios);

/* ---- EJERCICIO 3: cambiar la clave de un objeto ---- */

/* Lo que estaba en la clave vieja pasa a la clave nueva.
 *   - Si la nueva no esta: el MISMO nodo se desengancha de su cubo, cambia su
 *     clave y se engancha al principio del cubo de la nueva (sin malloc ni free).
 *   - Si la nueva ya esta: su elemento suma el de la vieja, y el nodo de la
 *     vieja se quita y se libera.
 * Devuelve 1, o 0 si la vieja no esta. Si vieja == nueva, no hace nada y devuelve 1. */
int cambiarClaveHashLista(HashLista * hashLista, int vieja, int nueva);

/* ---- EJERCICIO 4: quitar los agotados ---- */

/* Quita de la tabla, y libera, todos los nodos cuyo elemento sea menor que
 * minimo. Devuelve cuantos ha quitado. */
int eliminarSiMenorHashLista(HashLista * hashLista, int minimo);

/* ---- EJERCICIO 5: juntar dos inventarios ---- */

/* Pasa todo lo de origen a destino MOVIENDO los nodos (sin malloc): si la
 * clave ya esta en destino, suma el elemento al de su nodo y libera el nodo
 * de origen; si no esta, engancha el nodo de origen al principio de su cubo
 * en destino. Origen queda vacio: todos sus cubos a NULL y n = 0. Devuelve 1. */
int fusionarHashLista(HashLista * destino, HashLista * origen);

<<<<<<< HEAD
/* ===================== ACTO 2: LAS CARAVANAS ===================== */

/* ---- EJERCICIO 6: copiar un inventario ---- */

/* Deja destino igual que origen (tambien su funcion hash). Primero libera todos los nodos que tuviera
 * destino; despues copia cada cubo de origen en el mismo cubo de destino, en
 * el mismo orden, con nodos NUEVOS (malloc): destino no puede compartir ni
 * un nodo con origen. Origen no cambia. Devuelve cuantos elementos ha copiado. */
int copiarHashLista(HashLista * destino, HashLista * origen);

/* ---- EJERCICIO 7: comparar dos inventarios ---- */

/* Devuelve 1 si a y b tienen las mismas claves con los mismos elementos,
 * aunque dentro de un cubo esten en otro orden; 0 si no. No cambia nada. */
int igualesHashLista(HashLista * a, HashLista * b);

/* ---- EJERCICIO 8: lo que tienen los dos ---- */

/* Destino se queda solo con las claves que tambien estan en otro, y cada una
 * con el MENOR de los dos elementos. Los nodos que se quitan se liberan.
 * Otro no cambia. Devuelve cuantos elementos quedan en destino. */
int interseccionHashLista(HashLista * destino, HashLista * otro);

/* ---- EJERCICIO 9: pagar con lo que tiene el otro ---- */

/* Por cada clave de otro que este en destino, al elemento de destino se le
 * resta el de otro; si se queda en 0 o menos, el nodo se quita y se libera.
 * Las claves de otro que no estan en destino no hacen nada. Otro no cambia.
 * Devuelve cuantos nodos se han quitado de destino. */
int diferenciaHashLista(HashLista * destino, HashLista * otro);

/* ===================== ACTO 3: CREAR DISTINTOS HASH ===================== */
/* Las claves de este acto son positivas. Cada funcion devuelve un cubo entre
 * 0 y TAM_LISTA - 1: el resultado, mod TAM_LISTA. */

/* ---- EJERCICIO 10: plegamiento ---- */

/* Parte la clave en trozos de dos cifras empezando por la derecha y los suma:
 * 12345 -> 1 + 23 + 45 = 69. Devuelve la suma mod TAM_LISTA. */
int hashPlegamientoHashLista(int clave);

/* ---- EJERCICIO 11: mitad del cuadrado ---- */

/* Eleva la clave al cuadrado (en un long long) y se queda con las dos cifras
 * del centro: quita las dos ultimas y coge las dos siguientes,
 * (c / 100) % 100. 1234 -> 1522756 -> 27. Devuelve eso mod TAM_LISTA. */
int hashMitadCuadradoHashLista(int clave);

/* ---- EJERCICIO 12: polinomico sobre las cifras ---- */

/* h = 0 y, cifra a cifra empezando por la ultima (clave % 10, clave / 10...),
 * h = h * 31 + cifra, con h unsigned int. Devuelve h mod TAM_LISTA. */
int hashPolinomicoHashLista(int clave);

/* ===================== ACTO 4: JUEGO CON COLISIONES ===================== */

/* ---- EJERCICIO 14: lo que cuesta buscar ---- */

/* Cuantos nodos mira la busqueda de la clave en su cubo: hasta el que la
 * tiene (incluido) o, si no esta, todos los del cubo. */
int costeBuscarHashLista(HashLista * hashLista, int clave);

/* La suma del coste de buscar cada clave que hay en la tabla. */
int costeTotalHashLista(HashLista * hashLista);

/* ---- EJERCICIO 15: reorganizar ---- */

/* Si la clave esta, mueve SU nodo al principio de su cubo (sin malloc ni
 * free), para que la proxima vez se encuentre antes. Devuelve 1, o 0 si no esta. */
int alFrenteHashLista(HashLista * hashLista, int clave);

=======
>>>>>>> 3f25f6927880ffb8643cd3cd9fc5c81501cb72cd
/* Lo usa el registro. NO LA TOQUES. */
void volcarHashLista(HashLista * hashLista, const char * nombre);

#endif //LISTAS_DISPERSAS_TABLADISPERSALISTA_H
