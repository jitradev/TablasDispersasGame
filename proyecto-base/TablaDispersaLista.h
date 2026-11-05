#ifndef LISTAS_DISPERSAS_TABLADISPERSALISTA_H
#define LISTAS_DISPERSAS_TABLADISPERSALISTA_H

#define TAM_LISTA 101

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

/* ===================== LO QUE TIENES QUE PROGRAMAR ===================== */

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

/* Lo usa el registro. NO LA TOQUES. */
void volcarHashLista(HashLista * hashLista, const char * nombre);

#endif //LISTAS_DISPERSAS_TABLADISPERSALISTA_H
