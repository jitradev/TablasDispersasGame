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
};

static int hash(int clave) {
    int index = clave % TAM_LISTA;
    if (index < 0) {
        index += TAM_LISTA;
    }
    return index;
}

HashLista*  crearHashLista() {
    HashLista* hashLista = (HashLista*) malloc(sizeof(HashLista));
    if (hashLista == NULL) { return NULL;}
    for (int i = 0; i < TAM_LISTA; i++) {
        hashLista->cubos[i] = NULL;
    }
    hashLista->n = 0;
    return hashLista;
}

// Pushes at the head of the bucket without checking for an existing key.
int insertarHashLista(HashLista * hashLista, int clave, int elemento) {
    int index = hash(clave);
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
    Nodo* nodo = hashLista->cubos[hash(clave)];
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
    int index = hash(clave);
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
    for (Nodo* nodo = hashLista->cubos[hash(clave)]; nodo != NULL; nodo = nodo->sig) {
        if (nodo->clave == clave) {
            nodo->valor = elemento;     /* el mismo nodo: sin malloc */
            return 1;
        }
    }
    return insertarHashLista(hashLista, clave, elemento);
}

/* ===================== LO QUE TIENES QUE PROGRAMAR ===================== */

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

/* ============ NO TOQUES NADA A PARTIR DE AQUI: lo usa el registro ============ */

void volcarHashLista(HashLista * h, const char * nombre) {
    reg_printf("TL %s ", nombre);
    reg_ref(h);
    if (!reg_vivo(h, sizeof(HashLista))) { reg_printf("\n"); return; }
    reg_printf(" %d %d ", TAM_LISTA, h->n);
    reg_ref(h);
    reg_printf("\n");
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
