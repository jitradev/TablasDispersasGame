//
// Created by Jose Ignacio Trasobares Ibor on 04/11/2026.
//

#ifndef LISTAS_DISPERSAS_TABLADISPERSAARRAY_H
#define LISTAS_DISPERSAS_TABLADISPERSAARRAY_H

#define TAM 20

/* Las funciones hash que puede usar la tabla (acto 3). Por defecto, HASH_CLASE:
 * clave mod TAM, la de clase. */
#define HASH_CLASE 0
#define HASH_PLEGAMIENTO 1
#define HASH_MITAD_CUADRADO 2
#define HASH_POLINOMICO 3

/* Como se busca sitio cuando hay colision (acto 4). Por defecto, la de clase. */
#define SONDEO_LINEAL 0
#define SONDEO_CUADRATICO 1
#define SONDEO_DOBLE 2

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

/* Ya hechas: eligen la funcion hash (HASH_CLASE, HASH_PLEGAMIENTO...) y la
 * forma de buscar sitio (SONDEO_LINEAL, SONDEO_CUADRATICO, SONDEO_DOBLE).
 * Solo con la tabla vacia: devuelven 0 si ya tiene algo y no cambian nada. */
int usarHashArray(HashArray * hashArray, int funcion);
int usarSondeoArray(HashArray * hashArray, int sondeo);

/* ===================== ACTO 1: EL GREMIO ===================== */

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

/* ===================== ACTO 2: LAS CARAVANAS ===================== */

/* ---- EJERCICIO 6: copiar un inventario ---- */

/* Deja destino igual que origen: las tres arrays casilla a casilla (tambien
 * las marcas, BORRADA incluidas), n, la funcion hash y el sondeo. Origen no cambia. Devuelve cuantos
 * elementos (casillas OCUPADA) ha copiado. */
int copiarHashArray(HashArray * destino, HashArray * origen);

/* ---- EJERCICIO 7: comparar dos inventarios ---- */

/* Devuelve 1 si a y b tienen las mismas claves con los mismos elementos,
 * aunque esten en otras casillas; 0 si no. No cambia nada. */
int igualesHashArray(HashArray * a, HashArray * b);

/* ---- EJERCICIO 8: lo que tienen los dos ---- */

/* Destino se queda solo con las claves que tambien estan en otro, y cada una
 * con el MENOR de los dos elementos. Las que se quitan pasan a BORRADA.
 * Otro no cambia. Devuelve cuantos elementos quedan en destino. */
int interseccionHashArray(HashArray * destino, HashArray * otro);

/* ---- EJERCICIO 9: pagar con lo que tiene el otro ---- */

/* Por cada clave de otro que este en destino, al elemento de destino se le
 * resta el de otro; si se queda en 0 o menos, su casilla pasa a BORRADA.
 * Otro no cambia. Devuelve cuantas casillas se han quitado de destino. */
int diferenciaHashArray(HashArray * destino, HashArray * otro);

/* ===================== ACTO 3: LA SOMBRA DE LA TORRE (funciones hash) ===================== */
/* Las mismas tres funciones que en TablaDispersaLista, pero mod TAM. */

/* ---- EJERCICIO 10: plegamiento ---- */
int hashPlegamientoHashArray(int clave);

/* ---- EJERCICIO 11: mitad del cuadrado ---- */
int hashMitadCuadradoHashArray(int clave);

/* ---- EJERCICIO 12: polinomico sobre las cifras ---- */
int hashPolinomicoHashArray(int clave);

/* ===================== ACTO 4: EL TESORO DEL DRAGON (colisiones) ===================== */
/* Las claves de este acto son positivas. */

/* ---- EJERCICIO 13: otras formas de buscar sitio ---- */

/* El salto del doble hashing: 7 - (clave mod 7). Nunca vale 0. */
int hash2HashArray(int clave);

/* La casilla que se mira en el intento numero intento (0, 1, 2...), con h la
 * casilla que da la funcion hash de la tabla:
 *   SONDEO_LINEAL       (h + intento) mod TAM                  (ya hecha)
 *   SONDEO_CUADRATICO   (h + intento * intento) mod TAM
 *   SONDEO_DOBLE        (h + intento * hash2(clave)) mod TAM
 * insertar, buscar, eliminar y actualizar la usan para buscar sitio. */
int casillaHashArray(HashArray * hashArray, int clave, int intento);

/* ---- EJERCICIO 14: lo que cuesta buscar ---- */

/* Cuantas casillas mira la busqueda de la clave: desde el intento 0 hasta la
 * que la tiene o hasta la primera VACIA, las dos incluidas, como mucho TAM. */
int costeBuscarHashArray(HashArray * hashArray, int clave);

/* La suma del coste de buscar cada clave que hay en la tabla. */
int costeTotalHashArray(HashArray * hashArray);

/* ---- EJERCICIO 15: reorganizar ---- */

/* Quita las BORRADA sin cambiar el tamano: guarda aparte las claves y los
 * elementos de las OCUPADA (de la casilla 0 a la ultima), pone todas las
 * casillas VACIA y n = 0, y las vuelve a insertar en ese orden con
 * insertarHashArray. Devuelve cuantas BORRADA habia. */
int limpiarBorradasHashArray(HashArray * hashArray);

/* Lo usa el registro. NO LA TOQUES. */
void volcarHashArray(HashArray * hashArray, const char * nombre);

#endif //LISTAS_DISPERSAS_TABLADISPERSAARRAY_H
