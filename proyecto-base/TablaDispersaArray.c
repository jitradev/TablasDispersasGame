#include "TablaDispersaArray.h"

#include <stdio.h>
#include <stdlib.h>
#include "registro.h" /* vigila malloc y free: no lo quites */

typedef enum {VACIA,OCUPADA,BORRADA} ESTADO;

struct HashArray {
    int claves[TAM];
    int valores[TAM];
    int marca[TAM];
    int n;
    int funcion;    /* la funcion hash: HASH_CLASE salvo que se cambie */
    int sondeo;     /* como se busca sitio: SONDEO_LINEAL salvo que se cambie */
};

// La funcion hash de clase: clave mod el tamano, sin negativos.
static int hashClase(int clave) {
    int index = clave % TAM;
    if (index < 0) { // C keeps the sign of negative keys
        index += TAM;
    }
    return index;
}

// La casilla de la clave, con la funcion hash de la tabla.
static int indice(HashArray * hashArray, int clave) {
    switch (hashArray->funcion) {
        case HASH_PLEGAMIENTO: return hashPlegamientoHashArray(clave);
        case HASH_MITAD_CUADRADO: return hashMitadCuadradoHashArray(clave);
        case HASH_POLINOMICO: return hashPolinomicoHashArray(clave);
        default: return hashClase(clave);
    }
}

// Returns the slot holding the key, or -1. A BORRADA slot does not stop the probe.
// Prueba las casillas que da casillaHashArray: intento 0, 1, 2...
static int posicion(HashArray * hashArray, int clave) {
    for (int intento = 0; intento < TAM; intento++) {
        int index = casillaHashArray(hashArray, clave, intento);
        if (hashArray->marca[index] == VACIA) { return -1;}
        if (hashArray->marca[index] == OCUPADA && hashArray->claves[index] == clave) { return index;}
    }
    return -1;
}

HashArray*  crearHashArray() {
    HashArray* hashArray = (HashArray*) malloc(sizeof(HashArray));
    if (hashArray == NULL) { return NULL;}
    for (int i = 0; i < TAM; i++) {
        hashArray->marca[i] = VACIA;
    }
    hashArray->n = 0;
    hashArray->funcion = HASH_CLASE;
    hashArray->sondeo = SONDEO_LINEAL;
    return hashArray;
}

int insertarHashArray(HashArray * hashArray, int clave, int elemento) {
    if (hashArray->n >= TAM) { return 0;}
    if (posicion(hashArray, clave) >= 0) { return 0;}
    for (int intento = 0; intento < TAM; intento++) {   /* la primera que no este OCUPADA */
        int index = casillaHashArray(hashArray, clave, intento);
        if (hashArray->marca[index] != OCUPADA) {
            hashArray->valores[index] = elemento;
            hashArray->claves[index] = clave;
            hashArray->marca[index] = OCUPADA;
            hashArray->n++;
            return 1;
        }
    }
    return 0;   /* con la cuadratica o el doble, puede no encontrar sitio */

}

int buscarHashArray(HashArray * hashArray, int clave, int *elemento) {
    int index = posicion(hashArray, clave);
    if (index < 0) { return 0;}
    *elemento = hashArray->valores[index];
    return 1;
}

int eliminarElementoHashArray(HashArray * hashArray, int clave, int *elemento) {
    int index = posicion(hashArray, clave);
    if (index < 0) { return 0;}
    *elemento = hashArray->valores[index];
    hashArray->marca[index] = BORRADA;
    hashArray->n--;
    return 1;
}

void eliminarHashArray(HashArray * hashArray) {
    free(hashArray);
}

void mostrarHashArray(HashArray * hashArray) {
    for (int i = 0; i < TAM; i++) {
        printf("[%3d] ", i);
        if (hashArray->marca[i] == OCUPADA) {
            printf("%d:%d\n", hashArray->claves[i], hashArray->valores[i]);
        } else if (hashArray->marca[i] == BORRADA) {
            printf("BORRADA\n");
        } else {
            printf("VACIA\n");
        }
    }
    printf("n = %d\n", hashArray->n);
}

int actualizarHashArray(HashArray * hashArray, int clave, int elemento) {
    int index = posicion(hashArray, clave);
    if (index >= 0) {
        hashArray->valores[index] = elemento;
        return 1;
    }
    return insertarHashArray(hashArray, clave, elemento);
}

int usarHashArray(HashArray * hashArray, int funcion) {
    if (hashArray->n > 0) { return 0;}
    hashArray->funcion = funcion;
    return 1;
}

int usarSondeoArray(HashArray * hashArray, int sondeo) {
    if (hashArray->n > 0) { return 0;}
    hashArray->sondeo = sondeo;
    return 1;
}

/* ===================== ACTO 1: EL GREMIO ===================== */

/* ---- EJERCICIO 1: el objeto con mas unidades ---- */

int masAbundanteHashArray(HashArray * hashArray, int *clave, int *elemento) {
    /* TODO: recorre las casillas OCUPADA y quedate con la de elemento mas
     * grande (si empatan, la de clave mas pequena). */
    (void) hashArray;
    (void) clave;
    (void) elemento;
    return 0;
}

/* ---- EJERCICIO 2: medir las colisiones ---- */

int grupoMasLargoHashArray(HashArray * hashArray, int *borradas) {
    /* TODO: de la casilla 0 a la ultima, cuenta cuantas no VACIA van seguidas
     * y quedate con el maximo; cuenta tambien las BORRADA. */
    (void) hashArray;
    *borradas = 0;
    return 0;
}

/* ---- EJERCICIO 3: cambiar la clave de un objeto ---- */

