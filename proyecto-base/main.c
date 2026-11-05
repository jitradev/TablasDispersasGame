#include <stdio.h>

#include "TablaDispersaArray.h"
#include "TablaDispersaLista.h"

static void probarHashArray(void) {
    int elemento;
    HashArray* hashArray = crearHashArray();

    // 3, 23 and 43 collide with TAM 20
    insertarHashArray(hashArray, 3, 30);
    insertarHashArray(hashArray, 23, 230);
    insertarHashArray(hashArray, 43, 430);
    insertarHashArray(hashArray, -7, 70);
    mostrarHashArray(hashArray);

    eliminarElementoHashArray(hashArray, 23, &elemento);
    printf("eliminar(23) -> %d\n", elemento);
    printf("buscar(23) -> %d\n", buscarHashArray(hashArray, 23, &elemento));
    if (buscarHashArray(hashArray, 43, &elemento)) {
        printf("buscar(43) -> %d\n", elemento);
    }
    mostrarHashArray(hashArray);

    eliminarHashArray(hashArray);
}

static void probarHashLista(void) {
    int elemento;
    HashLista* hashLista = crearHashLista();

    // 5, 106 and 207 collide with TAM_LISTA 101
    insertarHashLista(hashLista, 5, 50);
    insertarHashLista(hashLista, 106, 1060);
    insertarHashLista(hashLista, 207, 2070);
    insertarHashLista(hashLista, -7, 70);
    mostrarHashLista(hashLista);

    eliminarElementoHashLista(hashLista, 106, &elemento);
    printf("eliminar(106) -> %d\n", elemento);
    printf("buscar(106) -> %d\n", buscarHashLista(hashLista, 106, &elemento));
    if (buscarHashLista(hashLista, 5, &elemento)) {
        printf("buscar(5) -> %d\n", elemento);
    }
    mostrarHashLista(hashLista);

    eliminarHashLista(hashLista);
}

int main(void) {
    probarHashArray();
    probarHashLista();
    return 0;
}
