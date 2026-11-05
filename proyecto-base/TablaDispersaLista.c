#include "TablaDispersaLista.h"

#include <stdio.h>
#include <stdlib.h>
#include "registro.h" /* vigila malloc y free: no lo quites */

typedef struct Nodo {
    int clave;
    int valor;
    struct Nodo *sig;
} Nodo;

struct HashLista {
    Nodo *cubos[TAM_LISTA];
    int n;
    int funcion;    /* la funcion hash: HASH_CLASE salvo que se cambie */
};

// La funcion hash de clase: clave mod el tamano, sin negativos.
static int hashClase(int clave) {
    int index = clave % TAM_LISTA;
    if (index < 0) {
        index += TAM_LISTA;
    }
    return index;
}

// El cubo de la clave, con la funcion hash de la tabla.
static int indice(HashLista * hashLista, int clave) {
    switch (hashLista->funcion) {
        case HASH_PLEGAMIENTO: return hashPlegamientoHashLista(clave);
        case HASH_MITAD_CUADRADO: return hashMitadCuadradoHashLista(clave);
        case HASH_POLINOMICO: return hashPolinomicoHashLista(clave);
        default: return hashClase(clave);
    }
}

HashLista*  crearHashLista() {
    HashLista* hashLista = (HashLista*) malloc(sizeof(HashLista));
    if (hashLista == NULL) { return NULL;}
    for (int i = 0; i < TAM_LISTA; i++) {
        hashLista->cubos[i] = NULL;
    }
    hashLista->n = 0;
    hashLista->funcion = HASH_CLASE;
    return hashLista;
}

// Pushes at the head of the bucket without checking for an existing key.
int insertarHashLista(HashLista * hashLista, int clave, int elemento) {
    int index = indice(hashLista, clave);
    Nodo* nodo = (Nodo*) malloc(sizeof(Nodo));
    if (nodo == NULL) { return 0;}
    nodo->clave = clave;
    nodo->valor = elemento;
    nodo->sig = hashLista->cubos[index];
    hashLista->cubos[index] = nodo;
    hashLista->n++;
    return 1;
}

int buscarHashLista(HashLista * hashLista, int clave, int *elemento) {
    Nodo* nodo = hashLista->cubos[indice(hashLista, clave)];
    while (nodo != NULL) {
        if (nodo->clave == clave) {
            *elemento = nodo->valor;
            return 1;
        }
        nodo = nodo->sig;
    }
    return 0;
}

int eliminarElementoHashLista(HashLista * hashLista, int clave, int *elemento) {
    int index = indice(hashLista, clave);
    Nodo* ant = NULL;
    Nodo* act = hashLista->cubos[index];
    while (act != NULL && act->clave != clave) {
        ant = act;
        act = act->sig;
    }
    if (act == NULL) { return 0;}
    if (ant == NULL) {
        hashLista->cubos[index] = act->sig;
    } else {
        ant->sig = act->sig;
    }
    *elemento = act->valor;
    free(act);
    hashLista->n--;
    return 1;
}

void eliminarHashLista(HashLista * hashLista) {
    for (int i = 0; i < TAM_LISTA; i++) {
        Nodo* nodo = hashLista->cubos[i];
        while (nodo != NULL) {
            Nodo* sig = nodo->sig; // save the link before freeing
            free(nodo);
            nodo = sig;
        }
    }
    free(hashLista);
}

void mostrarHashLista(HashLista * hashLista) {
    for (int i = 0; i < TAM_LISTA; i++) {
        if (hashLista->cubos[i] == NULL) { continue;}
        printf("[%3d] ", i);
        for (Nodo* nodo = hashLista->cubos[i]; nodo != NULL; nodo = nodo->sig) {
            printf("%d:%d -> ", nodo->clave, nodo->valor);
        }
        printf("NULL\n");
    }
    printf("n = %d\n", hashLista->n);
}

int actualizarHashLista(HashLista * hashLista, int clave, int elemento) {
    for (Nodo* nodo = hashLista->cubos[indice(hashLista, clave)]; nodo != NULL; nodo = nodo->sig) {
        if (nodo->clave == clave) {
            nodo->valor = elemento;     /* el mismo nodo: sin malloc */
            return 1;
        }
    }
    return insertarHashLista(hashLista, clave, elemento);
}

int usarHashLista(HashLista * hashLista, int funcion) {
    if (hashLista->n > 0) { return 0;}
    hashLista->funcion = funcion;
    return 1;
}

/* ===================== ACTO 1: EL GREMIO ===================== */

/* ---- EJERCICIO 1: el objeto con mas unidades ---- */

int masAbundanteHashLista(HashLista * hashLista, int *clave, int *elemento) {
    /* TODO: recorre todos los nodos de todos los cubos y quedate con el de
     * elemento mas grande (si empatan, el de clave mas pequena). */
    (void) hashLista;
    (void) clave;
    (void) elemento;
    return 0;
}

/* ---- EJERCICIO 2: medir las colisiones ---- */

int cuboMasLargoHashLista(HashLista * hashLista, int *vacios) {
    /* TODO: cuenta los nodos de cada cubo; quedate con el maximo y cuenta los
     * cubos a NULL. */
    (void) hashLista;
    *vacios = 0;
    return 0;
}

/* ---- EJERCICIO 3: cambiar la clave de un objeto ---- */

