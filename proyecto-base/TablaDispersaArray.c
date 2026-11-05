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
};

static int hash(int clave) {
    int index = clave % TAM;
    if (index < 0) { // C keeps the sign of negative keys
        index += TAM;
    }
    return index;
}

// Returns the slot holding the key, or -1. A BORRADA slot does not stop the probe.
static int posicion(HashArray * hashArray, int clave) {
    int index = hash(clave);
    for (int pasos = 0; pasos < TAM; pasos++) {
        if (hashArray->marca[index] == VACIA) { return -1;}
        if (hashArray->marca[index] == OCUPADA && hashArray->claves[index] == clave) { return index;}
        index = (index + 1) % TAM;
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
    return hashArray;
}

int insertarHashArray(HashArray * hashArray, int clave, int elemento) {
    if (hashArray->n >= TAM) { return 0;}
    if (posicion(hashArray, clave) >= 0) { return 0;}
    int index = hash(clave);
    while (hashArray->marca[index] == OCUPADA) {
        index = (index + 1) % TAM;
    }
    hashArray->valores[index] = elemento;
    hashArray->claves[index] = clave;
    hashArray->marca[index] = OCUPADA;
    hashArray->n++;
    return 1;

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

/* ===================== LO QUE TIENES QUE PROGRAMAR ===================== */

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
    reg_printf("\n");
    for (int i = 0; i < TAM; i++) {
        if (h->marca[i] == VACIA) { continue; }
        reg_printf("CA %s %d %d %d %d\n", nombre, i, h->marca[i], h->claves[i], h->valores[i]);
    }
}