int cambiarClaveHashArray(HashArray * hashArray, int vieja, int nueva) {
    /* TODO: la casilla de la vieja pasa a BORRADA; su elemento se suma al de
     * la nueva si ya esta, o se inserta con la clave nueva si no. */
    (void) hashArray;
    (void) vieja;
    (void) nueva;
    return 0;
}

/* ---- EJERCICIO 4: quitar los agotados ---- */

int eliminarSiMenorHashArray(HashArray * hashArray, int minimo) {
    /* TODO: cada OCUPADA con valor < minimo pasa a BORRADA. */
    (void) hashArray;
    (void) minimo;
    return 0;
}

/* ---- EJERCICIO 5: juntar dos inventarios ---- */

int fusionarHashArray(HashArray * destino, HashArray * origen) {
    /* TODO: cada OCUPADA de origen, sumada a su clave en destino o insertada;
     * al final, todas las casillas de origen VACIA. */
    (void) destino;
    (void) origen;
    return 0;
}

/* ===================== ACTO 2: LAS CARAVANAS ===================== */

/* ---- EJERCICIO 6: copiar un inventario ---- */

int copiarHashArray(HashArray * destino, HashArray * origen) {
    /* TODO: copia claves, valores, marca y n de origen a destino. */
    (void) destino;
    (void) origen;
    return 0;
}

/* ---- EJERCICIO 7: comparar dos inventarios ---- */

int igualesHashArray(HashArray * a, HashArray * b) {
    /* TODO: mismo n, y cada OCUPADA de a esta en b con el mismo elemento. */
    (void) a;
    (void) b;
    return 0;
}

/* ---- EJERCICIO 8: lo que tienen los dos ---- */

int interseccionHashArray(HashArray * destino, HashArray * otro) {
    /* TODO: las OCUPADA de destino que no esten en otro pasan a BORRADA; las
     * que si estan se quedan con el menor de los dos elementos. */
    (void) destino;
    (void) otro;
    return 0;
}

/* ---- EJERCICIO 9: pagar con lo que tiene el otro ---- */

int diferenciaHashArray(HashArray * destino, HashArray * otro) {
    /* TODO: resta a destino lo de otro; si un elemento queda en 0 o menos,
     * su casilla pasa a BORRADA. */
    (void) destino;
    (void) otro;
    return 0;
}

/* ===================== ACTO 3: LA SOMBRA DE LA TORRE (funciones hash) ===================== */

/* ---- EJERCICIO 10: plegamiento ---- */

int hashPlegamientoHashArray(int clave) {
    /* TODO: como en TablaDispersaLista, pero mod TAM. */
    (void) clave;
    return 0;
}

/* ---- EJERCICIO 11: mitad del cuadrado ---- */

int hashMitadCuadradoHashArray(int clave) {
    /* TODO: como en TablaDispersaLista, pero mod TAM. */
    (void) clave;
    return 0;
}

/* ---- EJERCICIO 12: polinomico sobre las cifras ---- */

int hashPolinomicoHashArray(int clave) {
    /* TODO: como en TablaDispersaLista, pero mod TAM. */
    (void) clave;
    return 0;
}

/* ===================== ACTO 4: EL TESORO DEL DRAGON (colisiones) ===================== */

/* ---- EJERCICIO 13: otras formas de buscar sitio ---- */

int hash2HashArray(int clave) {
    /* TODO: 7 - (clave mod 7). */
    (void) clave;
    return 1;
}

int casillaHashArray(HashArray * hashArray, int clave, int intento) {
    switch (hashArray->sondeo) {
        case SONDEO_CUADRATICO:
            /* TODO: el salto crece con el cuadrado del intento. */
            return (indice(hashArray, clave) + intento) % TAM;
        case SONDEO_DOBLE:
            /* TODO: el salto es intento * hash2(clave). */
            return (indice(hashArray, clave) + intento) % TAM;
        default: /* SONDEO_LINEAL, la de clase */
            return (indice(hashArray, clave) + intento) % TAM;
    }
}

/* ---- EJERCICIO 14: lo que cuesta buscar ---- */

int costeBuscarHashArray(HashArray * hashArray, int clave) {
    /* TODO: recorre las casillas como posicion() y cuenta cuantas mira, hasta
     * la de la clave o la primera VACIA (incluidas). */
    (void) hashArray;
    (void) clave;
    return 0;
}

int costeTotalHashArray(HashArray * hashArray) {
    /* TODO: suma el coste de buscar cada clave OCUPADA. */
    (void) hashArray;
    return 0;
}

/* ---- EJERCICIO 15: reorganizar ---- */

int limpiarBorradasHashArray(HashArray * hashArray) {
    /* TODO: guarda las OCUPADA en dos arrays locales, deja todo VACIA y n = 0,
     * y vuelve a insertarlas en el mismo orden. Devuelve cuantas BORRADA habia. */
    (void) hashArray;
    return 0;
}

/* ============ NO TOQUES NADA A PARTIR DE AQUI: lo usa el registro ============ */

void volcarHashArray(HashArray * h, const char * nombre) {
    reg_printf("TA %s ", nombre);
    reg_ref(h);
    if (!reg_vivo(h, sizeof(HashArray))) { reg_printf("\n"); return; }
    reg_printf(" %d %d ", TAM, h->n);
    reg_ref(h);
    reg_printf(" ");
    reg_ref(h);
    reg_printf(" ");
    reg_ref(h);
    reg_printf(" %d %d\n", h->funcion, h->sondeo);
    for (int i = 0; i < TAM; i++) {
        if (h->marca[i] == VACIA) { continue; }
        reg_printf("CA %s %d %d %d %d\n", nombre, i, h->marca[i], h->claves[i], h->valores[i]);
    }
}
