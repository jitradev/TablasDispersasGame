//
// Created by Jose Ignacio Trasobares Ibor on 04/11/2026.
//

#ifndef LISTAS_DISPERSAS_TABLADISPERSAARRAY_H
#define LISTAS_DISPERSAS_TABLADISPERSAARRAY_H

#define TAM 20

typedef struct HashArray HashArray;


HashArray * crearHashArray();
int insertarHashArray(HashArray * hashArray, int clave, int elemento);
int buscarHashArray(HashArray * hashArray, int clave, int *elemento);
int eliminarElementoHashArray(HashArray * hashArray, int clave, int *elemento);
void eliminarHashArray(HashArray * hashArray);
void mostrarHashArray(HashArray * hashArray);

/* Ya hecha: si la clave ya esta, cambia su elemento en su casilla; si no, la
 * inserta como insertarHashArray (en la primera casilla que no este OCUPADA,
 * asi que reaprovecha las BORRADA). Devuelve 1, o 0 si no cabe. */
int actualizarHashArray(HashArray * hashArray, int clave, int elemento);

/* ===================== LO QUE TIENES QUE PROGRAMAR ===================== */

/* ---- EJERCICIO 1: el objeto con mas unidades ---- */

/* Busca entre las casillas OCUPADA el elemento mas grande y deja en *clave y
 * *elemento su clave y su elemento. Si hay empate, el de la clave mas pequena.
 * Devuelve 1, o 0 si no hay ninguna OCUPADA (y entonces no toca *clave ni *elemento). */
int masAbundanteHashArray(HashArray * hashArray, int *clave, int *elemento);

/* ---- EJERCICIO 2: medir las colisiones ---- */

/* Devuelve la longitud del grupo mas largo de casillas seguidas que no estan
 * VACIA (OCUPADA o BORRADA), mirando de la casilla 0 a la ultima, sin dar la
 * vuelta. Deja en *borradas cuantas casillas BORRADA hay. */
int grupoMasLargoHashArray(HashArray * hashArray, int *borradas);

/* ---- EJERCICIO 3: cambiar la clave de un objeto ---- */

/* Lo que estaba en la clave vieja pasa a la clave nueva: la casilla de la
 * vieja pasa a BORRADA y, si la nueva ya esta, su elemento suma el de la
 * vieja; si no esta, se inserta como insertarHashArray.
 * Devuelve 1, o 0 si la vieja no esta. Si vieja == nueva, no hace nada y devuelve 1. */
int cambiarClaveHashArray(HashArray * hashArray, int vieja, int nueva);

/* ---- EJERCICIO 4: quitar los agotados ---- */

/* Marca como BORRADA todas las casillas OCUPADA cuyo elemento sea menor que
 * minimo. Devuelve cuantas ha quitado. */
int eliminarSiMenorHashArray(HashArray * hashArray, int minimo);

/* ---- EJERCICIO 5: juntar dos inventarios ---- */

/* Pasa cada OCUPADA de origen, de la casilla 0 a la ultima, a destino: si la
 * clave ya esta en destino, suma el elemento al suyo; si no, la inserta como
 * insertarHashArray. Origen queda vacio: todas sus casillas VACIA y n = 0.
 * Devuelve 1, o 0 si alguna no ha cabido en destino. */
int fusionarHashArray(HashArray * destino, HashArray * origen);

/* Lo usa el registro. NO LA TOQUES. */
void volcarHashArray(HashArray * hashArray, const char * nombre);

#endif //LISTAS_DISPERSAS_TABLADISPERSAARRAY_H