int cambiarClaveHashLista(HashLista * hashLista, int vieja, int nueva) {
    /* TODO: busca el nodo de la vieja (y el de antes, para desengancharlo).
     * Si la nueva ya esta, suma y libera el de la vieja; si no, desengancha el
     * nodo, cambia su clave y engancha el mismo nodo en el cubo de la nueva. */
    (void) hashLista;
    (void) vieja;
    (void) nueva;
    return 0;
}

/* ---- EJERCICIO 4: quitar los agotados ---- */

int eliminarSiMenorHashLista(HashLista * hashLista, int minimo) {
    /* TODO: recorre cada cubo quitando y liberando los nodos con valor < minimo
     * (pueden ser el primero, varios seguidos o todos). */
    (void) hashLista;
    (void) minimo;
    return 0;
}

/* ---- EJERCICIO 5: juntar dos inventarios ---- */

int fusionarHashLista(HashLista * destino, HashLista * origen) {
    /* TODO: recorre los cubos de origen; cada nodo, o suma su valor al de su
     * clave en destino (y se libera), o se engancha en su cubo de destino.
     * Al final, origen sin nodos. */
    (void) destino;
    (void) origen;
    return 0;
}

/* ===================== ACTO 2: LAS CARAVANAS ===================== */

/* ---- EJERCICIO 6: copiar un inventario ---- */

int copiarHashLista(HashLista * destino, HashLista * origen) {
    /* TODO: libera los nodos de destino; despues, cubo a cubo, copia la lista
     * de origen con nodos nuevos y en el mismo orden (enganchando al final). */
    (void) destino;
    (void) origen;
    return 0;
}

/* ---- EJERCICIO 7: comparar dos inventarios ---- */

int igualesHashLista(HashLista * a, HashLista * b) {
    /* TODO: mismo n, y cada clave de a esta en b con el mismo elemento. */
    (void) a;
    (void) b;
    return 0;
}

/* ---- EJERCICIO 8: lo que tienen los dos ---- */

int interseccionHashLista(HashLista * destino, HashLista * otro) {
    /* TODO: quita (y libera) de destino lo que no este en otro; lo que si
     * esta se queda con el menor de los dos elementos. */
    (void) destino;
    (void) otro;
    return 0;
}

/* ---- EJERCICIO 9: pagar con lo que tiene el otro ---- */

int diferenciaHashLista(HashLista * destino, HashLista * otro) {
    /* TODO: resta a destino lo de otro; si un elemento queda en 0 o menos,
     * su nodo se quita y se libera. */
    (void) destino;
    (void) otro;
    return 0;
}

/* ===================== ACTO 3: LA SOMBRA DE LA TORRE (funciones hash) ===================== */

/* ---- EJERCICIO 10: plegamiento ---- */

int hashPlegamientoHashLista(int clave) {
    /* TODO: suma los trozos de dos cifras (clave % 100, luego clave / 100...)
     * y devuelve la suma mod TAM_LISTA. */
    (void) clave;
    return 0;
}

/* ---- EJERCICIO 11: mitad del cuadrado ---- */

int hashMitadCuadradoHashLista(int clave) {
    /* TODO: c = clave al cuadrado en un long long; (c / 100) % 100, mod TAM_LISTA. */
    (void) clave;
    return 0;
}

/* ---- EJERCICIO 12: polinomico sobre las cifras ---- */

int hashPolinomicoHashLista(int clave) {
    /* TODO: h = h * 31 + cifra, de la ultima cifra a la primera, con h
     * unsigned int; devuelve h mod TAM_LISTA. */
    (void) clave;
    return 0;
}

/* ===================== ACTO 4: EL TESORO DEL DRAGON (colisiones) ===================== */

/* ---- EJERCICIO 14: lo que cuesta buscar ---- */

int costeBuscarHashLista(HashLista * hashLista, int clave) {
    /* TODO: cuenta los nodos del cubo de la clave hasta encontrarla (incluido). */
    (void) hashLista;
    (void) clave;
    return 0;
}

int costeTotalHashLista(HashLista * hashLista) {
    /* TODO: suma el coste de buscar cada clave de la tabla. */
    (void) hashLista;
    return 0;
}

/* ---- EJERCICIO 15: reorganizar ---- */

int alFrenteHashLista(HashLista * hashLista, int clave) {
    /* TODO: desengancha el nodo de la clave y engancha ESE nodo al principio
     * de su cubo. */
    (void) hashLista;
    (void) clave;
    return 0;
}

/* ============ NO TOQUES NADA A PARTIR DE AQUI: lo usa el registro ============ */

void volcarHashLista(HashLista * h, const char * nombre) {
    reg_printf("TL %s ", nombre);
    reg_ref(h);
    if (!reg_vivo(h, sizeof(HashLista))) { reg_printf("\n"); return; }
    reg_printf(" %d %d ", TAM_LISTA, h->n);
    reg_ref(h);
    reg_printf(" %d\n", h->funcion);
    for (int i = 0; i < TAM_LISTA; i++) {
        if (h->cubos[i] == NULL) { continue; }
        reg_printf("CL %s %d ", nombre, i);
        reg_ref(h->cubos[i]);
        reg_printf("\n");
        int pasos = 0;
        for (Nodo* p = h->cubos[i]; p != NULL && reg_vivo(p, sizeof(Nodo)) && pasos < 300; p = p->sig, pasos++) {
            reg_printf("NL %s ", nombre);
            reg_ref(p);
            reg_printf(" %d %d ", p->clave, p->valor);
            reg_ref(p->sig);
            reg_printf("\n");
        }
    }
}
